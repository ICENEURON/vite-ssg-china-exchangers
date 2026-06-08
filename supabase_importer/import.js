import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { fileURLToPath } from 'url';
import {
    loadAssetSyncManifest,
    shouldProcessDataFile,
    shouldProcessLocalContent,
    shouldProcessLocalWebPage,
    shouldProcessWebDataFile,
    shouldProcessLocalAsset
} from '../src/scripts/asset-sync-manifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

function readBooleanFlag(name, fallback) {
    const value = process.env[name];

    if (value === undefined || value === '') {
        return fallback;
    }

    return !['0', 'false', 'no', 'off'].includes(value.toLowerCase());
}

const SHOULD_IMPORT_MANUFACTURER_DATA = readBooleanFlag('SHOULD_IMPORT_MANUFACTURER_DATA', true);
const SHOULD_IMPORT_INDUSTRIES = readBooleanFlag('SHOULD_IMPORT_INDUSTRIES', true);
const SHOULD_UPLOAD_LOCAL_CONTENTS = readBooleanFlag('SHOULD_UPLOAD_LOCAL_CONTENTS', true);
const SHOULD_UPLOAD_LOCAL_WEB_PAGES = readBooleanFlag('SHOULD_UPLOAD_LOCAL_WEB_PAGES', true);

// 初始化 Supabase 客户端 (使用 Service Role 绕过 RLS)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 目标 Storage Bucket，所有公司与产品资源统一进入 assets bucket
const TARGET_BUCKET = 'assets';
const CONTENTS_BUCKET = 'contents';
const WEBPAGES_BUCKET = 'webpages';
const INDUSTRIES_JSON_PATH = path.join(__dirname, 'web_data', 'industries.json');
const assetSyncManifest = loadAssetSyncManifest();
const VERBOSE = process.env.SYNC_VERBOSE === '1';

const FOLDER_UPLOAD_TARGETS = [
    {
        enabled: SHOULD_UPLOAD_LOCAL_CONTENTS,
        localFolder: 'local_contents',
        bucket: CONTENTS_BUCKET
    },
    {
        enabled: SHOULD_UPLOAD_LOCAL_WEB_PAGES,
        localFolder: 'local_web_pages',
        bucket: WEBPAGES_BUCKET,
        ignoredExtensions: new Set(['.csv'])
    }
];

const STORAGE_FOLDER_ALIASES = {
    company_docs: 'company_doc',
    company_docss: 'company_doc',
    product_docs: 'product_doc',
    product_docss: 'product_doc'
};

const ALLOWED_FOLDERS = new Set([
    'company_certifications',
    'company_customers',
    'company_images',
    'company_doc',
    'product_images',
    'product_certifications',
    'product_doc'
]);

function normalizeStorageFolderName(folder) {
    const normalizedFolder = STORAGE_FOLDER_ALIASES[folder] || folder;

    if (!ALLOWED_FOLDERS.has(normalizedFolder)) {
        throw new Error(`不支持的资源目录: ${folder}`);
    }

    return normalizedFolder;
}

function getLocalFolderCandidates(folder, normalizedFolder) {
    const candidates = [folder, normalizedFolder];

    if (normalizedFolder === 'company_doc') {
        candidates.push('company_docs');
    }

    if (normalizedFolder === 'product_doc') {
        candidates.push('product_docs');
    }

    return [...new Set(candidates)];
}

function resolveLocalAssetPath(localAssetsDir, folder, normalizedFolder, fileName) {
    const folderCandidates = getLocalFolderCandidates(folder, normalizedFolder);

    for (const candidateFolder of folderCandidates) {
        const candidatePath = path.join(__dirname, 'local_assets', localAssetsDir, candidateFolder, fileName);
        if (fs.existsSync(candidatePath)) {
            return candidatePath;
        }
    }

    return path.join(__dirname, 'local_assets', localAssetsDir, folder, fileName);
}

function getFilesRecursively(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...getFilesRecursively(entryPath));
            continue;
        }

        if (entry.isFile()) {
            files.push(entryPath);
        }
    }

    return files;
}

function getStoragePath(localRoot, filePath) {
    return path.relative(localRoot, filePath).split(path.sep).join('/');
}

