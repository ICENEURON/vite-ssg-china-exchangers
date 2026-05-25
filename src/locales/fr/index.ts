import en from '../en';

type TranslationTree = Record<string, unknown>;

type FallbackResources = {
  navigation: TranslationTree;
  footer: TranslationTree;
  ui: TranslationTree;
  cookie: TranslationTree;
  industries: TranslationTree;
  pages: Record<string, TranslationTree>;
};

const fallback = en as unknown as FallbackResources;
const localeFiles = import.meta.glob<TranslationTree>('./**/*.json', { eager: true, import: 'default' });

function readLocaleFile(path: string, fallbackValue: TranslationTree = {}) {
  return (localeFiles[path] as TranslationTree | undefined) ?? fallbackValue;
}

function readPageFile(path: string, fallbackKey: string) {
  return readLocaleFile(path, fallback.pages[fallbackKey]);
}

const navigation = readLocaleFile('./components/navigation.json', fallback.navigation);
const footer = readLocaleFile('./components/footer.json', fallback.footer);
const ui = readLocaleFile('./components/ui.json', fallback.ui);
const cookie = readLocaleFile('./components/cookie.json', fallback.cookie);
const industries = readLocaleFile('./common/industries.json', fallback.industries);
const home = readPageFile('./pages/home.json', 'home');
const manufacturers = readPageFile('./pages/manufacturers.json', 'manufacturers');
const manufacturersList = readLocaleFile('./pages/manufacturers/list.json', fallback.pages.manufacturers?.list as TranslationTree);
const rfq = readPageFile('./pages/rfq.json', 'rfq');
const profile = readPageFile('./pages/update-your-profile.json', 'profile');
const cms = readPageFile('./pages/content-marketing-services.json', 'cms');
const about = readPageFile('./pages/about.json', 'about');
const news = readPageFile('./pages/industry-news.json', 'news');
const login = readPageFile('./pages/login.json', 'login');
const register = readPageFile('./pages/register.json', 'register');
const dashboard = readPageFile('./pages/dashboard.json', 'dashboard');
const terms = readPageFile('./pages/terms.json', 'terms');
const privacy = readPageFile('./pages/privacy.json', 'privacy');
const contact = readPageFile('./pages/contact.json', 'contact');
const notFound = readPageFile('./pages/404.json', '404');
const productsList = readLocaleFile('./pages/products/list.json', fallback.pages.products?.list as TranslationTree);
const productsPage = readPageFile('./pages/products-page.json', 'products');

const mfgFiles = import.meta.glob<TranslationTree>('./pages/manufacturers/*.json', { eager: true, import: 'default' });
const manufacturersData: Record<string, unknown> = {
  ...fallback.pages.manufacturers,
  ...manufacturers,
  list: manufacturersList
};

for (const path in mfgFiles) {
  const slug = path.split('/').pop()?.replace('.json', '');
  if (slug && slug !== 'list') {
    manufacturersData[slug] = mfgFiles[path];
  }
}

const productFiles = import.meta.glob<TranslationTree>('./pages/products/**/*.json', { eager: true, import: 'default' });
const productsData: Record<string, unknown> = {
  ...fallback.pages.products,
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
  cookie,
  industries,
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