// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://wilfrid.net',
  // Pages are prerendered today. Keep the adapter for Cloudflare Workers
  // and future on-demand routes; neither sessions nor runtime image services are needed.
  session: false,
  adapter: cloudflare({ imageService: 'passthrough' })
});
