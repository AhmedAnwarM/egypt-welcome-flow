## Constraints I'm working under

- **Simulated only** — no real Haweya / I-Score / Core Banking / AML / OCR / CMS / SMS / Email. Each integration is a mocked async with realistic delays and a clean adapter so a real provider can be swapped in later.
- **Branded SUMERGE** — every screen, every label, all metadata. No "MidBank" anywhere.
- **AR + RTL real** — `dir="rtl"`, mirrored layout, Arabic copy for every visible string.
- **Mobile-first** — designed for 360–430px width, scales up.
- **No backend** — state lives in React + `localStorage` for save/resume. Audit log is a console + in-memory store. Dashboards read from seeded mock data.

The full spec is realistically 6+ months of work even simulated. I'll ship it in phases so you can review each one before paying for the next.

## Phase 1 — Foundation & customer onboarding completion (this turn)

1. **i18n + RTL**
   - `src/lib/i18n.tsx` — `LangProvider`, `useT()`, dictionary for EN/AR.
   - `__root.tsx` sets `<html dir lang>` from context.
   - Replace hard-coded strings in `index.tsx`, `onboarding.tsx`, `status.tsx`, `Header`, `Footer` with `t("key")`.
2. **Extend onboarding** (in-place in `onboarding.tsx`, keeping existing steps):
   - **Selfie + passive liveness** sub-step inside step 3 after ID OCR — camera placeholder, "blink" prompt, simulated face-match score vs ID photo.
   - **Product selection** as new step — eligibility engine filters by age/nationality/income/risk; cards for Savings / Current / Youth / Payroll / Premium / Digital.
   - **Consents** screen — versioned checkboxes for T&C, Privacy, Data Processing, Marketing, Data Sharing, Open Banking; timestamps stored.
   - **Digital signature** — typed-name + OTP-confirmed signature, generates a stub "signed PDF" reference.
   - **Document upload** — address proof, utility bill, salary cert; drag-drop + camera; status badges.
   - **Review & submit** — full read-only summary with edit links.
3. **Application tracking** at `/tracking` — timeline (Registration → Verification → Compliance → Approval → Account Created → Card Issued), ETA, ref ID lookup.
4. **Welcome** at `/welcome` — account #, IBAN (mock EG generator), virtual card preview, mobile-banking activation link, downloadable welcome kit (client-generated PDF).
5. **Splash** at `/` overlay on first visit — animated SUMERGE logo, language picker.
6. **Session timeout** — 10 min idle warning modal with extend/logout.
7. **Audit hook** — `auditLog(event, data)` writing to in-memory ring buffer + console; viewable in dev panel.

## Phase 2 — Compliance & risk simulation

- KYC classifier (Simplified vs Full eKYC), AML/PEP/Sanctions/Watchlist screening cards with mock hit lists, automated risk score (Low/Med/High) with EDD branch triggering extra document collection + video-KYC scheduler.
- FATCA/CRS already partially present — expand to full questionnaire with conditional TIN matrices.
- Fraud signals: device fingerprint (FingerprintJS-style hash from `navigator` props), geo (mocked), rooted/jailbreak detection (UA heuristic), repeated-failure lockout.

## Phase 3 — Staff portals (separate route trees)

- `/ops` — pending/approved/rejected queues, SLA breach badges, maker-checker, reassignment.
- `/compliance` — AML alerts, PEP cases, EDD queue, escalations.
- `/business` — funnel, conversion %, product mix, approval stats.
- `/management` — daily volume, approval/rejection rates, avg time, risk distribution.
- Each reads seeded mock data + the in-memory submitted-applications store.

## Phase 4 — Post-approval systems

- Mock CIF + account + IBAN generator, virtual/physical card issuance flow, digital-banking enrollment (username + activation link + QR), notification center, profile/settings (language, MFA method, change password, sessions, devices).

## Phase 5 — Integration layer

- `src/lib/integrations/` adapters: `haweya.ts`, `iscore.ts`, `coreBanking.ts`, `aml.ts`, `ocr.ts`, `cms.ts`, `sms.ts`, `email.ts`, `notifications.ts`. Each exports a typed async interface returning mocked responses; swapping in real providers later is a one-file change.

