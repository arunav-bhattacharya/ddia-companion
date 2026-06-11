# Content Guide — DDIA Companion chapters

The contract every chapter must follow. Chapter 2
(`src/content/chapters/02-defining-nonfunctional-requirements.mdx` and its
sibling YAML files) is the canonical exemplar — when in doubt, imitate it.

## Files per chapter (identical basename = the join key)

| File | Purpose |
|---|---|
| `src/content/chapters/<slug>.mdx` | The summary prose |
| `src/content/flashcards/<slug>.yaml` | 12–20 flashcards |
| `src/content/quizzes/<slug>.yaml` | 8–12 multiple-choice questions |
| `src/content/assignments/<slug>.yaml` | 2–3 scenario assignments |
| `src/components/diagrams/chNN/*.astro` | 3–6 SVG diagram components |

Slugs (use exactly): `01-trade-offs-in-data-systems-architecture`,
`02-defining-nonfunctional-requirements`, `03-data-models-and-query-languages`,
`04-storage-and-retrieval`, `05-encoding-and-evolution`, `06-replication`,
`07-sharding`, `08-transactions`, `09-the-trouble-with-distributed-systems`,
`10-consistency-and-consensus`, `11-batch-processing`, `12-stream-processing`,
`13-a-philosophy-of-streaming-systems`, `14-doing-the-right-thing`.

## Hard rules (build-enforced by zod schemas in src/content.config.ts)

- Frontmatter: `title`, `chapter` (number), `description` (80–220 chars),
  `readingMinutes`, `keyTakeaways` (6–12 strings, each ≥40 chars),
  `references` (4–10 items: title, url, type ∈ article|video|course|paper|docs,
  optional author, note 20–300 chars).
- Flashcard ids `chNN-fNN`, quiz ids `chNN-qNN`, assignment ids `chNN-aNN`
  (two digits, e.g. `ch04-f01`). Quiz: exactly 4 options, `answerIndex` 0–3,
  `explanation` ≥30 chars (explain WHY, 1–3 sentences). Assignments: `title`,
  `scenario` (≥100 chars), `tasks` (2–4), optional `hints`, `modelAnswer` (≥200 chars).
- YAML conventions: block scalars (`|`) for any multi-sentence field; quoted
  strings for prompts containing colons. Multi-paragraph scenario/modelAnswer =
  paragraphs separated by blank lines (rendered as `<p>`s; no markdown).

## Prose rules

- **Coverage is non-negotiable.** Every section and subsection of the book
  chapter (the assigned section list) must be taught — including sidebars/boxes.
  H2s mirror the book's top-level section headings (you may shorten, never skip).
  Sidebars become `<Callout>`s.
- **Original prose only.** You are teaching the ideas, never reproducing the
  book's text. Numbers, named systems, and examples may be reused as facts;
  sentences may not. Cite no page numbers.
- 4,000–6,000 words. Open with 1–2 paragraphs framing the chapter's core
  question in plain language (no heading before it). Close the prose body with
  a short forward-looking Callout (see exemplar's "Where this chapter points").
- **Beginner-first, no topic skipped.** Every hard concept gets either a
  concrete analogy, a worked example with real numbers, or a diagram. Define
  jargon at first use in bold. Advanced topics are explained, not waved at.
- Code blocks where the book uses them (SQL, JSON, etc.) — short and original.
- Use components sparingly and purposefully:
  - `<Callout type="note|insight|warning|example" title="...">` — sidebars,
    traps, aha-moments. 3–7 per chapter.
  - Tables for genuine comparisons (e.g. B-tree vs LSM) — never as filler.
- readingMinutes ≈ wordcount / 200, rounded to nearest minute.

### Voice (the anti-AI-slop rules)

- Write like a sharp colleague explaining at a whiteboard: direct address
  ("you"), concrete nouns, occasional dry humor. See the pizza-shop percentile
  passage in the exemplar for register.
- Vary paragraph length; let some be one sentence. Prefer prose to bullets —
  use lists only when items are genuinely parallel and ≥3.
- Banned: "delve", "crucial", "leverage" (verb), "it's important to note",
  "in the world of", "landscape", "robust" (unless quoting), "game-changer",
  em-dash chains in every paragraph, starting >2 sections with "Imagine",
  rhetorical-question openers in >2 sections, identical paragraph rhythms,
  bullet-only sections, emoji.
- Never summarize the summary ("In this section we learned..."). The chapter's
  Summary section in the book becomes your keyTakeaways frontmatter, not prose.

## Diagrams

- 3–6 per chapter as `.astro` components in `src/components/diagrams/chNN/`,
  PascalCase names. Import in MDX after frontmatter, use as `<Name />`.
- Every diagram: wrap in the shared frame
  `import Diagram from '../Diagram.astro'` with a `caption` prop (full
  sentence). Add `wide` prop only for genuinely wide comparisons.
- SVG rules: `viewBox` only (no width/height attrs), text ≥11 font-size,
  stroke-width 1.5 for primary lines, `<title id>` + `aria-labelledby`.
- **Paint ONLY with**: `currentColor`, `var(--diagram-stroke)`,
  `var(--diagram-fill)`, `var(--diagram-accent)`, `var(--diagram-muted)`,
  `var(--bg)`. Hardcoded hex/rgb/named colors are banned and grep-checked.
- One visual dialect: rounded rects (rx 4–8), sans labels, accent color for
  the one thing the diagram is *about*, muted for annotations.

## References

- Use the verified references JSON for your chapter at
  `tools/research/chNN-refs.json` (already URL-verified). Pick 4–10, keep the
  best mix of types. The `note` says what the reader gets that this summary
  doesn't — one specific sentence, not marketing copy.

## Flashcards / quiz / assignments

- Flashcards: front = one precise question (or "X vs Y — distinction?"),
  back ≤ ~60 words. Cover the chapter's full breadth, not just the start.
- Quiz: test understanding, not recall of trivia. ≥4 questions should be
  scenario-shaped ("Your service does X... what happens?"). Wrong options must
  be plausible misconceptions. Explanation teaches why right is right AND why
  the tempting wrong one is wrong.
- Assignments: realistic design scenarios with constraints and numbers, 2–4
  tasks, hints optional, model answer 150–300 words that *applies* chapter
  concepts by name. Vary the industries (don't make every scenario a social
  network).

## Term links

Optionally link first-use of glossary terms:
`import Term from '../../components/mdx/Term.astro'` then
`<Term id="lsm-tree">LSM-tree</Term>`. Valid ids are in
`src/content/glossary/terms.yaml`. Use ≤8 per chapter.
