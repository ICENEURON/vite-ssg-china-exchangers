import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env.local');
const TARGET_BUCKET = 'assets';

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

async function downloadFile(bucket, filePath) {
  console.log(`Downloading: ${bucket}/${filePath} ...`);
  const { data, error } = await supabase.storage.from(bucket).download(filePath);
  
  if (error) {
    console.error(`❌ [Error] downloading ${bucket}/${filePath}:`, error.message);
    return;
  }
  
  const buffer = Buffer.from(await data.arrayBuffer());
  const outPath = path.join(DEST_DIR, bucket, filePath);
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log(`✅ Saved: ${bucket}/${filePath}`);
}

async function listAndDownload(bucket, currentPath = '') {
  const { data, error } = await supabase.storage.from(bucket).list(currentPath, { limit: 1000 });

  if (error) {
    console.error(`❌ [Error] listing folder ${bucket}/${currentPath}:`, error.message);
    return;
  }

  for (const item of data) {
    if (item.name === '.emptyFolderPlaceholder') continue; // Skip Supabase hidden placeholder
    
    // In Supabase Storage, a folder doesn't have an 'id', but a file does have one
    const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;
    
    if (!item.id || item.id === null) {
      // It's a folder, recursively list and download its contents
      await listAndDownload(bucket, itemPath);
    } else {
      // It's a file, download it directly
      await downloadFile(bucket, itemPath);
    }
  }
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
  await listAndDownload(TARGET_BUCKET);
  
  console.log(`\n🎉 All files successfully downloaded and saved to: ${DEST_DIR}`);
  console.log('💡 Note: You may want to add public/storage to your .gitignore if these files are large.');
}

main();
