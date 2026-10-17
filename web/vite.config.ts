import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const guide = Object.fromEntries(readdirSync(resolve(__dirname, 'guide')).filter((f) => f.endsWith('.html')).map((f) => [`guide-${f.replace('.html', '')}`, resolve(__dirname, 'guide', f)]));

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
        ...guide,
      },
    },
  },
});
