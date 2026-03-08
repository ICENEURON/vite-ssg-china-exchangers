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
      list: manufacturersList
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