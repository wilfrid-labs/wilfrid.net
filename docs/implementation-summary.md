# Landing page implementation summary

The site is a one-page professional landing page for Wilfrid Girard. Astro and TypeScript render it as static HTML, with plain CSS and a small email click handler. It presents career background, current interests, selected GitHub projects, planned writing, and contact links.

Content and links live mainly in `src/data/site.ts` and `src/pages/index.astro`. `src/layouts/Layout.astro` supplies metadata; `src/styles/global.css` supplies the responsive light design. The SVG favicon and social preview artwork live in `public/`; the metadata uses the PNG social card.

The chosen longer-term platform is Astro on Cloudflare Workers, with D1 only when persistent data is needed. The Cloudflare adapter, `wrangler.jsonc`, and generated `worker-configuration.d.ts` prepare that path. The current homepage is prerendered and has no database or deployed backend. `npm run build` writes local output to `dist/`; it does not publish.

The contact email is read from an ignored `.env` during the build. 

See `docs/architecture.md` for decisions and `docs/maintenance.md` for the role of each file and package. Keep future explanations beside non-obvious code and update these short notes when decisions change.
