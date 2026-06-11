// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// GitHub Pages serves project sites under /<repo>/; Vercel/Netlify and local
// dev serve from the root. The deploy workflow sets DEPLOY_TARGET=gh-pages.
const ghPages = process.env.DEPLOY_TARGET === 'gh-pages';

// https://astro.build/config
export default defineConfig({
  site: ghPages
    ? 'https://arunav-bhattacharya.github.io'
    : 'https://ddia-companion.vercel.app',
  base: ghPages ? '/ddia-companion' : undefined,
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
    },
  },
});
