# Revise — GCSE Mathematics (Higher) AI Agent

An AI-powered revision agent for **Year 10 GCSE Mathematics (Higher tier, Edexcel 9-1)**, built around the Y10 Summer PPE2.

It does four things:

1. **Adaptive practice + step-by-step marking** — Claude writes exam-style questions at three difficulty bands and marks your answer the way an Edexcel examiner would (method marks included), with a worked solution.
2. **Hint-first tutor** — a chat tutor that nudges you toward the answer rather than handing it over.
3. **Topic coverage mapped to the spec + Sparx codes** — every Higher topic from the PPE revision guide, grouped by strand, each with its Sparx Independent Learning codes.
4. **Weak-area dashboard** — local progress tracking that surfaces the topics you should revise next, plus a PPE countdown.

## Tech stack

- **Frontend:** React 18 + Vite + Tailwind CSS, KaTeX for maths rendering.
- **Backend:** Netlify Functions (serverless) that call the **Anthropic Claude** API. Your API key lives server-side and is never shipped to the browser.
- **Storage:** progress is kept in the browser's `localStorage` (no account or database needed for v1).

## Project structure

```
GCSE-Math-Revise/
├── index.html
├── netlify.toml              # build + dev + SPA redirect config
├── src/
│   ├── App.jsx               # shell + view navigation
│   ├── data/topics.js        # Higher spec topics + Sparx codes
│   ├── lib/api.js            # calls to the Netlify functions
│   ├── lib/storage.js        # localStorage progress + mastery scoring
│   └── components/           # Dashboard, Practice, Tutor, TopicBrowser, MathText
└── netlify/functions/
    ├── _lib.js               # shared Anthropic client + helpers
    ├── generate-question.js  # POST → { question, marks }
    ├── mark-answer.js         # POST → { score, verdict, feedback, workedSolution }
    └── tutor.js               # POST → { reply }
```

## Getting started

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API key
```bash
cp .env.example .env
# then edit .env and set ANTHROPIC_API_KEY=sk-ant-...
```
Get a key from the [Anthropic Console](https://console.anthropic.com/). Optionally set `CLAUDE_MODEL` (defaults to `claude-sonnet-4-6`).

### 3. Run locally
Use the Netlify CLI so the serverless functions run alongside the app:
```bash
npm install -g netlify-cli   # one-off
netlify dev                  # serves app + functions on http://localhost:8888
```
> Plain `vite` will serve the UI but the AI features need the functions — use `netlify dev` for the full experience. The Vite dev server proxies `/.netlify/functions/*` to the Netlify dev server automatically.

### 4. Build for production
```bash
npm run build      # outputs to dist/
```

## Deploying to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import from Git**, pick the repo.
3. Build settings are read from `netlify.toml` (build `npm run build`, publish `dist`, functions `netlify/functions`).
4. Add the environment variable **`ANTHROPIC_API_KEY`** under **Site settings → Environment variables** (and `CLAUDE_MODEL` if you want a non-default model).
5. Deploy.

## Notes & next steps

- The question/marking quality scales with the model — set `CLAUDE_MODEL=claude-opus-4-8` for tougher marking if you have access.
- v1 progress is per-browser. A natural next step is adding accounts + a database (e.g. Netlify Blobs or a Postgres) for cross-device tracking and teacher dashboards.
- Topic data lives in `src/data/topics.js` — adjust strands, focuses, or Sparx codes there.

---
Built from the Manchester Academy Y10 PPE2 revision guide · Edexcel Level 1/2 GCSE (9-1) Mathematics · Higher tier.
