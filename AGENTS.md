# AGENTS.md

## Project

The E-value Bibliography is a public static Vite + React website. It contains accepted bibliography
records and public contribution forms. Private editorial review, voting data, submission data,
secrets, and automated discovery belong in the separate `bibliography-operations` repository and
must not be added here.

## Commands

```bash
npm run dev
npm run test
npm run lint
npm run format:check
npm run build
```

The production site is written to `dist/client`. On GitHub Actions, Vite uses the
`/e-value-bibliography/` base path.

## Data flow

```text
papers/*.yml → scripts/composeData.js → public/papers.json → usePapersData → React components
```

Do not edit `public/papers.json` directly; it is generated. One accepted work corresponds to one
YAML file in `papers/`.

## Contribution forms

`VITE_INTAKE_API_URL` is a public server URL, never a secret. The browser may send untrusted text to
that endpoint. Do not fetch submitted URLs or process submitted content in the static site.

## Code structure

- `src/components/` — shared UI and paper cards
- `src/pages/` — public routes
- `src/hooks/` — data and filtering hooks
- `src/utils/` — formatting, graph, search, and export utilities
- `public/content/` — About, Books, History, and privacy content
- `papers/` — accepted bibliography records

`@` maps to `src/` in `vite.config.js`.
