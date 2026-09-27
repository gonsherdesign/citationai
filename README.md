# CitationAI

CitationAI is a speculative design project — a free, open-source scholarly tool for creating citations for AI agents. Share a link to a conversation, fill in who was involved and when, and get a ready-to-use citation — in a standard academic style or your own custom format — so reviewers, students, and future readers can see exactly what was asked and what came back.

It's a single, dependency-free static page. There's no server, no database, no account, and no data collection — everything runs in the visitor's browser.

**Live site:** add your GitHub Pages URL here once it's deployed (`https://<your-username>.github.io/citation-ai/`)

## Why this exists

There is no universal mechanism in scholarly work for citing an AI agent in a way that preserves a full record of how it was produced — no established convention for a citation style that captures an agent's identity, configuration, inputs, chain of thought, and other outputs well enough for another researcher to reconstruct exactly how the reference was produced. CitationAI is a beta prototype built to validate the concept and solicit feedback on emerging best practices around agentic collaboration in scholarly work. The full project statement is on the live page itself, under "About this project."

## How it works

1. **Share your agent citation** — paste a link to the conversation (your AI platform's own "Share" button output, or a link to a copy you've hosted elsewhere). Quick-launch buttons are provided for ChatGPT, Claude, Gemini, Grok, and Copilot to make it easy to go grab that link.
2. **Choose your citation format** — pick a style (APA, MLA, Chicago, Harvard, Vancouver, IEEE, or **No style**). Chatbot, date, author, and citation name are used by every style, so they're always shown. Two fields only appear for the styles that actually use them: **Accessed date** (Harvard and Vancouver, which cite a separate access date from the conversation date) and **Citation number** (Vancouver and IEEE, which are numbered styles). Comments, model/version, and the "I edited this" note are specific to **No style**, along with a checkbox on every field so you can choose exactly what's included.

The tool always outputs two things: a **reference-list citation** (styled per your choice, always ending with the link) and an **in-text citation** in the form `[Chatbot, citation number, year]` — e.g. `[Claude, 1, 2026]` — regardless of which reference style you picked.

## Making a link permanent

If a visitor doesn't have a platform share link, they can host a copy themselves and paste that link into step 1 instead:

- **GitHub + Software Heritage** — commit a file to any public repo, then archive it at [archive.softwareheritage.org/save](https://archive.softwareheritage.org/save/) for a permanent, content-addressed identifier (SWHID).
- **Arweave**, via [ArDrive](https://ardrive.io) — a small one-time fee per file, kept indefinitely.
- **IPFS**, via a free pinning tier like [Filebase](https://filebase.com) or [4EVERLAND](https://4everland.org) (5 GB free).
- **OpenTimestamps** — anchors a file's fingerprint in the Bitcoin blockchain as independent proof of when it existed.

## Running it locally

There's no build step. Clone the repo and open `index.html` in a browser, or serve it locally:

```bash
git clone https://github.com/<your-username>/citation-ai.git
cd citation-ai
python3 -m http.server 8000
```

## Deploying with GitHub Pages

1. Push this repo to GitHub (or use the web UI's "uploading an existing file").
2. **Settings → Pages** → **Source**: Deploy from a branch → **Branch**: `main` / `/ (root)`.
3. If it doesn't trigger a build, switch Branch to "None," then back to `main` — that reliably forces a rebuild.
4. Check the **Actions** tab for build status; the site publishes at `https://<your-username>.github.io/citation-ai/`.

## Design

Black background, square-cornered controls throughout, set in Helvetica Neue Bold (headers) and Calibri (body) — system fonts, with graceful fallbacks on systems that don't have them installed.

## Social share preview (Facebook, Twitter/X, LinkedIn, Slack, etc.)

`og-image.png` (1200×630) is the thumbnail shown when this link is shared. It's referenced in `index.html`'s `<head>` via Open Graph and Twitter Card meta tags, pointing to `https://gonsherdesign.github.io/citationai/og-image.png`. If your repo name or username differs, update the `og:image`, `og:url`, and `twitter:image` URLs in `index.html` to match. After deploying, use Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) to fetch and preview the card — Facebook caches old previews aggressively, so re-run the debugger any time you change the image or the meta tags.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Some concrete ideas:

- Additional citation styles (AAA, ASA, and other field-specific formats)
- Automatic hosting of transcripts (a prior iteration explored a serverless backend for this; removed for now in favor of the simpler share-link flow)
- Accessibility and internationalization improvements
- Design work on the open questions raised in "About this project" on the live page

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, self-host it, build on it.
