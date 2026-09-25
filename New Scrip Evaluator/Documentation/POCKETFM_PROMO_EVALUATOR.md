# PocketFM Promo Script Evaluator

## 1. Purpose

This application evaluates PocketFM promotional scripts against the selected show’s source story, the authoritative promo-writing rules, and show-specific successful/rejected promo patterns. It also forecasts Meta performance using historical CPI and 53-minute activation observations.

The system is designed to answer four questions:

1. Is the promo true to the selected show?
2. Does it follow the writing rules?
3. Does it resemble successful promos for this show while remaining original?
4. What CPI and 53-minute activation range might this creative produce?

Performance results are forecasts, not guarantees. Meta delivery, audience, placement, bid, budget, fatigue, and attribution windows also affect live results.

## 2. User workflow

1. Enter the evaluator’s name.
2. Select a show and genre.
3. Paste a promo or upload a `.docx`/`.txt` file.
4. Optionally select **Compare two** and provide Promo A and Promo B.
5. Click **Evaluate promo**.
6. Review story fidelity, scores, truth risks, fixes, KPI forecast, and performance drivers.

## 3. Evaluation pipeline

```text
User input
  → DOCX/TXT extraction (if uploaded)
  → Exact selected-show source loading
  → Source-truth audit
  → Rule-set evaluation
  → Same-show pattern evaluation
  → Weighted score normalization
  → CPI/activation prediction from Meta anchors
  → Report shown in the browser
```

### Source-truth audit

The evaluator checks claims about characters, relationships, events, powers, objects, locations, and outcomes. Claims are classified as supported, contradicted, or unsupported. Only supported evidence is presented as source evidence.

Every show in the selector has an explicit source filename mapping in `app/api/evaluate/route.ts`. The evaluator does not silently choose an unrelated source document when a mapping is missing.

### Rule and pattern passes

The two scores are independent:

- **Rule-set score:** compliance with the authoritative Rule Set learning document.
- **Pattern-learning score:** fit with observed same-show successful, average, and rejected promo structures.

The model is instructed not to copy scores, strengths, deductions, or tiers between the two columns.

## 4. Scoring model

The evaluator scores nine parameters from 1–10:

| Parameter | Weight |
|---|---:|
| Hook | 20% |
| Context & World Clarity | 10% |
| Sequence & Plot Movement | 10% |
| Scene Design | 15% |
| Pacing & Transitions | 10% |
| Ending, Callback & CTA | 10% |
| Narration/Dialogue Balance | 5% |
| Mental Impact & Recall Value | 5% |
| Follow successful promos pattern | 15% |

Both final scores are recalculated server-side using this formula. The browser never decides the final score.

Tiers:

- `P0 Topper`: above 9.5
- `P0 Above Avg`: above 8.5 through 9.5
- `P1 Avg`: above 7.5 through 8.5
- `P2 Rejected`: 7.5 or below

For every parameter below 7 in either score column, the server guarantees five actionable suggestions. Suggestions are required to include an approach, rewrite/structural fix, and reason.

## 5. Meta performance predictor

The predictor is implemented in `app/api/predict/route.ts` and trained from the manually supplied historical observations in `data/performance-training.json`.

### CPI

Cost per install in Indian rupees. Lower is better.

### Activation percentage

The percentage of total installs that entered the app and listened to the selected show for at least 53 minutes. Higher is better.

### Predictor output

The report displays:

- Estimated CPI in rupees
- CPI range
- Estimated 53-minute activation percentage
- Activation range
- Prediction confidence
- Main creative/performance drivers

The predictor uses same-show historical anchors first, then considers script content, source fidelity, rule score, pattern score, and the nine parameter scores. It does not treat the writing score as a deterministic CPI formula.

## 6. Historical KPI training data

The current training file contains the provided observations for:

- King of Dragon
- The Warrior
- The Beast Guru
- Primordial God

When adding new results, preserve this shape:

```json
{
  "script": "SHOW-SCRIPT-ID",
  "tier": "Topper",
  "score": 9.5,
  "cpi": 125.36,
  "activation": 37.11
}
```

Activation values are stored as percentage points, so `37.11` means `37.11%`.

## 7. Repository structure

```text
app/page.tsx                 Browser UI and report
app/api/extract/route.ts     DOCX/TXT upload extraction
app/api/evaluate/route.ts    Source audit and creative evaluation
app/api/predict/route.ts     CPI and activation forecast
data/                        Rule, pattern, show, and KPI training data
Show Content/                Show source documents
Winning Promo Scripts/       Benchmark promo documents
Documentation/               Product and engineering documentation
```

## 8. Local setup

Requirements: Node.js and npm.

```bash
npm install
```

Create `.env.local` with a new server-side key:

```env
OPENAI_API_KEY=your_new_server_side_key
OPENAI_MODEL=gpt-5
```

Never use `NEXT_PUBLIC_OPENAI_API_KEY`. Never commit `.env.local`.

Run locally:

```bash
npm run dev
```

Validate a production build:

```bash
npm run build
```

## 9. Deployment

The app is compatible with Vercel. Set the project root to this project directory and configure `OPENAI_API_KEY` and `OPENAI_MODEL` for the required environments. Redeploy after changing environment variables.

The API routes use the Node.js runtime because they read local DOCX files and use the `mammoth` package.

## 10. Reliability and limitations

- Story accuracy depends on the quality and completeness of the selected show source document.
- The LLM can still make an incorrect judgment; source evidence and contradictions should be reviewed for high-stakes publishing decisions.
- CPI and activation are estimates, not guaranteed Meta outcomes.
- The KPI model becomes more useful as real campaign results are added for more shows and more creative variants.
- Runtime filesystems on serverless deployments are not durable storage. Use an external database/KV store if persistent evaluation history is required.

## 11. Safe maintenance checklist

Before release:

1. Confirm every show maps to the correct source file.
2. Confirm the benchmark folder contains the intended same-show references.
3. Add new KPI observations to `data/performance-training.json`.
4. Run `npm run build`.
5. Test one single-promo evaluation, one upload, and one comparison.
6. Inspect source evidence and truth risks before trusting a high score.
7. Verify server environment variables without printing secrets.
