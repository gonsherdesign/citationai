# Contributing to CitationAI

Thanks for considering it. This is a small, single-file static site on purpose — keep changes simple and dependency-free where you can.

## Ground rules

- **No build step.** Everything lives in `index.html` (HTML, CSS, and JS in one file). If a change genuinely needs more structure, open an issue first to discuss splitting files.
- **No tracking, no analytics, no external calls with user data.** Transcripts a visitor pastes in should never leave their browser. Any new feature that would send data somewhere needs to say so clearly in the UI, opt-in, not by default.
- **Cite your sources.** If you're adding or changing a citation format, link to the style guide's actual documentation in the pull request description so it can be checked.

## Making a change

1. Fork the repo and create a branch: `git checkout -b add-vancouver-style`
2. Make your change in `index.html`.
3. Open `index.html` directly in a browser and click through the whole flow — paste a transcript, fill in details, generate, check every citation tab — before opening a PR.
4. Open a pull request describing what changed and why.

## Good first contributions

- A new citation style (add a tab, a date formatter if needed, and a branch in `renderCitation()`)
- Copy edits to the instructions or descriptions
- Accessibility fixes (keyboard navigation, screen-reader labels, contrast)
- A translation of the UI text

## Reporting a bug

Open an issue with what you did, what you expected, and what happened instead. A copy of the (non-sensitive) transcript metadata you used helps a lot.
