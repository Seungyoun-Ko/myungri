import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const pagesIn = (dir: string) =>
  Object.fromEntries(readdirSync(resolve(__dirname, dir)).filter((f) => f.endsWith('.html')).map((f) => [`${dir}-${f.replace('.html', '')}`, resolve(__dirname, dir, f)]));
const guide = { ...pagesIn('guide'), ...pagesIn('ilju') };

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        contact: resolve(__dirname, 'contact.html'),
        licenses: resolve(__dirname, 'licenses.html'),
        terms: resolve(__dirname, 'terms.html'),
        today: resolve(__dirname, 'today.html'),
        ...guide,
      },
    },
  },
});
