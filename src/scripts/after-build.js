import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';

// Post-build tasks for static output in dist/:
// - generate canonical sitemap.xml at the project root and in dist/
// - copy deployment files such as robots.txt and .htaccess into dist/
// - inject structured data into manufacturer and product detail pages
// - sync robots noindex meta based on VITE_SITE_NOINDEX
// - normalize critical head meta in generated HTML
// - ensure the deployment 404 page uses the React site layout and is noindexed

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const distDir = path.join(projectRoot, 'dist');
const webDir = path.join(projectRoot, 'src', 'web');
const localesDir = path.join(projectRoot, 'src', 'locales');
const languagesPath = path.join(localesDir, 'languages.json');
const countriesPath = path.join(projectRoot, 'src', 'data', 'countries.json');
const postsPath = path.join(projectRoot, '.velite', 'posts.json');
const env = loadEnv(process.env.NODE_ENV || 'production', projectRoot, '');
const outputPaths = [
  path.join(projectRoot, 'sitemap.xml'),
  path.join(distDir, 'sitemap.xml'),
];

const siteUrl = (env.VITE_SITE_URL || process.env.VITE_SITE_URL || 'https://heatexdirect.com').replace(/\/$/, '');
const siteHost = new URL(siteUrl).host;
const siteHostRegex = siteHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const siteName = env.VITE_SITE_TITLE || process.env.VITE_SITE_TITLE || 'HeatEx Direct';
const defaultOgImage = `${siteUrl}/static/websites/heatex-direct.png`;
const shouldNoindex = String(env.VITE_SITE_NOINDEX || process.env.VITE_SITE_NOINDEX || '').toLowerCase() === 'true';
const defaultLanguage = 'en';
const supportedLanguages = Object.keys(readJson(languagesPath));
const countriesByCode = new Map(readJson(countriesPath).map((country) => [country.id, country]));
const localeJsonCache = new Map();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readOptionalJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return readJson(filePath);
}

const postsByPermalink = new Map(
  (readOptionalJson(postsPath) || []).map((post) => [post.permalink, post]),
);

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, content) {
  const maxAttempts = 5;

  if (fs.existsSync(filePath) && readText(filePath) === content) {
    return;
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const tempPath = `${filePath}.${process.pid}.${attempt}.tmp`;

    try {
      fs.writeFileSync(tempPath, content, 'utf8');
      fs.renameSync(tempPath, filePath);
      return;
    } catch (error) {
      if (fs.existsSync(tempPath)) {
        fs.rmSync(tempPath, { force: true });
      }

      if (attempt === maxAttempts) {
        throw error;
      }

      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100 * attempt);
    }
  }
}

function renderTemplate(content) {
  return content
    .replace(/__SITE_URL__/g, siteUrl)
    .replace(/__SITE_HOST__/g, siteHost)
    .replace(/__SITE_HOST_REGEX__/g, siteHostRegex)
    ;
}

function getLocaleJson(language, ...segments) {
  const localePath = path.join(localesDir, language, 'pages', ...segments);
  const cacheKey = `${language}:${segments.join('/')}`;

  if (localeJsonCache.has(cacheKey)) {
    return localeJsonCache.get(cacheKey);
  }

  let data = readOptionalJson(localePath);

  if (!data && language !== 'en') {
    data = readOptionalJson(path.join(localesDir, 'en', 'pages', ...segments));
  }

  localeJsonCache.set(cacheKey, data);
  return data;
}

function toAbsoluteUrl(value) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return new URL(value.startsWith('/') ? value : `/${value}`, `${siteUrl}/`).href;
}

function getLocalizedRoute(route, language) {
  if (language === defaultLanguage) {
    return route;
  }

  return route === '/' ? `/${language}` : `/${language}${route}`;
}

function parseRoute(route) {
  const nonDefaultLanguages = supportedLanguages
    .filter((language) => language !== defaultLanguage)
    .sort((a, b) => b.length - a.length);

  for (const language of nonDefaultLanguages) {
    const prefix = `/${language}`;

    if (route === prefix || route.startsWith(`${prefix}/`)) {
      const normalizedRoute = route === prefix ? '/' : route.slice(prefix.length);
      return { language, normalizedRoute };
    }
  }

  return { language: defaultLanguage, normalizedRoute: route };
}

