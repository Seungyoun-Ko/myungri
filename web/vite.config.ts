import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const pagesIn = (dir: string) =>
  Object.fromEntries(readdirSync(resolve(import.meta.dirname, dir)).filter((f) => f.endsWith('.html')).map((f) => [`${dir}-${f.replace('.html', '')}`, resolve(import.meta.dirname, dir, f)]));
const guide = { ...pagesIn('guide'), ...pagesIn('ilju'), ...pagesIn('blog') };

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        licenses: resolve(import.meta.dirname, 'licenses.html'),
        terms: resolve(import.meta.dirname, 'terms.html'),
        today: resolve(import.meta.dirname, 'today.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
        en: resolve(import.meta.dirname, 'en/index.html'),
        enAbout: resolve(import.meta.dirname, 'en/about.html'),
        enPrivacy: resolve(import.meta.dirname, 'en/privacy.html'),
        enTerms: resolve(import.meta.dirname, 'en/terms.html'),
        newyear: resolve(import.meta.dirname, '2027/index.html'),
        enNewyear: resolve(import.meta.dirname, 'en/2027/index.html'),
        ...guide,
      },
    },
  },
});
