import navigation from './navigation.json';
import footer from './footer.json';
import home from './pages/home.json';
import manufacturers from './pages/manufacturers.json';
import manufacturersList from './pages/manufacturers/list.json';
import rfq from './pages/rfq.json';
import profile from './pages/claim-your-profile.json';
import cms from './pages/content-marketing-services.json';
import about from './pages/about.json';
import news from './pages/industry-news.json';
import login from './pages/login.json';
import register from './pages/register.json';
import dashboard from './pages/dashboard.json';
import terms from './pages/terms.json';
import privacy from './pages/privacy.json';
import contact from './pages/contact.json';
import notFound from './pages/404.json';

// --- Products --- 
import productsList from './pages/products/list.json';
import productsPage from './pages/products-page.json';

// --- Dynamic Imports for Manufacturers ---
const mfgFiles = import.meta.glob('./pages/manufacturers/*.json', { eager: true, import: 'default' });
const manufacturersData: Record<string, any> = {
  ...manufacturers,
  list: manufacturersList
};

for (const path in mfgFiles) {
  // Extract slug from filename (e.g., './pages/manufacturers/my-company.json' -> 'my-company')
  const slug = path.split('/').pop()?.replace('.json', '');
  if (slug && slug !== 'list') {
    manufacturersData[slug] = mfgFiles[path];
  }
}

// --- Dynamic Imports for Products ---
const productFiles = import.meta.glob('./pages/products/**/*.json', { eager: true, import: 'default' });
const productsData: Record<string, any> = {
  ...productsPage,
  list: productsList
};

for (const path in productFiles) {
  // Extract parts e.g., './pages/products/shphe/ht-bloc.json'
  const parts = path.split('/');
  const fileName = parts.pop()?.replace('.json', '');
  const dirName = parts.pop();

  if (fileName && fileName !== 'list' && dirName && dirName !== 'products') {
    if (!productsData[dirName]) {
      productsData[dirName] = {};
    }
    productsData[dirName][fileName] = productFiles[path];
  }
}

export default {
  navigation,
  footer,
  pages: {
    home,
    manufacturers: manufacturersData,
    products: productsData,
    rfq,
    profile,
    cms,
    about,
    news,
    login,
    register,
    dashboard,
    terms,
    privacy,
    contact,
    '404': notFound,
  },
} as const;