# CitationAI

CitationAI helps scholars build a transparent, permanent record of how they used AI in their research. Paste a conversation and it generates a ready-to-use citation — chatbot name, date, author, and paper title, linked to a fingerprinted copy of the full exchange — so reviewers, students, and future readers can see exactly what was asked and what came back.

It's a single, dependency-free static page. There's no server, no database, no account, and no data collection — everything runs in the visitor's browser.

**Live site:** add your GitHub Pages URL here once it's deployed (`https://<your-username>.github.io/citation-ai/`)

## Why this exists

As AI tools become part of the research process, "I used ChatGPT for this" isn't a citation — and a screenshot isn't a permanent record. CitationAI gives scholars a fast way to do both properly: a real formatted citation, and a durable, independently verifiable copy of the conversation it points to.

## How it works

1. Paste or upload the conversation.
2. Fill in the AI tool, model/version, date, and a short description.
3. The page computes a SHA-256 fingerprint of the transcript and lets you download it as a manifest file.
4. You put that file somewhere permanent (the page walks through free options — see below) and paste the resulting link back in.
5. The citation updates live with that link, in whichever style you need.

## Making the transcript permanently accessible

The app doesn't host your transcripts for you — that would mean CitationAI itself becoming a single point of failure, which defeats the point. Instead it points you to independent ways to do it yourself. No storage anywhere is genuinely both unlimited and free forever — someone always pays for disks and bandwidth — but for text transcripts (a few KB to a few hundred KB each) one option comes close in practice:

- **Recommended: GitHub + Software Heritage.** GitHub doesn't charge for public repo storage and allows unlimited public repos, so committing transcripts never really hits a wall — a single 1 GB repo holds thousands of them, and starting a new repo costs nothing. Archive the repo at [archive.softwareheritage.org/save](https://archive.softwareheritage.org/save/) — a nonprofit archive backed by Inria and UNESCO with no user storage quota — for a permanent, content-addressed identifier (SWHID) that survives even if the repo is later deleted.
- **Arweave**, via [ArDrive](https://ardrive.io) — a real, small, one-time fee per file, kept indefinitely. Not free, but cheap and non-recurring.
- **IPFS**, via a free pinning tier like [Filebase](https://filebase.com) or [4EVERLAND](https://4everland.org) — genuinely free, but genuinely capped at 5 GB.
- **OpenTimestamps** — optional, stacks on top of any of the above to anchor the file's fingerprint in the Bitcoin blockchain as independent proof of when it existed.

## Optional: fully automatic storage (no manual link-pasting)

By default, visitors get the manual flow: download the manifest, upload it themselves, paste the link back in. That works out of the box with zero setup. If you'd rather the page store transcripts automatically and fill in the link for you, there's a small backend for that in `/worker`.

**What it does:** receives the transcript from the page and commits it to a dedicated GitHub repo using a token only the backend holds — the static page itself never has a write credential, which is what keeps this safe to run publicly.

**Setup:**

1. Create a **second, separate** public GitHub repo just for storing transcripts, e.g. `citationai-transcripts` (keep it separate from this app's repo).
2. On GitHub, create a **fine-grained personal access token** (Settings → Developer settings → Fine-grained tokens) scoped to **only** that repo, with **Contents: Read and write** permission and nothing else.
3. Sign up for [Cloudflare Workers](https://workers.cloudflare.com) (free tier — no card required for this usage level) and install Wrangler: `npm install -g wrangler`
4. From `/worker`, run:
   ```bash
   wrangler login
   wrangler secret put GITHUB_TOKEN     # paste the token from step 2
   wrangler secret put GITHUB_REPO      # e.g. your-username/citationai-transcripts
   wrangler deploy
   ```
5. Wrangler prints your Worker's URL (something like `https://citationai-worker.<you>.workers.dev`). Open `citationai-worker.js` and set `ALLOWED_ORIGIN` to your actual GitHub Pages URL, then redeploy (`wrangler deploy`) so only your site can call it.
6. In `index.html`, find `const STORAGE_ENDPOINT = "";` near the top of the script and set it to that Worker URL. Commit and push — the site now stores transcripts automatically.

Leave `STORAGE_ENDPOINT` blank and the page falls back to the manual flow — nothing breaks either way.

## Running it locally

There's no build step. Clone the repo and open `index.html` in a browser, or serve it locally:

```bash
git clone https://github.com/<your-username>/citation-ai.git
cd citation-ai
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying with GitHub Pages

1. Push this repo to GitHub (see below if you haven't already).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch."
4. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
5. GitHub will publish it at `https://<your-username>.github.io/citation-ai/` within a minute or two.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Some concrete ideas if you're looking for a place to start:

- Additional citation styles (Vancouver, IEEE, AAA, etc.)
- Auto-triggering the Software Heritage save API and polling for the SWHID once archival completes, instead of relying on the raw GitHub link alone
- Support for reading common export formats from specific AI platforms
- Accessibility and internationalization improvements

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, self-host it, build on it.
