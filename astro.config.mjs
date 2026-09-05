import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindv4 from '@tailwindcss/vite';

const nonIndexablePaths = [
  '/404',
  '/ficha-de-datos',
  '/ficha-de-registro-docentes',
  '/ficha-legacy-matricula',
  '/ficha-de-matricula-2',
  '/reclutamiento-docente',
];

export default defineConfig({
  site: 'https://new.imbinstitute.com',
  trailingSlash: 'never',
  output: 'server',
  actions: true,
  redirects: {
    '/reclamaciones': '/libro-de-reclamaciones',
    '/ficha-de-matricula': '/ficha-de-matricula-2',
    '/capacitacion/mantenimiento': '/capacitacion?category=mantenimiento',
    '/capacitacion/logistica': '/capacitacion?category=logistica',
    '/capacitacion/recursos-humanos': '/capacitacion?category=recursos-humanos',
    '/capacitacion/analitica': '/capacitacion',
    '/capacitacion/calidad': '/capacitacion',
    '/capacitacion/derechos-leyes': '/capacitacion',
    '/capacitacion/finanzas': '/capacitacion',
    '/capacitacion/produccion': '/capacitacion',
    '/capacitacion/salud': '/capacitacion',
    '/capacitacion/construccion': '/capacitacion',
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
        return !pathname.startsWith('/admin') && !nonIndexablePaths.includes(pathname);
      },
    }),
  ],
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.jsonc'
    }
  }),
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'recursos.imbinstitute.com' },
    ],
  },
  vite: {
    plugins: [tailwindv4()],
    optimizeDeps: {
      include: ['astro/assets/services/noop', 'astro/logger/json'],
    },
  },
});
