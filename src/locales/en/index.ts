import navigation from './navigation.json';
import footer from './footer.json';
import home from './pages/home.json';
import manufacturers from './pages/manufacturers.json';
import manufacturersList from './pages/manufacturers/list.json';
import shphe from './pages/manufacturers/shanghai-heat-transfer-equipment-co-ltd.json';
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
import gasketedPhe from './pages/products/gasketed-phe.json';
import weldedPhe from './pages/products/welded-phe.json';
import brazedPhe from './pages/products/brazed-phe.json';
import shellAndTube from './pages/products/shell-and-tube.json';
import airCooled from './pages/products/air-cooled.json';
import spares from './pages/products/spares.json';
export default {
  navigation,
  footer,
  pages: {
    home,
    manufacturers: {
      ...manufacturers,
      list: manufacturersList,
      'shanghai-heat-transfer-equipment-co-ltd': shphe
    },
    products: {
      ...productsList,
      list: productsList,
      'gasketed-phe': gasketedPhe,
      'welded-phe': weldedPhe,
      'brazed-phe': brazedPhe,
      'shell-and-tube': shellAndTube,
      'air-cooled': airCooled,
      'spares': spares
    },
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