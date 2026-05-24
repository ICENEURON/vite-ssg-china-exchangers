import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
const localesDir = path.resolve(__dirname, '../locales');
const fallbackLanguages = getConfiguredLanguages();

function getConfiguredLanguages() {
  try {
    const languages = JSON.parse(fs.readFileSync(path.join(localesDir, 'languages.json'), 'utf-8'));
    const languageCodes = Object.keys(languages);
    return languageCodes.length > 0 ? languageCodes : ['en', 'zh'];
  } catch {
    return ['en', 'zh'];
  }
}

function ensureLocalesDir() {
  fs.mkdirSync(localesDir, { recursive: true });
}

function readJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf-8'));
}

function getAvailableLanguages(records, fallback = fallbackLanguages) {
  const localizedRecord = records.find((record) => record?.name && typeof record.name === 'object' && !Array.isArray(record.name));
  return localizedRecord ? Object.keys(localizedRecord.name) : fallback;
}

function localizeField(value, availableLangs, currentLang) {
  if (value === null || value === undefined) return value;

  if (typeof value === 'object' && !Array.isArray(value)) {
    const hasLangKey = availableLangs.some((lang) => lang in value);
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
    return value.map((item) => localizeField(item, availableLangs, currentLang));
  }

  return value;
}

function parsePossiblyLocalizedString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getLocalizedAssetAltText(asset, availableLangs, currentLang) {
  const parsedAltText = parsePossiblyLocalizedString(asset?.alt_text);
  if (parsedAltText) {
    const localizedAltText = localizeField(parsedAltText, availableLangs, currentLang);
    if (typeof localizedAltText === 'string' && localizedAltText.trim()) {
      return localizedAltText;
    }

    if (typeof parsedAltText.en === 'string' && parsedAltText.en.trim()) {
      return parsedAltText.en;
    }
  }

  const localizedAsset = localizeField(asset, availableLangs, currentLang);
  return typeof localizedAsset?.alt_text === 'string' ? localizedAsset.alt_text : '';
}

function toAssetUrl(asset) {
  return `/storage/${asset.storage_bucket}/${asset.storage_path}`;
}

function hasAssetType(asset, expectedTypes) {
  return expectedTypes.includes(asset.asset_type);
}

function generateCommonLocales() {
  const countries = readJson('countries.json');
  const industries = readJson('industries.json');

  for (const lang of fallbackLanguages) {
    const commonDir = path.join(localesDir, lang, 'common');
    fs.mkdirSync(commonDir, { recursive: true });

    const localizedIndustries = industries.map((industry) => ({
      id: industry.id,
      slug: industry.slug,
      name: industry.name[lang] || industry.name.en || '',
      is_visible: industry.is_visible
    }));

    fs.writeFileSync(
      path.join(commonDir, 'industries.json'),
      JSON.stringify(localizedIndustries, null, 2),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(commonDir, 'countries.json'),
      JSON.stringify(countries, null, 2),
      'utf-8'
    );

    console.log(`✅ Generated common locales for ${lang}`);
  }
}

function getProductImageAsset(productId, preferredProductAssets) {
  const productGalleryImages = preferredProductAssets
    .filter((asset) => asset.product_id === productId && asset.asset_type === 'gallery_image')
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  const primaryGalleryImage = productGalleryImages.find((asset) => asset.order === 1);
  if (primaryGalleryImage) {
    return primaryGalleryImage;
  }

  if (productGalleryImages.length > 0) {
    return productGalleryImages[0];
  }

  const productImages = preferredProductAssets
    .filter((asset) => asset.product_id === productId && asset.asset_type === 'image')
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  return productImages[0];
}

