import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const manifestPath = path.join(repoRoot, 'supabase_importer', 'asset_sync_manifest.json');

const folderNames = ['data', 'local_assets', 'local_contents', 'local_web_pages', 'web_data'];
const storageFolderAliases = new Map([
  ['company_docs', 'company_doc'],
  ['company_docss', 'company_doc'],
  ['product_docs', 'product_doc'],
  ['product_docss', 'product_doc']
]);

function normalizeSlashes(value) {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');
}

function removeFolderPrefix(value, folderName) {
  let normalized = normalizeSlashes(value);
  normalized = normalized.replace(new RegExp(`^supabase_importer/${folderName}/`), '');
  normalized = normalized.replace(new RegExp(`^${folderName}/`), '');
  return normalized;
}

function normalizeDataPath(value) {
  return removeFolderPrefix(value, 'data');
}

function normalizeWebDataPath(value) {
  return removeFolderPrefix(value, 'web_data');
}

function normalizeLocalWebPagePath(value) {
  return removeFolderPrefix(value, 'local_web_pages');
}

function normalizeLocalContentPath(value) {
  let normalized = removeFolderPrefix(value, 'local_contents');
  normalized = normalized.replace(/^contents\//, '');
  return normalized;
}

function normalizeLocalAssetPath(value) {
  let normalized = removeFolderPrefix(value, 'local_assets');
  normalized = normalized.replace(/^assets\//, '');
  const parts = normalized.split('/');

  if (parts.length >= 3 && storageFolderAliases.has(parts[1])) {
    parts[1] = storageFolderAliases.get(parts[1]);
    normalized = parts.join('/');
  }

  return normalized;
}

function normalizeContentImagePath(value) {
  let normalized = normalizeLocalContentPath(value);
  normalized = normalized.replace(/^content_posts_image\//, '');
  return normalized;
}

function readStringArray(value) {
  return Array.isArray(value) ? value.filter(item => typeof item === 'string' && item.trim()) : [];
}

function normalizeSet(values, normalize) {
  return new Set(readStringArray(values).map(normalize).filter(Boolean));
}

function getEmptyManifest(enabled = false) {
  return {
    enabled,
    manifestPath,
    data: new Set(),
    webData: new Set(),
    localAssets: new Set(),
    localContents: new Set(),
    localWebPages: new Set(),
    contentPostImages: new Set()
  };
}

export function loadAssetSyncManifest() {
  if (!fs.existsSync(manifestPath)) {
    return getEmptyManifest(false);
  }

  const raw = fs.readFileSync(manifestPath, 'utf8');
  const parsed = JSON.parse(raw);
  const manifest = getEmptyManifest(parsed.enabled !== false);

  manifest.data = normalizeSet(parsed.data, normalizeDataPath);
  manifest.webData = normalizeSet(parsed.web_data, normalizeWebDataPath);
  manifest.localAssets = normalizeSet(parsed.local_assets, normalizeLocalAssetPath);
  manifest.localContents = normalizeSet(parsed.local_contents, normalizeLocalContentPath);
  manifest.localWebPages = normalizeSet(parsed.local_web_pages, normalizeLocalWebPagePath);
  manifest.contentPostImages = normalizeSet(parsed.content_posts_image, normalizeContentImagePath);

  for (const relativePath of manifest.contentPostImages) {
    manifest.localContents.add(`content_posts_image/${relativePath}`);
  }

  return manifest;
}

export function getManifestFolderNames() {
  return folderNames;
}

export function normalizeAssetManifestDataPath(value) {
  return normalizeDataPath(value);
}

export function normalizeAssetManifestWebDataPath(value) {
  return normalizeWebDataPath(value);
}

export function normalizeAssetManifestLocalAssetPath(value) {
  return normalizeLocalAssetPath(value);
}

export function normalizeAssetManifestLocalContentPath(value) {
  return normalizeLocalContentPath(value);
}

export function normalizeAssetManifestLocalWebPagePath(value) {
  return normalizeLocalWebPagePath(value);
}

export function normalizeAssetManifestContentImagePath(value) {
  return normalizeContentImagePath(value);
}

export function shouldProcessDataFile(manifest, relativePath) {
  return !manifest.enabled || manifest.data.has(normalizeDataPath(relativePath));
}

export function shouldProcessWebDataFile(manifest, relativePath) {
  return !manifest.enabled || manifest.webData.has(normalizeWebDataPath(relativePath));
}

export function shouldProcessLocalAsset(manifest, storagePath) {
  return !manifest.enabled || manifest.localAssets.has(normalizeLocalAssetPath(storagePath));
}

export function shouldProcessLocalContent(manifest, storagePath) {
  return !manifest.enabled || manifest.localContents.has(normalizeLocalContentPath(storagePath));
}

export function shouldProcessLocalWebPage(manifest, storagePath) {
  return !manifest.enabled || manifest.localWebPages.has(normalizeLocalWebPagePath(storagePath));
}

export function getContentImageStoragePath(relativePath) {
  return `content_posts_image/${normalizeContentImagePath(relativePath)}`;
}

