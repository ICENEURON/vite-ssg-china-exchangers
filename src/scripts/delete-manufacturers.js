import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ============================================================================
// CONFIGURATION: 指定要彻底删除的厂家 slug 列表
// ============================================================================
const TARGET_SLUGS_TO_DELETE = [
    'jiangsu-alloy-process-equipment-co-ltd',
    'beijing-huaaixin-energy-saving-equipment-co-ltd',
    'zhejiang-compact-heat-exchange-technology-co-ltd',
    'qingdao-thermal-systems-co-ltd'
];
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env.local');

let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error("Could not read .env.local file.");
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
const key = env['SUPABASE_SERVICE_ROLE_KEY'] || env['VITE_SUPABASE_SERVICE_ROLE_KEY'];

if (!url || !key) {
  console.error("Missing SUPABASE URL or SERVICE ROLE KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

async function listAllFiles(bucket, currentPath = '') {
    let allFiles = [];
    const { data, error } = await supabase.storage.from(bucket).list(currentPath, { limit: 1000 });
    if (error) {
        console.error(`Error listing ${currentPath}:`, error);
        return [];
    }
    
    for (const item of data) {
        if (item.name === '.emptyFolderPlaceholder') continue;
        const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;
        if (!item.id || item.id === null) {
            const subFiles = await listAllFiles(bucket, itemPath);
            allFiles = allFiles.concat(subFiles);
        } else {
            allFiles.push(itemPath);
        }
    }
    return allFiles;
}

async function main() {
    console.log("🚀 Starting Targeted Manufacturer Deletion...");

    if (TARGET_SLUGS_TO_DELETE.length === 0) {
        console.log("ℹ️ No target slugs defined. Exiting.");
        return;
    }

    const { data: mfgs, error: mfgErr } = await supabase
        .from('manufacturers')
        .select('id, slug')
        .in('slug', TARGET_SLUGS_TO_DELETE);
        
    if (mfgErr) {
        console.error("❌ Error fetching manufacturers:", mfgErr);
        process.exit(1);
    }

    if (!mfgs || mfgs.length === 0) {
        console.log("ℹ️ None of the target slugs were found in the database. Exiting.");
        return;
    }

    for (const mfg of mfgs) {
        console.log(`\n🗑️ Deleting Manufacturer: ${mfg.slug} (${mfg.id})`);
        
        // 1. Delete storage assets for this slug
        const filesToRemove = await listAllFiles('assets', mfg.slug);
        if (filesToRemove.length > 0) {
            const { error: rmErr } = await supabase.storage.from('assets').remove(filesToRemove);
            if (rmErr) console.error(`   ❌ Failed to remove files for ${mfg.slug}:`, rmErr);
            else console.log(`   ✅ Removed ${filesToRemove.length} files from storage for ${mfg.slug}`);
        } else {
             console.log(`   ℹ️ No files found in storage for ${mfg.slug}`);
        }

        // 2. Delete DB records
        const { data: prods } = await supabase.from('products').select('id').eq('manufacturer_id', mfg.id);
        if (prods && prods.length > 0) {
            const prodIds = prods.map(p => p.id);
            await supabase.from('product_assets').delete().in('product_id', prodIds);
            await supabase.from('products').delete().eq('manufacturer_id', mfg.id);
            console.log(`   ✅ Deleted ${prods.length} products & their assets`);
        } else {
            console.log(`   ℹ️ No products found for ${mfg.slug}`);
        }
        
        const { count: mAssetsCount, error: maErr } = await supabase.from('manufacturer_assets').delete().eq('manufacturer_id', mfg.id);
        if (!maErr) console.log(`   ✅ Deleted manufacturer assets`);
        
        const { error: finalErr } = await supabase.from('manufacturers').delete().eq('id', mfg.id);
        if (finalErr) console.error(`   ❌ Failed to delete manufacturer record:`, finalErr);
        else console.log(`   ✅ Deleted manufacturer record successfully`);
    }

    console.log(`\n🎉 Manufacturer Deletion Complete!`);
}

main().catch(console.error);
