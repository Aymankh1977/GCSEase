# GCSEase — GCSE revision made easy

An AI-powered revision platform for **GCSE students across the UK**. A student creates an account, picks their **exam board** and **tier**, and gets tailored practice, instant marking, a tutor and clear grade targets for every subject.

> Owned and published by **DentEdTech** (shown only in the footer copyright).

## What it does

1. **All UK exam boards** — AQA, Pearson Edexcel, OCR, WJEC/Eduqas and CCEA. The chosen board is passed to the AI so questions and marking match the specification.
2. **Foundation & Higher tiers** — tiered subjects (Maths, the Sciences, reformed MFLs) can be sat at Foundation (grades 1–5) or Higher (grades 4–9). Switch tier in one click from the header.
3. **Every core GCSE subject** — Maths, English Language & Literature, Combined Science, Biology, Chemistry, Physics, French/Spanish/German, Geography, History, RS, Computer Science, Business, Economics, Psychology, Sociology, Statistics, PE, Media, Citizenship, plus portfolio subjects (Art, Drama, Music, D&T, Food).
4. **Grade guide (1–9)** — a one-click guide explaining what each grade needs, filtered to your tier, both overall and per subject.
5. **AI practice + step-by-step marking** — Claude writes exam-style questions at three difficulty bands (mapped to grade ranges for your tier) and marks answers like an examiner, with a worked solution / mark scheme.
6. **24/7 hint-first tutor** — a chat tutor that nudges you toward the answer, and can explain an uploaded handout (photo or PDF).
7. **Accounts + your data, restored** — sign up / log in, and your progress is saved to your account and restored when you log back in. Export a backup any time and import it on another device.

## Tech stack

- **Frontend:** React 18 + Vite + Tailwind CSS, KaTeX for maths rendering. Responsive and installable (PWA manifest + icons).
- **Backend:** Netlify Functions (serverless) that call the **Anthropic Claude** API. The API key lives server-side and is never shipped to the browser.
- **Accounts & storage:** **Supabase** (Postgres + Auth) for cross-device accounts and progress when configured; otherwise an on-device fallback (salted + SHA-256 hashed passwords, progress in `localStorage`) so local dev works with no backend. The app is local-first: writes hit the cache + `localStorage` instantly, then sync to Supabase.

## Project structure

```
├── index.html                 # GCSEase branding, PWA meta, theme-color
├── public/
│   ├── manifest.webmanifest    # installable app metadata
│   └── icon.svg                # 3D GCSEase app icon
├── netlify.toml                # build + dev + SPA redirect config
├── src/
│   ├── App.jsx                 # auth gate, board/tier state, navigation
│   ├── data/
│   │   ├── boards.js           # the 5 UK exam boards
│   │   ├── grades.js           # grades 1–9 + Foundation/Higher tiers
│   │   ├── subjects.js         # the UK GCSE subject catalogue
│   │   └── topics.js           # detailed Maths topics + Sparx codes
│   ├── lib/
│   │   ├── auth.js             # sign up / log in / session / profile
│   │   ├── storage.js          # per-user progress + backup export/import
│   │   └── api.js              # calls to the Netlify functions
│   └── components/             # AuthScreen, Home, GradeGuide, Dashboard,
│                               # Practice, Tutor, TopicBrowser, Checklist,
│                               # Logo (3D mark), WelcomeBanner, Footer, …
└── netlify/functions/
    ├── _lib.js                 # shared Anthropic client + helpers
    ├── generate-question.js    # board/tier/grade-aware question writer
    ├── mark-answer.js          # examiner-style marking
    └── tutor.js                # hint-first tutor (text + image/PDF)
```

## Getting started

```bash
npm install
cp .env.example .env            # set ANTHROPIC_API_KEY=sk-ant-...
npm install -g netlify-cli      # one-off
netlify dev                     # app + functions on http://localhost:8888
```
> Plain `vite` serves the UI but the AI features need the functions — use `netlify dev`. `CLAUDE_MODEL` defaults to `claude-sonnet-4-6`; set `claude-opus-4-8` for tougher marking if you have access.

Build for production with `npm run build` (outputs to `dist/`).

## Deploying to Netlify

1. Push to GitHub, then in Netlify: **Add new site → Import from Git**.
2. Build settings come from `netlify.toml` (build `npm run build`, publish `dist`, functions `netlify/functions`).
3. Add **`ANTHROPIC_API_KEY`** under **Site settings → Environment variables**.

## Shipping to Android & iOS (app stores)

The app is built mobile-first and is installable as a PWA. To publish to the Play Store / App Store, wrap the built site with **[Capacitor](https://capacitorjs.com/)**:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init GCSEase com.dentedtech.gcsease --web-dir=dist
npm run build && npx cap add android && npx cap add ios
npx cap open android   # build/sign in Android Studio
npx cap open ios       # build/sign in Xcode
```
Point the app at your deployed Netlify URL (or bundle `dist/` and call the functions remotely). Export the `public/icon.svg` to the PNG sizes each store requires (e.g. 512×512, 1024×1024) for the store listings and launcher icons.

## Cloud accounts with Supabase (cross-device login + progress)

Without any extra config the app uses on-device accounts. To enable real
cross-device accounts:

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste and run [`supabase/schema.sql`](supabase/schema.sql) — it creates the `profiles` and `user_data` tables and the Row Level Security policies (each user can only touch their own rows).
3. **Authentication → Providers → Email**: keep Email enabled. For instant sign-up→login (no email step), turn **"Confirm email" off** under Auth settings; leave it on if you'd rather verify emails (users then confirm via email before their first login).
4. Copy your project's **URL** and **anon public key** (Project Settings → API) into env vars:
   - locally in `.env`: `VITE_SUPABASE_URL=…` and `VITE_SUPABASE_ANON_KEY=…`
   - on Netlify: the same two, under Site settings → Environment variables.
5. Redeploy / restart. The app auto-detects the keys and switches to cloud mode.

The anon key is meant to live in the browser — RLS is what protects the data, so never expose the `service_role` key. Only `src/lib/supabase.js`, `auth.js` and `storage.js` touch the backend; the rest of the UI is unchanged, so you can swap providers later if needed.

---
GCSEase · a DentEdTech platform · powered by Anthropic Claude.