## Technical notes

- All state is client-side. Save/Resume serializes `data` to `localStorage` keyed by ref ID; resume link emails are simulated via a toast.
- PDF generation uses `pdf-lib` (already Worker-safe) for the signed-agreement and welcome-kit downloads.
- IBAN: EG2 + 27 digits, mod-97 valid checksum.
- Mock data lives in `src/lib/mocks/` so dashboards have realistic rows from turn one.
- AR strings are professional banking Arabic; I'll flag any I'm unsure of so you can have a native reviewer pass them.

## What I will NOT do

- Real biometric face matching, real OCR, real Haweya, real core banking, real card issuance, real SMS/email — all mocked.
- Mobile-app packaging (Capacitor/native) — this remains a responsive web app.
- A real workflow engine with persisted state machine — Phase 3 dashboards mutate in-memory mock data only.

If you approve, I start Phase 1 immediately. Each later phase is its own request so you can re-scope based on what you actually need.

## Active Phase — Retail Lending MVP

Customer-facing simulated lending journey at `/lending`, fully client-side.
No staff workflow, dashboards, reporting, or tracking integration in this phase.

- **Products**: Credit Card, Personal Loan, Auto Loan, Mortgage.
- **Channels**: Mobile/Web, Branch Assisted, Sales/RM.
- **Customer type**: ETB (mocked Core Banking prefill) or NTB (simulated Haweya/KYC).
- **Steps**:
  1. Product & channel
  2. Profile & identity (national ID, full name, mobile, email)
  3. Employment & affordability — employer, type, sector, net income, existing obligations, requested amount/limit, tenor; live monthly installment + DBR.
  4. Documents — fake uploads (salary slip, HR letter, bank statement, ID/passport, optional collateral for auto/mortgage); client state only.
  5. Automated decisioning — AML/PEP/fraud + I-Score + DBR via `lending.runScreening` and `lending.decide` in `src/lib/integrations.ts`. DBR cap = 50%.
  6. Alternative proposals — when DBR > 50% but otherwise eligible, `lending.generateAlternatives` returns longer tenor / lower amount / combined options with recalculated installment + DBR.
  7. Review, OTP/e-sign simulation, submit; success state shows lending reference (`LN-YYYY-XXXXXX`) and status timeline.
- **Decision rules**: AML/sanctions/fraud → reject; I-Score <580 → reject; 580–649 → refer; DBR ≤50% & ≥680 → instant pre-approval; DBR >50% & ≥650 with no hits → conditional approval w/ alternatives; otherwise → refer.
- **Audit events**: `lending.start`, `lending.identityVerified`, `lending.decisionCalculated`, `lending.alternativeSelected`, `lending.submit`.
- **i18n**: EN + AR strings for all new visible labels in `src/lib/i18n.tsx`; RTL works via existing `LangProvider`.
- **Entry points**: header link ("Apply for loan / card") and a section on the landing page.
- **Out of scope this phase**: real backend, real Haweya / I-Score / Core Banking / AML / OCR / SMS / email, internal staff workflow, dashboards, route-level tracking integration.

### Hardening (current)
- Alternative proposals are policy-gated: `lending.generateAlternatives` only returns options with DBR ≤ 50% and amount ≥ product minimum. Empty list ⇒ UI shows "No policy-compliant alternative is available; case will be referred to Credit Risk" and blocks Continue.
- Per-product tenor caps (`PRODUCT_MAX_TENOR`): credit card 12, personal loan 60, auto loan 84, mortgage 240. Longer-tenor alternatives never reduce the current tenor.
- Range validation on the affordability step enforces both min and max for amount (per-product) and tenor (per-product, except credit card which is fixed at 12m). Inline helper text; Continue disabled until in range.
- Decision reasons returned as i18n keys (`reasonKey`) so EN/AR are both covered. All visible `/lending` strings are translated via `useT()`; unused `lending.step.alternatives` key removed.
- Save/resume: stable `LN-YYYY-XXXXXX` reference generated on first mount, "Save and continue later" persists non-sensitive draft to `localStorage` (`sumerge.lending.app`). Opening `/lending?resume=<ref>` restores it and shows a "Welcome back" banner. Draft is cleared on submit.