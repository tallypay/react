# Contributing to @tallypay/react

This repository is a **read-only mirror**. The canonical source is the TallyPay monorepo, which contains `@tallypay/react` alongside `@tallypay/server`, `@tallypay/react`, and the rest of the platform.

## Reporting bugs and requesting features

Open an issue here and we'll triage it. Please use the bug-report template under `.github/ISSUE_TEMPLATE/`.

## Submitting code changes

You have two options — both are welcome:

1. **Open a PR against this repo.** We'll port the patch to the monorepo, attribute you in the merge commit, and the next sync will publish it back here. There may be a short delay.
2. **Skip the round-trip and open an issue** describing the change you'd make. If it's well-scoped we can land it directly upstream and credit you in the changelog.

## Why a mirror?

`@tallypay/react` is developed alongside `@tallypay/server`, `@tallypay/react`, and the dashboard / collector. Cross-package changes (shared types, refactors, test plumbing) are routine, so a single source repo keeps refactors atomic and avoids dependency pinball.

## Local dev

This mirror is publish-ready: clone, `npm install`, run `npm test`. For full cross-package development clone the upstream monorepo instead.

## License

By contributing, you agree that your contributions will be licensed under the MIT License — see [`LICENSE`](./LICENSE).
