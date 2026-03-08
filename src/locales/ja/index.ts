import navigation from './navigation.json';
import footer from './footer.json';
import home from './pages/home.json';
import profile from './pages/claim-your-profile.json';
import login from './pages/login.json';
import signup from './pages/signup.json';
import about from './pages/about.json';
import terms from './pages/terms.json';
import privacy from './pages/privacy.json';
import dashboard from './pages/dashboard.json';
import contact from './pages/contact.json';
import notFound from './pages/404.json';
import contentMarketingServices from './pages/content-marketing-services.json';
import manufacturers from './pages/manufacturers.json';
import manufacturersList from './pages/manufacturers/list.json';

// --- Products --- 
import productsList from './pages/products/list.json';

// --- Dynamic Imports for Manufacturers ---
const mfgFiles = import.meta.glob('./pages/manufacturers/*.json', { eager: true, import: 'default' });
const manufacturersData: Record<string, any> = {
  ...manufacturers,
  list: manufacturersList
};

for (const path in mfgFiles) {
  const slug = path.split('/').pop()?.replace('.json', '');
  if (slug && slug !== 'list') {
    manufacturersData[slug] = mfgFiles[path];
  }
}

// --- Dynamic Imports for Products ---
const productFiles = import.meta.glob('./pages/products/**/*.json', { eager: true, import: 'default' });
const productsData: Record<string, any> = {
  ...productsList,
  list: productsList
};

for (const path in productFiles) {
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
    profile,
    login,
    signup,
    about,
    terms,
    privacy,
    dashboard,
    contentMarketingServices,
    contact,
    '404': notFound,
  },
} as const;