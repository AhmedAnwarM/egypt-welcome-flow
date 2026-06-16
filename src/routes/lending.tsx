import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CreditCard,
  Wallet,
  Car,
  Home,
  Smartphone,
  Building2,
  UserCog,
  Upload,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
  PenLine,
} from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/lib/i18n";
import { auditLog } from "@/lib/audit";
import {
  lending,
  estimateInstallment,
  dbrRatio,
  type LendingProduct,
  type LendingChannel,
  type LendingCustomerType,
  type LendingDecision,
  type LendingScreening,
} from "@/lib/integrations";

export const Route = createFileRoute("/lending")({
  head: () => ({
    meta: [
      { title: "Retail Lending — SUMERGE" },
      { name: "description", content: "Apply for a SUMERGE credit card, personal loan, auto loan or mortgage in minutes." },
      { property: "og:title", content: "Retail Lending — SUMERGE" },
      { property: "og:description", content: "Apply for a SUMERGE credit card, personal loan, auto loan or mortgage in minutes." },
    ],
  }),
  component: LendingPage,
});

type DocKey = "salary_slip" | "hr_letter" | "bank_statement" | "id_doc" | "collateral";
const DOC_LABELS: Record<DocKey, string> = {
  salary_slip: "Latest salary slip",
  hr_letter: "HR / employer letter",
  bank_statement: "Bank statement (3 months)",
  id_doc: "National ID / Passport",
  collateral: "Collateral / asset document",
};

type Alt = ReturnType<typeof lending.generateAlternatives>[number];

const PRODUCT_META: Record<
  LendingProduct,
  { icon: typeof CreditCard; defaultAmount: number; defaultTenor: number; minTenor: number; maxTenor: number; minAmount: number; maxAmount: number }
> = {
  credit_card: { icon: CreditCard, defaultAmount: 50000, defaultTenor: 12, minTenor: 12, maxTenor: 12, minAmount: 5000, maxAmount: 500000 },
  personal_loan: { icon: Wallet, defaultAmount: 100000, defaultTenor: 36, minTenor: 6, maxTenor: 60, minAmount: 10000, maxAmount: 2000000 },
  auto_loan: { icon: Car, defaultAmount: 400000, defaultTenor: 48, minTenor: 12, maxTenor: 84, minAmount: 50000, maxAmount: 3000000 },
  mortgage: { icon: Home, defaultAmount: 1500000, defaultTenor: 120, minTenor: 60, maxTenor: 240, minAmount: 200000, maxAmount: 15000000 },
};

const CHANNELS: { id: LendingChannel; icon: typeof Smartphone; key: string }[] = [
  { id: "digital", icon: Smartphone, key: "lending.channel.digital" },
  { id: "branch", icon: Building2, key: "lending.channel.branch" },
  { id: "rm", icon: UserCog, key: "lending.channel.rm" },
];

const STEP_KEYS = [
  "lending.step.product",
  "lending.step.identity",
  "lending.step.affordability",
  "lending.step.documents",
  "lending.step.decision",
  "lending.step.review",
] as const;

function fmtEGP(n: number) {
  return new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(n || 0);
}
function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

