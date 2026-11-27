# Architecture decisions

## Development philosophy

Follow [AGENTS.md](../AGENTS.md): prefer simple, maintainable solutions and avoid unnecessary runtime code, dependencies, requests, and asset weight.

- **Astro + TypeScript** is the foundation. Prerender the professional site and future writing to HTML; use Astro components and plain CSS by default. No framework runtime; a small inline script is included only when email reveal is configured.
- **Cloudflare Workers** is the deployment target, using the existing Astro Cloudflare adapter. Keep static pages cacheable; introduce on-demand routes only when a feature needs server behavior. OVHcloud remains the domain registrar.
- **Cloudflare D1** is the planned relational store for applications that need persistent data. No database, binding, authentication, or backend is introduced for the landing page. Design migrations and access boundaries when the first persistent application is scoped.
- **Keep interactive applications isolated.** WebGPU/WGSL, Three.js, ML models, React Flow, and WebLLM belong on explicitly opened experiment or application routes. Import their bundles only there; never preload them from the landing page. React islands can be added where justified.
- **Content grows incrementally.** Editable profile and project metadata live in `src/data/site.ts`. Add Markdown/MDX content collections for real writing, and Giscus only on article pages when comments are wanted. Keep independent apps separate from the lightweight professional site.
- **Privacy and accessibility are defaults.** No analytics, externally hosted fonts, or contact service. Use semantic HTML, visible keyboard focus, and reduced-motion support. 

Revisit these decisions when a concrete feature requires it. Prefer adding capabilities at the point of use over infrastructure for hypothetical needs.

## Visual design

The site uses a white background, dark text, and a muted blue accent. Georgia headings, generous line spacing, and restrained diagrams support unhurried reading. Colors and font stacks are defined in `src/styles/global.css`; system fonts avoid external font requests. Project illustrations are decorative diagrams, not repository screenshots or measured results.

## Cloudflare routing, redirects, and 404 responses

The homepage is prerendered; ordinary builds generate local output. GitHub Actions publishes through Wrangler on `main`. Deployment verification is tracked in the [initial checklist](first-deployment.md); outstanding routing features are in [TODO.md](../TODO.md).

### Deployment addresses

Cloudflare assigns each Worker a default website address under `workers.dev`, such as `https://wilfrid-net.<account-subdomain>.workers.dev`. When enabled, this address serves the deployed site without requiring a custom domain. It can coexist with `wilfrid.net` or be disabled if only the custom domain should serve the site. It is not a Cloudflare management API endpoint or a separate staging environment. See [Cloudflare’s workers.dev guide](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/). The decision about retaining this additional public address is tracked in [TODO.md](../TODO.md#deployment-and-routing).

### Routing decisions

- **Cloudflare routing:** Cloudflare determines which Worker handles incoming HTTP requests. Prefer a Workers Custom Domain for the main website. `Workers Routes Write` is only needed when managing Workers route associations; do not assume it is required for every deployment.
- **Astro routing:** Astro handles application pages, redirects, and 404 responses. Do not create Cloudflare routes for individual Astro pages.
- **Moved pages:** Preserve old bookmarks and inbound links with permanent HTTP 301 redirects configured in Astro and version-controlled.
- **Unknown URLs:** Return a genuine HTTP 404 with a friendly page explaining that the URL may be incorrect, deleted, or moved. Include a homepage link and helpful suggestions.
- **Broken-link monitoring:** Eventually track requests to nonexistent URLs, preferably through existing Cloudflare analytics or logging rather than custom infrastructure.

Keep routing simple, fast, inexpensive, and maintainable. Prefer Astro's native features, reuse existing Cloudflare capabilities, and avoid unnecessary dependencies.

Track outstanding implementation work in [TODO.md](../TODO.md).

## CI/CD design decisions

| Decision | Rationale |
| --- | --- |
| GitHub Actions instead of Cloudflare's GitHub integration | Avoid granting Cloudflare's GitHub App repository access. |
| Ubuntu 24.04 | Compatible, economical Linux runner with a stable major OS version. The maintained image receives updates and is not immutable; it is independent of local Windows development. |
| Node.js 24 LTS | The locked Astro, Vite, and Wrangler engine ranges support it. LTS gives build tooling a maintained baseline; pinning the major allows patch and minor maintenance updates. |
| Separate CI and deployment workflows | PR validation has no production environment or secrets; deployment checks again after merge. |
| Protected `main` branch (manual setup pending) | Require a PR and successful `validate` check before changes reach production. |
| Read-only `GITHUB_TOKEN` | Both workflows request only `contents: read`; other permissions are unset. |
| Checkout without persisted credentials | Build scripts have no reusable Git authentication stored by checkout. |
| Full-SHA Action pinning | Mutable upstream tags cannot silently change the selected Action code. |
| Monthly grouped Dependabot updates | Group routine Action minor/patch updates in one PR; review major updates separately. |
| Existing GitHub `production` environment | Keep credentials scoped to production and honor its existing protection rules. Branch restrictions also need manual verification. |
| Step-scoped secrets | Only the build receives `CONTACT_EMAIL`; only Wrangler deployment receives the Cloudflare token and account ID. |
| One production job | One build and no artifact transfer or reinstall. Accept the shared-runner risk explained in [security notes](../SECURITY.md#deployment-trust-and-remaining-risks). |
| Main-only dispatch and serialized deployment | A job-level repository/ref guard also covers manual dispatch. Concurrency lets an active deployment finish without overlapping another. |
| No staging initially | Avoid infrastructure complexity while the landing page is entirely prerendered. |

Node.js runs npm, Astro, checking, and Wrangler during development and CI; it is not the production request runtime. The generated deployment currently contains only static assets. Future Worker code would run on Cloudflare's Workers runtime, whose behavior is controlled separately by Wrangler's compatibility date and flags.

See [SECURITY.md](../SECURITY.md) for trust boundaries and remaining risks, and [maintenance](maintenance.md) for operating instructions.

## Future staging

Add staging when SSR, Cloudflare bindings, databases, authentication, or other runtime behavior makes it useful. Prefer a separate Worker and least-privilege API token, the same account ID if appropriate, a test email or a build without a real address, and explicit staging deployment restrictions. This implementation creates no staging resources, workflow, or secrets.
