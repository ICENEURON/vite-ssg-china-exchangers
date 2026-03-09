import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
const localesDir = path.resolve(__dirname, '../locales');

// Ensure locales directory exists
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

// Read data files
const readJson = (filename) => JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf-8'));

const countries = readJson('countries.json');
const industries = readJson('industries.json');

const langs = ['en', 'zh', 'ja'];

/**
 * Localizes an industry object for a specific language.
 */
function localizeIndustry(ind, lang) {
  return {
    id: ind.id,
    slug: ind.slug,
    name: ind.name[lang] || ind.name['en'] || '',
    is_visible: ind.is_visible
  };
}

function processData() {
  for (const lang of langs) {
    const commonDir = path.join(localesDir, lang, 'common');
    fs.mkdirSync(commonDir, { recursive: true });

    // 1. Process Industries
    const localizedInds = industries.map(ind => localizeIndustry(ind, lang));
    fs.writeFileSync(
      path.join(commonDir, 'industries.json'),
      JSON.stringify(localizedInds, null, 2),
      'utf-8'
    );

    // 2. Process Countries (English only as requested)
    fs.writeFileSync(
      path.join(commonDir, 'countries.json'),
      JSON.stringify(countries, null, 2),
      'utf-8'
    );

    console.log(`✅ Generated common locales for ${lang}`);
  }
}

processData();
