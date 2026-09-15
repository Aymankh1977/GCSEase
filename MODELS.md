# AI Models — GCSEasy

All model definitions live in one place. **Only edit `_lib.js` to change models** — every function inherits from it.

---

## Where models are defined

### `netlify/functions/_lib.js` — lines 8–14 (single source of truth)

```js
const SONNET = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';
const HAIKU  = 'claude-haiku-4-5-20251001';

export function modelForPlan(plan) {
  return (plan === 'pro' || plan === 'family') ? SONNET : HAIKU;
}
```

---

## Which model each feature uses

| Feature | Function | Free users | Pro / Family users |
|---|---|---|---|
| Question generation | `generate-question.js` | Haiku | Sonnet (via `modelForPlan`) |
| Answer marking | `mark-answer.js` | Haiku | Sonnet (via `modelForPlan`) |
| AI Tutor | `tutor.js` | Haiku (hardcoded line 36) | Haiku (hardcoded line 36) |

> **Note:** The tutor uses Haiku for **all** plans — it is hardcoded in `tutor.js:36` rather than using `modelForPlan`. This was a deliberate choice for speed and cost (tutor responses need to be fast). If you want Pro users to get Sonnet in the tutor, change line 36 of `tutor.js` to use `modelForPlan(plan)` instead.

---

## How to change models

### Upgrade Sonnet to a newer version (e.g. claude-sonnet-5)
Edit `netlify/functions/_lib.js` line 8:
```js
const SONNET = process.env.CLAUDE_MODEL || 'claude-sonnet-5';
```
This automatically updates question generation and marking for Pro/family users.

### Upgrade Haiku to a newer version
Edit `netlify/functions/_lib.js` line 9:
```js
const HAIKU = 'claude-haiku-4-5-20251001'; // ← change this
```
This updates free users' question generation, marking, **and** the tutor for all users.

### Change the tutor model independently
Edit `netlify/functions/tutor.js` line 36:
```js
const model = 'claude-haiku-4-5-20251001'; // ← change this
```

### Override Sonnet via environment variable (no redeploy needed)
In Netlify → Site configuration → Environment variables, set:
```
CLAUDE_MODEL = claude-sonnet-5
```
This overrides the hardcoded Sonnet value without a code change or redeploy.

---

## Current model IDs (as of September 2026)

| Model | ID | Used for |
|---|---|---|
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | All question gen + marking; tutor (all plans) |

> **To restore Sonnet for Pro users**, change line 8 of `_lib.js` back to `'claude-sonnet-4-6'`.

---

## Daily usage limits (enforced server-side)

Defined in `netlify/functions/_lib.js` lines 18–22:

```js
const LIMITS = {
  free:   { questions: 5,  tutor_msgs: 5  },
  pro:    { questions: 30, tutor_msgs: 30 },
  family: { questions: 30, tutor_msgs: 30 },
};
```

When changing limits, also update the user-facing text in:
- `src/components/UpgradePrompt.jsx`
- `src/components/HowItWorks.jsx`
- `src/components/Terms.jsx`
