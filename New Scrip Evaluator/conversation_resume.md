# Conversation Resume Notes

## Project

PocketFM Promo Script Evaluator in this folder.

## GitHub

- Repository: `https://github.com/AshishPatel044/New-Script-Evaluator-`
- Branch: `main`
- Latest pushed commit: `47df3c0` — Harden evaluation report rendering

## Vercel

- Project: `ashishpatel-4895s-projects/new-script-evaluator-uo`
- Production URL: `https://new-script-evaluator-uo-ten.vercel.app`
- Vercel project is linked locally in `.vercel/`.

## Current implementation

- Next.js app with UI in `app/page.tsx`.
- Evaluation API in `app/api/evaluate/route.ts`.
- DOCX extraction uses `mammoth`.
- Selected show source material is loaded from `Show Content/`.
- Matching winning promo benchmarks are loaded from `Winning Promo Scripts/`.
- API supports `OPENROUTER_*` and `OPENAI_*` environment variable names.
- Report attempts to show rule-set and pattern-learning scores separately.
- Runtime and output-token limits were added to reduce timeouts.
- Client error boundary exists in `app/error.tsx`.

## Current Vercel configuration concept

For OpenRouter, Production should use:

```env
OPENROUTER_API_KEY=<secret, never commit or print>
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.5-flash
```

Do not put API keys in GitHub or chat. The DOCX containing a key is intentionally not committed.

## Known issue / last diagnosis

The evaluator initially worked for several tests, then failed intermittently. Vercel logs showed:

- `429 Provider returned error` from a free OpenRouter provider.
- Earlier `402 ... requires more credits, or fewer max_tokens`.
- Earlier timeout and malformed JSON errors were caused by large context and long free-model responses.

Most recent understanding: the free OpenRouter model/provider can hit quota, rate limits, or temporary availability limits. This is not necessarily a code failure. Paid credits or a different available model may be needed for reliable repeated testing.

## Important recent commits

- `610ffd6` — Fix evaluation API and DOCX source extraction
- `60829c3` — Support Gemini evaluation model
- `7d08fbd` — Support OpenRouter environment variable names
- `f329466` — Evaluate against show sources and winning promo benchmarks
- `b8284bb` — Bound evaluator runtime to prevent timeout responses
- `7256cf3` — Limit model output tokens for OpenRouter
- `a1c4338` — Reduce evaluation context for reliable JSON responses
- `47df3c0` — Harden evaluation report rendering

## Resume instruction

Read this file and `PROJECT_HANDOFF.md` first. Inspect `git status`, never expose `.env.local`, then check current Vercel logs before changing code. Do not change code merely for a provider quota/rate-limit error; first distinguish provider billing/quota from an application bug.