async function listStorageFilesRecursively(bucket, prefix = '') {
    const files = [];
    let offset = 0;
    const limit = 1000;

    while (true) {
        const { data: entries, error: listError } = await supabase.storage
            .from(bucket)
            .list(prefix, {
                limit,
                offset,
                sortBy: { column: 'name', order: 'asc' }
            });

        if (listError) {
            throw new Error(`读取 bucket 文件列表失败 [${bucket}/${prefix}]: ${listError.message}`);
        }

        if (!entries || entries.length === 0) {
            break;
        }

        for (const entry of entries) {
            const storagePath = prefix ? `${prefix}/${entry.name}` : entry.name;

            if (entry.id === null) {
                files.push(...await listStorageFilesRecursively(bucket, storagePath));
                continue;
            }

            files.push(storagePath);
        }

        if (entries.length < limit) {
            break;
        }

        offset += limit;
    }

    return files;
}

async function removeOrphanedStorageFiles(bucket, expectedStoragePaths) {
    const existingStoragePaths = await listStorageFilesRecursively(bucket);
    const orphanedStoragePaths = existingStoragePaths.filter(storagePath => !expectedStoragePaths.has(storagePath));

    if (orphanedStoragePaths.length === 0) {
        console.log(`🧹 ${bucket} bucket 没有需要删除的冗余文件。`);
        return;
    }

    console.log(`🧹 ${bucket} bucket 发现 ${orphanedStoragePaths.length} 个本地已移除的文件，开始删除...`);

    for (let index = 0; index < orphanedStoragePaths.length; index += 100) {
        const batch = orphanedStoragePaths.slice(index, index + 100);
        const { error: removeError } = await supabase.storage.from(bucket).remove(batch);

        if (removeError) {
            console.error(`❌ 删除冗余文件失败 [${bucket}]:`, removeError.message);
            continue;
        }

        for (const storagePath of batch) {
            console.log(`🗑️ 已删除: ${bucket}/${storagePath}`);
        }
    }
}

async function uploadLocalFolderToBucket(localFolder, bucket, options = {}) {
    const localRoot = path.join(__dirname, localFolder);

    if (!fs.existsSync(localRoot)) {
        console.warn(`⚠️ 本地目录不存在，跳过上传: ${localRoot}`);
        return;
    }

    const files = getFilesRecursively(localRoot)
        .filter(filePath => !options.ignoredExtensions?.has(path.extname(filePath).toLowerCase()))
        .filter(filePath => {
            const storagePath = getStoragePath(localRoot, filePath);
            return options.storagePathFilter ? options.storagePathFilter(storagePath) : true;
        });
    const expectedStoragePaths = new Set(files.map(filePath => getStoragePath(localRoot, filePath)));
    console.log(`\n📤 开始上传 ${localFolder} 到 ${bucket} bucket，共 ${files.length} 个文件...`);

    let successCount = 0;
    let failureCount = 0;

    for (const filePath of files) {
        const storagePath = getStoragePath(localRoot, filePath);
        const fileBuffer = fs.readFileSync(filePath);
        const contentType = mime.lookup(filePath) || 'application/octet-stream';

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(storagePath, fileBuffer, {
                upsert: true,
                contentType
            });

        if (uploadError) {
            failureCount += 1;
            console.error(`❌ 上传失败 [${bucket}/${storagePath}]:`, uploadError.message);
            continue;
        }

        successCount += 1;
        if (VERBOSE) {
            console.log(`✅ 已上传: ${bucket}/${storagePath}`);
        }
    }

    console.log(`📦 ${bucket} bucket 上传完成：成功 ${successCount} 个，失败 ${failureCount} 个。`);

    if (options.skipOrphanCleanup) {
        console.log(`⏭️ ${bucket} bucket 使用资产清单过滤，跳过远端冗余文件删除。`);
        return;
    }

    await removeOrphanedStorageFiles(bucket, expectedStoragePaths);
}

