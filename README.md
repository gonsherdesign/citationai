# CitationAI

CitationAI is a speculative design project that helps scholars build a transparent record of how they used AI in their research. Paste (or link to) a conversation, fill in who was involved and when, and get a ready-to-use citation — in a standard academic style or your own custom set of fields — so reviewers, students, and future readers can see exactly what was asked and what came back.

It's a single, dependency-free static page. There's no server, no database, no account, and no data collection — everything runs in the visitor's browser except the one link-hosting step the user chooses themselves.

**Live site:** add your GitHub Pages URL here once it's deployed (`https://<your-username>.github.io/citation-ai/`)

## Why this exists

There is no established mechanism in scholarly work for citing an AI agent in a way that preserves a record of how it was produced. There is no single, universally adopted citation standard that fully preserves an AI agent's data — including identity, configuration, inputs, chain of thought, and other outputs — so that another researcher can reconstruct exactly how the reference was produced. CitationAI is a beta prototype built to validate the concept and to solicit feedback on emerging best practices around agentic collaboration in scholarly work. The full project statement is on the live page itself, under "About this project."

## How it works

1. **Paste chatbot text** (optional) — used to suggest a citation name automatically and, if automatic hosting is enabled, to generate a hosted copy.
2. **Link your AI record** — either paste a link you already have (your AI platform's own "Share" link, or a link to a copy you've hosted elsewhere), or use "Upload & host automatically" once that feature is configured (see below; it ships as "not yet implemented" until you wire up a backend).
3. **Add the details** — chatbot/agent name, model/version, date, author, a name for the citation (defaults to the first five words of the pasted text), and a citation number.
4. **Choose your citation format** — a standard style (APA, MLA, Chicago, Harvard, Vancouver, IEEE), or pick your own fields to include. Optionally add a "CitationAI locator" — a short, DOI-like identifier such as `Claude, citation #1, 2026` — which is appended to the reference citation and also used as the in-text citation.
5. The page outputs both a **reference-list citation** and an **in-text citation**, each with its own copy button.

## "Upload & host automatically" — not yet implemented by default

This deployment ships with that option showing a **"Not yet implemented"** badge — visitors can still preview how it will behave via "Try demo mode," but no real upload happens until you configure a backend. Once you do (see below), the badge and demo-mode note disappear on their own and the option becomes fully functional — nothing else needs to change.

**What it does once configured:** receives the record from the page and commits it to a dedicated GitHub repo using a token only the backend holds — the static page itself never has a write credential, which is what keeps this safe to run publicly.

**Setup:**

1. Create a **second, separate** public GitHub repo just for storing records, e.g. `citationai-transcripts` (keep it separate from this app's repo).
2. On GitHub, create a **fine-grained personal access token** at [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new), scoped to **only** that repo, with **Contents: Read and write** permission and nothing else.
3. Sign up for [Cloudflare Workers](https://workers.cloudflare.com) (free tier — no card required for this usage level) and install Wrangler: `npm install -g wrangler`
4. From `/worker`, run:
   ```bash
   wrangler login
   wrangler secret put GITHUB_TOKEN     # paste the token from step 2
   wrangler secret put GITHUB_REPO      # e.g. your-username/citationai-transcripts
   wrangler deploy
   ```
5. Wrangler prints your Worker's URL (something like `https://citationai-worker.<you>.workers.dev`). Open `citationai-worker.js` and set `ALLOWED_ORIGIN` to your actual GitHub Pages URL, then redeploy (`wrangler deploy`) so only your site can call it.
6. In `index.html`, find `const STORAGE_ENDPOINT = "";` near the top of the script and set it to that Worker URL. Commit and push — the site now stores records automatically, and the "not yet implemented" badge disappears.

## Alternative ways to make a link permanent, if you're not using automatic hosting

If a visitor doesn't have a platform share link and doesn't want to wait for automatic hosting, they can host a copy themselves and paste that link into "Paste a link" instead:

- **GitHub + Software Heritage** — commit the file to any public repo, then archive it at [archive.softwareheritage.org/save](https://archive.softwareheritage.org/save/) (a nonprofit archive backed by Inria and UNESCO) for a permanent, content-addressed identifier (SWHID).
- **Arweave**, via [ArDrive](https://ardrive.io) — a small one-time fee per file, kept indefinitely.
- **IPFS**, via a free pinning tier like [Filebase](https://filebase.com) or [4EVERLAND](https://4everland.org) (5 GB free).
- **OpenTimestamps** — optional, anchors a file's fingerprint in the Bitcoin blockchain as independent proof of when it existed.

## Running it locally

There's no build step. Clone the repo and open `index.html` in a browser, or serve it locally:

```bash
git clone https://github.com/<your-username>/citation-ai.git
cd citation-ai
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying with GitHub Pages

1. Push this repo to GitHub (or use the web UI's "uploading an existing file").
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch."
4. Set **Branch** to `main` and folder to `/ (root)`. If the change doesn't seem to trigger a build, switch Branch to "None," then back to `main` — that reliably forces a rebuild.
5. GitHub will publish it at `https://<your-username>.github.io/citation-ai/` within a minute or two. Check the repo's **Actions** tab for build status.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Some concrete ideas if you're looking for a place to start:

- Additional citation styles (AAA, ASA, and other field-specific formats)
- Auto-triggering the Software Heritage save API and polling for the SWHID once archival completes
- Support for reading common export formats from specific AI platforms
- Accessibility and internationalization improvements
- Design work on the open questions raised in "About this project" on the live page — adoption by journals, what data is worth retaining, hosting vs. linking, and data ownership

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, self-host it, build on it.
