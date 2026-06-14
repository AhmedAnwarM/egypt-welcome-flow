import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, LogIn, Upload, CheckCircle2, IdCard, Briefcase, Wallet, Users, Globe2 } from "lucide-react";
import sumergeLogo from "@/assets/sumerge-logo.png.asset.json";
import Footer from "@/components/site/Footer";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get Started — SUMERGE" },
      { name: "description", content: "Start your SUMERGE personal account in minutes with your Egyptian National ID." },
    ],
  }),
  component: Onboarding,
});

const steps = [
  "Choose your option",
  "Contact information",
  "Capture National ID",
  "Work and product details",
  "Address details",
  "Create login credentials",
] as const;

function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    productChoice: "",
    phone: "",
    email: "",
    confirmEmail: "",
    promo: "",
    otpSent: false,
    otp: "",
    nationalId: "",
    fullName: "",
    firstName: "",
    lastName: "",
    nationality: "Egypt",
    expiry: "",
    employment: "Employed",
    employer: "",
    income: "",
    accountType: "everyday",
    cardType: "debit",
    governorate: "Cairo",
    address: "",
    building: "",
    username: "",
    password: "",
    idFront: false,
    idBack: false,
  });
  const update = (k: keyof typeof data, v: any) => setData((d) => ({ ...d, [k]: v }));
  const next = () => setStep((s) => Math.min(steps.length, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const canContinue = (() => {
    switch (step) {
      case 0: return !!data.productChoice;
      case 1: return data.phone.length >= 10 && /\S+@\S+/.test(data.email) && data.email === data.confirmEmail;
      case 2: return data.idFront && data.idBack && data.nationalId.length === 14 && data.fullName.trim().length > 3;
      case 3: return !!data.accountType && !!data.cardType && !!data.income;
      case 4: return !!data.governorate && !!data.address;
      case 5: return data.username.length >= 4 && data.password.length >= 8;
      default: return true;
    }
  })();

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,#dff0ea_0%,#e6f3ee_50%,#edf6f2_100%)]">
      <TopBar refId="EGY140626-476" />
      <main className="flex-1">
      {step >= steps.length ? (
        <div className="mx-auto max-w-3xl px-6 py-16">
          <SuccessStep />
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[260px_1fr] md:py-14">
          <aside className="space-y-5 md:sticky md:top-10 md:self-start">
            <ProgressCard current={step} total={steps.length} />
            <SideStepper current={step} />
          </aside>
          <section className="min-h-[560px]">
            <div className="rounded-2xl bg-card p-6 md:p-10 shadow-elegant">
              {step === 0 && <ChooseOptionStep data={data} update={update} />}
              {step === 1 && <ContactStep data={data} update={update} />}
              {step === 2 && <CaptureIdStep data={data} update={update} />}
              {step === 3 && <WorkProductStep data={data} update={update} />}
              {step === 4 && <AddressStep data={data} update={update} />}
              {step === 5 && <CredentialsStep data={data} update={update} />}

              <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground/80 hover:bg-secondary/40 disabled:opacity-40"
                >
                  Back
                </button>
                <Button
                  size="lg"
                  onClick={next}
                  disabled={!canContinue}
                  className="h-11 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2"
                >
                  {step === steps.length - 1 ? "Submit application" : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
      </main>
      <Footer />
    </div>
  );
}

function TopBar({ refId }: { refId?: string }) {
  return (
    <header className="bg-background/90 backdrop-blur border-b border-border/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-5">
        <Link to="/" aria-label="SUMERGE home" className="flex items-center">
          <img src={sumergeLogo.url} alt="SUMERGE" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          {refId && (
            <div className="text-right leading-tight">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">Reference Number</p>
              <p className="text-sm font-mono font-bold text-primary">{refId}</p>
            </div>
          )}
          <Link to="/" aria-label="Sign in" className="text-foreground/70 hover:text-primary">
            <LogIn className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProgressCard({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Application Completion Progress</p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-sm font-bold text-foreground">Step {current} of {total}</span>
        <span className="text-sm font-bold text-muted-foreground">{pct}%</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary/30">
        <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SideStepper({ current }: { current: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <ol className="space-y-5">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  done
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : active
                      ? "border-secondary bg-card"
                      : "border-border bg-card"
                }`}
              >
                {done ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : active ? (
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                ) : null}
              </span>
              <span className={`text-sm leading-tight ${active ? "font-semibold text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "h-12 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-8">
      <h2 className="text-2xl font-bold text-primary md:text-[28px]">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
    </header>
  );
}

function ChooseOptionStep({ data, update }: any) {
  const options = [
    { id: "everyday", icon: Wallet, badge: null, t: "SUMERGE Everyday", d: "Open a free account when you maintain EGP 3,000 or transfer a minimum salary of EGP 10,000 and earn up to EGP 1,750 cashback as a welcome bonus." },
    { id: "plus", icon: Globe2, badge: "5%", t: "SUMERGE Plus", d: "Maintain a minimum monthly balance of EGP 50,000 to unlock SUMERGE Plus benefits — 5% p.a. with Plus Saver Account and fee-free banking." },
    { id: "plus-salary", icon: Briefcase, badge: "6.25%", t: "SUMERGE Plus (Salary)", d: "Transfer a monthly salary of EGP 10,000 or above to unlock SUMERGE Plus — 6.25% p.a. with Plus Saver Account and fee-free banking." },
  ];
  return (
    <div>
      <StepHeader title="How can SUMERGE work for you?" subtitle="Explore and select an option that works for you:" />
      <div className="space-y-3">
        {options.map((o) => {
          const Icon = o.icon;
          const selected = data.productChoice === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => update("productChoice", o.id)}
              className={`flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-all ${selected ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-background hover:border-primary/40"}`}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                {o.badge ? <span className="text-xs">{o.badge}</span> : <Icon className="h-5 w-5" />}
              </span>
              <div className="flex-1">
                <div className="font-bold text-foreground">{o.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{o.d}</div>
              </div>
              <span className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border"}`}>
                {selected && <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-sm font-semibold text-foreground">Shari'ah compliant Islamic products available</p>
    </div>
  );
}

function ContactStep({ data, update }: any) {
  return (
    <div>
      <StepHeader title="Let's get to know you better!" />
      <div className="space-y-5">
        <Field label="Mobile Number">
          <div className="flex h-12 items-center rounded-md border border-border bg-background px-3">
            <span className="text-sm font-semibold text-foreground">+20</span>
            <input
              className="ml-2 h-full flex-1 bg-transparent text-sm outline-none"
              placeholder="1XX XXX XXXX"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
              maxLength={11}
            />
          </div>
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Email"><input type="email" className={inputCls} value={data.email} onChange={(e) => update("email", e.target.value)} /></Field>
          <Field label="Confirm Email"><input type="email" className={inputCls} value={data.confirmEmail} onChange={(e) => update("confirmEmail", e.target.value)} /></Field>
        </div>
        <div>
          <p className="mb-1.5 text-sm font-semibold text-foreground">Have a promo code? (Optional)</p>
          <input className={inputCls} placeholder="Promo code" value={data.promo} onChange={(e) => update("promo", e.target.value)} />
        </div>
        <p className="text-sm text-muted-foreground">If we sense an issue during your application, we may reach out via email, mobile, or WhatsApp to help you complete the process.</p>
      </div>
    </div>
  );
}

function CaptureIdStep({ data, update }: any) {
  return (
    <div>
      <StepHeader title="Please capture/upload both sides of your National ID" />
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_280px]">
        <UploadCard label="National ID front" sub="Please upload the front image of your National ID" done={data.idFront} onChange={() => update("idFront", true)} />
        <UploadCard label="National ID back" sub="Please upload the back image of your National ID" done={data.idBack} onChange={() => update("idBack", true)} />
        <aside className="rounded-xl border border-border bg-secondary/40 p-5">
          <h4 className="font-bold text-foreground">Tips to upload your pictures</h4>
          <p className="mt-3 text-sm text-muted-foreground">Avoid bright light and avoid shaking your camera.</p>
          <p className="mt-3 text-sm text-muted-foreground">Ensure you upload images of front and back of your document separately. Allowed formats: JPEG, PNG, PDF. Size must not exceed 2 MB.</p>
        </aside>
      </div>

      {data.idFront && data.idBack && (
        <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-6">
          <h3 className="text-lg font-bold">Great! Please check the captured details</h3>
          <p className="mt-1 text-sm text-muted-foreground">Your personal info has been captured from your National ID</p>
          <div className="mt-5 rounded-lg border border-border bg-background p-5">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <IdCard className="h-5 w-5 text-primary" />
              <input
                className="flex-1 bg-transparent text-base font-semibold outline-none"
                placeholder="Full name as per National ID"
                value={data.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Field label="National ID number">
                <input inputMode="numeric" maxLength={14} className={inputCls} placeholder="14 digits" value={data.nationalId} onChange={(e) => update("nationalId", e.target.value.replace(/\D/g, ""))} />
              </Field>
              <Field label="Nationality">
                <input className={inputCls} value={data.nationality} onChange={(e) => update("nationality", e.target.value)} />
              </Field>
              <Field label="Expiry date">
                <input type="date" className={inputCls} value={data.expiry} onChange={(e) => update("expiry", e.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadCard({ label, sub, done, onChange }: { label: string; sub: string; done: boolean; onChange: () => void }) {
  return (
    <label className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${done ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/60"}`}>
      <input type="file" className="hidden" accept="image/*,application/pdf" onChange={onChange} />
      {done ? <CheckCircle2 className="h-8 w-8 text-primary" /> : <Upload className="h-8 w-8 text-primary" />}
      <div className="text-base font-bold text-foreground">{done ? "Uploaded" : label}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </label>
  );
}

function WorkProductStep({ data, update }: any) {
  const accounts = [
    { id: "current", t: "Everyday Current", d: "Free transfers, debit card, no monthly fees." },
    { id: "savings", t: "Savings Account", d: "Earn competitive interest with flexible access." },
    { id: "youth", t: "Youth (18–24)", d: "Lower limits, fee-free, perfect for students." },
  ];
  const cards = [
    { id: "debit", t: "Visa Debit", d: "Free with your account." },
    { id: "credit", t: "Visa Credit", d: "Subject to credit assessment." },
    { id: "none", t: "No card right now", d: "You can request one later." },
  ];
  return (
    <div>
      <StepHeader title="Tell us about your work and product" />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Employment status">
          <select className={inputCls} value={data.employment} onChange={(e) => update("employment", e.target.value)}>
            {["Employed","Self-employed","Student","Retired","Unemployed"].map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Employer name"><input className={inputCls} value={data.employer} onChange={(e) => update("employer", e.target.value)} /></Field>
        <Field label="Monthly income (EGP)"><input inputMode="numeric" className={inputCls} value={data.income} onChange={(e) => update("income", e.target.value.replace(/\D/g, ""))} /></Field>
      </div>

      <h3 className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Account type</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {accounts.map((a) => (
          <button key={a.id} type="button" onClick={() => update("accountType", a.id)}
            className={`rounded-xl border p-4 text-left transition-all ${data.accountType === a.id ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-background hover:border-primary/40"}`}>
            <div className="font-semibold">{a.t}</div>
            <div className="mt-1 text-xs text-muted-foreground">{a.d}</div>
          </button>
        ))}
      </div>

      <h3 className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Card preference</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {cards.map((a) => (
          <button key={a.id} type="button" onClick={() => update("cardType", a.id)}
            className={`rounded-xl border p-4 text-left transition-all ${data.cardType === a.id ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-background hover:border-primary/40"}`}>
            <div className="font-semibold">{a.t}</div>
            <div className="mt-1 text-xs text-muted-foreground">{a.d}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AddressStep({ data, update }: any) {
  return (
    <div>
      <StepHeader title="Where can we reach you?" subtitle="Please provide your current residential address in Egypt." />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Governorate">
          <select className={inputCls} value={data.governorate} onChange={(e) => update("governorate", e.target.value)}>
            {["Cairo","Giza","Alexandria","Dakahlia","Sharqia","Qalyubia","Gharbia","Aswan","Luxor","Port Said","Suez","Ismailia","Beheira","Minya","Asyut","Sohag","Qena","Beni Suef","Fayoum","Red Sea","South Sinai","North Sinai","Matrouh","New Valley","Kafr El Sheikh","Damietta","Monufia"].map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Building / Street"><input className={inputCls} value={data.building} onChange={(e) => update("building", e.target.value)} /></Field>
        <div className="md:col-span-2">
          <Field label="Full address"><input className={inputCls} placeholder="Apartment, district, city" value={data.address} onChange={(e) => update("address", e.target.value)} /></Field>
        </div>
      </div>
    </div>
  );
}

function CredentialsStep({ data, update }: any) {
  return (
    <div>
      <StepHeader title="Create your login credentials" subtitle="You'll use these to sign in to SUMERGE Online and Mobile Banking." />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Username"><input className={inputCls} value={data.username} onChange={(e) => update("username", e.target.value)} /></Field>
        <Field label="Password"><input type="password" className={inputCls} value={data.password} onChange={(e) => update("password", e.target.value)} /></Field>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Use at least 8 characters, including a number and a symbol.</p>
    </div>
  );
}

function SuccessStep() {
  const router = useRouter();
  void router;
  return (
    <div className="rounded-2xl border border-border bg-card p-10 py-12 text-center">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <h2 className="mt-5 text-2xl font-bold">Application submitted</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Thank you! We've received your application. You'll get an SMS within 24 hours once your SUMERGE account is activated.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90"><Link to="/status">Track application</Link></Button>
        <Button asChild variant="outline" size="lg" className="rounded-md"><Link to="/">Back to home</Link></Button>
      </div>
    </div>
  );
}

// Removed unused icons appease tree-shaking
void Users;
void ArrowRight;