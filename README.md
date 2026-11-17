# wilfrid.net

A lightweight professional site built with Astro, TypeScript, and plain CSS. Cloudflare Workers is the deployment target; see [architecture decisions](docs/architecture.md) for the longer-term direction.

The site uses a white background, dark text, and a muted blue accent. Georgia headings, generous line spacing, and restrained diagrams support unhurried reading. Colors and font stacks are defined in `src/styles/global.css`; profile links live in `src/data/site.ts`.

## Development

Use the Node version specified in `package.json`, then run `npm install`.

| Command | Purpose |
| --- | --- |
| `npm run dev -- --background` | Start the Astro dev server in background mode |
| `npm run astro -- dev status` | Inspect the background server |
| `npm run astro -- dev logs` | Read server logs |
| `npm run astro -- dev stop` | Stop the background server |
| `npm run check` | Run Astro diagnostics and TypeScript checks |
| `npm run build` | Generate the production build in `dist/` |

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`. No lint or test scripts are currently configured.

## Editing the landing page

- `src/data/site.ts`: full name, profile links, canonical URL, and selected projects.
- `src/pages/index.astro`: page sections and expertise copy.
- `src/components/`: email interaction.
- `src/layouts/Layout.astro`: metadata and document structure.
- `src/styles/global.css`: responsive styles, focus states, and reduced-motion behavior.
- `public/`: local favicon and social artwork. Project illustrations in the page are decorative diagrams, not repository screenshots or measured results.

The homepage is prerendered. A small inline script is included only when email is configured; otherwise no client JavaScript is shipped. There are no backend services or tracking. Social metadata uses a local PNG with an editable SVG source. Verify social previews before sharing broadly.

## Configuring email without committing it

Copy `.env.example` to `.env`, then set `CONTACT_EMAIL` to your real address. `.env` and `.env.*` are ignored by Git, with `.env.example` explicitly allowed. Never put the address in a tracked source file. For a hosted build, configure `CONTACT_EMAIL` in the build environment. It is a build-time value: rebuild after changing it; a runtime-only Worker secret will not change the prerendered page. See [Astro environment variables](https://docs.astro.build/en/guides/environment-variables/).

Without a value, visitors see an unavailable email control. With a value, the “Email” button reconstructs the address from reversed, shifted character codes on click and opens the visitor’s mail client. The address is not shown on the page. Without JavaScript, visitors can still use GitHub, LinkedIn, or the booking link.

This keeps the plaintext address out of the repository and initial HTML. It is reversible obfuscation, not encryption or a guarantee against crawlers: anyone can decode the published data. An address that must remain secret requires a server-side contact relay instead, which is outside this static milestone. A dedicated public contact alias is another way to limit exposure of your private inbox.

Deployment is intentionally outside this milestone. Do not run the existing deploy script until deployment is explicitly authorized.

For package, asset, Wrangler, and generated-type explanations, see [maintenance notes](docs/maintenance.md). A [short implementation summary](docs/implementation-summary.md) is available for sharing with ChatGPT. Brief project history is recorded in the [change log](docs/changelog.md).
