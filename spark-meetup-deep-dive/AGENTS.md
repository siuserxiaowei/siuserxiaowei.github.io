# Spark Meetup Deep-Dive Project Protocol

## Goal

Produce a self-contained Chinese learning report for people who did not attend the Spark meetup. Reconstruct the meeting from the supplied transcript, correct transcription noise conservatively, add evidence-backed external research, and analyze it through 道、法、术、器、势.

## Evidence rules

- The user-supplied transcript is the primary source for what was said at the event.
- Never convert a speaker's claim into an independently verified fact without external support.
- Label uncertain speaker identities, product names, dates, and revenue figures.
- External claims must include a public URL, access date, source type, and a short support note.
- Prefer primary sources: official sites, founder posts, product pages, original research, and platform documentation.
- Search snippets are discovery leads, not final evidence.
- Separate: verified fact, speaker self-report, evidence-backed inference, and editorial interpretation.

## Writing rules

- Write natural Chinese for an intelligent general audience.
- Lead each section with the conclusion, then evidence, limits, and implications.
- Preserve useful disagreement: identify where Marcus's method works and where it may fail.
- Avoid motivational filler and universal claims based on one survivor story.
- Do not quote the noisy transcript verbatim unless the wording can be reconstructed with high confidence.

## File ownership

- `modules/timeline.md`: event reconstruction and timestamp-level analysis.
- `modules/entity_factcheck.md`: people, products, dates, numbers, and correction ledger.
- `modules/strategy_research.md`: external research and claim validation.
- `modules/dao-fa-shu-qi-shi.md`: framework analysis, counterpoints, and action system.
- `research/`: query, source, evidence, and gap ledgers.
- `REPORT.md`: integrated final deliverable, owned by the root agent.
- `REPORT.en.md`: English translation of `REPORT.md`, built to `en/index.html`; keep structure, heading count, and relative links in sync with the Chinese report.
- `site/template.html` / `site/template.en.html`: page shells for the Chinese and English pages; both are rendered by `scripts/build-site.sh`.

Multiple agents work in separate worktrees. Do not revert others' edits. Commit only owned files.

## Completion gate

- The full 00:00–01:29:22 timeline is covered without pretending every noisy sentence is meaningful.
- Central claims have evidence status and caveats.
- The report includes a practical 7-day and 30-day learning/action plan.
- All links, filenames, tables, and key numbers are checked before delivery.
