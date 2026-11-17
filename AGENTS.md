## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Development philosophy

- Prefer simple solutions that are easy to understand and maintain.
- Use clear names and keep short explanations next to non-obvious code or configuration so the reasoning can be shared.
- Record lasting decisions briefly in the relevant `docs/` file.
- Treat performance as a design goal: avoid unnecessary runtime code, dependencies, network requests, and asset weight.

## Documentation

Keep explanations close to non-obvious code and configuration. Record durable
decisions briefly in `docs/architecture.md` and maintenance details in
`docs/maintenance.md`. Update notes when behavior changes, especially when a
generated file, asset, or deployment setting is involved. Prefer plain language
that helps a future reader understand why each part exists.

This site is currently prerendered and is not deployed by ordinary build work.
Do not edit `package-lock.json` or `worker-configuration.d.ts` by hand. Update
the social card PNG when changing its SVG source. Do not commit `.env` or logs.

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
