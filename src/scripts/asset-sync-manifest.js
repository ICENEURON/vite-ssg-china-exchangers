import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const manifestPath = path.join(repoRoot, 'supabase_importer', 'asset_sync_manifest.json');
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

function normalizeLocalAssetPath(value) {
  let normalized = normalizeSlashes(value);
  normalized = normalized.replace(/^assets\//, '');
  normalized = normalized.replace(/^local_assets\//, '');
  normalized = normalized.replace(/^supabase_importer\/local_assets\//, '');
  const parts = normalized.split('/');

  if (parts.length >= 3 && storageFolderAliases.has(parts[1])) {
    parts[1] = storageFolderAliases.get(parts[1]);
    normalized = parts.join('/');
  }

  return normalized;
}

function normalizeContentImagePath(value) {
  let normalized = normalizeSlashes(value);
  normalized = normalized.replace(/^contents\//, '');
  normalized = normalized.replace(/^local_contents\//, '');
  normalized = normalized.replace(/^supabase_importer\/local_contents\//, '');
  normalized = normalized.replace(/^content_posts_image\//, '');
  return normalized;
}

function readStringArray(value) {
  return Array.isArray(value) ? value.filter(item => typeof item === 'string' && item.trim()) : [];
}

export function loadAssetSyncManifest() {
  if (!fs.existsSync(manifestPath)) {
    return {
      enabled: false,
      manifestPath,
      localAssets: new Set(),
      contentPostImages: new Set()
    };
  }

  const raw = fs.readFileSync(manifestPath, 'utf8');
  const parsed = JSON.parse(raw);

  return {
    enabled: parsed.enabled !== false,
    manifestPath,
    localAssets: new Set(readStringArray(parsed.local_assets).map(normalizeLocalAssetPath)),
    contentPostImages: new Set(readStringArray(parsed.content_posts_image).map(normalizeContentImagePath))
  };
}

export function normalizeAssetManifestLocalAssetPath(value) {
  return normalizeLocalAssetPath(value);
}

export function normalizeAssetManifestContentImagePath(value) {
  return normalizeContentImagePath(value);
}

export function isContentPostImageStoragePath(storagePath) {
  return normalizeSlashes(storagePath).startsWith('content_posts_image/');
}

export function shouldProcessLocalAsset(manifest, storagePath) {
  if (!manifest.enabled) {
    return true;
  }

  return manifest.localAssets.has(normalizeLocalAssetPath(storagePath));
}

export function shouldProcessContentStoragePath(manifest, storagePath) {
  if (!manifest.enabled || !isContentPostImageStoragePath(storagePath)) {
    return true;
  }

  return manifest.contentPostImages.has(normalizeContentImagePath(storagePath));
}

export function getContentImageStoragePath(relativePath) {
  return `content_posts_image/${normalizeContentImagePath(relativePath)}`;
}
