// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Páginas públicas estáticas (rápidas); /admin y /api/* se vuelven on-demand
  // con `export const prerender = false`. El adaptador habilita ese modo.
  site: 'https://mi-portafolio-eta-hazel.vercel.app',
  adapter: vercel(),
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});