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

const manufacturers = readJson('manufacturers.json');
const manufacturerAssets = readJson('manufacturer_assets.json');
const industries = readJson('industries.json');
const products = readJson('products.json');
const productAssets = readJson('product_assets.json');

const preferredManufacturerAssets = manufacturerAssets.filter(asset => asset.storage_bucket === 'assets');
const preferredProductAssets = productAssets.filter(asset => asset.storage_bucket === 'assets');

// Detect available languages
const langsArray = [];
if (manufacturers.length > 0 && typeof manufacturers[0].name === 'object') {
  langsArray.push(...Object.keys(manufacturers[0].name));
} else {
  langsArray.push('en', 'zh');
}

/**
 * Localizes an object or array recursively by resolving language keys.
 */
function localizeField(value, availableLangs, currentLang) {
  if (value === null || value === undefined) return value;

  if (typeof value === 'object' && !Array.isArray(value)) {
    const hasLangKey = availableLangs.some(l => l in value);
    if (hasLangKey) {
      if (currentLang in value) {
        return localizeField(value[currentLang], availableLangs, currentLang);
      }
      return '';
    }

    const localizedObj = {};
    for (const key of Object.keys(value)) {
      localizedObj[key] = localizeField(value[key], availableLangs, currentLang);
    }
    return localizedObj;
  }

  if (Array.isArray(value)) {
    return value.map(item => localizeField(item, availableLangs, currentLang));
  }

  return value;
}

function toAssetUrl(asset) {
  return `/storage/${asset.storage_bucket}/${asset.storage_path}`;
}

function hasAssetType(asset, expectedTypes) {
  return expectedTypes.includes(asset.asset_type);
}

function getProductImageAsset(productId) {
  const galleryImage = preferredProductAssets.find(asset => asset.product_id === productId && asset.asset_type === 'gallery_image');
  if (galleryImage) {
    return galleryImage;
  }

  return preferredProductAssets.find(asset => asset.product_id === productId && asset.asset_type === 'image');
}

function processData() {
  for (const lang of langsArray) {
    const langDir = path.join(localesDir, lang, 'pages', 'manufacturers');
    fs.rmSync(langDir, { recursive: true, force: true });
    fs.mkdirSync(langDir, { recursive: true });

    const listData = [];

    for (const mfg of manufacturers) {
      // Localize the manufacturer for the current language
      const localizedMfg = localizeField(mfg, langsArray, lang);

      // Build the individual manufacturer object with specific fields
      const individualMfg = {
        name: localizedMfg.name,
        full_description: localizedMfg.full_description,
        advantages: localizedMfg.advantages,
        slug: localizedMfg.slug,
        website: localizedMfg.website,
        email: localizedMfg.email,
        phone: localizedMfg.phone,
        country_name: localizedMfg.country_name,
        city: localizedMfg.city,
        address: localizedMfg.address,
        established_year: localizedMfg.established_year,
        factory_area: localizedMfg.factory_area,
        employee_count: localizedMfg.employee_count,
        export_markets: localizedMfg.export_markets,
        seo_data: localizedMfg.seo_data,
        industries: [],
        certifications: [],
        customers: [],
        images: [],
        products: []
      };

      // Handle industries
      if (mfg.industries && Array.isArray(mfg.industries)) {
        individualMfg.industries = mfg.industries.map(id => {
          const ind = industries.find(i => String(i.id) === String(id));
          if (ind) {
            const localizedInd = localizeField(ind, langsArray, lang);
            return localizedInd.name;
          }
          return id;
        });
      }

      // Add manufacturer assets by type
      const mfgAssets = preferredManufacturerAssets.filter(asset => asset.manufacturer_id === mfg.id);

      individualMfg.certifications = mfgAssets
        .filter(asset => hasAssetType(asset, ['certifications', 'certificate']))
        .map(asset => {
          const locAsset = localizeField(asset, langsArray, lang);
          return { alt_text: locAsset.alt_text, url: toAssetUrl(asset) };
        });

      individualMfg.customers = mfgAssets
        .filter(asset => hasAssetType(asset, ['customers', 'logo']))
        .map(asset => {
          const locAsset = localizeField(asset, langsArray, lang);
          return { alt_text: locAsset.alt_text, url: toAssetUrl(asset) };
        });

      individualMfg.images = mfgAssets
        .filter(asset => hasAssetType(asset, ['images', 'media']))
        .map(asset => {
          const locAsset = localizeField(asset, langsArray, lang);
          return { alt_text: locAsset.alt_text, url: toAssetUrl(asset) };
        });

      // Add products
      individualMfg.products = products
        .filter(prod => prod.manufacturer_id === mfg.id)
        .map(prod => {
          const localizedProd = localizeField(prod, langsArray, lang);
          const pImage = getProductImageAsset(prod.id);
          return {
            slug: localizedProd.slug,
            name: localizedProd.name,
            image: pImage ? toAssetUrl(pImage) : undefined,
            short_description: localizedProd.short_description,
            url: `${individualMfg.slug}/${localizedProd.slug}`
          };
        });

      // Save individual manufacturer json
      const slug = individualMfg.slug;
      if (slug) {
        fs.writeFileSync(
          path.join(langDir, `${slug}.json`),
          JSON.stringify(individualMfg, null, 2),
          'utf-8'
        );
      }

      // Prepare list data
      const listMfg = {
        name: localizedMfg.name,
        short_description: localizedMfg.short_description,
        slug: localizedMfg.slug,
        city: localizedMfg.city,
        country_name: localizedMfg.country_name,
        industries: []
      };

      if (mfg.industries && Array.isArray(mfg.industries)) {
        listMfg.industries = mfg.industries.map(id => {
          const ind = industries.find(i => String(i.id) === String(id));
          if (ind) {
            const localizedInd = localizeField(ind, langsArray, lang);
            return localizedInd.name;
          }
          return id; // fallback if industry not found
        });
      }

      listData.push(listMfg);
    }

    // Save list.json
    fs.writeFileSync(
      path.join(langDir, 'list.json'),
      JSON.stringify(listData, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved locales for ${lang}`);
  }
}

processData();
