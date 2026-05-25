import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

type ManufacturerRouteEntry = {
  slug: string;
};

type ProductRouteEntry = {
  url: string;
};

type BlogRouteEntry = {
  slug: string;
  permalink?: string;
};

type LanguagesConfig = Record<string, {
  name: string;
}>;

function getConfiguredLanguageCodes() {
  try {
    const languages = require('./src/locales/languages.json') as LanguagesConfig;
    return Object.keys(languages).join(',');
  } catch (e) {
    console.warn('Failed to load configured languages for HTML env replacement', e);
    return 'en';
  }
}

// Custom plugin to replace environment variables in HTML
function htmlEnvReplace(env: Record<string, string>) {
  return {
    name: 'html-env-replace',
    transformIndexHtml(html: string) {
      const defaultLanguage = env.VITE_DEFAULT_LANGUAGE || 'en';
      const supportedLanguages = env.VITE_SUPPORTED_LANGUAGES || getConfiguredLanguageCodes();
      const enableLanguageToggle = env.VITE_ENABLE_LANGUAGE_TOGGLE || 'false';
      const enableThemeToggle = env.VITE_ENABLE_THEME_TOGGLE || 'false';

      return html
        .replace('__VITE_DEFAULT_LANGUAGE__', defaultLanguage)
        .replace('__VITE_SUPPORTED_LANGUAGES__', supportedLanguages)
        .replace('__VITE_ENABLE_LANGUAGE_TOGGLE__', enableLanguageToggle)
        .replace('__VITE_ENABLE_THEME_TOGGLE__', enableThemeToggle);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), htmlEnvReplace(env)],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '.velite': resolve(__dirname, './.velite'),
      },
    },
    server: {},
    preview: {
      open: false,
      port: 4173,
      strictPort: false
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks(id: string) {
            const normalizedId = id.replace(/\\/g, '/');

            if (normalizedId.includes('/node_modules/')) {
              if (
                normalizedId.includes('/react/') ||
                normalizedId.includes('/react-dom/') ||
                normalizedId.includes('/scheduler/')
              ) {
                return 'react-vendor';
              }

              if (normalizedId.includes('/i18next/') || normalizedId.includes('/react-i18next/')) {
                return 'i18n-vendor';
              }

              if (
                normalizedId.includes('/@radix-ui/') ||
                normalizedId.includes('/lucide-react/') ||
                normalizedId.includes('/class-variance-authority/') ||
                normalizedId.includes('/tailwind-merge/') ||
                normalizedId.includes('/clsx/') ||
                normalizedId.includes('/embla-carousel-react/')
              ) {
                return 'ui-vendor';
              }

              return 'vendor';
            }

            if (normalizedId.includes('/src/data/') || normalizedId.includes('/src/locales/')) {
              return 'site-data';
            }
          },
        },
      }
    },
    ssgOptions: {
      concurrency: 1,
      includedRoutes(paths: string[]) {
        const staticRoutes = paths.filter(path => !path.includes(':'))
        const enableBlog = env.VITE_ENABLE_BLOG === 'true';
        const defaultLanguage = env.VITE_DEFAULT_LANGUAGE || 'en';
        
        // Base static routes with dynamic blog & manufacturers appended
        let allSSGRoutes = [...staticRoutes];

        const addLocalizedVariants = (route: string) => {
          const variants = [route];

          try {
            const languages = require('./src/locales/languages.json') as LanguagesConfig;

            Object.keys(languages)
              .filter((language) => language !== defaultLanguage)
              .forEach((language) => {
                variants.push(`/${language}${route}`);
              });
          } catch (e) {
            console.warn('Failed to load languages for localized SSG routes', e);
          }

          return variants;
        };

        try {
          const mfgList = require('./src/locales/en/pages/manufacturers/list.json') as ManufacturerRouteEntry[];
          const mfgRoutes = mfgList.flatMap((mfg) => addLocalizedVariants(`/manufacturers/${mfg.slug}`));
          allSSGRoutes = [...allSSGRoutes, ...mfgRoutes];
        } catch (e) {
             console.warn('Failed to load manufacturers for SSG', e);
        }

        try {
          const productList = require('./src/locales/en/pages/products/list.json') as ProductRouteEntry[];
          const productRoutes = productList.flatMap((product) => addLocalizedVariants(`/products/${product.url}`));
          allSSGRoutes = [...allSSGRoutes, ...productRoutes];
        } catch (e) {
             console.warn('Failed to load products for SSG', e);
        }

        if (enableBlog) {
          try {
            const posts = require('./.velite/posts.json') as BlogRouteEntry[];
            const blogRoutes = posts.map((post) => post.permalink || `/industry-news/${post.slug}`);
            allSSGRoutes = [...allSSGRoutes, ...blogRoutes];
          } catch (e) {
            console.warn('Failed to load velite posts for SSG', e);
          }
        }
        
        return allSSGRoutes;
      }
    }
  }
})
