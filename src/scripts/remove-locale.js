import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ============================================================================
// CONFIGURATION: 指定要删除的语言代码
// ============================================================================
const TARGET_LANG = 'ja';
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

const url = env['VITE_SUPABASE_URL'];
const key = env['VITE_SUPABASE_SERVICE_ROLE_KEY'];

if (!url || !key) {
  console.error("Missing SUPABASE URL or SERVICE ROLE KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

function cleanJsonField(value, targetLang) {
    if (!value) return value;
    
    let parsed;
    let isString = typeof value === 'string';
    
    try {
        // If it's an object, we stringify and parse it to create a deep clone 
        // so we don't mutate the original reference and can compare them later.
        parsed = isString ? JSON.parse(value) : JSON.parse(JSON.stringify(value));
    } catch(e) {
        return value;
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return value;
    }

    let modified = false;
    if (targetLang in parsed) {
        delete parsed[targetLang];
        modified = true;
    }
    
    return modified ? (isString ? JSON.stringify(parsed) : parsed) : value;
}

async function main() {
    console.log(`🧹 Starting Locale Cleanup: Removing '${TARGET_LANG}' from all JSON fields...`);
    
    // Industries
    const { data: inds } = await supabase.from('industries').select('*');
    let indsUpdated = 0;
    for (const ind of inds || []) {
        const cleanedName = cleanJsonField(ind.name, TARGET_LANG);
        if (cleanedName !== ind.name) {
             await supabase.from('industries').update({ name: cleanedName }).eq('id', ind.id);
             indsUpdated++;
        }
    }
    console.log(`   ✅ Cleaned ${indsUpdated} industries`);

    // Manufacturers
    const { data: mfgs } = await supabase.from('manufacturers').select('*');
    let mfgsUpdated = 0;
    for (const mfg of mfgs || []) {
        const updates = {};
        for (const field of ['name', 'short_description', 'full_description', 'advantages', 'country_name', 'city', 'address', 'seo_data']) {
            const cleaned = cleanJsonField(mfg[field], TARGET_LANG);
            if (cleaned !== mfg[field]) updates[field] = cleaned;
        }
        if (Object.keys(updates).length > 0) {
             await supabase.from('manufacturers').update(updates).eq('id', mfg.id);
             mfgsUpdated++;
        }
    }
    console.log(`   ✅ Cleaned ${mfgsUpdated} manufacturers`);

    // Products
    const { data: prods } = await supabase.from('products').select('*');
    let prodsUpdated = 0;
    for (const prod of prods || []) {
        const updates = {};
        for (const field of ['name', 'short_description', 'full_description', 'advantage', 'seo_data']) {
            const cleaned = cleanJsonField(prod[field], TARGET_LANG);
            if (cleaned !== prod[field]) updates[field] = cleaned;
        }
        if (Object.keys(updates).length > 0) {
             await supabase.from('products').update(updates).eq('id', prod.id);
             prodsUpdated++;
        }
    }
    console.log(`   ✅ Cleaned ${prodsUpdated} products`);

    console.log(`\n🎉 Locale Cleanup Complete!`);
}

main().catch(console.error);
