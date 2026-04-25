# AI 壓力檢測小幫手

A mobile-friendly AI stress-level checker built with Next.js. All text is in Traditional Chinese.

## How it works

1. User answers 5 Likert-scale questions (0–5) and an optional open-text question.
2. The frontend POSTs answers to `/api/analyze`.
3. The API route calls the OpenAI API (server-side, key never exposed to the browser).
4. The AI returns a structured JSON analysis displayed as a report card.

---

## Run locally

### 1. Install dependencies

```bash
cd stress-checker
npm install
```

### 2. Set your OpenAI API key

```bash
cp .env.local.example .env.local
# then edit .env.local and paste your key:
# OPENAI_API_KEY=sk-...
```

### 3. Start the dev server

```bash
npm run dev
# open http://localhost:3000
```

---

## Deploy on Vercel

1. Push this repo (or just the `stress-checker` folder as its own repo) to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Set **Root Directory** to `stress-checker` (if the folder is inside a larger repo).
4. Add the environment variable `OPENAI_API_KEY` in **Project Settings → Environment Variables**.
5. Click **Deploy**.

---

## Deploy on CodeSandbox

1. Open [codesandbox.io](https://codesandbox.io) → **Import from GitHub** and point it at the repo (or the `stress-checker` subfolder).
2. CodeSandbox detects Next.js automatically and runs `npm install && npm run dev`.
3. Add `OPENAI_API_KEY` in **Project → Env Variables** (the padlock icon in the sidebar).

---

## Environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key — **never commit this** |

The `.gitignore` already excludes `.env.local`.
