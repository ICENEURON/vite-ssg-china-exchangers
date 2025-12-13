import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Custom plugin to replace environment variables in HTML
function htmlEnvReplace(env: Record<string, string>) {
  return {
    name: 'html-env-replace',
    transformIndexHtml(html: string) {
      const defaultLanguage = env.VITE_DEFAULT_LANGUAGE || 'en';
      const supportedLanguages = env.VITE_SUPPORTED_LANGUAGES || '';
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
        }
      }
    },
    ssgOptions: {
      includedRoutes(paths: string[], routes: any) {
        const staticRoutes = paths.filter(path => !path.includes(':'))
        const enableBlog = env.VITE_ENABLE_BLOG !== 'false';
        if (!enableBlog) {
          return staticRoutes;
        }
        try {
          const posts = require('./.velite/posts.json')
          const blogRoutes = posts.map((post: any) => `/blog/${post.slug}`)
          return [...staticRoutes, ...blogRoutes]
        } catch (e) {
          console.warn('Failed to load velite posts for SSG', e)
          return staticRoutes
        }
      }
    }
  }
})
