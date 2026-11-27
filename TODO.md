# Todo

Outstanding work and ideas for wilfrid.net. Unchecked items are not implemented; the list does not imply a delivery order or schedule. Technical decisions live in [architecture](docs/architecture.md), and setup details live in [maintenance](docs/maintenance.md).

## Deployment and routing

- [ ] Review whether to retain the optional public `workers.dev` address alongside the configured website domain, and align Wrangler settings with that decision.

- [x] Implement GitHub Actions PR validation and main-only Cloudflare Workers deployment (remote execution still pending).
- [ ] Verify the existing Cloudflare token's account scope and permissions, GitHub settings, and first deployment; follow the [initial setup checklist](docs/first-deployment.md).
- [ ] Implement permanent HTTP 301 redirects for moved pages in Astro.
- [ ] Create a custom `404.astro` page with a homepage link and helpful suggestions, and verify that unknown URLs return HTTP 404.

## Ideas to explore

- [ ] Evaluate isolated production build/deploy jobs, with artifact verification and minimal deploy-time code; see [security notes](SECURITY.md#deployment-trust-and-remaining-risks).
- [ ] Evaluate standardized SBOM generation, association with releases, and dependency scanning as the project grows; no SBOM tooling yet.
- [ ] Add staging when SSR, Cloudflare bindings, databases, authentication, or other runtime features justify it; see [architecture](docs/architecture.md#future-staging).
- [ ] Explore suggesting similar valid URLs for mistyped paths.
- [ ] Investigate lightweight monitoring of 404 requests and broken inbound links using existing Cloudflare capabilities.
