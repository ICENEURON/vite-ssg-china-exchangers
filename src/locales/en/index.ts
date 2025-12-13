import navigation from './navigation.json';
import footer from './footer.json';
import home from './pages/home.json';
import manufacturers from './pages/manufacturers.json';
import rfq from './pages/rfq.json';
import profile from './pages/claim-your-profile.json';
import login from './pages/login.json';
import signup from './pages/signup.json';
import about from './pages/about.json';
import terms from './pages/terms.json';
import privacy from './pages/privacy.json';
import dashboard from './pages/dashboard.json';
import notFound from './pages/404.json';

export default {
  navigation,
  footer,
  pages: {
    home,
    manufacturers,
    rfq,
    profile,
    login,
    signup,
    about,
    terms,
    privacy,
    dashboard,
    '404': notFound,
  },
} as const;