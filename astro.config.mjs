// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

const isVercel = process.env.VERCEL === '1';

// https://astro.build/config
export default defineConfig({
  site: isVercel ? 'https://orcine.vercel.app' : 'https://orcinebv.github.io',
  base: isVercel ? '/' : '/orcine',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
