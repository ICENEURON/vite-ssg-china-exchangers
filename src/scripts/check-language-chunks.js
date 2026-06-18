import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');
const languages = ['en', 'zh', 'ru', 'es', 'fr', 'ar'];
const nonDefaultLanguages = languages.filter((language) => language !== 'en');
const maxSiteDataChunkBytes = 800 * 1024;

function fail(message) {
  failures.push(message);
}

function getAssetFiles() {
  if (!fs.existsSync(assetsDir)) {
    fail(`Missing build assets directory: ${assetsDir}`);
    return [];
  }

  return fs.readdirSync(assetsDir).filter((file) => file.endsWith('.js'));
}

function readAsset(file) {
  return fs.readFileSync(path.join(assetsDir, file), 'utf8');
}

function collectStaticImports(entryFiles, assetFiles) {
  const assetSet = new Set(assetFiles);
  const visited = new Set();
  const queue = [...entryFiles];
  const staticImportRegex = /import\s+(?:[^'"]*?\s+from\s*)?["']\.\/([^"']+\.js)["']|import\s*["']\.\/([^"']+\.js)["']/g;

  while (queue.length > 0) {
    const file = queue.shift();
    if (!file || visited.has(file) || !assetSet.has(file)) continue;

    visited.add(file);
    const source = readAsset(file);
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

function getInitialScriptFiles(htmlFile) {
  const htmlPath = path.join(distDir, htmlFile);
  if (!fs.existsSync(htmlPath)) {
    fail(`Missing built HTML file: ${htmlPath}`);
    return [];
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  return [...html.matchAll(/(?:src|href)="\/assets\/([^"]+\.js)"/g)].map((match) => match[1]);
}

const failures = [];
const assetFiles = getAssetFiles();

for (const language of languages) {
  const hasLocaleChunk = assetFiles.some((file) => file.startsWith(`locale-${language}-`) && file.endsWith('.js'));
  if (!hasLocaleChunk) {
    fail(`Missing split locale chunk for ${language}`);
  }
}

for (const file of assetFiles.filter((asset) => asset.startsWith('site-data-'))) {
  const size = fs.statSync(path.join(assetsDir, file)).size;
  if (size > maxSiteDataChunkBytes) {
    fail(`${file} is ${(size / 1024).toFixed(1)}KB; expected <= ${(maxSiteDataChunkBytes / 1024).toFixed(0)}KB after language splitting`);
  }
}

const productInitialFiles = getInitialScriptFiles('products.html');
const productStaticGraph = collectStaticImports(productInitialFiles, assetFiles);

for (const language of nonDefaultLanguages) {
  const blockingChunks = [...productStaticGraph].filter((file) => file.startsWith(`locale-${language}-`));
  if (blockingChunks.length > 0) {
    fail(`English /products statically loads ${language} locale chunk(s): ${blockingChunks.join(', ')}`);
  }
}

if (failures.length > 0) {
  console.error('Language chunk check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Language chunks are split by locale and English /products does not statically load non-English locales.');
