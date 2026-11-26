# Maintenance notes

## Site overview

The site is a one-page professional landing page for Wilfrid Girard. It presents career background, current interests, selected GitHub projects, planned writing, and contact links. Astro and TypeScript render it as static HTML with plain CSS; a small client script handles the optional email interaction.

The homepage is prerendered, with no database or deployed backend. Cloudflare Workers is the chosen deployment target, with D1 planned only when persistent data is needed. Builds generate local output without publishing. The sections below cover source files, assets, email configuration, and Cloudflare tooling; see [architecture decisions](architecture.md) for the reasoning behind these choices.

Keep explanations beside non-obvious code and update these notes when implementation or setup changes.

## Local development

Use the Node version specified in `package.json`, then run `npm ci` to install from the lockfile.

| Command                       | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `npm run dev -- --background` | Start the Astro dev server in background mode    |
| `npm run astro -- dev status` | Inspect the background server                    |
| `npm run astro -- dev logs`   | Read server logs                                 |
| `npm run astro -- dev stop`   | Stop the background server                       |
| `npm run check`               | Run Astro diagnostics and TypeScript checks      |
| `npm run build`               | Generate the production build locally in `dist/` |

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`. No lint or test scripts are currently configured.

## Where things live

- `src/pages/index.astro` is the prerendered landing page, including its sections and expertise copy.

- `src/data/site.ts` holds the full name, profile links, canonical URL, and selected projects.

- `src/components/EmailReveal.astro` contains the email interaction.

- `src/layouts/Layout.astro` sets document metadata.

- `src/styles/global.css` contains the visual system and responsive rules.

- `public/favicon.svg` is the browser tab icon.

- `public/social-card.png` is the 1200 × 630 preview referenced by Open Graph metadata.

- `public/social-card.svg` is its editable source. Update the PNG when changing the SVG or page headline.

- `public/.assetsignore` is copied into the built asset directory. It tells Wrangler not to upload Worker and route files as public assets. This is a precaution for Cloudflare deployment; the current static build has no such files in that directory.

Verify social previews before sharing broadly.

## README screenshot

`docs/images/site-preview.jpg` illustrates the site in the repository README. Keep it in `docs/images/` so it does not add weight to the published site. Refresh it in the same change whenever the site's visuals change, including layout, typography, colors, artwork, or visible content.

The README displays the image at 640 pixels wide and links it to `https://wilfrid.net`. A 3-pixel muted blue-gray border (`#8b9eaa`) is baked into the JPEG so its edges stay visible without relying on HTML tables or inline styles.

To refresh it:

1. Run `npm run build`, then `npm run astro -- preview --background --port 4322`.
2. Open `http://localhost:4322/` in a desktop browser at normal zoom. Capture only the header and hero introduction, ending before the About section, without browser chrome or development controls. The current crop is 1265 × 827 pixels; adjust the crop if the layout changes so the title and buttons remain fully visible.
3. Add a 3-pixel border (`#8b9eaa`) on all four sides of the fresh capture, then save it as `docs/images/site-preview.jpg`, replacing the existing image. Use JPEG to keep the README preview lightweight. Add the border only once; the current bordered image is 1271 × 833 pixels.
4. Open the image and check that the header, title, buttons, and border render correctly. Keep the 640-pixel display width and verify that clicking the README image opens `https://wilfrid.net`.
5. Stop the preview with `npm run astro -- preview stop`.

## Configuring email without committing it

Copy `.env.example` to `.env`, then set `CONTACT_EMAIL` to your real address. `.env` and `.env.*` are ignored by Git, with `.env.example` explicitly allowed. Never put the address in a tracked source file. For a hosted build, configure `CONTACT_EMAIL` in the build environment. It is a build-time value: rebuild after changing it; a runtime-only Worker secret will not change the prerendered page. See [Astro environment variables](https://docs.astro.build/en/guides/environment-variables/).

Without a value, visitors see an unavailable email control and no client JavaScript is shipped. With a value, “Contact by email” reveals actions to open the visitor’s mail client or copy the address. The selected action reconstructs the address from reversed, shifted character codes. Copying shows a temporary confirmation; if clipboard access fails, selectable address text is shown instead. Without JavaScript, visitors can still use GitHub, LinkedIn, or the booking link.

This keeps the plaintext address out of the repository and initial HTML. It is reversible obfuscation, not encryption or a guarantee against crawlers.

## npm packages and lockfile

`package.json` lists the packages selected for this project:

- `astro` builds the pages.
- `@astrojs/check` and `typescript` power Astro's diagnostics and TypeScript checking via `npm run check`.
- `@astrojs/cloudflare` prepares the chosen Workers deployment target and future on-demand routes.
- `wrangler` provides Cloudflare's local development and deployment CLI.
- `@types/node` provides Node type definitions used by tooling.

Only Astro is essential to produce the current static page. The Cloudflare packages preserve the chosen deployment path. The adapter is not required for a purely static Astro site.

`package-lock.json` is generated by npm. It records exact versions and the dependency tree so installs are repeatable. Its many other entries are dependencies of the four direct packages, including build tools and optional packages for different platforms.

An `integrity` value such as `sha512-...` is a Base64-encoded checksum of a downloaded package archive. npm uses it to detect a changed or damaged archive. It is neither encrypted content nor a public key.

Change dependencies in `package.json` with npm, and let npm update the lockfile. Do not edit integrity values manually. Use `npm ci` for a clean install from the lockfile.

## Cloudflare setup

`astro.config.mjs` configures Astro's Cloudflare adapter (the integration that packages Astro output for Cloudflare Workers).

The homepage currently has `prerender = true`, so the build generates HTML in `dist/client/`.

`wrangler.jsonc` names the Worker, selects the compatibility date (the date that pins which Cloudflare runtime behavior and APIs the Worker uses) and flags, points to the Astro adapter entrypoint (the adapter-provided Worker startup module), and declares the build output as static assets under the `ASSETS` binding (the named connection through which Worker code can access those files).

Astro generates a deployment config in `dist/client/wrangler.json` that points its assets to `dist/client/`. Wrangler reads the project config for type generation and the generated config for deployment.

`npm run build` only builds locally. `npm run deploy` builds and then publishes through Wrangler. D1 is planned, with no binding or database in use yet.

Deployment is intentionally outside the current milestone. Do not run the deploy script until deployment is explicitly authorized. See [architecture decisions](architecture.md#cloudflare-routing-redirects-and-404-responses) for the intended routing approach and [TODO.md](../TODO.md) for outstanding work.

`worker-configuration.d.ts` is generated by `npm run generate-types` (`wrangler types`) from `wrangler.jsonc` and Cloudflare runtime definitions.

`tsconfig.json` includes `worker-configuration.d.ts` so TypeScript knows the `Env` bindings and Worker APIs.

The current `Env` contains only `ASSETS`. Regenerate `worker-configuration.d.ts` after changing compatibility settings (the compatibility date or flags in `wrangler.jsonc`) or bindings (resources such as `ASSETS` declared in `wrangler.jsonc`). Never edit the generated file by hand. Custom application types belong in source files such as `src/env.d.ts`.
