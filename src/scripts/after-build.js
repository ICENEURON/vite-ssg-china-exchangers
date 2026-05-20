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
const countriesPath = path.join(projectRoot, 'src', 'data', 'countries.json');
const env = loadEnv(process.env.NODE_ENV || 'production', projectRoot, '');
const outputPaths = [
  path.join(projectRoot, 'sitemap.xml'),
  path.join(distDir, 'sitemap.xml'),
];

const siteUrl = (env.VITE_SITE_URL || process.env.VITE_SITE_URL || 'https://heatexdirect.com').replace(/\/$/, '');
const siteHost = new URL(siteUrl).host;
const siteHostRegex = siteHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const siteName = env.VITE_SITE_TITLE || process.env.VITE_SITE_TITLE || 'HeatEx Direct';
const shouldNoindex = String(env.VITE_SITE_NOINDEX || process.env.VITE_SITE_NOINDEX || '').toLowerCase() === 'true';
const supportedLanguages = ['en', 'zh'];
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
  if (language === 'zh') {
    return route === '/' ? '/zh' : `/zh${route}`;
  }

  return route;
}

function parseRoute(route) {
  if (route === '/zh' || route.startsWith('/zh/')) {
    const normalizedRoute = route === '/zh' ? '/' : route.slice(3);
    return { language: 'zh', normalizedRoute };
  }

  return { language: 'en', normalizedRoute: route };
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
      { name: language === 'zh' ? '制造商' : 'Manufacturers', route: getLocalizedRoute('/manufacturers', language) },
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
      { name: language === 'zh' ? '\u4ea7\u54c1' : 'Products', route: getLocalizedRoute('/products', language) },
      manufacturer ? { name: manufacturer.name, route: getLocalizedRoute(`/manufacturers/${manufacturerSlug}`, language) } : null,
      { name: product.name, route },
    ].filter(Boolean)),
  ];
}

function getStructuredDataForRoute(route) {
  const { normalizedRoute } = parseRoute(route);

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

    if (structuredData.length === 0) {
      return;
    }

    const html = readText(filePath);

    if (html.includes('data-heatex-structured-data="true"')) {
      manifest.push({ route, schemaTypes: ['already-injected'] });
      return;
    }

    const scriptTag = buildJsonLdScript(structuredData);
    const updatedHtml = html.replace('</head>', `  ${scriptTag}\n</head>`);

    if (updatedHtml !== html) {
      writeText(filePath, updatedHtml);
      manifest.push({ route, schemaTypes: structuredData.map((item) => item['@type']) });
    }
  });

  writeText(path.join(distDir, 'structured-data-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`Updated structured data for ${manifest.filter((entry) => !entry.schemaTypes.includes('already-injected')).length} pages.`);
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
      .filter((language) => language !== 'en')
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

  if (fs.existsSync(htaccessPath)) {
    writeText(path.join(distDir, '.htaccess'), renderTemplate(readText(htaccessPath)));
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

function getPriority(route) {
  if (route === '/' || route === '/zh') return '1.0';
  if (route === '/manufacturers' || route === '/products' || route === '/zh/manufacturers' || route === '/zh/products') return '0.9';
  if (route === '/quote-request' || route === '/zh/quote-request') return '0.9';
  if (route.startsWith('/manufacturers/') || route.startsWith('/zh/manufacturers/')) return '0.8';
  if (route.startsWith('/products/') || route.startsWith('/zh/products/')) return '0.8';
  if (route === '/industry-news' || route === '/zh/industry-news') return '0.7';
  if (route.startsWith('/industry-news/') || route.startsWith('/zh/industry-news/')) return '0.7';
  if (route === '/about' || route === '/contact' || route === '/update-your-profile') return '0.7';
  if (route === '/zh/about' || route === '/zh/contact' || route === '/zh/update-your-profile') return '0.7';
  if (route === '/terms' || route === '/privacy' || route === '/zh/terms' || route === '/zh/privacy') return '0.3';
  return '0.6';
}

function getChangefreq(route) {
  if (route === '/' || route === '/zh' || route === '/manufacturers' || route === '/products' || route === '/zh/manufacturers' || route === '/zh/products') {
    return 'weekly';
  }

  if (route.startsWith('/industry-news/') || route.startsWith('/zh/industry-news/')) {
    return 'monthly';
  }

  if (route.startsWith('/manufacturers/') || route.startsWith('/products/') || route.startsWith('/zh/manufacturers/') || route.startsWith('/zh/products/')) {
    return 'weekly';
  }

  if (route === '/terms' || route === '/privacy' || route === '/zh/terms' || route === '/zh/privacy') {
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
    .sort((a, b) => a.route.localeCompare(b.route));

  const sitemapRoutes = allRoutes.filter(({ route }) => shouldIncludeInSitemap(route));
  const routeSet = new Set(sitemapRoutes.map(({ route }) => route));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapRoutes.map(({ route, lastmod }) => `  <url>\n    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>${buildAlternateLinks(route, routeSet)}\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${getChangefreq(route)}</changefreq>\n    <priority>${getPriority(route)}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;

  outputPaths.forEach((outputPath) => {
    writeText(outputPath, xml);
  });

  copyDeploymentFiles();
  injectStructuredData(allRoutes);
  syncNoindexMeta(allRoutes);
  syncCriticalHeadMeta(allRoutes);
  syncNotFoundPages();

  console.log(`Generated sitemap with ${sitemapRoutes.length} URLs.`);
}

buildSitemap();
