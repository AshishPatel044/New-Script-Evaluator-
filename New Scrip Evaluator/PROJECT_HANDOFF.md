# PocketFM Promo Script Evaluator — Project Handoff

## Product goal

Build a user-friendly PocketFM promo script evaluator. A user enters their name, selects one of 21 shows and a genre, pastes or uploads a promo script, then receives a source-grounded evaluation. The tool must also compare two promos for the same show.

## Evaluation requirements

- Read the selected show source material before evaluating.
- Compare the promo against successful benchmark promos.
- Return two independent score columns:
  1. Authoritative rule-set score.
  2. Successful-promo-pattern / learned-observation score.
- Score these nine parameters from 1–10:
  - Hook
  - Context & World Clarity
  - Sequence & Plot Movement
  - Scene Design
  - Pacing & Transitions
  - Ending, Callback & CTA
  - Narration/Dialogue Balance
  - Mental Impact & Recall Value
  - Follow successful promos pattern
- Weighted final score:
  - Hook × 0.20
  - Context × 0.10
  - Sequence × 0.10
  - Scene Design × 0.15
  - Pacing × 0.10
  - Ending × 0.10
  - Narration/Dialogue Balance × 0.05
  - Mental Impact × 0.05
  - Successful Pattern × 0.15
- Tiers: P0 = 8.5–10, P1 = 6.5–8.4, P2 = below 6.5.
- Include fidelity percentage, source evidence, contradictions, structure, strengths, priority problems, and publish readiness.
- For every parameter below 7, return exactly five materially different suggestions. Each suggestion needs an approach label, actionable rewrite/structural fix, and reason.
- Preserve the original emotional intention, character roles, dramatic situation, audience promise, and source truth.

## Existing implementation

This is a Next.js/Vercel-compatible project.

- UI: `app/page.tsx`
- Styling: `app/styles.css`
- Layout metadata: `app/layout.tsx`
- OpenAI server route: `app/api/evaluate/route.ts`
- Package configuration: `package.json`
- Environment template: `.env.example`
- Local secret file: `.env.local` (ignored by Git)

The UI currently includes:

- PocketFM-themed responsive layout
- Name entry
- 21-show selector
- Genre selector
- Single promo mode
- Two-promo comparison mode UI
- Paste input
- `.docx`/`.txt` upload control
- Word count
- Evaluation loading/error states
- Score cards and report sections
- Refresh suggestion accordions

## Source files in the repository

The following folders were pushed to GitHub:

- `Show Content/`
- `Winning Promo Scripts/`
- `King Of Dragon Score/`
- `The Warrior Score/`
- `My Mysterious Princes Score/`
- Master prompt DOCX

## GitHub

Repository: https://github.com/AshishPatel044/New-Script-Evaluator-

Commits already pushed:

- `801dcf9` — Build PocketFM promo script evaluator
- `72b947e` — Add promo source and benchmark documents

The repository root contains the `New Scrip Evaluator` project directory. When importing into Vercel, set the Vercel **Root Directory** to:

```text
New Scrip Evaluator
```

## Environment configuration

Create a new OpenAI API key because the key included in the original DOCX was exposed and must not be reused.

In Vercel, go to `Project → Settings → Environment Variables` and add:

```env
OPENAI_API_KEY=your-new-server-side-key
OPENAI_MODEL=gpt-5
```

Apply the variables to Production, Preview, and Development as needed, then redeploy. Never use `NEXT_PUBLIC_OPENAI_API_KEY`.

Locally, put the key only in `.env.local`:

```env
OPENAI_API_KEY=your-new-server-side-key
OPENAI_MODEL=gpt-5
```

Do not print, commit, upload, or paste the key into chat.

## Important remaining work

1. Install dependencies and run `npm run build` when network access is available.
2. Fix/verify `.docx` upload extraction. The current client upload handler uses browser text reading and needs proper DOCX extraction, ideally by sending the file to a server route and using `mammoth`.
3. Improve the API source loading so it extracts actual DOCX text and reads up to 20 relevant episodes plus benchmark promos, instead of passing a truncated base64 document payload to the model.
4. Implement complete side-by-side comparison output for Promo A and Promo B, including parameter deltas, winners, fidelity/contradiction comparison, and combined recommendation.
5. Add benchmark metadata so the known P0/P1/P2 examples influence pattern scoring explicitly.
6. Test the deployed app with real scripts and verify OpenAI model/API availability.
7. Consider excluding `Show Content/.DS_Store` if a clean repository is desired.

## Resume instruction

When resuming this project, read this file first, inspect the current Git status, then continue with the remaining work above. Preserve `.env.local` and never expose its contents.
