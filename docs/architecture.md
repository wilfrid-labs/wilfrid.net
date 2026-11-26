# Architecture decisions

## Development philosophy

Prefer simple, clear solutions that are easy to maintain and explain. Use names that make intent apparent, and add concise comments beside code when the reason is not obvious. Record durable decisions in short notes so future contributors can understand and share the reasoning. Keep performance in view by avoiding unnecessary runtime code, dependencies, network requests, and asset weight.

- **Astro + TypeScript** is the foundation. Prerender the professional site and future writing to HTML; use Astro components and plain CSS by default. No framework runtime; a small inline script is included only when email reveal is configured.
- **Cloudflare Workers** is the deployment target, using the existing Astro Cloudflare adapter. Keep static pages cacheable; introduce on-demand routes only when a feature needs server behavior. This milestone does not deploy or change account settings.
- **Cloudflare D1** is the planned relational store for applications that need persistent data. No database, binding, authentication, or backend is introduced for the landing page. Design migrations and access boundaries when the first persistent application is scoped.
- **Keep interactive applications isolated.** WebGPU/WGSL, Three.js, ML models, React Flow, and WebLLM belong on explicitly opened experiment or application routes. Import their bundles only there; never preload them from the landing page. React islands can be added where justified.
- **Content grows incrementally.** Editable profile and project metadata live in `src/data/site.ts`. Add Markdown/MDX content collections for real writing, and Giscus only on article pages when comments are wanted. Keep independent apps separate from the lightweight professional site.
- **Privacy and accessibility are defaults.** No analytics, externally hosted fonts, or contact service. Use semantic HTML, visible keyboard focus, and reduced-motion support. 

Revisit these decisions when a concrete feature requires it. Prefer adding capabilities at the point of use over infrastructure for hypothetical needs.

## Visual design

The site uses a white background, dark text, and a muted blue accent. Georgia headings, generous line spacing, and restrained diagrams support unhurried reading. Colors and font stacks are defined in `src/styles/global.css`; system fonts avoid external font requests. Project illustrations are decorative diagrams, not repository screenshots or measured results.

## Cloudflare routing, redirects, and 404 responses

### Current functionality

The homepage is prerendered. The Cloudflare adapter and Wrangler configuration prepare the Workers deployment target, but ordinary builds only generate local output and do not deploy. GitHub Actions deployment, the domain association, moved-page redirects, a custom 404 page, and broken-link monitoring are future work; the decisions below do not establish that they are configured or active.

### Decisions for future implementation

- **Deployment:** GitHub Actions will deploy the site to Cloudflare Workers using a Cloudflare API token with minimal permissions, restricted to `wilfrid.net` where applicable. Verify the deployment mode and exact permissions before configuring deployment.
- **Cloudflare routing:** Cloudflare determines which Worker handles incoming HTTP requests. Prefer a Workers Custom Domain for the main website. `Workers Routes Write` is only needed when managing Workers route associations; do not assume it is required for every deployment.
- **Astro routing:** Astro handles application pages, redirects, and 404 responses. Do not create Cloudflare routes for individual Astro pages.
- **Moved pages:** Preserve old bookmarks and inbound links with permanent HTTP 301 redirects configured in Astro and version-controlled.
- **Unknown URLs:** Return a genuine HTTP 404 with a friendly page explaining that the URL may be incorrect, deleted, or moved. Include a homepage link and helpful suggestions.
- **Broken-link monitoring:** Eventually track requests to nonexistent URLs, preferably through existing Cloudflare analytics or logging rather than custom infrastructure.

Keep routing simple, fast, inexpensive, and maintainable. Prefer Astro's native features, reuse existing Cloudflare capabilities, and avoid unnecessary dependencies.

Track outstanding implementation work in [TODO.md](../TODO.md).
