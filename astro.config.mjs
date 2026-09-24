// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://deadanddani.github.io',
  base: '/supilates-redesign',
  output: 'static',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
});