async function uploadConfiguredLocalFolders() {
    for (const target of FOLDER_UPLOAD_TARGETS) {
        if (!target.enabled) {
            console.log(`⏭️ 跳过 ${target.localFolder} 上传，flag 为 false。`);
            continue;
        }

        const manifestFilter =
            target.localFolder === 'local_contents'
                ? storagePath => shouldProcessLocalContent(assetSyncManifest, storagePath)
                : target.localFolder === 'local_web_pages'
                    ? storagePath => shouldProcessLocalWebPage(assetSyncManifest, storagePath)
                    : undefined;

        await uploadLocalFolderToBucket(target.localFolder, target.bucket, {
            ignoredExtensions: target.ignoredExtensions,
            storagePathFilter: assetSyncManifest.enabled ? manifestFilter : undefined,
            skipOrphanCleanup: assetSyncManifest.enabled && Boolean(manifestFilter)
        });
    }
}

async function uploadManifestLocalAssets() {
    if (!assetSyncManifest.enabled) {
        return;
    }

    const localRoot = path.join(__dirname, 'local_assets');

    if (!fs.existsSync(localRoot)) {
        console.warn(`⚠️ 本地目录不存在，跳过 ${TARGET_BUCKET} bucket 资产清单上传: ${localRoot}`);
        return;
    }

    const files = getFilesRecursively(localRoot)
        .filter(filePath => {
            const storagePath = getStoragePath(localRoot, filePath);
            return shouldProcessLocalAsset(assetSyncManifest, storagePath);
        });

    if (files.length === 0) {
        console.log(`ℹ️ Asset manifest enabled. No ${TARGET_BUCKET} bucket files listed for standalone upload.`);
        return;
    }

    console.log(`\n📤 开始按资产清单补充上传 local_assets 到 ${TARGET_BUCKET} bucket，共 ${files.length} 个文件...`);

    let successCount = 0;
    let failureCount = 0;

    for (const filePath of files) {
        const storagePath = getStoragePath(localRoot, filePath);
        const fileBuffer = fs.readFileSync(filePath);
        const contentType = mime.lookup(filePath) || 'application/octet-stream';

        const { error: uploadError } = await supabase.storage
            .from(TARGET_BUCKET)
            .upload(storagePath, fileBuffer, {
                upsert: true,
                contentType
            });

        if (uploadError) {
            failureCount += 1;
            console.error(`❌ 上传失败 [${TARGET_BUCKET}/${storagePath}]:`, uploadError.message);
            continue;
        }

        successCount += 1;
        if (VERBOSE) {
            console.log(`✅ 已上传: ${TARGET_BUCKET}/${storagePath}`);
        }
    }

    console.log(`📦 ${TARGET_BUCKET} bucket 资产清单补充上传完成：成功 ${successCount} 个，失败 ${failureCount} 个。`);
}

