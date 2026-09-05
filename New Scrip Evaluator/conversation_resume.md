# Conversation Resume Notes

## Project

PocketFM Promo Script Evaluator in this folder.

## GitHub

- Repository: `https://github.com/AshishPatel044/New-Script-Evaluator-`
- Branch: `main`
- Latest pushed commit: `9af4b99` — Add five fantasy shows to evaluator
- Previous task commit: `9af8f46` — Fix independent scoring, story loading, and DOCX uploads

## Vercel

- Project: `ashishpatel-4895s-projects/new-script-evaluator-uo`
- Production URL alias: `https://new-script-evaluator-uo-ashishpatel-4895s-projects.vercel.app`
- Vercel project is linked locally in `.vercel/`.
- Latest deployment URL: `https://new-script-evaluator-7baeo4pg1-ashishpatel-4895s-projects.vercel.app`
- Latest deployment was still showing `Building` during the last status check; verify status before assuming it is Ready.

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
- DOCX/TXT uploads use `app/api/extract/route.ts` and server-side `mammoth` extraction.
- Compare mode supports upload for both Promo A and Promo B and requires both scripts.
- Rule-set and Pattern Learning are explicitly instructed to score independently; exact verified benchmark matches may still have equal scores when both agree.
- Story source matching now matches the selected show filename and passes show-specific benchmark aliases.

## Added fantasy shows (2026-09-04)

- `Mrityulok Ka Devta`
- `Kalyug Ka Amar Doctor`
- `Garud Warrior`
- `Super Yoddha`
- `Mahagatha`

Their source DOCX files are in `Show Content/` and were committed in `9af4b99`.

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
- `9af8f46` — Fix independent scoring, story loading, and DOCX uploads
- `9af4b99` — Add five fantasy shows to evaluator

## Resume instruction

Read this file and `PROJECT_HANDOFF.md` first. Inspect `git status`, never expose `.env.local`, then check current Vercel deployment status/logs before changing code. The GitHub remote is `origin` on `main`; commits require access to the parent repository `.git` directory. Do not add unrelated untracked workspace folders/documents unless explicitly requested. Do not change code merely for a provider quota/rate-limit error; first distinguish provider billing/quota from an application bug.
