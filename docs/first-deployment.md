# Initial setup record and protection checks

Use [maintenance](maintenance.md) for ongoing operations and [CONTRIBUTING.md](../CONTRIBUTING.md) for routine PRs. Completed infrastructure below is maintainer-confirmed as of 2026-11-27; it was not repeated or changed by the production-configuration update.

## Completed setup

- [x] GitHub Actions successfully deployed `wilfrid-net` from `main`; the site is live at `https://wilfrid.net/`.
- [x] GitHub environment `production` contains the existing `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `CONTACT_EMAIL` secrets.
- [x] DNS moved to Cloudflare and DNSSEC migration completed; OVHcloud remains the registrar.
- [x] The apex Custom Domain was attached manually to the existing Worker; the legacy OVHcloud parking A record was removed.
- [x] A Cloudflare Redirect Rule permanently redirects `www` to the apex, retaining paths and queries.
- [x] The account-wide Workers subdomain was changed to `wilfrid-apps`.

Do not repeat domain setup. Production URL policy and verification after the next deployment are documented in [maintenance](maintenance.md#production-domain-and-deployment-validation). PR previews and staging remain [deferred](../TODO.md#deferred-cicd-improvements).

## Owner checks to retain

Successful deployment does not verify token least privilege or GitHub protection settings. The following settings were not inspected remotely during this update; keep this checklist for owner verification rather than treating first deployment as pending.

1. **Inspect the existing Cloudflare token and destination.** Preserve the existing secrets. Verify the token is limited to the intended account and required **Workers Scripts: Edit** permission for this assets deployment. Domain and DNS administration remain outside CI/CD; do not add DNS, zone, D1, or Workers Routes write access for these URL flags. See [deployment validation](maintenance.md#production-domain-and-deployment-validation) and [security notes](../SECURITY.md#credentials-and-incidents).
2. **Settings → Actions → General.** Verify Actions are allowed and policy permits the SHA-pinned official checkout/setup-node Actions. Set default workflow token permissions to read-only repository contents and packages. Disable Actions creating and approving PRs unless needed. Avoid sending write tokens or secrets to untrusted fork PRs. Fork policies can require a maintainer to approve the first CI run.
3. **Settings → Environments → production.** Preserve the existing environment, all three secrets, and protection rules. Restrict deployment branches/tags to the branch `main`, where the plan supports it. Retain existing approvals; no new approval requirement is needed for this solo site.
4. **Settings → Security → Advanced Security / Code security** (label varies by plan). Enable or verify the dependency graph, Dependabot alerts, and Dependabot security updates. The monthly Actions schedule is version maintenance, not a replacement for security updates.
5. **After reviewing the local changes, commit them on a feature branch, push, and open a PR targeting `main`.** Wait for the `CI` workflow's `validate` job to pass. GitHub must have seen the check run before it can reliably be selected in a ruleset; do not guess its displayed check name.
6. **Settings → Rules → Rulesets.** Create or update an active branch ruleset targeting `main`. Require PRs and the exact check displayed for `CI` / `validate` after that run; select GitHub Actions as the expected source where available. Use zero required approving reviews where supported for a sole developer. Block force pushes, restrict deletions, and avoid unnecessary bypass permissions. Verify enforcement and plan support rather than assuming the ruleset is active.
7. **Settings → General → Pull Requests.** Prefer squash merging and automatically delete merged feature branches. Merge a passing PR only when ready: that push to `main` triggers a production update, subject to existing environment protections.
8. **Inspect Actions → Deploy after merging.** Verify install/check/build/deploy success and the checked-out commit, then follow the [production verification steps](maintenance.md#production-domain-and-deployment-validation). Local validation cannot prove remote permissions or routing.
