import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const distDir = path.join(projectRoot, 'dist');
const outputPaths = [
  path.join(projectRoot, 'sitemap.xml'),
  path.join(distDir, 'sitemap.xml'),
];

const siteUrl = (process.env.VITE_SITE_URL || 'https://heatexdirect.com').replace(/\/$/, '');

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

function getPriority(route) {
  if (route === '/' || route === '/zh') return '1.0';
  if (route === '/manufacturers' || route === '/products' || route === '/zh/manufacturers' || route === '/zh/products') return '0.9';
  if (route === '/quote-request' || route === '/zh/quote-request') return '0.9';
  if (route.startsWith('/manufacturers/') || route.startsWith('/zh/manufacturers/')) return '0.8';
  if (route.startsWith('/products/') || route.startsWith('/zh/products/')) return '0.8';
  if (route === '/industry-news' || route === '/zh/industry-news') return '0.7';
  if (route.startsWith('/industry-news/') || route.startsWith('/zh/industry-news/')) return '0.7';
  if (route === '/about' || route === '/contact' || route === '/update-your-profile' || route === '/claim-your-profile') return '0.7';
  if (route === '/zh/about' || route === '/zh/contact' || route === '/zh/update-your-profile' || route === '/zh/claim-your-profile') return '0.7';
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

  const routes = walkHtmlFiles(distDir)
    .map((filePath) => {
      const route = toRoute(filePath);

      if (!route) {
        return null;
      }

      const lastmod = fs.statSync(filePath).mtime.toISOString().slice(0, 10);

      return {
        route,
        lastmod,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.route.localeCompare(b.route));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(({ route, lastmod }) => `  <url>\n    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${getChangefreq(route)}</changefreq>\n    <priority>${getPriority(route)}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;

  outputPaths.forEach((outputPath) => {
    fs.writeFileSync(outputPath, xml, 'utf8');
  });

  console.log(`Generated sitemap with ${routes.length} URLs.`);
}

buildSitemap();