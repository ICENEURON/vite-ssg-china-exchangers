import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env.local');

// Extremely simple .env parser so we don't need external dependencies like 'dotenv'
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
      const val = parts.slice(1).join('=').trim().replace(/(^"|"$)/g, ''); // strip simple quotes
      return [key, val];
    })
);

const url = env['VITE_SUPABASE_URL'];
const serviceRoleKey = env['VITE_SUPABASE_SERVICE_ROLE_KEY'];
const anonKey = env['VITE_SUPABASE_ANON_KEY'];

// 首选 Service Role Key，因为它拥有最高权限，可以绕过所有 RLS 安全策略直接读取数据
const key = serviceRoleKey || anonKey;

if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY/VITE_SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Initialize Supabase Client
const supabase = createClient(url, key);

async function fetchTable(tableName, columns = '*') {
  console.log(`Fetching ${tableName} from Supabase...`);
  const { data, error } = await supabase.from(tableName).select(columns);

  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
    process.exit(1);
  }

  const outPath = path.resolve(__dirname, `../data/${tableName}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`✅ Saved ${data.length} records to src/data/${tableName}.json`);
}

async function main() {
  await fetchTable('countries', 'id, name');
  await fetchTable('industries');
  await fetchTable('manufacturers');
  await fetchTable('manufacturer_assets');
  await fetchTable('products');
  await fetchTable('product_assets');
  // We explicitly do NOT fetch 'rfqs' here
}

main();
