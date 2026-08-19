import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindv4 from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  actions: true,
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.jsonc'
    }
  }),
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' }
    ],
  },
  vite: {
    plugins: [tailwindv4()],
  },
});