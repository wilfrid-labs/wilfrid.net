# Security notes

## Deployment trust and remaining risks

Production installation, checks, build, and deployment share one temporary GitHub-hosted runner. A compromised npm install/build dependency could modify Wrangler or leave a background process running, then capture Cloudflare credentials when the deploy step receives them. Step-scoped secrets reduce routine exposure but do not isolate processes. This is the [one production job trade-off](docs/architecture.md#cicd-design-decisions).

PR validation runs separately without production secrets. Keep its unprivileged `pull_request` trigger, review workflow/dependency changes, protect `main`, and restrict the production environment to that branch. Someone able to modify trusted workflow code can also modify its guard.

Both workflows request read-only `contents` permission and disable persisted checkout credentials. GitHub's short-lived `GITHUB_TOKEN` is separate from Cloudflare credentials and is not explicitly passed to build/deploy scripts; Actions can still access it through GitHub's runtime context. No PAT, write token permissions, or OIDC access is requested.

Action SHA pins prevent tag movement; lockfile integrity checks detect altered package downloads. Neither proves code is safe. GitHub's runners/Actions, trusted repository code, npm dependencies, and Wrangler remain trusted. See [GitHub's security guidance](https://docs.github.com/en/actions/reference/security/secure-use).

The [isolation follow-up](TODO.md#ideas-to-explore) evaluates fresh build/deploy runners. It must verify artifact source commit and contents, minimize deploy-time dependency installation/code execution, and document remaining tooling risks. Separating jobs alone does not make a malicious build safe.

## Credentials and incidents

Scope the Cloudflare token to the intended account and required permissions. Rotate it periodically and after suspected exposure: replace the existing environment secret and revoke the old token. Treat incident logs and generated files as potentially sensitive.

Secret names and GitHub settings paths are configuration metadata: documenting them does not reveal values or grant access. Publish only necessary metadata, never actual tokens, account IDs, personal addresses, or sensitive logs. Protect repository/environment access, account security, and workflow code.

See [secret configuration](docs/maintenance.md#existing-environment-secrets) for step scopes and [initial setup](docs/first-deployment.md) for repository protections. Email obfuscation is explained in [maintenance](docs/maintenance.md#configuring-email-without-committing-it).

## Reporting a concern

Private vulnerability reporting is enabled, as confirmed by the maintainer. Use [Report a vulnerability](https://github.com/wilfrid-labs/wilfrid.net/security/advisories/new) (**Security → Advisories → Report a vulnerability**). Include affected behavior, reproduction steps, and likely impact; remove credentials and personal information. Keep exploitable details out of public issues/PRs. No formal response time is promised.