function getAlternateRoutes(route, routeSet) {
  const { normalizedRoute } = parseRoute(route);
  const variants = supportedLanguages
    .map((language) => getLocalizedRoute(normalizedRoute, language))
    .filter((candidate) => routeSet.has(candidate));

  if (variants.length <= 1) {
    return [];
  }

  return variants;
}

function buildAlternateLinks(route, routeSet) {
  const alternateRoutes = getAlternateRoutes(route, routeSet);

  if (alternateRoutes.length === 0) {
    return '';
  }

  const englishRoute = alternateRoutes.find((candidate) => parseRoute(candidate).language === 'en');
  const links = alternateRoutes.map((candidate) => {
    const { language } = parseRoute(candidate);
    return `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(`${siteUrl}${candidate}`)}" />`;
  });

  if (englishRoute) {
    links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${siteUrl}${englishRoute}`)}" />`);
  }

  return `\n${links.join('\n')}`;
}

function buildBreadcrumbList(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.route),
    })),
  };
}

function firstText(value) {
  if (Array.isArray(value)) {
    return value.find((item) => typeof item === 'string' && item.trim()) || value.join(' ');
  }

  return value;
}

function getLocalizedPageLabel(language, pageFile, fallback) {
  const page = getLocaleJson(language, pageFile);

  return page?.hero?.title || page?.page?.title || page?.title || fallback;
}

