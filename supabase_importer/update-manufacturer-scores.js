import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(__dirname, '.env') });

const SCORE_TABLE = 'manufacturer_scores';
const SCORE_JSON_PATH = path.join(repoRoot, 'src', 'data', 'manufacturer_scores.json');
const CONTENT_ARTICLE_SECTIONS = ['posts', 'news'];
const DEFAULT_RESPONSE_TIME = 'n/a';
const RESPONSE_TIME_SCORE = {
    within_24h: 10,
    within_3_days: 7,
    within_1_week: 4,
    unknown: 0,
    'n/a': 0
};

const STORAGE_FOLDER_ALIASES = {
    company_docs: 'company_doc',
    company_docss: 'company_doc',
    product_docs: 'product_doc',
    product_docss: 'product_doc'
};

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function normalizeStorageFolderName(folder) {
    return STORAGE_FOLDER_ALIASES[folder] || folder;
}

function readJsonFile(filePath, fallback = null) {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadImporterPayload() {
    const dataDir = path.join(__dirname, 'data');
    const files = fs
        .readdirSync(dataDir)
        .filter((file) => file.endsWith('.json') && file !== 'data_payload.json' && file !== 'sync_config.json');
    const payload = [];

    for (const file of files) {
        try {
            const parsed = readJsonFile(path.join(dataDir, file), []);
            if (Array.isArray(parsed)) payload.push(...parsed);
        } catch (error) {
            console.error(`解析 JSON 文件失败: ${file}`, error.message);
        }
    }

    return payload.filter((item) => item?.manufacturer?.slug);
}

function loadExistingScoreMap() {
    const existingScores = readJsonFile(SCORE_JSON_PATH, []);
    return Array.isArray(existingScores)
        ? new Map(existingScores.map((score) => [score.manufacturer_slug, score]))
        : new Map();
}

function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function toText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(toText).join(' ');
    if (typeof value === 'object') return toText(value.en || value.zh || Object.values(value).flat());
    return String(value);
}

function toArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'object') {
        const localizedValue = value.en || value.zh;
        return Array.isArray(localizedValue) ? localizedValue : [];
    }
    return [];
}

function hasMeaningfulText(value, minLength = 1) {
    return toText(value).trim().length >= minLength;
}

function hasObjectEntries(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0);
}

function getCompanyAssets(item, normalizedFolder) {
    return (item.company_assets || []).filter((asset) => normalizeStorageFolderName(asset.folder) === normalizedFolder);
}

function getProductAssets(item, normalizedFolder) {
    return (item.products || []).flatMap((productItem) => (
        (productItem.product_assets || []).filter((asset) => normalizeStorageFolderName(asset.folder) === normalizedFolder)
    ));
}

function scoreCompanyIntro(manufacturer) {
    const fullDescription = toText(manufacturer.full_description);
    const descriptionParagraphs = toArray(manufacturer.full_description);
    const advantages = toArray(manufacturer.advantages);
    let score = 1;

    if (fullDescription.length >= 160) score += 2;
    if (descriptionParagraphs.length >= 3 || fullDescription.length >= 600) score += 2;
    if (advantages.length >= 3) score += 2;
    if (manufacturer.established_year && manufacturer.factory_area && manufacturer.employee_count) score += 1;
    if (manufacturer.website && ((manufacturer.email || []).length > 0 || (manufacturer.phone || []).length > 0)) score += 1;
    if ((manufacturer.industries || []).length > 0) score += 1;

    return clamp(score, 1, 10);
}

function scoreSingleProduct(productItem) {
    const product = productItem.product || {};
    const productImages = (productItem.product_assets || []).filter((asset) => normalizeStorageFolderName(asset.folder) === 'product_images');
    let score = 0;

    if (hasMeaningfulText(product.name)) score += 1;
    if (hasMeaningfulText(product.short_description) || hasMeaningfulText(product.full_description)) score += 1;
    if (productImages.length > 0) score += 1;
    if (hasObjectEntries(product.technical_parameters)) score += 1;
    if (toArray(product.details).length > 0 || hasMeaningfulText(product.details)) score += 1;

    return score;
}

function scoreProductInfo(products) {
    if (!products || products.length === 0) return 1;

    const productCountScore = Math.min(products.length, 4);
    const averageCompleteness = products.reduce((sum, productItem) => sum + scoreSingleProduct(productItem), 0) / products.length;
    const productQualityScore = Math.round((averageCompleteness / 5) * 6);

    return clamp(productCountScore + productQualityScore, 1, 10);
}

function normalizeResponseTime(value) {
    if (value === 'within_24h' || value === 'within_3_days' || value === 'within_1_week') return value;
    return DEFAULT_RESPONSE_TIME;
}

function collectMarkdownFiles(directory) {
    const markdownFiles = [];
    if (!fs.existsSync(directory)) return markdownFiles;

    const walk = (currentDirectory) => {
        for (const entry of fs.readdirSync(currentDirectory, { withFileTypes: true })) {
            const fullPath = path.join(currentDirectory, entry.name);
            if (entry.isDirectory()) walk(fullPath);
            if (entry.isFile() && /\.mdx?$/.test(entry.name)) markdownFiles.push(fullPath);
        }
    };

    walk(directory);
    return markdownFiles;
}

