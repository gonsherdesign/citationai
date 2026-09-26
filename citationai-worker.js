/**
 * CitationAI storage worker.
 *
 * Receives a transcript manifest from the CitationAI page and commits it
 * to a dedicated public GitHub repo, then returns a permanent raw-file
 * URL. This exists so the page itself never has to hold a write credential.
 *
 * Deploy with Cloudflare Workers (free tier). Configure two secrets before
 * deploying:
 *   GITHUB_TOKEN — a fine-grained GitHub personal access token, scoped to
 *                  ONLY the transcripts repo below, with Contents: Read
 *                  and write permission and nothing else.
 *   GITHUB_REPO  — "your-username/citationai-transcripts" (owner/name of
 *                  a public repo you create just for storing transcripts —
 *                  keep it separate from the app's own repo).
 *
 * Set them with: npx wrangler secret put GITHUB_TOKEN
 *                npx wrangler secret put GITHUB_REPO
 *
 * SECURITY: lock ALLOWED_ORIGIN below to your actual GitHub Pages URL
 * before going live, so only your site can call this endpoint.
 */

const ALLOWED_ORIGIN = "*"; // e.g. "https://your-username.github.io" once deployed
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB per transcript — generous for text, prevents abuse

export default {
  async fetch(request, env) {
    const cors = corsHeaders();

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400, cors);
    }

    const { filename, content } = body || {};
    if (!filename || typeof content !== "string") {
      return json({ error: "filename and content are required" }, 400, cors);
    }
    if (new TextEncoder().encode(content).length > MAX_BYTES) {
      return json({ error: "Transcript too large" }, 413, cors);
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 100);
    const path = `transcripts/${Date.now()}-${safeName}`;
    const repo = env.GITHUB_REPO;
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

    const ghResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "citationai-worker",
        Accept: "application/vnd.github+json"
      },
      body: JSON.stringify({
        message: `Add transcript ${safeName}`,
        content: toBase64(content)
      })
    });

    const data = await ghResponse.json();
    if (!ghResponse.ok) {
      return json({ error: data.message || "GitHub API error" }, 502, cors);
    }

    const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${path}`;

    // Best-effort: ask Software Heritage to archive the repo too. Fire and
    // forget — this doesn't block the response, and SWH archival isn't
    // instant, so we don't wait on it.
    fetch(
      `https://archive.softwareheritage.org/api/1/origin/save/git/url/https://github.com/${repo}/`,
      { method: "POST" }
    ).catch(() => {});

    return json({ url: rawUrl, githubUrl: data.content.html_url }, 200, cors);
  }
};

function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors }
  });
}