function truncateText(value, maxLength = 320) {
  if (!value || typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trim()}...`;
}

function resolveExportMarkets(exportMarkets) {
  return (exportMarkets || [])
    .map((code) => countriesByCode.get(code)?.name || code)
    .filter(Boolean)
    .map((name) => ({ '@type': 'Country', name }));
}

function buildManufacturerSchemas(route, manufacturerSlug) {
  const { language } = parseRoute(route);
  const manufacturer = getLocaleJson(language, 'manufacturers', `${manufacturerSlug}.json`);

  if (!manufacturer) {
    return [];
  }

  const description = truncateText(
    manufacturer.seo_data?.meta_description || firstText(manufacturer.full_description),
  );
  const sameAs = [manufacturer.website, ...(manufacturer.social_media_links || []).filter((link) => link.is_visible !== false).map((link) => link.url)]
    .filter(Boolean);
  const contactPoints = [];

  if ((manufacturer.phone || []).length > 0 || (manufacturer.email || []).length > 0) {
    contactPoints.push({
      '@type': 'ContactPoint',
      telephone: manufacturer.phone?.[0],
      email: manufacturer.email?.[0],
      contactType: 'sales',
      availableLanguage: language,
    });
  }

  const profileTitle = manufacturer.seo_data?.meta_title || manufacturer.name;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: profileTitle,
      description,
      url: toAbsoluteUrl(route),
      inLanguage: language,
      mainEntity: {
        '@id': toAbsoluteUrl(route),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': toAbsoluteUrl(route),
      name: manufacturer.name,
      description,
      url: toAbsoluteUrl(route),
      sameAs,
      image: (manufacturer.images || []).map((image) => toAbsoluteUrl(image.url)).filter(Boolean),
      foundingDate: manufacturer.established_year || undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: manufacturer.address || undefined,
        addressLocality: manufacturer.city || undefined,
        addressCountry: manufacturer.country_name || undefined,
      },
      areaServed: resolveExportMarkets(manufacturer.export_markets),
      knowsAbout: manufacturer.industries || [],
      contactPoint: contactPoints,
    },
    buildBreadcrumbList([
      { name: siteName, route: getLocalizedRoute('/', language) },
      { name: getLocalizedPageLabel(language, 'manufacturers.json', 'Manufacturers'), route: getLocalizedRoute('/manufacturers', language) },
      { name: manufacturer.name, route },
    ]),
  ];
}

function buildProductSchemas(route, manufacturerSlug, productSlug) {
  const { language } = parseRoute(route);
  const product = getLocaleJson(language, 'products', manufacturerSlug, `${productSlug}.json`);
  const manufacturer = getLocaleJson(language, 'manufacturers', `${manufacturerSlug}.json`);

  if (!product) {
    return [];
  }

  const description = truncateText(
    product.seo_data?.meta_description || product.short_description || firstText(product.full_description),
  );
  const technicalParameters = product.technical_parameters || {};
  const url = toAbsoluteUrl(route);
  const imageUrls = (product.images || []).map((image) => toAbsoluteUrl(image.url)).filter(Boolean);
  const manufacturerUrl = manufacturer
    ? toAbsoluteUrl(getLocalizedRoute(`/manufacturers/${manufacturerSlug}`, language))
    : undefined;
  const productTopic = {
    '@type': 'Thing',
    name: product.name,
    description,
    identifier: product.slug,
    url,
    image: imageUrls,
    additionalProperty: Object.entries(technicalParameters).map(([name, value]) => ({
      '@type': 'PropertyValue',
      name,
      value,
    })),
  };

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      name: product.name,
      description,
      url,
      inLanguage: language,
      isPartOf: {
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
      },
      primaryImageOfPage: imageUrls[0] ? {
        '@type': 'ImageObject',
        url: imageUrls[0],
      } : undefined,
      about: productTopic,
      mentions: [
        manufacturer ? {
          '@type': 'Organization',
          name: manufacturer.name,
          url: manufacturerUrl,
        } : null,
        ...(product.industries || []).map((industry) => ({
          '@type': 'DefinedTerm',
          name: industry,
        })),
      ].filter(Boolean),
      keywords: (product.industries || []).join(', ') || undefined,
    },
    buildBreadcrumbList([
      { name: siteName, route: getLocalizedRoute('/', language) },
      { name: getLocalizedPageLabel(language, 'products-page.json', 'Products'), route: getLocalizedRoute('/products', language) },
      manufacturer ? { name: manufacturer.name, route: getLocalizedRoute(`/manufacturers/${manufacturerSlug}`, language) } : null,
      { name: product.name, route },
    ].filter(Boolean)),
  ];
}

function getPostForRoute(route) {
  return postsByPermalink.get(route);
}

function getArticleImage(post) {
  return toAbsoluteUrl(post.cover) || defaultOgImage;
}

function buildArticleSchemas(route) {
  const { language } = parseRoute(route);
  const post = getPostForRoute(route);

  if (!post) {
    return [];
  }

  const url = toAbsoluteUrl(route);
  const headline = post.metaTitle || post.title;
  const description = truncateText(post.metaDescription || post.excerpt || post.title);
  const datePublished = post.date ? new Date(post.date).toISOString() : undefined;
  const image = getArticleImage(post);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      image: image ? [image] : undefined,
      datePublished,
      dateModified: datePublished,
      author: {
        '@type': 'Organization',
        name: post.author || siteName,
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: defaultOgImage,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      url,
      inLanguage: language,
      keywords: Array.isArray(post.keywords) && post.keywords.length > 0
        ? post.keywords.join(', ')
        : undefined,
    },
    buildBreadcrumbList([
      { name: siteName, route: getLocalizedRoute('/', language) },
      { name: getLocalizedPageLabel(language, 'industry-news.json', 'Industry News'), route: getLocalizedRoute('/industry-news', language) },
      { name: post.title, route },
    ]),
  ];
}

function getStructuredDataForRoute(route) {
  const { normalizedRoute } = parseRoute(route);

  const articleMatch = normalizedRoute.match(/^\/industry-news\/(?:news|posts)\/([^/]+)$/);

  if (articleMatch) {
    return buildArticleSchemas(route);
  }

  const manufacturerMatch = normalizedRoute.match(/^\/manufacturers\/([^/]+)$/);

  if (manufacturerMatch) {
    return buildManufacturerSchemas(route, manufacturerMatch[1]);
  }

  const productMatch = normalizedRoute.match(/^\/products\/([^/]+)\/([^/]+)$/);

  if (productMatch) {
    return buildProductSchemas(route, productMatch[1], productMatch[2]);
  }

  return [];
}

function buildJsonLdScript(structuredData) {
  const json = JSON.stringify(structuredData.length === 1 ? structuredData[0] : structuredData)
    .replace(/</g, '\\u003c');

  return `<script type="application/ld+json" data-heatex-structured-data="true">${json}</script>`;
}

function injectStructuredData(routeEntries) {
  const manifest = [];

  routeEntries.forEach(({ route, filePath }) => {
    const structuredData = getStructuredDataForRoute(route);
    const html = readText(filePath);
    const cleanedHtml = html.replace(
      /\n?\s*<script\s+type=["']application\/ld\+json["']\s+data-heatex-structured-data=["']true["'][^>]*>[\s\S]*?<\/script>/gi,
      '',
    );

    if (structuredData.length === 0) {
      if (cleanedHtml !== html) {
        writeText(filePath, cleanedHtml);
      }

      return;
    }

    const scriptTag = buildJsonLdScript(structuredData);
    const updatedHtml = cleanedHtml.replace('</head>', `  ${scriptTag}\n</head>`);

    if (updatedHtml !== html) {
      writeText(filePath, updatedHtml);
      manifest.push({ route, schemaTypes: structuredData.map((item) => item['@type']) });
    }
  });

  writeText(path.join(distDir, 'structured-data-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`Updated structured data for ${manifest.filter((entry) => !entry.schemaTypes.includes('already-injected')).length} pages.`);
}

function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function buildHtmlAlternateLinks(route, routeSet) {
  const alternateRoutes = getAlternateRoutes(route, routeSet);

  if (alternateRoutes.length === 0) {
    return '';
  }

  const englishRoute = alternateRoutes.find((candidate) => parseRoute(candidate).language === defaultLanguage);
  const links = alternateRoutes.map((candidate) => {
    const { language } = parseRoute(candidate);
    return `    <link data-heatex-hreflang="true" rel="alternate" hreflang="${language}" href="${escapeHtmlAttribute(`${siteUrl}${candidate}`)}" />`;
  });

  if (englishRoute) {
    links.push(`    <link data-heatex-hreflang="true" rel="alternate" hreflang="x-default" href="${escapeHtmlAttribute(`${siteUrl}${englishRoute}`)}" />`);
  }

  return links.join('\n');
}

function removeHtmlHreflangLinks(html) {
  return html.replace(
    /\n?\s*<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\bhreflang=["'][^"']+["'])[^>]*\/?>/gi,
    '',
  );
}

function syncHreflangLinks(routeEntries, routeSet) {
  let updatedCount = 0;

  routeEntries.forEach(({ route, filePath }) => {
    const html = readText(filePath);
    const withoutHreflang = removeHtmlHreflangLinks(html);
    const alternateLinks = buildHtmlAlternateLinks(route, routeSet);
    const updatedHtml = alternateLinks
      ? withoutHreflang.replace('</head>', `${alternateLinks}\n</head>`)
      : withoutHreflang;

    if (updatedHtml !== html) {
      writeText(filePath, updatedHtml);
      updatedCount += 1;
    }
  });

  console.log(`Synced hreflang links for ${updatedCount} pages.`);
}

function syncArticleOgImages(routeEntries) {
  let updatedCount = 0;

  routeEntries.forEach(({ route, filePath }) => {
    const post = getPostForRoute(route);

    if (!post?.cover) {
      return;
    }

    const imageUrl = getArticleImage(post);
    const metaTag = `    <meta property="og:image" content="${escapeHtmlAttribute(imageUrl)}" />`;
    const html = readText(filePath);
    const ogImagePattern = /\n?\s*<meta\b(?=[^>]*\bproperty=["']og:image["'])(?=[^>]*\bcontent=["'][^"']*["'])[^>]*\/?>/i;
    const updatedHtml = ogImagePattern.test(html)
      ? html.replace(ogImagePattern, `\n${metaTag}`)
      : html.replace('</head>', `${metaTag}\n</head>`);

    if (updatedHtml !== html) {
      writeText(filePath, updatedHtml);
      updatedCount += 1;
    }
  });

  console.log(`Synced article og:image for ${updatedCount} pages.`);
}

function syncNoindexMeta(routeEntries) {
  routeEntries.forEach(({ filePath }) => {
    const html = readText(filePath);
    const withoutNoindex = html.replace(/\n?\s*<meta\s+name=["']robots["']\s+content=["']noindex,\s*nofollow["']\s*\/?>/i, '');
    const updatedHtml = shouldNoindex
      ? withoutNoindex.replace('</head>', '    <meta name="robots" content="noindex, nofollow" />\n</head>')
      : withoutNoindex;

    if (updatedHtml !== html) {
      writeText(filePath, updatedHtml);
    }
  });

  console.log(`${shouldNoindex ? 'Added' : 'Removed'} noindex meta for ${routeEntries.length} pages.`);
}

function syncCriticalHeadMeta(routeEntries) {
  routeEntries.forEach(({ filePath }) => {
    const html = readText(filePath);
    const withoutCriticalMeta = html
      .replace(/\n?\s*<meta\s+charset=["']UTF-8["']\s*\/?>/i, '')
      .replace(/\n?\s*<meta\s+name=["']viewport["']\s+content=["']width=device-width,\s*initial-scale=1\.0["']\s*\/?>/i, '');
    const updatedHtml = withoutCriticalMeta.replace(
      /<head([^>]*)>\s*/i,
      '<head$1>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n',
    );

    if (updatedHtml !== html) {
      writeText(filePath, updatedHtml);
    }
  });

  console.log(`Normalized critical head meta for ${routeEntries.length} pages.`);
}

function ensureNoindexMeta(html) {
  const withoutNoindex = html.replace(/\n?\s*<meta\s+name=["']robots["']\s+content=["']noindex,\s*nofollow["']\s*\/?>/i, '');

  return withoutNoindex.replace('</head>', '    <meta name="robots" content="noindex, nofollow" />\n</head>');
}

function normalizeCriticalHeadMeta(html) {
  const withoutCriticalMeta = html
    .replace(/\n?\s*<meta\s+charset=["']UTF-8["']\s*\/?>/i, '')
    .replace(/\n?\s*<meta\s+name=["']viewport["']\s+content=["']width=device-width,\s*initial-scale=1\.0["']\s*\/?>/i, '');

  return withoutCriticalMeta.replace(
    /<head([^>]*)>\s*/i,
    '<head$1>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n',
  );
}

function syncNotFoundPages() {
  const notFoundPaths = [
    path.join(distDir, '404.html'),
    ...supportedLanguages
      .filter((language) => language !== defaultLanguage)
      .map((language) => path.join(distDir, language, '404.html')),
  ].filter((filePath) => fs.existsSync(filePath));

  if (notFoundPaths.length === 0) {
    throw new Error(`404 page was not generated: ${path.join(distDir, '404.html')}`);
  }

  notFoundPaths.forEach((notFoundPath) => {
    const html = readText(notFoundPath);
    const updatedHtml = ensureNoindexMeta(normalizeCriticalHeadMeta(html));

    if (updatedHtml !== html) {
      writeText(notFoundPath, updatedHtml);
    }
  });

  console.log(`Synced ${notFoundPaths.length} custom 404 pages.`);
}

function writeRobotsTxt() {
  const robotsTemplatePath = path.join(webDir, 'robots.txt');
  const robotsTemplate = fs.existsSync(robotsTemplatePath)
    ? readText(robotsTemplatePath)
    : 'User-agent: *\nAllow: /\n\nSitemap: __SITE_URL__/sitemap.xml\n';

  writeText(path.join(distDir, 'robots.txt'), renderTemplate(robotsTemplate));
}

function copyDeploymentFiles() {
  const htaccessPath = path.join(webDir, '.htaccess');
  const sitemapStylesheetPath = path.join(webDir, 'sitemap.xsl');

  if (fs.existsSync(htaccessPath)) {
    writeText(path.join(distDir, '.htaccess'), renderTemplate(readText(htaccessPath)));
  }

  if (fs.existsSync(sitemapStylesheetPath)) {
    writeText(path.join(projectRoot, 'sitemap.xsl'), renderTemplate(readText(sitemapStylesheetPath)));
    writeText(path.join(distDir, 'sitemap.xsl'), renderTemplate(readText(sitemapStylesheetPath)));
  }

  writeRobotsTxt();
}

function walkHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === '.vite' || entry.name === 'assets' || entry.name === 'static' || entry.name === 'storage') {
        continue;
      }

      files.push(...walkHtmlFiles(fullPath));
      continue;
    }

    if (entry.name.endsWith('.html') && entry.name !== '404.html') {
      files.push(fullPath);
    }
  }

  return files;
}

function toRoute(filePath) {
  const relativePath = path.relative(distDir, filePath).replace(/\\/g, '/');

  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    const routePath = relativePath.slice(0, -'/index.html'.length);
    return `/${routePath}`;
  }

  if (relativePath.endsWith('.html')) {
    const routePath = relativePath.slice(0, -'.html'.length);
    return `/${routePath}`;
  }

  return null;
}

function shouldIncludeInSitemap(route) {
  return true;
}

function isArticleRoute(route) {
  const { normalizedRoute } = parseRoute(route);

  return normalizedRoute.startsWith('/industry-news/') && normalizedRoute !== '/industry-news';
}

function getLanguageSortIndex(route) {
  const { language } = parseRoute(route);
  const index = supportedLanguages.indexOf(language);

  return index === -1 ? supportedLanguages.length : index;
}

function compareSitemapRoutes(first, second) {
  const firstIsArticle = isArticleRoute(first.route);
  const secondIsArticle = isArticleRoute(second.route);

  if (firstIsArticle !== secondIsArticle) {
    return firstIsArticle ? 1 : -1;
  }

  const firstParsed = parseRoute(first.route);
  const secondParsed = parseRoute(second.route);
  const normalizedComparison = firstParsed.normalizedRoute.localeCompare(secondParsed.normalizedRoute);

  if (normalizedComparison !== 0) {
    return normalizedComparison;
  }

  return getLanguageSortIndex(first.route) - getLanguageSortIndex(second.route);
}

function getPriority(route) {
  const { normalizedRoute } = parseRoute(route);

  if (normalizedRoute === '/') return '1.0';
  if (normalizedRoute === '/manufacturers' || normalizedRoute === '/products') return '0.9';
  if (normalizedRoute === '/quote-request') return '0.9';
  if (normalizedRoute.startsWith('/manufacturers/')) return '0.8';
  if (normalizedRoute.startsWith('/products/')) return '0.8';
  if (normalizedRoute === '/industry-news') return '0.7';
  if (normalizedRoute.startsWith('/industry-news/')) return '0.7';
  if (normalizedRoute === '/about' || normalizedRoute === '/contact' || normalizedRoute === '/update-your-profile') return '0.7';
  if (normalizedRoute === '/terms' || normalizedRoute === '/privacy') return '0.3';
  return '0.6';
}

function getChangefreq(route) {
  const { normalizedRoute } = parseRoute(route);

  if (normalizedRoute === '/' || normalizedRoute === '/manufacturers' || normalizedRoute === '/products') {
    return 'weekly';
  }

  if (normalizedRoute.startsWith('/industry-news/')) {
    return 'monthly';
  }

  if (normalizedRoute.startsWith('/manufacturers/') || normalizedRoute.startsWith('/products/')) {
    return 'weekly';
  }

  if (normalizedRoute === '/terms' || normalizedRoute === '/privacy') {
    return 'yearly';
  }

  return 'monthly';
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap() {
  if (!fs.existsSync(distDir)) {
    throw new Error(`Dist directory not found: ${distDir}`);
  }

  const allRoutes = walkHtmlFiles(distDir)
    .map((filePath) => {
      const route = toRoute(filePath);

      if (!route) {
        return null;
      }

      const lastmod = fs.statSync(filePath).mtime.toISOString().slice(0, 10);

      return {
        route,
        filePath,
        lastmod,
      };
    })
    .filter(Boolean)
    .sort(compareSitemapRoutes);

  const sitemapRoutes = allRoutes.filter(({ route }) => shouldIncludeInSitemap(route));
  const routeSet = new Set(sitemapRoutes.map(({ route }) => route));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapRoutes.map(({ route, lastmod }) => `  <url>\n    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>${buildAlternateLinks(route, routeSet)}\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${getChangefreq(route)}</changefreq>\n    <priority>${getPriority(route)}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;

  outputPaths.forEach((outputPath) => {
    writeText(outputPath, xml);
  });

  copyDeploymentFiles();
  injectStructuredData(allRoutes);
  syncArticleOgImages(allRoutes);
  syncHreflangLinks(sitemapRoutes, routeSet);
  syncNoindexMeta(allRoutes);
  syncCriticalHeadMeta(allRoutes);
  syncNotFoundPages();

  console.log(`Generated sitemap with ${sitemapRoutes.length} URLs.`);
}

buildSitemap();
