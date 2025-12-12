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
      const supportedLanguages = env.VITE_SUPPORTED_LANGUAGES || '';
      const defaultLanguage = env.VITE_DEFAULT_LANGUAGE || 'en';
      const enableThemeToggle = env.VITE_ENABLE_THEME_TOGGLE || 'false';
      const enableLanguageToggle = env.VITE_ENABLE_LANGUAGE_TOGGLE || 'false';

      return html
        .replace('__VITE_SUPPORTED_LANGUAGES__', supportedLanguages)
        .replace('__VITE_DEFAULT_LANGUAGE__', defaultLanguage)
        .replace('__VITE_ENABLE_THEME_TOGGLE__', enableThemeToggle)
        .replace('__VITE_ENABLE_LANGUAGE_TOGGLE__', enableLanguageToggle);
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
      // Disable SPA fallback for preview to test real static behavior
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
        // Use the existing routes
        const staticRoutes = paths.filter(path => !path.includes(':'))

        // Check if blog is enabled
        const enableBlog = env.VITE_ENABLE_BLOG !== 'false';
        if (!enableBlog) {
          return staticRoutes;
        }

        // Read velite posts to generate dynamic routes
        try {
          // We need to use require here because this runs in Node environment
          // and we want to read the generated json file
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