function LendingPage() {
  const t = useT();
  const navigate = useNavigate();

  // ---------- state ----------
  const [step, setStep] = useState(0);

  const [product, setProduct] = useState<LendingProduct>("personal_loan");
  const [channel, setChannel] = useState<LendingChannel>("digital");
  const [customerType, setCustomerType] = useState<LendingCustomerType>("ntb");

  const meta = PRODUCT_META[product];

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [identityVerified, setIdentityVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [employer, setEmployer] = useState("");
  const [employmentType, setEmploymentType] = useState("permanent");
  const [sector, setSector] = useState("");
  const [netIncome, setNetIncome] = useState<number>(0);
  const [obligations, setObligations] = useState<number>(0);
  const [amount, setAmount] = useState<number>(meta.defaultAmount);
  const [tenor, setTenor] = useState<number>(meta.defaultTenor);

  const [docs, setDocs] = useState<Record<DocKey, string | null>>({
    salary_slip: null,
    hr_letter: null,
    bank_statement: null,
    id_doc: null,
    collateral: null,
  });

  const [deciding, setDeciding] = useState(false);
  const [screening, setScreening] = useState<LendingScreening | null>(null);
  const [decision, setDecision] = useState<{ decision: LendingDecision; reason: string } | null>(null);
  const [alternatives, setAlternatives] = useState<Alt[]>([]);
  const [chosenAlt, setChosenAlt] = useState<Alt | null>(null);

  const [otp, setOtp] = useState("");
  const [signature, setSignature] = useState("");
  const [submitted, setSubmitted] = useState<{ ref: string; decision: LendingDecision } | null>(null);

  // ---------- derived ----------
  const effectiveAmount = chosenAlt?.amount ?? amount;
  const effectiveTenor = chosenAlt?.tenorMonths ?? tenor;
  const installment = useMemo(
    () => estimateInstallment(product, effectiveAmount, effectiveTenor),
    [product, effectiveAmount, effectiveTenor],
  );
  const dbr = useMemo(
    () => dbrRatio(obligations, installment, netIncome),
    [obligations, installment, netIncome],
  );

  // ---------- handlers ----------
  function onPickProduct(p: LendingProduct) {
    setProduct(p);
    const m = PRODUCT_META[p];
    setAmount(m.defaultAmount);
    setTenor(m.defaultTenor);
    setChosenAlt(null);
  }

  async function loadEtb() {
    setVerifying(true);
    const p = await lending.fetchEtbProfile("");
    setFullName(p.fullName);
    setNationalId(p.nationalId);
    setMobile(p.mobile);
    setEmail(p.email);
    setEmployer(p.employer);
    setEmploymentType(p.employmentType);
    setSector(p.sector);
    setNetIncome(p.netMonthlyIncome);
    setObligations(p.existingObligations);
    setIdentityVerified(true);
    setVerifying(false);
    auditLog("lending.identityVerified", { customerType: "etb" });
  }

  async function verifyNtb() {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1100));
    setIdentityVerified(true);
    setVerifying(false);
    auditLog("lending.identityVerified", { customerType: "ntb" });
  }

  async function runDecision() {
    setDeciding(true);
    setChosenAlt(null);
    setAlternatives([]);
    const sc = await lending.runScreening({ nationalId, fullName });
    setScreening(sc);
    const baseInstallment = estimateInstallment(product, amount, tenor);
    const baseDbr = dbrRatio(obligations, baseInstallment, netIncome);
    const d = lending.decide({ screening: sc, dbr: baseDbr });
    setDecision(d);
    if (d.decision === "conditional_approval") {
      setAlternatives(
        lending.generateAlternatives({
          product,
          amount,
          tenorMonths: tenor,
          existingObligations: obligations,
          netIncome,
        }),
      );
    }
    auditLog("lending.decisionCalculated", { decision: d.decision, iScore: sc.iScore, dbr: Number(baseDbr.toFixed(3)) });
    setDeciding(false);
  }

  function submit() {
    const ref = lending.generateLendingRef();
    auditLog("lending.submit", {
      ref,
      product,
      amount: effectiveAmount,
      tenor: effectiveTenor,
      decision: decision?.decision,
    });
    setSubmitted({ ref, decision: decision!.decision });
  }

  // ---------- step gating ----------
  const canContinue = (() => {
    switch (step) {
      case 0:
        return !!product && !!channel && !!customerType;
      case 1:
        return identityVerified && fullName && nationalId.length >= 10 && mobile.length >= 7 && /.+@.+\..+/.test(email);
      case 2:
        return employer && netIncome > 0 && amount >= meta.minAmount && tenor >= meta.minTenor;
      case 3:
        return !!docs.salary_slip && !!docs.id_doc && !!docs.bank_statement;
      case 4:
        if (!decision) return false;
        if (decision.decision === "outright_reject") return false;
        if (decision.decision === "conditional_approval") return !!chosenAlt;
        return true;
      case 5:
        return otp.length === 6 && signature.trim().length > 2;
      default:
        return true;
    }
  })();

  function next() {
    if (step === 0) auditLog("lending.start", { product, channel, customerType });
    setStep((s) => Math.min(s + 1, STEP_KEYS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // ---------- success screen ----------
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">{t("lending.success.title")}</h1>
            <p className="text-muted-foreground mb-6">{t("lending.success.body")}</p>
            <div className="rounded-2xl border border-border bg-background/60 p-5 text-left space-y-2 mb-6">
              <div className="flex justify-between"><span className="text-muted-foreground text-sm">Reference</span><span className="font-mono font-semibold">{submitted.ref}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-sm">Product</span><span className="font-medium">{t(`lending.product.${product}`)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-sm">Amount</span><span className="font-medium">{fmtEGP(effectiveAmount)}</span></div>
              {product !== "credit_card" && (
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Tenor</span><span className="font-medium">{effectiveTenor} months</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground text-sm">Monthly installment</span><span className="font-medium">{fmtEGP(installment)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-sm">Decision</span><span className="font-semibold text-primary">{t(`lending.decision.${submitted.decision}`)}</span></div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-left">Status timeline</p>
              {[
                { label: "Application received", done: true },
                { label: "Compliance & risk screening", done: true },
                { label: "Credit decision recorded", done: true },
                { label: "Disbursement / card issuance", done: false },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.done ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  <span className={s.done ? "" : "text-muted-foreground"}>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate({ to: "/" })}>Back to home</Button>
              <Button onClick={() => navigate({ to: "/tracking" })}>Track application</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ---------- main wizard ----------
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">{t("lending.title")}</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("lending.subtitle")}</h1>
          </div>

          {/* Stepper */}
          <ol className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
            {STEP_KEYS.map((k, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <li key={k} className="flex items-center gap-2 shrink-0">
                  <span className={`h-7 w-7 rounded-full text-[11px] font-semibold flex items-center justify-center ${active ? "bg-primary text-primary-foreground" : done ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={`text-xs ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{t(k)}</span>
                  {i < STEP_KEYS.length - 1 && <span className="h-px w-6 bg-border" />}
                </li>
              );
            })}
          </ol>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            {/* STEP 0 — product & channel */}
            {step === 0 && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-base font-semibold mb-3">Choose a product</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.keys(PRODUCT_META) as LendingProduct[]).map((p) => {
                      const Icon = PRODUCT_META[p].icon;
                      const active = product === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => onPickProduct(p)}
                          className={`rounded-2xl border p-4 text-left transition-colors ${active ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/40"}`}
                        >
                          <Icon className="h-5 w-5 text-primary mb-2" />
                          <p className="font-semibold text-sm">{t(`lending.product.${p}`)}</p>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h2 className="text-base font-semibold mb-3">Application channel</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CHANNELS.map((c) => {
                      const Icon = c.icon;
                      const active = channel === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setChannel(c.id)}
                          className={`rounded-2xl border p-4 text-left transition-colors ${active ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/40"}`}
                        >
                          <Icon className="h-5 w-5 text-primary mb-2" />
                          <p className="font-medium text-sm">{t(c.key)}</p>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h2 className="text-base font-semibold mb-3">Customer type</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(["etb", "ntb"] as LendingCustomerType[]).map((c) => {
                      const active = customerType === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setCustomerType(c); setIdentityVerified(false); }}
                          className={`rounded-2xl border p-4 text-left transition-colors ${active ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/40"}`}
                        >
                          <p className="font-semibold text-sm">{t(`lending.customer.${c}`)}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {c === "etb" ? "We'll prefill your details from Core Banking." : "We'll verify your identity via Haweya."}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* STEP 1 — profile & identity */}
            {step === 1 && (
              <div className="space-y-6">
                {!identityVerified ? (
                  <div className="rounded-2xl border border-dashed border-border p-5 flex items-start gap-4">
                    <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {customerType === "etb" ? "Fetch your profile from Core Banking" : "Verify your identity via Haweya"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Simulated — no real data leaves this device.</p>
                      <Button
                        size="sm"
                        className="mt-3"
                        disabled={verifying}
                        onClick={customerType === "etb" ? loadEtb : verifyNtb}
                      >
                        {verifying && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                        {customerType === "etb" ? "Load my details" : "Verify identity"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Identity verified.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full name"><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></Field>
                  <Field label="National ID"><Input value={nationalId} onChange={(e) => setNationalId(e.target.value)} inputMode="numeric" maxLength={14} /></Field>
                  <Field label="Mobile"><Input value={mobile} onChange={(e) => setMobile(e.target.value)} inputMode="tel" /></Field>
                  <Field label="Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></Field>
                </div>
              </div>
            )}

            {/* STEP 2 — employment & affordability */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Employer"><Input value={employer} onChange={(e) => setEmployer(e.target.value)} /></Field>
                  <Field label="Employment type">
                    <Select value={employmentType} onValueChange={setEmploymentType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="self_employed">Self-employed</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Sector"><Input value={sector} onChange={(e) => setSector(e.target.value)} placeholder="e.g. Technology" /></Field>
                  <Field label="Net monthly income (EGP)"><Input value={netIncome || ""} onChange={(e) => setNetIncome(Number(e.target.value) || 0)} inputMode="numeric" /></Field>
                  <Field label="Existing monthly obligations (EGP)"><Input value={obligations || ""} onChange={(e) => setObligations(Number(e.target.value) || 0)} inputMode="numeric" /></Field>
                  <Field label={product === "credit_card" ? "Requested limit (EGP)" : "Requested amount (EGP)"}>
                    <Input value={amount || ""} onChange={(e) => { setAmount(Number(e.target.value) || 0); setChosenAlt(null); }} inputMode="numeric" />
                  </Field>
                  {product !== "credit_card" && (
                    <Field label="Tenor (months)">
                      <Input
                        type="number"
                        min={meta.minTenor}
                        max={meta.maxTenor}
                        value={tenor || ""}
                        onChange={(e) => { setTenor(Number(e.target.value) || 0); setChosenAlt(null); }}
                      />
                    </Field>
                  )}
                </div>

                <div className="rounded-2xl border border-border bg-background/60 p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Monthly installment</p>
                    <p className="text-lg font-bold">{fmtEGP(installment)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Debt burden ratio</p>
                    <p className={`text-lg font-bold ${dbr > 0.5 ? "text-destructive" : "text-primary"}`}>{netIncome ? pct(dbr) : "—"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — documents */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Upload the required documents. Simulated — files stay on this device.</p>
                {(Object.keys(DOC_LABELS) as DocKey[])
                  .filter((k) => k !== "collateral" || product === "auto_loan" || product === "mortgage")
                  .map((k) => (
                    <DocRow
                      key={k}
                      label={DOC_LABELS[k]}
                      optional={k === "collateral"}
                      value={docs[k]}
                      onPick={(name) => setDocs((d) => ({ ...d, [k]: name }))}
                    />
                  ))}
              </div>
            )}

            {/* STEP 4 — decision */}
            {step === 4 && (
              <div className="space-y-6">
                {!decision && (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      We'll run AML/PEP, fraud, I-Score and affordability checks now.
                    </p>
                    <Button onClick={runDecision} disabled={deciding}>
                      {deciding && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                      Run automated decisioning
                    </Button>
                  </div>
                )}

                {decision && screening && (
                  <>
                    <DecisionBanner decision={decision.decision} reason={decision.reason} t={t} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <Stat label="I-Score" value={String(screening.iScore)} />
                      <Stat label="DBR" value={pct(dbr)} bad={dbr > 0.5} />
                      <Stat label="AML / Sanctions" value={screening.amlHit || screening.sanctions ? "Hit" : "Clear"} bad={screening.amlHit || screening.sanctions} />
                      <Stat label="Fraud" value={screening.fraud ? "Hit" : "Clear"} bad={screening.fraud} />
                    </div>

                    {alternatives.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold">Choose an alternative that fits within policy:</p>
                        {alternatives.map((alt, i) => {
                          const active = chosenAlt === alt;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setChosenAlt(alt);
                                auditLog("lending.alternativeSelected", { label: alt.label, amount: alt.amount, tenor: alt.tenorMonths });
                              }}
                              className={`w-full rounded-2xl border p-4 text-left transition-colors ${active ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/40"}`}
                            >
                              <p className="font-semibold text-sm">{alt.label}</p>
                              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                                <span>Amount: <strong className="text-foreground">{fmtEGP(alt.amount)}</strong></span>
                                {product !== "credit_card" && <span>Tenor: <strong className="text-foreground">{alt.tenorMonths}m</strong></span>}
                                <span>Installment: <strong className="text-foreground">{fmtEGP(alt.installment)}</strong></span>
                                <span>DBR: <strong className={alt.dbr > 0.5 ? "text-destructive" : "text-foreground"}>{pct(alt.dbr)}</strong></span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {decision.decision === "outright_reject" && (
                      <p className="text-sm text-muted-foreground">You can return to the home page or apply for a different product later.</p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* STEP 5 — review & sign */}
            {step === 5 && decision && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-background/60 p-5 space-y-2 text-sm">
                  <Row k="Product" v={t(`lending.product.${product}`)} />
                  <Row k={product === "credit_card" ? "Limit" : "Amount"} v={fmtEGP(effectiveAmount)} />
                  {product !== "credit_card" && <Row k="Tenor" v={`${effectiveTenor} months`} />}
                  <Row k="Monthly installment" v={fmtEGP(installment)} />
                  <Row k="DBR" v={pct(dbr)} />
                  <Row k="Decision" v={t(`lending.decision.${decision.decision}`)} />
                </div>

                <div className="rounded-2xl border border-border p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <PenLine className="h-4 w-4 text-primary" /> Digital acceptance
                  </div>
                  <Field label="6-digit OTP (simulated)">
                    <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" maxLength={6} placeholder="••••••" />
                  </Field>
                  <Field label="Type your full name to sign">
                    <Input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder={fullName || "Your full name"} />
                  </Field>
                </div>
              </div>
            )}

            {/* Footer nav */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <Button type="button" variant="outline" onClick={back} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              {step < 5 ? (
                <Button type="button" onClick={next} disabled={!canContinue}>
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="button" onClick={submit} disabled={!canContinue}>
                  Submit application <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">Cancel and return home</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
      <p className={`text-sm font-bold ${bad ? "text-destructive" : ""}`}>{value}</p>
    </div>
  );
}

function DecisionBanner({ decision, reason, t }: { decision: LendingDecision; reason: string; t: (k: string) => string }) {
  const map: Record<LendingDecision, { tone: string; Icon: typeof CheckCircle2 }> = {
    instant_pre_approval: { tone: "border-primary/40 bg-primary/5 text-primary", Icon: CheckCircle2 },
    conditional_approval: { tone: "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-400", Icon: AlertTriangle },
    refer_credit_risk: { tone: "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-400", Icon: AlertTriangle },
    outright_reject: { tone: "border-destructive/40 bg-destructive/5 text-destructive", Icon: AlertTriangle },
  };
  const { tone, Icon } = map[decision];
  return (
    <div className={`rounded-2xl border p-4 flex items-start gap-3 ${tone}`}>
      <Icon className="h-5 w-5 mt-0.5" />
      <div>
        <p className="font-semibold text-sm">{t(`lending.decision.${decision}`)}</p>
        <p className="text-xs opacity-80 mt-1">{reason}</p>
      </div>
    </div>
  );
}

function DocRow({ label, value, onPick, optional }: { label: string; value: string | null; onPick: (name: string) => void; optional?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4 cursor-pointer hover:border-primary/40 transition-colors">
      <div className="flex items-center gap-3">
        <span className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          {value ? <CheckCircle2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
        </span>
        <div>
          <p className="text-sm font-medium">{label} {optional && <span className="text-xs text-muted-foreground">(optional)</span>}</p>
          <p className="text-xs text-muted-foreground">{value ? value : "PDF, JPG or PNG · up to 5 MB"}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
        <Upload className="h-4 w-4" /> {value ? "Replace" : "Upload"}
      </span>
      <input
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f.name);
        }}
      />
    </label>
  );
}