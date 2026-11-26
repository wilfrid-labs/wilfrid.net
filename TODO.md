# Todo

Outstanding work and ideas for wilfrid.net. These items are not implemented; the list does not imply a delivery order or schedule. Technical decisions live in [architecture](docs/architecture.md), and setup details live in [maintenance](docs/maintenance.md).

## Deployment and routing

- [ ] Verify Cloudflare deployment mode and required API token permissions.
- [ ] Configure GitHub Actions deployment to Cloudflare Workers and associate the domain once deployment is authorized.
- [ ] Implement permanent HTTP 301 redirects for moved pages in Astro.
- [ ] Create a custom `404.astro` page with a homepage link and helpful suggestions, and verify that unknown URLs return HTTP 404.

## Ideas to explore

- [ ] Explore suggesting similar valid URLs for mistyped paths.
- [ ] Investigate lightweight monitoring of 404 requests and broken inbound links using existing Cloudflare capabilities.
