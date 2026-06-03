import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');
const maxMainChunkBytes = 1200 * 1024;
const blogLeakNeedles = [
  'what-data-to-send-before-heat-exchanger-quote',
  'wide-gap-welded-plate-air-preheater',
];
const routeChunkNames = [
  'route-auth',
  'route-blog',
  'route-home',
  'route-manufacturers',
  'route-products',
  'route-rfq',
  'route-static-pages',
];

const failures = [];

function fail(message) {
  failures.push(message);
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

    if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function routeFromHtmlPath(filePath) {
  const relativePath = path.relative(path.join(rootDir, 'dist'), filePath).replace(/\\/g, '/');

  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'/index.html'.length)}`;
  }

  return `/${relativePath.replace(/\.html$/, '')}`;
}

function normalizedRoute(route) {
  const languageMatch = route.match(/^\/(?:zh|ru|es|fr|ar)(\/.*)?$/);
  return languageMatch ? languageMatch[1] || '/' : route;
}

function allowedRouteChunksFor(route) {
  const normalized = normalizedRoute(route);

  if (normalized === '/') return new Set(['route-home']);
  if (normalized.startsWith('/products')) return new Set(['route-products']);
  if (normalized.startsWith('/manufacturers')) return new Set(['route-manufacturers']);
  if (normalized.startsWith('/industry-news')) return new Set(['route-blog']);
  if (normalized === '/quote-request') return new Set(['route-rfq']);
  if (normalized === '/login' || normalized === '/register' || normalized === '/dashboard') return new Set(['route-auth']);

  return new Set(['route-static-pages']);
}

function getRouteResourceChunks(html) {
  return [...html.matchAll(/<link\b(?=[^>]*\brel=["'](?:modulepreload|stylesheet)["'])(?=[^>]*\bhref=["'][^"']*\/assets\/(route-[^"']+\.(?:js|css))["'])[^>]*>/gi)]
    .map((match) => routeChunkNames.find((chunkName) => match[1].startsWith(`${chunkName}-`)))
    .filter(Boolean);
}

function getInitialJsFiles(html) {
  return [...html.matchAll(/(?:src|href)=["']\/assets\/([^"']+\.js)["']/g)]
    .map((match) => match[1]);
}

function collectStaticImports(entryFiles, assetFiles) {
  const assetSet = new Set(assetFiles);
  const visited = new Set();
  const queue = [...entryFiles];
  const staticImportRegex = /import(?:[^'"]*?from)?["']\.\/([^"']+\.js)["']|import["']\.\/([^"']+\.js)["']/g;

  while (queue.length > 0) {
    const file = queue.shift();
    if (!file || visited.has(file) || !assetSet.has(file)) continue;

    visited.add(file);
    const source = fs.readFileSync(path.join(assetsDir, file), 'utf8');
    let match;

    while ((match = staticImportRegex.exec(source))) {
      const importedFile = match[1] || match[2];
      if (assetSet.has(importedFile) && !visited.has(importedFile)) {
        queue.push(importedFile);
      }
    }
  }

  return visited;
}

function getRouteChunksFromFiles(files) {
  return [...files]
    .map((file) => routeChunkNames.find((chunkName) => file.startsWith(`${chunkName}-`)))
    .filter(Boolean);
}

function getSsgHashes(html) {
  return [...html.matchAll(/window\.__VITE_REACT_SSG_HASH__\s*=\s*['"]([^'"]+)['"]/g)]
    .map((match) => match[1]);
}

function checkStaticLoaderDataManifests(htmlFiles) {
  const ssgHashes = new Set();

  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, 'utf8');

    for (const hash of getSsgHashes(html)) {
      ssgHashes.add(hash);
    }
  }

  if (ssgHashes.size === 0) {
    fail('Missing Vite React SSG hash in generated HTML');
    return;
  }

  for (const hash of ssgHashes) {
    const manifestName = `static-loader-data-manifest-${hash}.json`;
    const manifestPath = path.join(distDir, manifestName);

    if (!fs.existsSync(manifestPath)) {
      fail(`Missing ${manifestName}; client-side navigation will fetch HTML fallback and fail JSON parsing`);
      continue;
    }

    try {
      JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (error) {
      fail(`${manifestName} is not valid JSON: ${error.message}`);
    }
  }
}

if (!fs.existsSync(distDir)) {
  fail(`Missing build dist directory: ${distDir}`);
} else {
  const htmlFiles = walkHtmlFiles(distDir);
  checkStaticLoaderDataManifests(htmlFiles);
}

if (!fs.existsSync(assetsDir)) {
  fail(`Missing build assets directory: ${assetsDir}`);
} else {
  const assetFiles = fs.readdirSync(assetsDir).filter((file) => file.endsWith('.js'));
  const mainChunks = fs
    .readdirSync(assetsDir)
    .filter((file) => /^main-.*\.js$/.test(file));

  if (mainChunks.length === 0) {
    fail('Missing main JS chunk');
  }

  for (const file of mainChunks) {
    const filePath = path.join(assetsDir, file);
    const source = fs.readFileSync(filePath, 'utf8');
    const size = fs.statSync(filePath).size;

    if (size > maxMainChunkBytes) {
      fail(`${file} is ${(size / 1024).toFixed(1)}KB; expected <= ${(maxMainChunkBytes / 1024).toFixed(0)}KB after route splitting`);
    }

    for (const needle of blogLeakNeedles) {
      if (source.includes(needle)) {
        fail(`${file} still contains blog content marker "${needle}"`);
      }
    }
  }

  const htmlFiles = walkHtmlFiles(distDir);

  for (const filePath of htmlFiles) {
    const route = routeFromHtmlPath(filePath);
    const allowedRouteChunks = allowedRouteChunksFor(route);
    const html = fs.readFileSync(filePath, 'utf8');
    const routeResourceChunks = getRouteResourceChunks(html);
    const blockingChunks = routeResourceChunks.filter((chunkName) => !allowedRouteChunks.has(chunkName));

    if (blockingChunks.length > 0) {
      fail(`${path.relative(path.join(rootDir, 'dist'), filePath).replace(/\\/g, '/')} preloads unrelated route chunk(s): ${[...new Set(blockingChunks)].join(', ')}`);
    }

    const staticGraph = collectStaticImports(getInitialJsFiles(html), assetFiles);
    const blockingStaticChunks = getRouteChunksFromFiles(staticGraph).filter((chunkName) => !allowedRouteChunks.has(chunkName));

    if (blockingStaticChunks.length > 0) {
      fail(`${path.relative(path.join(rootDir, 'dist'), filePath).replace(/\\/g, '/')} statically imports unrelated route chunk(s): ${[...new Set(blockingStaticChunks)].join(', ')}`);
    }

  }
}

if (failures.length > 0) {
  console.error('Route chunk check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Route chunks keep large blog content out of main and main is within budget.');
