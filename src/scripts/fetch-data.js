import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadAssetSyncManifest, shouldProcessWebDataFile } from './asset-sync-manifest.js';

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

const url = env['SUPABASE_URL'] || env['VITE_SUPABASE_URL'];
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['VITE_SUPABASE_SERVICE_ROLE_KEY'];
const anonKey = env['SUPABASE_ANON_KEY'] || env['VITE_SUPABASE_ANON_KEY'];
const VERBOSE = process.env.SYNC_VERBOSE === '1';
const savedTables = [];
const assetSyncManifest = loadAssetSyncManifest();

// 首选 Service Role Key，因为它拥有最高权限，可以绕过所有 RLS 安全策略直接读取数据
const key = serviceRoleKey || anonKey;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Initialize Supabase Client
const supabase = createClient(url, key);

function isRetriableFileError(error) {
  return ['EBUSY', 'EPERM', 'EACCES', 'UNKNOWN'].includes(error?.code);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function writeJsonFile(outPath, data) {
  const dir = path.dirname(outPath);
  const json = JSON.stringify(data, null, 2);
  const tempPath = path.join(
    dir,
    `.${path.basename(outPath)}.${process.pid}.${Date.now()}.tmp`
  );

  fs.mkdirSync(dir, { recursive: true });

  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      await fs.promises.writeFile(tempPath, json);
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

async function fetchTable(tableName, columns = '*', options = {}) {
  if (VERBOSE) {
    console.log(`Fetching ${tableName} from Supabase...`);
  }
  let query = supabase.from(tableName).select(columns);

  if (options.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? true });
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
    process.exit(1);
  }

  const outPath = path.resolve(__dirname, `../data/${tableName}.json`);
  await writeJsonFile(outPath, data);
  savedTables.push({ tableName, count: data.length });
}

async function fetchAssetTable(tableName) {
  if (VERBOSE) {
    console.log(`Fetching ${tableName} from Supabase (assets bucket only)...`);
  }
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('storage_bucket', 'assets');

  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
    process.exit(1);
  }

  const outPath = path.resolve(__dirname, `../data/${tableName}.json`);
  await writeJsonFile(outPath, data);
  savedTables.push({ tableName, count: data.length });
}

async function main() {
  const shouldFetchImporterData = !assetSyncManifest.enabled || assetSyncManifest.data.size > 0;
  const shouldFetchIndustries = shouldProcessWebDataFile(assetSyncManifest, 'industries.json');

  if (shouldFetchIndustries) {
    await fetchTable('countries', 'id, name, name_zh');
    await fetchTable('industries');
  }

  if (shouldFetchImporterData) {
    await fetchTable('manufacturers');
    await fetchTable('manufacturer_scores', '*', { orderBy: 'order' });
    await fetchAssetTable('manufacturer_assets');
    await fetchTable('products');
    await fetchAssetTable('product_assets');
  }

  if (assetSyncManifest.enabled && !shouldFetchIndustries && !shouldFetchImporterData) {
    console.log('ℹ️ Asset manifest enabled. No data or web_data files listed, skipping data table sync.');
  }

  // We explicitly do NOT fetch 'rfqs' here
  const totalRecords = savedTables.reduce((total, table) => total + table.count, 0);
  console.log(`✅ Data sync complete. Saved ${totalRecords} records across ${savedTables.length} files.`);
}

main();
