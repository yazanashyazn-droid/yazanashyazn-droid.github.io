// @ts-check
import { defineConfig } from 'astro/config';

// SITE / BASE are set by the GitHub Pages workflow; local dev falls back to root.
export default defineConfig({
  site: process.env.SITE || 'http://localhost:4321',
  base: process.env.BASE || '/',
  trailingSlash: 'ignore',
  // Class-based scoping lets a parent's styles reach `class` props passed to child components.
  scopedStyleStrategy: 'class',
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: {
    // Keep CSS in files so the Content-Security-Policy can stay strict (no 'unsafe-inline').
    inlineStylesheets: 'never',
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
