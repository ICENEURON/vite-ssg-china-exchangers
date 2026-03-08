import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env.local');

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

const url = env['VITE_SUPABASE_URL'];
const serviceRoleKey = env['VITE_SUPABASE_SERVICE_ROLE_KEY'];
const anonKey = env['VITE_SUPABASE_ANON_KEY'];

// Prefer the Service Role Key because it bypasses RLS
const key = serviceRoleKey || anonKey;

if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or keys in .env.local");
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
  console.log('Fetching list of buckets from Supabase...');
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error.message);
    process.exit(1);
  }

  if (!buckets || buckets.length === 0) {
    console.log('No storage buckets found in this project.');
    return;
  }

  // Ensure destination root directory exists
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  for (const bucket of buckets) {
    console.log(`\n📦 Processing bucket: ${bucket.name}`);
    await listAndDownload(bucket.name);
  }
  
  console.log(`\n🎉 All files successfully downloaded and saved to: ${DEST_DIR}`);
  console.log('💡 Note: You may want to add public/storage to your .gitignore if these files are large.');
}

main();
