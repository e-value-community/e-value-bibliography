# The E-value Bibliography

A curated, searchable bibliography covering e-values, e-processes, e-detectors, confidence
sequences, multiple testing, post-hoc inference, and related methods and applications. AI-assisted
searches help identify papers and update metadata; members of the e-value community contribute
papers, corrections, and scientific judgment.

The public repository contains the bibliography and general website only. Editorial review,
candidate screening, and automation run separately in a private operations repository.

The site's architecture is based on the
[Algorithms with Predictions website](https://github.com/algorithms-with-predictions/algorithms-with-predictions.github.io).
Its original MIT copyright notice is retained in `LICENSE`.

## Local development

Requirements: Node.js 18 or newer and npm 8 or newer.

```bash
npm ci
npm test
npm run build
npm run dev
```

The development server runs at `http://localhost:3000`. Production files are written to
`dist/client`.

## Paper data

Each accepted paper is stored as a human-readable YAML file in `papers/`. The build creates the
static catalogue used by the website:

```text
papers/*.yml → scripts/composeData.js → public/papers.json → React website
```

Important metadata fields include:

```yaml
title: Example paper on e-values
authors: Ada Researcher, Ben Statistician
year: 2026
doi: 10.1000/example
arxiv: '2601.00001'
database_added: '2026-10-19'
database_updated: '2026-10-21'
abstract: The formal abstract reproduced from the linked source.
abstract_status: source_abstract
abstract_source: https://doi.org/10.1000/example
labels:
  - e-values
  - theory
publications:
  - name: Journal of Examples
    year: 2026
    url: https://doi.org/10.1000/example
```

`database_added` records when the work first entered the bibliography. `database_updated` advances
only when its record changes materially. Every abstract must identify its source and provenance; the
build rejects curator- or AI-written substitutes.

## Contributions

The website's **Contribute** page accepts paper suggestions, historical-paper suggestions, and
general corrections. The per-paper edit button carries the paper's identifiers into the suggestion.
These forms send suggestions to a separate intake service for private editorial review; nothing is
added to the bibliography automatically.

The public browser bundle contains only the intake service URL. It must never contain credentials or
private review data. Set `VITE_INTAKE_API_URL` to the public intake endpoint when deploying.

## GitHub Pages

The workflow builds and tests every pull request. It deploys `dist/client` only after the repository
is made public, so the private preparation repository does not publish a Pages site accidentally.
The project path is configured for:

```text
https://e-value-community.github.io/e-value-bibliography/
```

## License

MIT. The original copyright notice is retained in `LICENSE` as required.