function countPublishedArticles(manufacturerSlug, existingScore) {
    let hasContentArticleRoot = false;
    const articleSlugs = new Set();

    for (const section of CONTENT_ARTICLE_SECTIONS) {
        const sectionDir = path.join(repoRoot, 'content', section);
        if (fs.existsSync(sectionDir)) hasContentArticleRoot = true;

        const manufacturerDir = path.join(sectionDir, manufacturerSlug);
        for (const filePath of collectMarkdownFiles(manufacturerDir)) {
            const articleSlug = path.basename(filePath).replace(/\.mdx?$/, '');
            articleSlugs.add(`${section}:${articleSlug}`);
        }
    }

    return hasContentArticleRoot ? articleSlugs.size : existingScore?.published_article_count || 0;
}

function buildManufacturerScore(item, index, existingScore) {
    const manufacturer = item.manufacturer;
    const products = item.products || [];
    const responseTime = normalizeResponseTime(manufacturer.response_time || item.response_time || existingScore?.response_time);
    const publishedArticleCount = countPublishedArticles(manufacturer.slug, existingScore);
    const score = {
        manufacturer_slug: manufacturer.slug,
        order: Number.isInteger(existingScore?.order) ? existingScore.order : index + 1,
        company_intro_score: scoreCompanyIntro(manufacturer),
        product_info_score: scoreProductInfo(products),
        export_market_score: clamp((manufacturer.export_markets || []).length, 0, 10),
        video_count_score: clamp((manufacturer.video_link?.trim() ? 1 : 0) + products.filter((productItem) => productItem.product?.video_link?.trim()).length, 0, 10),
        social_media_score: (manufacturer.social_media_links || []).some((link) => link?.url && link.is_visible !== false) ? 10 : 0,
        factory_certification_score: clamp(getCompanyAssets(item, 'company_certifications').length, 0, 10),
        downloadable_document_score: clamp(getCompanyAssets(item, 'company_doc').length + getProductAssets(item, 'product_doc').length, 0, 10),
        partner_logo_score: clamp(getCompanyAssets(item, 'company_customers').length, 0, 10),
        response_time: responseTime,
        response_time_score: RESPONSE_TIME_SCORE[responseTime] || 0,
        published_article_count: publishedArticleCount,
        published_article_score: clamp(publishedArticleCount, 0, 10)
    };

    score.overall_score = score.company_intro_score
        + score.product_info_score
        + score.export_market_score
        + score.video_count_score
        + score.social_media_score
        + score.factory_certification_score
        + score.downloadable_document_score
        + score.partner_logo_score
        + score.response_time_score
        + score.published_article_score;

    return score;
}

function createSupabaseClient() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY 环境变量。');
    }

    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function loadManufacturerIdsBySlug(supabase, slugs) {
    const { data, error } = await supabase
        .from('manufacturers')
        .select('id, slug')
        .in('slug', slugs);

    if (error) throw error;
    return new Map((data || []).map((manufacturer) => [manufacturer.slug, manufacturer.id]));
}

async function loadScoresFromSupabase(supabase) {
    const { data, error } = await supabase
        .from(SCORE_TABLE)
        .select('*')
        .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
}

async function updateManufacturerScores({ dryRun = false } = {}) {
    const payload = loadImporterPayload();
    const existingScoreMap = loadExistingScoreMap();
    const scoreDrafts = payload.map((item, index) => buildManufacturerScore(item, index, existingScoreMap.get(item.manufacturer.slug)));

    if (scoreDrafts.length === 0) {
        console.log('没有找到可评分的公司数据。');
        return;
    }

    if (dryRun) {
        console.log(JSON.stringify(scoreDrafts, null, 2));
        return;
    }

    const supabase = createSupabaseClient();
    const manufacturerIdsBySlug = await loadManufacturerIdsBySlug(supabase, scoreDrafts.map((score) => score.manufacturer_slug));
    const now = new Date().toISOString();
    const rows = scoreDrafts
        .map((score) => {
            const manufacturerId = manufacturerIdsBySlug.get(score.manufacturer_slug);
            if (!manufacturerId) {
                console.warn(`⚠️ 数据库中找不到厂家: ${score.manufacturer_slug}，跳过评分更新。`);
                return null;
            }

            return {
                ...score,
                manufacturer_id: manufacturerId,
                updated_at: now
            };
        })
        .filter(Boolean);

    if (rows.length === 0) {
        console.log('没有可写入 manufacturer_scores 的记录。');
        return;
    }

    const { error } = await supabase
        .from(SCORE_TABLE)
        .upsert(rows, { onConflict: 'manufacturer_id' });

    if (error) throw error;
    console.log(`✅ 已更新 ${rows.length} 条 manufacturer_scores 记录。`);

    const refreshedScores = await loadScoresFromSupabase(supabase);
    writeJsonFile(SCORE_JSON_PATH, refreshedScores);
    console.log(`✅ 已写入 ${path.relative(repoRoot, SCORE_JSON_PATH)}。`);
}

const dryRun = process.argv.includes('--dry-run');

updateManufacturerScores({ dryRun }).catch((error) => {
    console.error('❌ 更新 manufacturer_scores 失败:', error.message);
    process.exitCode = 1;
});