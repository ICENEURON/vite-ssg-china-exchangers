import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const newsDir = path.join(projectRoot, 'content/news');
const dataDir = path.join(projectRoot, 'src/data');
const localesDir = path.join(projectRoot, 'src/locales');
const languagesPath = path.join(localesDir, 'languages.json');
const manufacturersPath = path.join(dataDir, 'manufacturers.json');
const highlightedArticlesPath = path.join(dataDir, 'highlighted-articles.json');
const featuredFirstCompanySlug = 'shanghai-heat-transfer-equipment-co-ltd';
const excludedHomepageCompanySlugs = new Set(['heatex-direct']);
const languages = Object.keys(readJson(languagesPath));

const fallbackCompanies = {
  'heatex-direct': {
    id: 'heatex-direct',
    name: toLocalizedValue('HeatEx Direct')
  }
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function toLocalizedValue(value) {
  return Object.fromEntries(languages.map((language) => [language, value]));
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
    name: toLocalizedValue(companySlug)
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

function buildArticlePermalinks(contentType, slug) {
  return Object.fromEntries(
    languages.map((language) => [
      language,
      `${language === 'en' ? '' : `/${language}`}/industry-news/${contentType}/${slug}`
    ])
  );
}

function normalizePublicPath(value) {
  if (!value) {
    return '';
  }

  return value.startsWith('/') ? value : `/${value}`;
}

function buildHighlightedArticle(companySlug, article, manufacturersBySlug) {
  const companyMeta = getCompanyMeta(companySlug, manufacturersBySlug);
  const english = article.localized.en || {};
  const firstLocalized = Object.values(article.localized)[0] || {};
  const fallbackTitle = english.title || firstLocalized.title || article.slug;
  const fallbackDescription =
    english.excerpt ||
    english.metaDescription ||
    firstLocalized.excerpt ||
    firstLocalized.metaDescription ||
    '';

  return {
    companyId: companyMeta.id,
    companySlug,
    companyName: companyMeta.name,
    contentType: 'news',
    articleSlug: article.slug,
    permalinks: buildArticlePermalinks('news', article.slug),
    cover: Object.fromEntries(
      languages.map((language) => [
        language,
        normalizePublicPath(article.localized[language]?.cover || english.cover || firstLocalized.cover || '')
      ])
    ),
    articleTitle: Object.fromEntries(
      languages.map((language) => [
        language,
        article.localized[language]?.title || fallbackTitle
      ])
    ),
    shortDescription: Object.fromEntries(
      languages.map((language) => [
        language,
        article.localized[language]?.excerpt ||
          article.localized[language]?.metaDescription ||
          fallbackDescription
      ])
    ),
    date: article.date,
    paths: Object.fromEntries(
      languages.map((language) => [
        language,
        `news/${companySlug}/${article.localized[language] ? language : 'en'}/${article.filename}`
      ])
    )
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
    .map((entry) => entry.name)
    .filter((companySlug) => !excludedHomepageCompanySlugs.has(companySlug));

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
    description: 'Automatically generated homepage highlight configuration using the latest news article for each external company. HeatEx Direct articles are excluded. Shanghai Heat Transfer Equipment Co., Ltd. is pinned first.',
    items
  };

  fs.writeFileSync(highlightedArticlesPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Updated ${path.relative(projectRoot, highlightedArticlesPath)} with ${items.length} highlighted news articles.`);
}

main();
