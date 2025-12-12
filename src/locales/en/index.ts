import navigation from './navigation.json';
import footer from './footer.json';
import home from './pages/home.json';
import history from './pages/history.json';
import faq from './pages/faq.json';
import docs from './pages/docs.json';
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
    history,
    faq,
    docs,
    login,
    signup,
    about,
    terms,
    privacy,
    dashboard,
    '404': notFound,
  },
} as const;