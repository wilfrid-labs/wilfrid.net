# Maintenance notes

Operational instructions for the site. See [architecture](architecture.md) for design decisions, [security](../SECURITY.md) for risks, and [initial setup](first-deployment.md) for first-deployment checks.

## Local development

Use Node.js 24 LTS to match CI. On Windows, `npm.cmd` avoids PowerShell's `npm.ps1` execution-policy issues; other shells can use `npm`.

| Command | Purpose |
| --- | --- |
| `npm.cmd ci` | Install locked dependencies |
| `npm.cmd run dev -- --background` | Start development in required background mode |
| `npm.cmd run astro -- dev status` | Inspect the server |
| `npm.cmd run astro -- dev logs` | Read server logs |
| `npm.cmd run astro -- dev stop` | Stop the server |
| `npm.cmd run check` | Check Astro and TypeScript |
| `npm.cmd run build` | Generate local output in `dist/`; does not publish |

No lint or test scripts are configured.

## Where things live

| File | Purpose |
| --- | --- |
| `src/pages/index.astro` | Prerendered landing page |
| `src/data/site.ts` | Profile, links, canonical URL, projects |
| `src/components/EmailReveal.astro` | Optional email interaction |
| `src/layouts/Layout.astro` | Metadata |
| `src/styles/global.css` | Styles and responsive rules |
| `public/favicon.svg` | Browser icon |
| `public/social-card.svg`, `public/social-card.png` | Editable social artwork and 1200 × 630 published preview; regenerate the PNG when changing its SVG or page headline |
| `public/.assetsignore` | Excludes Worker/routing files from public asset uploads |

Verify social previews before sharing.

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

Copy `.env.example` to ignored `.env` and set `CONTACT_EMAIL` locally. It is a build-time value: rebuild after changing it; a runtime Worker secret cannot change prerendered HTML. Never commit the address. See [Astro environment variables](https://docs.astro.build/en/guides/environment-variables/).

Without a value, the email control is unavailable and its script is omitted. With a value, visitors can open their mail app or copy the address; failed clipboard access shows selectable text. Other contact links work without JavaScript.

The address is stored as reversed, shifted character codes and decoded after an email action. This keeps plaintext out of initial HTML but is reversible obfuscation, not encryption or crawler protection.

## npm packages and lockfile

Astro builds pages; `@astrojs/check` and TypeScript check them. The Cloudflare adapter prepares Workers output; Wrangler supplies development/deployment tooling; `@types/node` supplies tooling types.

Use npm to update dependencies and generate `package-lock.json`; never edit it by hand. `npm ci` installs its exact dependency tree, including platform-specific packages. Archive `integrity` checksums detect changed downloads, not unsafe code. See [security notes](../SECURITY.md).

## Cloudflare setup

`astro.config.mjs` configures the Cloudflare adapter. The prerendered homepage builds to `dist/client/`. `wrangler.jsonc` selects the Worker name, compatibility date/flags, adapter entrypoint, and static-assets binding `ASSETS`.

Astro generates `dist/client/wrangler.json` and Wrangler's deployment-config redirect. Wrangler deploys that generated output; it reads the project config for type generation. `npm run deploy` builds and publishes, so run it only when deployment is intended.

After changing compatibility settings or bindings, run `npm run generate-types` (`wrangler types`). Never edit `worker-configuration.d.ts` by hand. `tsconfig.json` includes it; the current `Env` contains only `ASSETS`. Custom application types belong in `src/env.d.ts`.

## GitHub Actions deployment

The [PR process](../CONTRIBUTING.md) leads to these workflows:

| Workflow | Trigger and behavior |
| --- | --- |
| [CI](../.github/workflows/ci.yml), job `validate` | Every PR to `main`: install, check, build without production secrets. Publishes no preview or staging site. |
| [Deploy](../.github/workflows/deploy.yml), job `deploy` | Push to `main` or manual run: verify repository/ref, check out the triggering commit, install, check, build once, deploy through the existing `production` environment. |

`npm ci` installs Wrangler as a direct devDependency; Astro does not install it. `npx --no-install wrangler deploy` uses that installed CLI and Astro's generated config, with no second build or artifact transfer.

“Dispatch” means a manual `workflow_dispatch` request. Use **Actions → Deploy → Run workflow → main** (or the CLI/API). Other branches/tags are skipped; existing environment approvals still apply. Prefer a new dispatch on current `main`: rerunning an old run redeploys its original commit.

Production concurrency lets an active deployment finish without overlap; GitHub can replace older pending runs, so it is not a strict queue. Runtime and security rationales are in [architecture](architecture.md#cicd-design-decisions).

### Existing environment secrets

These already exist under **Settings → Environments → production**, not under repository-level Actions secrets. Preserve them; do not duplicate or recreate them. See [security notes](../SECURITY.md#credentials-and-incidents) for access and disclosure considerations.

| Environment secret | Purpose and scope |
| --- | --- |
| `CONTACT_EMAIL` | Build step only; empty values fail production. See [email configuration](#configuring-email-without-committing-it). |
| `CLOUDFLARE_API_TOKEN` | Available only in the Wrangler deploy step; authorizes Cloudflare API deployment. |
| `CLOUDFLARE_ACCOUNT_ID` | Available only in the Wrangler deploy step; selects the destination account. |

Secrets are injected only at the steps above. Token permissions and the shared-runner limitation are covered in [SECURITY.md](../SECURITY.md).

### Action updates

All external Actions use full 40-character commit SHAs with release comments. A tag such as `v7.0.1` is a readable name for a release; the SHA selects the exact code. For a manual update, find the code commit for the intended upstream release, review its changes, then update both workflows' SHA and version comments.

Git tags have two forms: a lightweight tag points directly to a commit; an annotated tag points to a tag object that in turn identifies the commit. “Dereference” means follow that extra pointer to the code commit, rather than accidentally pinning the tag object's ID. For example, this read-only command queries upstream without changing the local repository:

```text
git ls-remote --tags https://github.com/actions/checkout.git 'refs/tags/v7.0.1' 'refs/tags/v7.0.1^{}'
```

If a `^{}` row appears, use its commit SHA; otherwise use the direct tag row for a lightweight release tag. Confirm it matches the intended release on upstream GitHub. Repeat with `actions/setup-node` and its intended tag. See [Git's tag dereferencing documentation](https://git-scm.com/docs/git-ls-remote). Pinning prevents silent changes from movable tags but does not prove the selected code is safe.

`.github/dependabot.yml` schedules monthly GitHub Actions version checks and groups minor/patch updates into one PR; major upgrades remain separate. Dependabot preserves SHA pins and updates release comments; verify this in each PR. Security-alert and security-update settings are separate; verify them during [initial setup](first-deployment.md). See [GitHub's Dependabot options](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference) and [secure Action use](https://docs.github.com/en/actions/reference/security/secure-use).

## Initial setup

Use the [first-deployment checklist](first-deployment.md) for one-time GitHub settings and deployment commissioning. Keep its completion status separate from the ongoing operating instructions above.
