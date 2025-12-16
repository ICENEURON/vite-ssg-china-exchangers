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
import notFound from './pages/404.json';

export default {
  navigation,
  footer,
  pages: {
    home,
    manufacturers: {
      ...manufacturers,
      list: manufacturersList
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
    '404': notFound,
  },
} as const;