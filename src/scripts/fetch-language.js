import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadAssetSyncManifest } from './asset-sync-manifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env.local');

const TARGET_BUCKET = 'webpages';
const DEST_DIR = path.resolve(__dirname, '../locales');
const VERBOSE = process.env.SYNC_VERBOSE === '1';
const assetSyncManifest = loadAssetSyncManifest();

let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error('Could not read .env.local file. Please make sure it exists at the root of the project.');
  process.exit(1);
}

const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => {
      const parts = line.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/(^"|"$)/g, '');
      return [key, val];
    })
);

const url = env['SUPABASE_URL'] || env['VITE_SUPABASE_URL'];
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['VITE_SUPABASE_SERVICE_ROLE_KEY'];
const anonKey = env['SUPABASE_ANON_KEY'] || env['VITE_SUPABASE_ANON_KEY'];
const key = serviceRoleKey || anonKey;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

function isRetriableFileError(error) {
  return ['EBUSY', 'EPERM', 'EACCES', 'UNKNOWN'].includes(error?.code);
}

function isRetriableStorageError(error) {
  const message = error?.message || '';
  return (
    error?.status >= 500 ||
    message.includes('Unexpected token') ||
    message.includes('fetch failed') ||
    message.includes('network') ||
    message.includes('timeout')
  );
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatError(error) {
  return error?.message || JSON.stringify(error) || String(error);
}

async function writeFileWithRetry(outPath, buffer) {
  const dir = path.dirname(outPath);
  const tempPath = path.join(
    dir,
    `.${path.basename(outPath)}.${process.pid}.${Date.now()}.tmp`
  );

  fs.mkdirSync(dir, { recursive: true });

  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      await fs.promises.writeFile(tempPath, buffer);
      await fs.promises.rename(tempPath, outPath);
      return;
    } catch (error) {
      if (!isRetriableFileError(error) || attempt === 5) {
        try {
          await fs.promises.unlink(tempPath);
        } catch {
          // Best-effort cleanup only.
        }
        throw error;
      }

      await wait(150 * (attempt + 1));
    }
  }
}

async function withStorageRetry(operation) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const result = await operation();

    if (!result.error) {
      return result;
    }

    if (!isRetriableStorageError(result.error) || attempt === 4) {
      return result;
    }

    await wait(300 * (attempt + 1));
  }
}

async function downloadFile(storagePath) {
  const { data, error } = await withStorageRetry(
    () => supabase.storage.from(TARGET_BUCKET).download(storagePath)
  );

  if (error) {
    console.error(`❌ [Error] downloading ${TARGET_BUCKET}/${storagePath}:`, formatError(error));
    return false;
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  const outPath = path.join(DEST_DIR, storagePath);

  await writeFileWithRetry(outPath, buffer);
  if (VERBOSE) {
    console.log(`✅ Saved: ${TARGET_BUCKET}/${storagePath}`);
  }
  return true;
}

async function listFolder(currentPath) {
  const entries = [];
  const limit = 1000;
  let offset = 0;

  while (true) {
    const { data, error } = await withStorageRetry(
      () => supabase.storage.from(TARGET_BUCKET).list(currentPath, { limit, offset })
    );

    if (error) {
      console.error(`❌ [Error] listing folder ${TARGET_BUCKET}/${currentPath}:`, formatError(error));
      process.exit(1);
    }

    if (!data || data.length === 0) {
      break;
    }

    entries.push(...data);

    if (data.length < limit) {
      break;
    }

    offset += limit;
  }

  return entries;
}

async function listAndDownload(currentPath = '') {
  const entries = await listFolder(currentPath);

  let successCount = 0;
  let failureCount = 0;

  for (const item of entries) {
    if (item.name === '.emptyFolderPlaceholder') continue;

    const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;

    if (!item.id || item.id === null) {
      const result = await listAndDownload(itemPath);
      successCount += result.successCount;
      failureCount += result.failureCount;
      continue;
    }

    const downloaded = await downloadFile(itemPath);
    if (downloaded) {
      successCount += 1;
    } else {
      failureCount += 1;
    }
  }

  return { successCount, failureCount };
}

async function downloadListedLocalWebPages() {
  let successCount = 0;
  let failureCount = 0;

  if (assetSyncManifest.localWebPages.size === 0) {
    console.log(`ℹ️ Asset manifest enabled. No ${TARGET_BUCKET} bucket files listed for download.`);
    return { successCount, failureCount };
  }

  for (const storagePath of assetSyncManifest.localWebPages) {
    const downloaded = await downloadFile(storagePath);
    if (downloaded) {
      successCount += 1;
    } else {
      failureCount += 1;
    }
  }

  return { successCount, failureCount };
}

async function main() {
  console.log(`\n🌐 Processing bucket: ${TARGET_BUCKET}`);
  console.log(`📁 Locale files target: ${DEST_DIR}`);
  console.log('ℹ️ This sync only replaces or adds files. Local files missing from Supabase are left unchanged.');

  const { successCount, failureCount } = assetSyncManifest.enabled
    ? await downloadListedLocalWebPages()
    : await listAndDownload();

  console.log(`\n🎉 Language sync complete. Saved ${successCount} files, failed ${failureCount} files.`);

  if (failureCount > 0) {
    process.exit(1);
  }
}

main();
