import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env.local');

const TARGET_BUCKET = 'contents';
const CONTENT_IMAGES_PREFIX = 'content_posts_image';
const CONTENT_DEST_DIR = path.resolve(__dirname, '../../content');
const CONTENT_IMAGES_DEST_DIR = path.resolve(__dirname, '../../public/static/content_posts_image');

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

function getDestinationPath(storagePath) {
  const imagePrefix = `${CONTENT_IMAGES_PREFIX}/`;

  if (storagePath.startsWith(imagePrefix)) {
    return path.join(CONTENT_IMAGES_DEST_DIR, storagePath.slice(imagePrefix.length));
  }

  return path.join(CONTENT_DEST_DIR, storagePath);
}

async function downloadFile(storagePath) {
  const { data, error } = await supabase.storage.from(TARGET_BUCKET).download(storagePath);

  if (error) {
    console.error(`❌ [Error] downloading ${TARGET_BUCKET}/${storagePath}:`, error.message);
    return false;
  }

  const outPath = getDestinationPath(storagePath);
  const buffer = Buffer.from(await data.arrayBuffer());

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log(`✅ Saved: ${storagePath} -> ${path.relative(path.resolve(__dirname, '../..'), outPath)}`);
  return true;
}

async function listFolder(currentPath) {
  const entries = [];
  const limit = 1000;
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(TARGET_BUCKET).list(currentPath, { limit, offset });

    if (error) {
      console.error(`❌ [Error] listing folder ${TARGET_BUCKET}/${currentPath}:`, error.message);
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

async function main() {
  console.log(`\n📦 Processing bucket: ${TARGET_BUCKET}`);
  console.log(`📁 Content files target: ${CONTENT_DEST_DIR}`);
  console.log(`🖼️ Content image files target: ${CONTENT_IMAGES_DEST_DIR}`);

  const { successCount, failureCount } = await listAndDownload();

  console.log(`\n🎉 Content sync complete. Saved ${successCount} files, failed ${failureCount} files.`);
}

main();