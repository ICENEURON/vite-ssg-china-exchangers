import navigation from './components/navigation.json';
import footer from './components/footer.json';
import ui from './components/ui.json';
import industries from './common/industries.json';
import home from './pages/home.json';
import manufacturers from './pages/manufacturers.json';
import manufacturersList from './pages/manufacturers/list.json';
import profile from './pages/claim-your-profile.json';
import cms from './pages/content-marketing-services.json';
import about from './pages/about.json';
import login from './pages/login.json';
import dashboard from './pages/dashboard.json';
import terms from './pages/terms.json';
import privacy from './pages/privacy.json';
import contact from './pages/contact.json';
import news from './pages/industry-news.json';
import rfq from './pages/rfq.json';
import register from './pages/register.json';
import notFound from './pages/404.json';

type TranslationTree = Record<string, unknown>;

// --- Products --- 
import productsList from './pages/products/list.json';
import productsPage from './pages/products-page.json';

// --- Dynamic Imports for Manufacturers ---
const mfgFiles = import.meta.glob<TranslationTree>('./pages/manufacturers/*.json', { eager: true, import: 'default' });
const manufacturersData: Record<string, unknown> = {
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
const productFiles = import.meta.glob<TranslationTree>('./pages/products/**/*.json', { eager: true, import: 'default' });
const productsData: Record<string, unknown> = {
  ...productsPage,
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
    (productsData[dirName] as Record<string, unknown>)[fileName] = productFiles[path];
  }
}

export default {
  navigation,
  footer,
  ui,
  industries,
  pages: {
    home,
    manufacturers: manufacturersData,
    products: productsData,
    rfq,
    profile,
    cms,
    about,
    login,
    register,
    dashboard,
    terms,
    privacy,
    contact,
    news,
    '404': notFound,
  },
} as const;