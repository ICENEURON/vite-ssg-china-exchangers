import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const newsDir = path.join(projectRoot, 'content/news');
const dataDir = path.join(projectRoot, 'src/data');
const manufacturersPath = path.join(dataDir, 'manufacturers.json');
const highlightedArticlesPath = path.join(dataDir, 'highlighted-articles.json');
const featuredFirstCompanySlug = 'shanghai-heat-transfer-equipment-co-ltd';
const languages = ['en', 'zh'];

const fallbackCompanies = {
  'heatex-direct': {
    id: 'heatex-direct',
    name: {
      en: 'HeatEx Direct',
      zh: 'HeatEx Direct'
    }
  }
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function stripWrappingQuotes(value) {
  const trimmed = value.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) {
    return {};
  }

  const endIndex = markdown.indexOf('\n---', 3);
  if (endIndex === -1) {
    return {};
  }

  const frontmatter = markdown.slice(3, endIndex).trim();
  const data = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    data[key] = stripWrappingQuotes(rawValue);
  }

  return data;
}

function readPostFrontmatter(filePath) {
  return parseFrontmatter(fs.readFileSync(filePath, 'utf-8'));
}

function toTimestamp(date) {
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory)
    .filter((filename) => filename.endsWith('.md'))
    .sort();
}

function getCompanyMeta(companySlug, manufacturersBySlug) {
  const manufacturer = manufacturersBySlug.get(companySlug);
  if (manufacturer) {
    return {
      id: manufacturer.id,
      name: manufacturer.name
    };
  }

  return fallbackCompanies[companySlug] || {
    id: companySlug,
    name: {
      en: companySlug,
      zh: companySlug
    }
  };
}

function getLocalizedArticle(companySlug, filename) {
  const localized = {};

  for (const language of languages) {
    const filePath = path.join(newsDir, companySlug, language, filename);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    localized[language] = readPostFrontmatter(filePath);
  }

  return localized;
}

function getLatestNewsArticle(companySlug) {
  const englishNewsDir = path.join(newsDir, companySlug, 'en');
  const articles = getMarkdownFiles(englishNewsDir)
    .map((filename) => {
      const localized = getLocalizedArticle(companySlug, filename);
      const englishFrontmatter = localized.en;

      if (!englishFrontmatter?.date || !englishFrontmatter?.title) {
        return null;
      }

      return {
        filename,
        slug: englishFrontmatter.slug || filename.replace(/\.md$/, ''),
        date: englishFrontmatter.date,
        timestamp: toTimestamp(englishFrontmatter.date),
        localized
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.timestamp - a.timestamp || a.slug.localeCompare(b.slug));

  return articles[0] || null;
}

function buildHighlightedArticle(companySlug, article, manufacturersBySlug) {
  const companyMeta = getCompanyMeta(companySlug, manufacturersBySlug);
  const english = article.localized.en || {};
  const chinese = article.localized.zh || english;

  return {
    companyId: companyMeta.id,
    companySlug,
    companyName: companyMeta.name,
    contentType: 'news',
    articleSlug: article.slug,
    articleTitle: {
      en: english.title || article.slug,
      zh: chinese.title || english.title || article.slug
    },
    shortDescription: {
      en: english.excerpt || english.metaDescription || '',
      zh: chinese.excerpt || chinese.metaDescription || english.excerpt || english.metaDescription || ''
    },
    date: article.date,
    paths: {
      en: `news/${companySlug}/en/${article.filename}`,
      zh: `news/${companySlug}/zh/${article.filename}`
    }
  };
}

function sortHighlightedArticles(items) {
  return items.sort((a, b) => {
    if (a.companySlug === featuredFirstCompanySlug) return -1;
    if (b.companySlug === featuredFirstCompanySlug) return 1;

    return toTimestamp(b.date) - toTimestamp(a.date) || a.companySlug.localeCompare(b.companySlug);
  });
}

function main() {
  if (!fs.existsSync(newsDir)) {
    throw new Error(`News directory not found: ${newsDir}`);
  }

  const manufacturers = readJson(manufacturersPath);
  const manufacturersBySlug = new Map(manufacturers.map((manufacturer) => [manufacturer.slug, manufacturer]));

  const companySlugs = fs.readdirSync(newsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const items = sortHighlightedArticles(
    companySlugs
      .map((companySlug) => {
        const article = getLatestNewsArticle(companySlug);
        return article ? buildHighlightedArticle(companySlug, article, manufacturersBySlug) : null;
      })
      .filter(Boolean)
  ).map((item, index) => ({
    priority: index + 1,
    ...item
  }));

  const output = {
    lastUpdated: new Date().toISOString().slice(0, 10),
    description: 'Automatically generated homepage highlight configuration using the latest news article for each company. Shanghai Heat Transfer Equipment Co., Ltd. is pinned first.',
    items
  };

  fs.writeFileSync(highlightedArticlesPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Updated ${path.relative(projectRoot, highlightedArticlesPath)} with ${items.length} highlighted news articles.`);
}

main();