import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Custom plugin to replace environment variables in HTML
function htmlEnvReplace() {
  return {
    name: 'html-env-replace',
    transformIndexHtml(html: string) {
      const supportedLanguages = process.env.VITE_SUPPORTED_LANGUAGES || '';
      const defaultLanguage = process.env.VITE_DEFAULT_LANGUAGE || 'en';

      return html
        .replace('__VITE_SUPPORTED_LANGUAGES__', supportedLanguages)
        .replace('__VITE_DEFAULT_LANGUAGE__', defaultLanguage);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), htmlEnvReplace()],
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
  // @ts-expect-error - ssgOptions is not typed in vite config
  ssgOptions: {
    includedRoutes(paths: string[], routes: any) {
      // Use the existing routes
      const staticRoutes = paths.filter(path => !path.includes(':'))

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
})