async function findOrCreateManufacturer(manufacturer) {
    const { data: existingManufacturer } = await supabase
        .from('manufacturers')
        .select('id')
        .eq('slug', manufacturer.slug)
        .maybeSingle();

    if (existingManufacturer) {
        const { error: updateError } = await supabase
            .from('manufacturers')
            .update({
                ...manufacturer,
                updated_at: new Date().toISOString()
            })
            .eq('id', existingManufacturer.id);

        if (updateError) {
            throw updateError;
        }

        return existingManufacturer.id;
    }

    const { data: createdManufacturer, error: createError } = await supabase
        .from('manufacturers')
        .insert({
            ...manufacturer,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

    if (createError) {
        throw createError;
    }

    return createdManufacturer.id;
}

async function findOrCreateProduct(product, manufacturerId) {
    const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .eq('manufacturer_id', manufacturerId)
        .maybeSingle();

    if (existingProduct) {
        const { error: updateError } = await supabase
            .from('products')
            .update({
                ...product,
                manufacturer_id: manufacturerId,
                updated_at: new Date().toISOString()
            })
            .eq('id', existingProduct.id);

        if (updateError) {
            throw updateError;
        }

        return existingProduct.id;
    }

    const { data: createdProduct, error: createError } = await supabase
        .from('products')
        .insert({
            ...product,
            manufacturer_id: manufacturerId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

    if (createError) {
        throw createError;
    }

    return createdProduct.id;
}

function readIndustries() {
    if (!fs.existsSync(INDUSTRIES_JSON_PATH)) {
        throw new Error(`找不到 industries JSON 文件: ${INDUSTRIES_JSON_PATH}`);
    }

    const industries = JSON.parse(fs.readFileSync(INDUSTRIES_JSON_PATH, 'utf8'));

    if (!Array.isArray(industries)) {
        throw new Error('industries.json 必须是数组。');
    }

    return industries.map((industry) => {
        if (!industry.id || !industry.slug || !industry.name || typeof industry.name !== 'object') {
            throw new Error(`industries.json 数据格式不正确: ${JSON.stringify(industry)}`);
        }

        return {
            id: Number(industry.id),
            slug: industry.slug,
            name: industry.name,
            is_visible: Boolean(industry.is_visible)
        };
    });
}

async function syncIndustries() {
    if (!shouldProcessWebDataFile(assetSyncManifest, 'industries.json')) {
        console.log('\n⏭️ Asset manifest enabled. web_data/industries.json is not listed, skipping industries sync.');
        return;
    }

    const industries = readIndustries();
    const expectedIds = new Set(industries.map((industry) => industry.id));

    console.log(`\n🏷️ 开始同步 industries 表，共 ${industries.length} 条记录...`);

    const { error: upsertError } = await supabase
        .from('industries')
        .upsert(industries, { onConflict: 'id' });

    if (upsertError) {
        throw new Error(`industries 表 upsert 失败: ${upsertError.message}`);
    }

    const { data: existingIndustries, error: selectError } = await supabase
        .from('industries')
        .select('id');

    if (selectError) {
        throw new Error(`读取 industries 表失败: ${selectError.message}`);
    }

    for (const existingIndustry of existingIndustries || []) {
        if (expectedIds.has(Number(existingIndustry.id))) {
            continue;
        }

        const { error: deleteError } = await supabase
            .from('industries')
            .delete()
            .eq('id', existingIndustry.id);

        if (deleteError) {
            throw new Error(`删除冗余 industry 失败 [${existingIndustry.id}]: ${deleteError.message}`);
        }

        console.log(`🗑️ 已删除本地 JSON 不存在的 industry: ${existingIndustry.id}`);
    }

    console.log('✅ industries 表同步完成。');
}

/**
 * 通用文件上传并记录资产表的方法
 */
async function processAndUploadAsset(localAssetsDir, mfgSlug, assetData, foreignKeyColumn, foreignKeyValue, tableName) {
    const { folder, file_name, asset_type, alt_text } = assetData;
    const normalizedFolder = normalizeStorageFolderName(folder);

    // 拼接本地路径，允许 local_assets 目录名与最终 slug 不同
    const localPath = resolveLocalAssetPath(localAssetsDir, folder, normalizedFolder, file_name);

    // 拼接云端 Storage 路径: <slug>/<folder>/<file>
    const storagePath = `${mfgSlug}/${normalizedFolder}/${file_name}`;

    if (!shouldProcessLocalAsset(assetSyncManifest, storagePath)) {
        if (VERBOSE) {
            console.log(`⏭️ 跳过未列入资产清单的文件: ${TARGET_BUCKET}/${storagePath}`);
        }
        return;
    }

    if (!fs.existsSync(localPath)) {
        console.warn(`⚠️ 找不到本地文件: ${localPath}，跳过此附件。`);
        return;
    }

    const fileExt = path.extname(file_name).replace('.', '').toLowerCase();
    const fileBuffer = fs.readFileSync(localPath);
    const contentType = mime.lookup(localPath) || 'application/octet-stream';

    // 1. 上传到 Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(TARGET_BUCKET)
        .upload(storagePath, fileBuffer, {
            upsert: true, // 如果文件已存在则覆盖
            contentType: contentType
        });

    if (uploadError) {
        console.error(`❌ 文件上传失败 [${storagePath}]:`, uploadError.message);
        return;
    }
    console.log(`✅ 文件已上传至 Storage: ${TARGET_BUCKET}/${storagePath}`);

    const { data: existingAsset } = await supabase
        .from(tableName)
        .select('id')
        .eq(foreignKeyColumn, foreignKeyValue)
        .eq('storage_bucket', TARGET_BUCKET)
        .eq('storage_path', storagePath)
        .maybeSingle();

    if (existingAsset) {
        // 如果资产记录存在，更新 alt_text 和 order
        await supabase.from(tableName).update({ 
            alt_text, 
            order: assetData.order || 0,
            updated_at: new Date().toISOString() 
        }).eq('id', existingAsset.id);
        console.log(`ℹ️ 资产记录已存在，已更新信息 [${tableName} - ${file_name}]`);
        return;
    }

    // 2. 将数据插入对应的资产关系表
    const assetRecord = {
        [foreignKeyColumn]: foreignKeyValue,
        asset_type: asset_type,
        alt_text: alt_text,
        order: assetData.order || 0,
        storage_bucket: TARGET_BUCKET,
        storage_path: storagePath,
        file_name: file_name,
        file_type: fileExt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { error: dbError } = await supabase.from(tableName).insert(assetRecord);

    if (dbError) {
        console.error(`❌ 资产记录插入数据库失败 [${tableName} - ${file_name}]:`, dbError.message);
    } else {
        console.log(`✅ 资产记录写入数据库成功 [${tableName}]`);
    }
}

async function runImport() {
    console.log('🚀 开始按公司分类目录导入数据...');
    const dataDir = path.join(__dirname, 'data');
    const files = fs.readdirSync(dataDir)
        .filter(f => f.endsWith('.json') && f !== 'data_payload.json' && f !== 'sync_config.json')
        .filter(f => shouldProcessDataFile(assetSyncManifest, f));
    let payload = [];

    if (assetSyncManifest.enabled && files.length === 0) {
        console.log('⏭️ Asset manifest enabled. No supabase_importer/data files listed, skipping manufacturer data import.');
        return;
    }
    
    for (const file of files) {
        const rawData = fs.readFileSync(path.join(dataDir, file));
        try {
            const parsed = JSON.parse(rawData);
            if (Array.isArray(parsed) && parsed.length > 0) {
                payload = payload.concat(parsed);
            }
        } catch (e) {
            console.error(`解析 JSON 文件失败: ${file}`, e);
        }
    }

    if (payload.length === 0) {
        console.log('没有找到有效的数据进行导入。');
        return;
    }

    // Load sync config
    const configPath = path.join(dataDir, 'sync_config.json');
    let syncTargets = null;
    if (fs.existsSync(configPath) && shouldProcessDataFile(assetSyncManifest, 'sync_config.json')) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.sync_targets && Array.isArray(config.sync_targets)) {
            syncTargets = new Set(config.sync_targets);
            console.log(`📝 已加载白名单配置，仅同步以下公司: ${config.sync_targets.join(', ')}`);
        }
    }

    for (const item of payload) {
        const mfgSlug = item.manufacturer.slug;
        
        if (syncTargets && !syncTargets.has(mfgSlug)) {
            console.log(`\n⏭️ 跳过公司: ${mfgSlug} (不在 sync_config.json 的白名单中)`);
            continue;
        }

        const localAssetsDir = item.local_assets_dir || mfgSlug;
        console.log(`\n===========================================`);
        console.log(`⏳ 正在处理公司: ${mfgSlug}`);
        console.log(`===========================================`);

        let mfgId;
        try {
            mfgId = await findOrCreateManufacturer(item.manufacturer);
        } catch (mfgError) {
            console.error(`❌ 工厂数据插入失败:`, mfgError.message);
            continue; // 核心数据失败，跳过该公司的后续处理
        }

        console.log(`✅ 工厂数据插入成功! UUID: ${mfgId}`);

        // --- Clean up orphaned manufacturer assets ---
        const expectedMfgAssets = new Set(
            (item.company_assets || []).map(a => `${mfgSlug}/${normalizeStorageFolderName(a.folder)}/${a.file_name}`)
        );

        const { data: existingMfgAssets } = await supabase
            .from('manufacturer_assets')
            .select('id, storage_path')
            .eq('manufacturer_id', mfgId);

        if (existingMfgAssets) {
            for (const asset of existingMfgAssets) {
                if (!expectedMfgAssets.has(asset.storage_path)) {
                    console.log(`🗑️ 删除冗余公司附件: ${asset.storage_path}`);
                    await supabase.from('manufacturer_assets').delete().eq('id', asset.id);
                    await supabase.storage.from(TARGET_BUCKET).remove([asset.storage_path]);
                }
            }
        }

        // --- 2. 处理公司级别资产 (Manufacturer Assets) ---
        if (item.company_assets && item.company_assets.length > 0) {
            console.log(`\n📁 开始处理公司附件...`);
            for (const asset of item.company_assets) {
                try {
                    await processAndUploadAsset(localAssetsDir, mfgSlug, asset, 'manufacturer_id', mfgId, 'manufacturer_assets');
                } catch (error) {
                    console.error(`❌ 公司附件处理失败 [${asset.file_name}]:`, error.message);
                }
            }
        }

        // --- Clean up orphaned products & product assets ---
        const expectedProductSlugs = new Set((item.products || []).map(p => p.product.slug));
        
        const { data: existingProducts } = await supabase
            .from('products')
            .select('id, slug')
            .eq('manufacturer_id', mfgId);

        if (existingProducts) {
            for (const prod of existingProducts) {
                if (!expectedProductSlugs.has(prod.slug)) {
                    console.log(`🗑️ 删除冗余产品: ${prod.slug}`);
                    // Delete all assets for this product
                    const { data: prodAssets } = await supabase
                        .from('product_assets')
                        .select('id, storage_path')
                        .eq('product_id', prod.id);
                    
                    if (prodAssets) {
                        for (const asset of prodAssets) {
                            await supabase.from('product_assets').delete().eq('id', asset.id);
                            await supabase.storage.from(TARGET_BUCKET).remove([asset.storage_path]);
                        }
                    }
                    // Delete the product itself
                    await supabase.from('products').delete().eq('id', prod.id);
                } else {
                    // Product exists in payload, cleanup its specific orphaned assets
                    const payloadProd = item.products.find(p => p.product.slug === prod.slug);
                    const expectedProdAssets = new Set(
                        (payloadProd.product_assets || []).map(a => `${mfgSlug}/${normalizeStorageFolderName(a.folder)}/${a.file_name}`)
                    );

                    const { data: prodAssets } = await supabase
                        .from('product_assets')
                        .select('id, storage_path')
                        .eq('product_id', prod.id);

                    if (prodAssets) {
                        for (const asset of prodAssets) {
                            if (!expectedProdAssets.has(asset.storage_path)) {
                                console.log(`🗑️ 删除冗余产品附件: ${asset.storage_path}`);
                                await supabase.from('product_assets').delete().eq('id', asset.id);
                                await supabase.storage.from(TARGET_BUCKET).remove([asset.storage_path]);
                            }
                        }
                    }
                }
            }
        }

        // --- 3. 处理 Products ---
        if (item.products && item.products.length > 0) {
            console.log(`\n📦 开始处理产品数据...`);
            for (const prodItem of item.products) {
                console.log(`   ⏳ 正在插入/更新产品: ${prodItem.product.slug}`);
                let prodId;
                try {
                    prodId = await findOrCreateProduct(prodItem.product, mfgId);
                } catch (prodError) {
                    console.error(`   ❌ 产品插入失败:`, prodError.message);
                    continue;
                }

                console.log(`   ✅ 产品插入成功! UUID: ${prodId}`);

                // --- 4. 处理产品级别资产 (Product Assets) ---
                if (prodItem.product_assets && prodItem.product_assets.length > 0) {
                    for (const asset of prodItem.product_assets) {
                        try {
                            await processAndUploadAsset(localAssetsDir, mfgSlug, asset, 'product_id', prodId, 'product_assets');
                        } catch (error) {
                            console.error(`❌ 产品附件处理失败 [${asset.file_name}]:`, error.message);
                        }
                    }
                }
            }
        }
    }
    console.log('\n🎉 所有公司数据和文件导入完成！');
}

async function main() {
    if (SHOULD_IMPORT_INDUSTRIES) {
        await syncIndustries();
    } else {
        console.log('⏭️ 跳过 industries 表同步，flag 为 false。');
    }

    if (SHOULD_IMPORT_MANUFACTURER_DATA) {
        await runImport();
    } else {
        console.log('⏭️ 跳过公司/产品数据导入，flag 为 false。');
    }

    await uploadManifestLocalAssets();
    await uploadConfiguredLocalFolders();
}

main().catch(console.error);
