# DDIA Companion

A study companion for *Designing Data-Intensive Applications, 2nd edition*
(Martin Kleppmann & Chris Riccomini). Every chapter of the book retold as a
comprehensive, beginner-friendly summary — every section covered, nothing
skipped — plus key takeaways, hand-picked external references, and an
interactive practice section (flashcards, quizzes, design scenarios) with
progress saved in your browser.

Independent study notes; not affiliated with the authors or O'Reilly.
[Buy the book](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/) —
it's worth every page.

## Stack

- [Astro 6](https://astro.build) static site, MDX content collections with
  zod-validated schemas (`src/content.config.ts`)
- [Pagefind](https://pagefind.app) full-text search (⌘K), indexed at build time
- Zero-framework interactivity: vanilla TypeScript custom elements
  (`src/scripts/`) with `localStorage` progress
- Light/dark theme via CSS custom properties (`src/styles/tokens.css`),
  no flash of wrong theme
- Custom inline-SVG diagrams that adapt to both themes
  (`src/components/diagrams/`)

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `dist/` + Pagefind index |
| `npm run preview` | Preview the production build |
| `npm run check` | Type + content-schema validation |
| `npm run search:dev` | Build a search index usable in `astro dev` |

## Deploying

Static output — zero-config on Vercel (framework preset: Astro) and Netlify
(`netlify.toml` included). The Pagefind indexing step rides inside
`npm run build`, so no platform hooks are needed.

## Content pipeline

Chapter content lives in `src/content/` (one MDX file + flashcards/quiz/
assignments YAML per chapter, joined by filename). `CONTENT_GUIDE.md` is the
authoring contract; schema violations fail the build. `tools/extract_chapter.py`
extracts source text from a local PDF of the book for authoring reference
(extracted text is gitignored and never committed).
