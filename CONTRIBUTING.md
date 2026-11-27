# Contributing

Use a short-lived feature branch and a pull request targeting `main`. No permanent `develop` branch is needed.

1. Follow [local setup](docs/maintenance.md#local-development) and [AGENTS.md](AGENTS.md).
2. Make the change on your feature branch.
3. Run `npm.cmd run check` and `npm.cmd run build`. Review applicable documentation, including the changelog, and update it with the change.
4. Open a PR describing the problem, resulting behavior, and validation. Review code, workflow, dependency, and generated-asset changes before merging. The `CI` workflow's `validate` job must pass; enforcing it as a required check needs the [initial GitHub setup](docs/first-deployment.md).
5. Squash merge into `main` when ready to publish. The resulting push triggers production validation, a build, and Cloudflare deployment, subject to existing environment protections. Delete the merged feature branch.

CI validates the build but does not publish a staging site or PR preview URL. Inspect the feature branch locally using the development server; staging remains [deferred](docs/architecture.md#future-staging).

Keep `.env`, credentials, and logs out of commits. See [email setup](docs/maintenance.md#configuring-email-without-committing-it) and [security notes](SECURITY.md).
