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
const industries = readJson('industries.json');
const products = readJson('products.json');
const productAssets = readJson('product_assets.json');

const preferredProductAssets = productAssets.filter(asset => asset.storage_bucket === 'assets');

// Detect available languages
const langsArray = [];
if (products.length > 0 && typeof products[0].name === 'object') {
  langsArray.push(...Object.keys(products[0].name));
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

  function getProductImageAssets(productId) {
    const galleryImages = preferredProductAssets.filter(asset => asset.product_id === productId && asset.asset_type === 'gallery_image');
    if (galleryImages.length > 0) {
      return galleryImages;
    }

    return preferredProductAssets.filter(asset => asset.product_id === productId && asset.asset_type === 'image');
  }

function processData() {
  for (const lang of langsArray) {
    const langProductsDir = path.join(localesDir, lang, 'pages', 'products');
    fs.rmSync(langProductsDir, { recursive: true, force: true });
    fs.mkdirSync(langProductsDir, { recursive: true });

    const listData = [];

    for (const prod of products) {
      const mfg = manufacturers.find(m => m.id === prod.manufacturer_id);
      if (!mfg) continue; // Skip if manufacturer not found

      const localizedProd = localizeField(prod, langsArray, lang);
      const localizedMfg = localizeField(mfg, langsArray, lang);

      // Add manufacturer info to the product item
      localizedProd.manufacturer = localizedMfg;

      // Handle industries
      if (prod.industries && Array.isArray(prod.industries)) {
        localizedProd.industries = prod.industries.map(id => {
          const ind = industries.find(i => String(i.id) === String(id));
          if (ind) {
             const localizedInd = localizeField(ind, langsArray, lang);
             return { id: ind.id, slug: ind.slug, name: localizedInd.name };
          }
          return id;
        });
      }

      const mfgSlug = localizedMfg.slug;
      const prodSlug = localizedProd.slug;
      
      const individualProd = {
        slug: prodSlug,
        name: localizedProd.name,
        full_description: localizedProd.full_description,
        industries: localizedProd.industries ? localizedProd.industries.map(ind => ind.name || ind) : [],
        advantage: localizedProd.advantage, // it's advantage in the array
        technical_parameters: localizedProd.technical_parameters,
        seo_data: localizedProd.seo_data,
        manufacturer: {
          slug: mfgSlug
        },
        images: getProductImageAssets(prod.id)
          .map(asset => {
            const locAsset = localizeField(asset, langsArray, lang);
            return { alt_text: locAsset.alt_text, url: toAssetUrl(asset) };
          }),
        certificates: preferredProductAssets
          .filter(asset => asset.product_id === prod.id && asset.asset_type === 'certificate')
          .map(asset => {
            const locAsset = localizeField(asset, langsArray, lang);
            return { alt_text: locAsset.alt_text, url: toAssetUrl(asset) };
          })
      };

      // Every product JSON is stored inside its owner manufacturer's folder
      if (mfgSlug && prodSlug) {
        const mfgProductsDir = path.join(langProductsDir, mfgSlug);
        if (!fs.existsSync(mfgProductsDir)) {
          fs.mkdirSync(mfgProductsDir, { recursive: true });
        }
        
        fs.writeFileSync(
          path.join(mfgProductsDir, `${prodSlug}.json`),
          JSON.stringify(individualProd, null, 2),
          'utf-8'
        );
      }

      // Build item for the master list
      const listProd = {
        slug: prodSlug,
        manufacturer: {
          slug: mfgSlug,
          name: localizedMfg.name
        },
        name: localizedProd.name,
        short_description: localizedProd.short_description,
        industries: localizedProd.industries ? localizedProd.industries.map(ind => ind.name || ind) : [],
        images: getProductImageAssets(prod.id)
          .map(asset => {
            const locAsset = localizeField(asset, langsArray, lang);
            return { alt_text: locAsset.alt_text, url: toAssetUrl(asset) };
          }),
        url: `${mfgSlug}/${prodSlug}`
      };
      listData.push(listProd);
    }

    // Save master list.json
    fs.writeFileSync(
      path.join(langProductsDir, 'list.json'),
      JSON.stringify(listData, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved product locales for ${lang}`);
  }
}

processData();
