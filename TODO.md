# Todo

Outstanding work and ideas for wilfrid.net. Unchecked items are not implemented; the list does not imply a delivery order or schedule. Technical decisions live in [architecture](docs/architecture.md), and setup details live in [maintenance](docs/maintenance.md).

## Deployment and routing

- [x] Configure production `workers.dev` and Version URLs off; takes effect on the next deployment. Keep the existing Custom Domain outside CI.

- [x] Implement GitHub Actions PR validation and main-only Cloudflare Workers deployment; production is live.
- [ ] Audit existing token scope and GitHub protection settings; see the [setup record](docs/first-deployment.md). Successful deployment does not establish least privilege or branch protection.
- [ ] Implement permanent HTTP 301 redirects for moved pages in Astro.
- [ ] Create a custom `404.astro` page with a homepage link and helpful suggestions, and verify that unknown URLs return HTTP 404.

## Deferred CI/CD improvements

- [ ] **Automated pull-request preview deployments — deferred, not implemented. Priority: Next CI/CD enhancement.** Validate CI first, then deploy each PR to an isolated temporary Cloudflare environment with a unique URL. Associate that URL with the PR through a deployment status or PR check. Evaluate Worker Previews against separate temporary Workers, appropriate Cloudflare API permissions, and the GitHub Actions trust model for untrusted external PRs. Keep production Cloudflare credentials, secrets (including `CONTACT_EMAIL`), databases, and user data inaccessible; production environment secrets must not be reused for untrusted PR previews. Define cleanup/expiry when PRs close, consider smoke tests against deployed previews, and keep hosting and maintenance costs low. Preserve GitHub Actions ownership without installing Cloudflare's GitHub App.

- [ ] **Persistent staging environment — deferred, not implemented. Priority: Deferred; evaluate necessity after PR previews.** Document whether staging adds enough value beyond ephemeral previews before implementing it. Compare automatic deployment, manual deployment, and relying entirely on PR previews. If justified, use a separate Worker or Wrangler environment, independent configuration, credentials and data resources, no shared production database or secrets, a stable URL, integration/end-to-end tests, a clear deployment/promotion strategy, appropriate access controls, and minimal additional hosting costs.

These items authorize no infrastructure: no preview/staging workflow, Worker, secret, database, or hosting resource exists yet. See [architecture](docs/architecture.md#deployment-addresses) for terminology.

## Ideas to explore

- [ ] Evaluate isolated production build/deploy jobs, with artifact verification and minimal deploy-time code; see [security notes](SECURITY.md#deployment-trust-and-remaining-risks).
- [ ] Evaluate standardized SBOM generation, association with releases, and dependency scanning as the project grows; no SBOM tooling yet.
- [ ] Explore suggesting similar valid URLs for mistyped paths.
- [ ] Investigate lightweight monitoring of 404 requests and broken inbound links using existing Cloudflare capabilities.
