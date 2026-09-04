/// <reference types="vitest/config" />

import { getViteConfig } from 'astro/config';

const cloudflareWorkersStub = decodeURIComponent(
  new URL('./tests/stubs/cloudflare-workers.ts', import.meta.url).pathname,
).replace(/^\/([A-Za-z]:)/, '$1');

export default getViteConfig({
  resolve: {
    alias: {
      'cloudflare:workers': cloudflareWorkersStub,
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 15_000,
  },
}, { configFile: false });