function generateManufacturerLocales() {
  const manufacturers = readJson('manufacturers.json');
  const manufacturerAssets = readJson('manufacturer_assets.json');
  const industries = readJson('industries.json');
  const products = readJson('products.json');
  const productAssets = readJson('product_assets.json');
  const languages = getAvailableLanguages(manufacturers);
  const preferredManufacturerAssets = manufacturerAssets.filter((asset) => asset.storage_bucket === 'assets');
  const preferredProductAssets = productAssets.filter((asset) => asset.storage_bucket === 'assets');

  for (const lang of languages) {
    const langDir = path.join(localesDir, lang, 'pages', 'manufacturers');
    fs.rmSync(langDir, { recursive: true, force: true });
    fs.mkdirSync(langDir, { recursive: true });

    const listData = [];

    for (const manufacturer of manufacturers) {
      const localizedManufacturer = localizeField(manufacturer, languages, lang);
      const individualManufacturer = {
        name: localizedManufacturer.name,
        full_description: localizedManufacturer.full_description,
        advantages: localizedManufacturer.advantages,
        slug: localizedManufacturer.slug,
        website: localizedManufacturer.website,
        video_link: localizedManufacturer.video_link,
        social_media_links: localizedManufacturer.social_media_links,
        email: localizedManufacturer.email,
        phone: localizedManufacturer.phone,
        country_name: localizedManufacturer.country_name,
        city: localizedManufacturer.city,
        address: localizedManufacturer.address,
        established_year: localizedManufacturer.established_year,
        factory_area: localizedManufacturer.factory_area,
        employee_count: localizedManufacturer.employee_count,
        export_markets: localizedManufacturer.export_markets,
        seo_data: localizedManufacturer.seo_data,
        industries: [],
        certifications: [],
        customers: [],
        images: [],
        documents: [],
        products: []
      };

      if (manufacturer.industries && Array.isArray(manufacturer.industries)) {
        individualManufacturer.industries = manufacturer.industries.map((id) => {
          const industry = industries.find((item) => String(item.id) === String(id));
          if (industry) {
            return localizeField(industry, languages, lang).name;
          }
          return id;
        });
      }

      const manufacturerAssetsForItem = preferredManufacturerAssets
        .filter((asset) => asset.manufacturer_id === manufacturer.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      individualManufacturer.certifications = manufacturerAssetsForItem
        .filter((asset) => hasAssetType(asset, ['certifications', 'certificate']))
        .map((asset) => ({ alt_text: getLocalizedAssetAltText(asset, languages, lang), url: toAssetUrl(asset) }));

      individualManufacturer.customers = manufacturerAssetsForItem
        .filter((asset) => hasAssetType(asset, ['customers', 'logo']))
        .map((asset) => ({ alt_text: getLocalizedAssetAltText(asset, languages, lang), url: toAssetUrl(asset) }));

      individualManufacturer.images = manufacturerAssetsForItem
        .filter((asset) => hasAssetType(asset, ['images', 'media']))
        .map((asset) => ({ alt_text: getLocalizedAssetAltText(asset, languages, lang), url: toAssetUrl(asset) }));

      individualManufacturer.documents = manufacturerAssetsForItem
        .filter((asset) => hasAssetType(asset, ['document']))
        .map((asset) => ({ alt_text: getLocalizedAssetAltText(asset, languages, lang), url: toAssetUrl(asset), file_name: asset.file_name }));

      individualManufacturer.products = products
        .filter((product) => product.manufacturer_id === manufacturer.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((product) => {
          const localizedProduct = localizeField(product, languages, lang);
          const productImage = getProductImageAsset(product.id, preferredProductAssets);
          return {
            slug: localizedProduct.slug,
            name: localizedProduct.name,
            image: productImage ? toAssetUrl(productImage) : undefined,
            short_description: localizedProduct.short_description,
            url: `${individualManufacturer.slug}/${localizedProduct.slug}`
          };
        });

      if (individualManufacturer.slug) {
        fs.writeFileSync(
          path.join(langDir, `${individualManufacturer.slug}.json`),
          JSON.stringify(individualManufacturer, null, 2),
          'utf-8'
        );
      }

      const listManufacturer = {
        name: localizedManufacturer.name,
        short_description: localizedManufacturer.short_description,
        slug: localizedManufacturer.slug,
        city: localizedManufacturer.city,
        country_name: localizedManufacturer.country_name,
        industries: []
      };

      if (manufacturer.industries && Array.isArray(manufacturer.industries)) {
        listManufacturer.industries = manufacturer.industries.map((id) => {
          const industry = industries.find((item) => String(item.id) === String(id));
          if (industry) {
            return localizeField(industry, languages, lang).name;
          }
          return id;
        });
      }

      listData.push(listManufacturer);
    }

    fs.writeFileSync(
      path.join(langDir, 'list.json'),
      JSON.stringify(listData, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved manufacturer locales for ${lang}`);
  }
}

function getProductImageAssets(productId, preferredProductAssets) {
  const galleryImages = preferredProductAssets
    .filter((asset) => asset.product_id === productId && asset.asset_type === 'gallery_image')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (galleryImages.length > 0) {
    return galleryImages;
  }

  return preferredProductAssets
    .filter((asset) => asset.product_id === productId && asset.asset_type === 'image')
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

function generateProductLocales() {
  const manufacturers = readJson('manufacturers.json');
  const industries = readJson('industries.json');
  const products = readJson('products.json');
  const productAssets = readJson('product_assets.json');
  const languages = getAvailableLanguages(products);
  const preferredProductAssets = productAssets.filter((asset) => asset.storage_bucket === 'assets');

  for (const lang of languages) {
    const langProductsDir = path.join(localesDir, lang, 'pages', 'products');
    fs.rmSync(langProductsDir, { recursive: true, force: true });
    fs.mkdirSync(langProductsDir, { recursive: true });

    const listData = [];

    for (const product of products) {
      const manufacturer = manufacturers.find((item) => item.id === product.manufacturer_id);
      if (!manufacturer) continue;

      const localizedProduct = localizeField(product, languages, lang);
      const localizedManufacturer = localizeField(manufacturer, languages, lang);
      localizedProduct.manufacturer = localizedManufacturer;

      if (product.industries && Array.isArray(product.industries)) {
        localizedProduct.industries = product.industries.map((id) => {
          const industry = industries.find((item) => String(item.id) === String(id));
          if (industry) {
            const localizedIndustry = localizeField(industry, languages, lang);
            return { id: industry.id, slug: industry.slug, name: localizedIndustry.name };
          }
          return id;
        });
      }

      const manufacturerSlug = localizedManufacturer.slug;
      const productSlug = localizedProduct.slug;

      const individualProduct = {
        slug: productSlug,
        name: localizedProduct.name,
        full_description: localizedProduct.full_description,
        industries: localizedProduct.industries ? localizedProduct.industries.map((industry) => industry.name || industry) : [],
        advantage: localizedProduct.advantage,
        technical_parameters: localizedProduct.technical_parameters,
        video_link: localizedProduct.video_link,
        details: localizedProduct.details,
        seo_data: localizedProduct.seo_data,
        manufacturer: {
          slug: manufacturerSlug
        },
        images: getProductImageAssets(product.id, preferredProductAssets)
          .map((asset) => ({ alt_text: getLocalizedAssetAltText(asset, languages, lang), url: toAssetUrl(asset) })),
        certificates: preferredProductAssets
          .filter((asset) => asset.product_id === product.id && asset.asset_type === 'certificate')
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((asset) => ({ alt_text: getLocalizedAssetAltText(asset, languages, lang), url: toAssetUrl(asset) })),
        documents: preferredProductAssets
          .filter((asset) => asset.product_id === product.id && asset.asset_type === 'document')
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((asset) => ({ alt_text: getLocalizedAssetAltText(asset, languages, lang), url: toAssetUrl(asset), file_name: asset.file_name }))
      };

      if (manufacturerSlug && productSlug) {
        const manufacturerProductsDir = path.join(langProductsDir, manufacturerSlug);
        fs.mkdirSync(manufacturerProductsDir, { recursive: true });

        fs.writeFileSync(
          path.join(manufacturerProductsDir, `${productSlug}.json`),
          JSON.stringify(individualProduct, null, 2),
          'utf-8'
        );
      }

      listData.push({
        slug: productSlug,
        manufacturer: {
          slug: manufacturerSlug,
          name: localizedManufacturer.name
        },
        name: localizedProduct.name,
        short_description: localizedProduct.short_description,
        industries: localizedProduct.industries ? localizedProduct.industries.map((industry) => industry.name || industry) : [],
        images: getProductImageAssets(product.id, preferredProductAssets)
          .map((asset) => ({ alt_text: getLocalizedAssetAltText(asset, languages, lang), url: toAssetUrl(asset) })),
        url: `${manufacturerSlug}/${productSlug}`
      });
    }

    fs.writeFileSync(
      path.join(langProductsDir, 'list.json'),
      JSON.stringify(listData, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved product locales for ${lang}`);
  }
}

function main() {
  ensureLocalesDir();
  generateCommonLocales();
  generateManufacturerLocales();
  generateProductLocales();
}

main();