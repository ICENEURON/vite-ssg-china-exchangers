import navigation from './navigation.json';
import footer from './footer.json';
import home from './pages/home.json';
import manufacturers from './pages/manufacturers.json';
import manufacturersList from './pages/manufacturers/list.json';
import profile from './pages/claim-your-profile.json';
import about from './pages/about.json';
import login from './pages/login.json';
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
    profile,
    about,
    login,
    dashboard,
    terms,
    privacy,
    '404': notFound,
  },
} as const;