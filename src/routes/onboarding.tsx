import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Fingerprint, Upload, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Open an Account — SUMERGE" },
      { name: "description", content: "Open your SUMERGE personal account in minutes with Digital Egyptian ID." },
    ],
  }),
  component: Onboarding,
});

const steps = [
  "Identity",
  "Personal info",
  "Account type",
  "Documents",
  "Review",
] as const;

function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    nationalId: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    governorate: "Cairo",
    address: "",
    employment: "Employed",
    income: "",
    accountType: "current",
    cardType: "debit",
    proofUploaded: false,
    idUploaded: false,
    verified: false,
  });
  const update = (k: keyof typeof data, v: any) => setData((d) => ({ ...d, [k]: v }));
  const next = () => setStep((s) => Math.min(steps.length, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-screen bg-secondary/40">
      <TopBar />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Stepper current={step} />
        <div className="mt-8 rounded-2xl border border-border bg-card p-7 shadow-sm md:p-10">
          {step === 0 && <DigitalIdStep data={data} update={update} onNext={next} />}
          {step === 1 && <PersonalStep data={data} update={update} />}
          {step === 2 && <AccountTypeStep data={data} update={update} />}
          {step === 3 && <DocumentsStep data={data} update={update} />}
          {step === 4 && <ReviewStep data={data} />}
          {step === 5 && <SuccessStep />}

          {step > 0 && step < 5 && (
            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <Button variant="ghost" onClick={back}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button variant="mint" size="lg" onClick={next}>
                {step === 4 ? "Submit application" : "Continue"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          SUMERGE
        </Link>
        <Link to="/status" className="text-sm text-muted-foreground hover:text-foreground">Save & exit</Link>
      </div>
    </header>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="grid grid-cols-5 gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-col items-start gap-2">
            <div className={`h-1.5 w-full rounded-full ${done || active ? "bg-mint" : "bg-border"}`} />
            <div className="flex items-center gap-2 text-xs">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${done ? "bg-mint text-mint-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className={active ? "font-semibold text-foreground" : "text-muted-foreground"}>{label}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-mint";

function DigitalIdStep({ data, update, onNext }: any) {
  return (
    <div className="text-center">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/15 text-primary">
        <Fingerprint className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-bold">Verify your identity with Digital Egyptian ID</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Sign in with your Digital Egyptian ID to securely verify your identity and pre-fill your application.
      </p>
      <div className="mx-auto mt-6 max-w-sm">
        <Field label="National ID number">
          <input
            inputMode="numeric"
            maxLength={14}
            placeholder="14-digit national ID"
            className={inputCls}
            value={data.nationalId}
            onChange={(e) => update("nationalId", e.target.value.replace(/\D/g, ""))}
          />
        </Field>
        <Button
          variant="mint"
          size="xl"
          className="mt-5 w-full"
          onClick={() => {
            update("verified", true);
            onNext();
          }}
          disabled={data.nationalId.length !== 14}
        >
          <ShieldCheck className="h-4 w-4" /> Continue with Digital ID
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          By continuing you agree to share your verified identity data with SUMERGE.
        </p>
      </div>
    </div>
  );
}

function PersonalStep({ data, update }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold">A little about you</h2>
      <p className="mt-1 text-sm text-muted-foreground">We use this to set up your account and contact you.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="First name"><input className={inputCls} value={data.firstName} onChange={(e) => update("firstName", e.target.value)} /></Field>
        <Field label="Last name"><input className={inputCls} value={data.lastName} onChange={(e) => update("lastName", e.target.value)} /></Field>
        <Field label="Mobile number"><input className={inputCls} placeholder="+20 1XX XXX XXXX" value={data.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
        <Field label="Email"><input type="email" className={inputCls} value={data.email} onChange={(e) => update("email", e.target.value)} /></Field>
        <Field label="Governorate">
          <select className={inputCls} value={data.governorate} onChange={(e) => update("governorate", e.target.value)}>
            {["Cairo","Giza","Alexandria","Dakahlia","Sharqia","Qalyubia","Gharbia","Aswan","Luxor","Port Said","Suez","Ismailia","Beheira","Minya","Asyut","Sohag","Qena","Beni Suef","Fayoum","Red Sea","South Sinai","North Sinai","Matrouh","New Valley","Kafr El Sheikh","Damietta","Monufia"].map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Address"><input className={inputCls} value={data.address} onChange={(e) => update("address", e.target.value)} /></Field>
        <Field label="Employment status">
          <select className={inputCls} value={data.employment} onChange={(e) => update("employment", e.target.value)}>
            {["Employed","Self-employed","Student","Retired","Unemployed"].map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Monthly income (EGP)"><input inputMode="numeric" className={inputCls} value={data.income} onChange={(e) => update("income", e.target.value.replace(/\D/g, ""))} /></Field>
      </div>
    </div>
  );
}

function AccountTypeStep({ data, update }: any) {
  const accounts = [
    { id: "current", t: "Everyday Current Account", d: "Free transfers, debit card, no monthly fees." },
    { id: "savings", t: "Savings Account", d: "Earn competitive interest with flexible access." },
    { id: "youth", t: "Youth Account (18–24)", d: "Lower limits, fee-free, perfect for students." },
  ];
  const cards = [
    { id: "debit", t: "Mastercard Debit", d: "Free with your account." },
    { id: "credit", t: "Mastercard Credit", d: "Subject to credit assessment." },
    { id: "none", t: "No card right now", d: "You can request one later." },
  ];
  return (
    <div>
      <h2 className="text-2xl font-bold">Choose your account</h2>
      <p className="mt-1 text-sm text-muted-foreground">You can change this later from the app.</p>

      <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Account type</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {accounts.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => update("accountType", a.id)}
            className={`rounded-xl border p-4 text-left transition-all ${data.accountType === a.id ? "border-mint bg-mint/10 ring-2 ring-mint" : "border-border bg-background hover:border-mint/50"}`}
          >
            <div className="font-semibold">{a.t}</div>
            <div className="mt-1 text-xs text-muted-foreground">{a.d}</div>
          </button>
        ))}
      </div>

      <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Card preference</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {cards.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => update("cardType", a.id)}
            className={`rounded-xl border p-4 text-left transition-all ${data.cardType === a.id ? "border-mint bg-mint/10 ring-2 ring-mint" : "border-border bg-background hover:border-mint/50"}`}
          >
            <div className="font-semibold">{a.t}</div>
            <div className="mt-1 text-xs text-muted-foreground">{a.d}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DocumentsStep({ data, update }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Upload your documents</h2>
      <p className="mt-1 text-sm text-muted-foreground">Both sides of your national ID and a recent proof of address.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <UploadCard label="National ID (front & back)" done={data.idUploaded} onChange={() => update("idUploaded", true)} />
        <UploadCard label="Proof of address (utility bill)" done={data.proofUploaded} onChange={() => update("proofUploaded", true)} />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Accepted: JPG, PNG, PDF — up to 10 MB each.</p>
    </div>
  );
}

function UploadCard({ label, done, onChange }: { label: string; done: boolean; onChange: () => void }) {
  return (
    <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${done ? "border-mint bg-mint/10" : "border-border bg-background hover:border-mint/60"}`}>
      <input type="file" className="hidden" accept="image/*,application/pdf" onChange={onChange} />
      {done ? <CheckCircle2 className="h-7 w-7 text-mint" /> : <Upload className="h-7 w-7 text-muted-foreground" />}
      <div className="text-sm font-medium">{done ? "Uploaded" : "Click to upload"}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </label>
  );
}

function ReviewStep({ data }: any) {
  const rows: [string, string][] = [
    ["Full name", `${data.firstName} ${data.lastName}`.trim() || "—"],
    ["National ID", data.nationalId || "—"],
    ["Mobile", data.phone || "—"],
    ["Email", data.email || "—"],
    ["Governorate", data.governorate],
    ["Address", data.address || "—"],
    ["Employment", data.employment],
    ["Monthly income", data.income ? `EGP ${Number(data.income).toLocaleString()}` : "—"],
    ["Account type", data.accountType],
    ["Card preference", data.cardType],
  ];
  const router = useRouter();
  // pre-navigate handled by parent's Submit button -> next() -> success step
  void router;
  return (
    <div>
      <h2 className="text-2xl font-bold">Review your application</h2>
      <p className="mt-1 text-sm text-muted-foreground">Make sure everything is correct before submitting.</p>
      <dl className="mt-6 divide-y divide-border rounded-xl border border-border bg-background">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium capitalize">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SuccessStep() {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/15 text-mint">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-2xl font-bold">Application submitted</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Thank you! We've received your application. You'll get an SMS within 24 hours once your SUMERGE account is activated.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild variant="mint" size="lg"><Link to="/status">Track application</Link></Button>
        <Button asChild variant="outline" size="lg"><Link to="/">Back to home</Link></Button>
      </div>
    </div>
  );
}