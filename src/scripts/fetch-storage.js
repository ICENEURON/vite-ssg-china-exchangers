import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadAssetSyncManifest } from './asset-sync-manifest.js';

// Calculate paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env.local');
const TARGET_BUCKET = 'assets';
const VERBOSE = process.env.SYNC_VERBOSE === '1';
const assetSyncManifest = loadAssetSyncManifest();

// 最好存放在 public 目录下，这样 Vite 和 SSG 构建时可以直接引用绝对路径 /storage/...
const DEST_DIR = path.resolve(__dirname, '../../public/storage');

// Extremely simple .env parser
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error("Could not read .env.local file. Please make sure it exists at the root of the project.");
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

// Prefer the Service Role Key because it bypasses RLS
const key = serviceRoleKey || anonKey;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY in .env.local");
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

async function downloadFile(bucket, filePath) {
  if (VERBOSE) {
    console.log(`Downloading: ${bucket}/${filePath} ...`);
  }

  const { data, error } = await withStorageRetry(
    () => supabase.storage.from(bucket).download(filePath)
  );
  
  if (error) {
    console.error(`❌ [Error] downloading ${bucket}/${filePath}:`, formatError(error));
    return false;
  }
  
  const buffer = Buffer.from(await data.arrayBuffer());
  const outPath = path.join(DEST_DIR, bucket, filePath);
  
  await writeFileWithRetry(outPath, buffer);
  if (VERBOSE) {
    console.log(`✅ Saved: ${bucket}/${filePath}`);
  }
  return true;
}

async function listAndDownload(bucket, currentPath = '') {
  const { data, error } = await withStorageRetry(
    () => supabase.storage.from(bucket).list(currentPath, { limit: 1000 })
  );

  if (error) {
    console.error(`❌ [Error] listing folder ${bucket}/${currentPath}:`, formatError(error));
    return { successCount: 0, failureCount: 1 };
  }

  let successCount = 0;
  let failureCount = 0;

  for (const item of data) {
    if (item.name === '.emptyFolderPlaceholder') continue; // Skip Supabase hidden placeholder
    
    // In Supabase Storage, a folder doesn't have an 'id', but a file does have one
    const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;
    
    if (!item.id || item.id === null) {
      // It's a folder, recursively list and download its contents
      const result = await listAndDownload(bucket, itemPath);
      successCount += result.successCount;
      failureCount += result.failureCount;
    } else {
      // It's a file, download it directly
      const downloaded = await downloadFile(bucket, itemPath);
      if (downloaded) {
        successCount += 1;
      } else {
        failureCount += 1;
      }
    }
  }

  return { successCount, failureCount };
}

async function main() {
  // Ensure destination root directory exists
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  for (const legacyDir of ['manufacturer_assets', 'product_assets']) {
    const legacyPath = path.join(DEST_DIR, legacyDir);
    if (fs.existsSync(legacyPath)) {
      fs.rmSync(legacyPath, { recursive: true, force: true });
      console.log(`🧹 Removed legacy local storage folder: ${legacyPath}`);
    }
  }

  console.log(`\n📦 Processing bucket: ${TARGET_BUCKET}`);
  const { successCount, failureCount } = assetSyncManifest.enabled
    ? await downloadListedAssets()
    : await listAndDownload(TARGET_BUCKET);
  
  console.log(`\n🎉 Storage sync complete. Saved ${successCount} files, failed ${failureCount} files.`);
  console.log('💡 Note: You may want to add public/storage to your .gitignore if these files are large.');

  if (failureCount > 0) {
    process.exit(1);
  }
}

async function downloadListedAssets() {
  let successCount = 0;
  let failureCount = 0;

  if (assetSyncManifest.localAssets.size === 0) {
    console.log(`ℹ️ Asset manifest enabled. No ${TARGET_BUCKET} bucket files listed for download.`);
    return { successCount, failureCount };
  }

  for (const storagePath of assetSyncManifest.localAssets) {
    const downloaded = await downloadFile(TARGET_BUCKET, storagePath);
    if (downloaded) {
      successCount += 1;
    } else {
      failureCount += 1;
    }
  }

  return { successCount, failureCount };
}

main();
