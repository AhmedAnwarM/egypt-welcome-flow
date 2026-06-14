import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, LogIn, Upload, CheckCircle2, IdCard, Wallet, Users, PiggyBank, Banknote, CalendarClock, Pencil, ClipboardCheck, PhoneCall, Sparkles } from "lucide-react";
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
    jobTitle: "",
    businessReg: "",
    income: "",
    sourceOfFunds: "Salary",
    useIdAddress: false,
    governorate: "",
    city: "",
    street: "",
    apartment: "",
    floor: "",
    postalCode: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreeCredit: false,
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
      case 3: {
        const baseOk = !!data.employment && !!data.income && !!data.employer.trim() && !!data.jobTitle.trim() && !!data.sourceOfFunds;
        const isBiz = data.employment === "Self-employed" || data.employment === "Business owner";
        return baseOk && (!isBiz || !!data.businessReg.trim());
      }
      case 4: return !!data.governorate && !!data.city.trim() && !!data.street.trim();
      case 5: {
        const pwOk = data.password.length >= 8 && data.password === data.confirmPassword;
        return data.username.length >= 4 && pwOk && data.agreeTerms && data.agreeCredit;
      }
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
              {step === 3 && <WorkProductStep data={data} update={update} onChangeProduct={() => setStep(0)} />}
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
    {
      id: "saving",
      icon: PiggyBank,
      badge: "8.75%",
      t: "Saving Account",
      d: "A diverse bundle of savings accounts with multiple options and flexible payment methods to suit all your needs.",
      bullets: [
        "Competitive periodic interest rate of up to 8.75%",
        "Earn interest monthly, quarterly, or yearly",
        "Deposit or withdraw funds at any time",
        "Available in EGP and major foreign currencies",
      ],
    },
    {
      id: "current",
      icon: Banknote,
      badge: null,
      t: "Non-Interest-Bearing Current Account",
      d: "Carry out all your banking transactions with ease, in EGP and major foreign currencies.",
      bullets: [
        "Free cash deposits and withdrawals at any time",
        "Cheque book and debit card included",
        "Available for individuals and companies",
        "No minimum monthly balance fees",
      ],
    },
    {
      id: "prime-saving",
      icon: Wallet,
      badge: null,
      t: "Prime Saving Account",
      d: "An interest-bearing account with competitive, tiered interest rates for individuals who want to grow their savings.",
      bullets: [
        "Interest calculated on lowest monthly balance and credited monthly",
        "Individuals only · Local currency (EGP) only",
        "Minimum balance to open: EGP 5,000",
        "Minimum amount to earn interest: EGP 5,000",
      ],
    },
    {
      id: "current-365",
      icon: CalendarClock,
      badge: null,
      t: "Current Account 365 Days",
      d: "A current account that rewards you every single day with a daily interest rate.",
      bullets: [
        "Daily interest calculated on daily closing balance and credited daily",
        "Offered for individuals and companies, in EGP only",
        "Minimum to open the account: EGP 5,000",
        "Interest accrues from EGP 50,000 (individuals) / EGP 1,000,000 (companies)",
      ],
    },
  ];
  return (
    <div>
      <StepHeader title="How can SUMERGE work for you?" subtitle="Explore and select an account that works for you:" />
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
                <ul className="mt-3 space-y-1.5">
                  {o.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" strokeWidth={3} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <span className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border"}`}>
                {selected && <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
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

const PRODUCT_LABELS: Record<string, string> = {
  "saving": "Saving Account",
  "current": "Non-Interest-Bearing Current Account",
  "prime-saving": "Prime Saving Account",
  "current-365": "Current Account 365 Days",
};

function SelectionRecap({ data, onChange }: any) {
  const label = PRODUCT_LABELS[data.productChoice] || "Account selected";
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Wallet className="h-5 w-5" />
        </span>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Your selection</div>
          <div className="text-sm font-bold text-foreground">{label}</div>
        </div>
      </div>
      <button type="button" onClick={onChange} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <Pencil className="h-3.5 w-3.5" /> Change
      </button>
    </div>
  );
}

function WorkProductStep({ data, update, onChangeProduct }: any) {
  const isBiz = data.employment === "Self-employed" || data.employment === "Business owner";
  const employerLabel = isBiz ? "Business name" : "Employer name";
  return (
    <div>
      <SelectionRecap data={data} onChange={onChangeProduct} />
      <StepHeader title="Tell us about your work" subtitle="We use this to personalize your account and meet regulatory requirements. Your information is kept confidential." />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Employment status">
          <select className={inputCls} value={data.employment} onChange={(e) => update("employment", e.target.value)}>
            {["Employed","Self-employed","Business owner","Student","Retired","Not currently employed"].map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Monthly income (EGP)">
          <select className={inputCls} value={data.income} onChange={(e) => update("income", e.target.value)}>
            <option value="">Select range</option>
            {["Less than 10,000","10,000 – 25,000","25,000 – 50,000","50,000 – 100,000","100,000 – 250,000","More than 250,000"].map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <div className="md:col-span-2">
          <Field label={employerLabel}><input className={inputCls} value={data.employer} onChange={(e) => update("employer", e.target.value)} /></Field>
        </div>
        <Field label="Job title / occupation"><input className={inputCls} value={data.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} /></Field>
        <Field label="Source of funds">
          <select className={inputCls} value={data.sourceOfFunds} onChange={(e) => update("sourceOfFunds", e.target.value)}>
            {["Salary","Business income","Investments","Family support","Other"].map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        {isBiz && (
          <div className="md:col-span-2">
            <Field label="Business registration number"><input className={inputCls} value={data.businessReg} onChange={(e) => update("businessReg", e.target.value)} /></Field>
          </div>
        )}
      </div>
    </div>
  );
}

const GOVERNORATES = ["Cairo","Giza","Alexandria","Dakahlia","Sharqia","Qalyubia","Gharbia","Aswan","Luxor","Port Said","Suez","Ismailia","Beheira","Minya","Asyut","Sohag","Qena","Beni Suef","Fayoum","Red Sea","South Sinai","North Sinai","Matrouh","New Valley","Kafr El Sheikh","Damietta","Monufia"];

function AddressStep({ data, update }: any) {
  const toggleIdAddress = () => {
    const next = !data.useIdAddress;
    update("useIdAddress", next);
    if (next) {
      update("governorate", "Cairo");
      update("city", "Nasr City");
      update("street", "Abbas El Akkad St., Building 22");
      update("apartment", "5");
      update("floor", "3");
      update("postalCode", "11371");
    } else {
      update("governorate", "");
      update("city", "");
      update("street", "");
      update("apartment", "");
      update("floor", "");
      update("postalCode", "");
    }
  };
  const disabled = data.useIdAddress;
  const fieldCls = `${inputCls} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;
  return (
    <div>
      <StepHeader title="Where should we send your card and statements?" subtitle="You can update this later from your account settings." />
      <button
        type="button"
        onClick={toggleIdAddress}
        className={`mb-6 flex w-full items-center justify-between rounded-full border px-5 py-3 text-sm font-semibold transition-all ${data.useIdAddress ? "border-secondary bg-secondary/40 text-foreground" : "border-secondary/40 bg-secondary/20 text-foreground/80 hover:bg-secondary/30"}`}
      >
        <span className="flex items-center gap-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded border-2 ${data.useIdAddress ? "border-secondary bg-secondary text-secondary-foreground" : "border-border bg-background"}`}>
            {data.useIdAddress && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          Use the address from my National ID
        </span>
      </button>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Governorate">
          <select disabled={disabled} className={fieldCls} value={data.governorate} onChange={(e) => update("governorate", e.target.value)}>
            <option value="">Select governorate</option>
            {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="City / district"><input disabled={disabled} className={fieldCls} value={data.city} onChange={(e) => update("city", e.target.value)} /></Field>
        <div className="md:col-span-2">
          <Field label="Street name and building number"><input disabled={disabled} className={fieldCls} value={data.street} onChange={(e) => update("street", e.target.value)} /></Field>
        </div>
        <Field label="Apartment"><input disabled={disabled} className={fieldCls} value={data.apartment} onChange={(e) => update("apartment", e.target.value)} /></Field>
        <Field label="Floor"><input disabled={disabled} className={fieldCls} value={data.floor} onChange={(e) => update("floor", e.target.value)} /></Field>
        <div className="md:col-span-2">
          <Field label="Postal code (optional)"><input disabled={disabled} className={fieldCls} value={data.postalCode} onChange={(e) => update("postalCode", e.target.value)} /></Field>
        </div>
      </div>
    </div>
  );
}

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  return Math.min(score, 3); // 0..3
}

function CredentialsStep({ data, update }: any) {
  const score = passwordStrength(data.password);
  const meter = [
    { w: "33%", c: "bg-red-500", label: "Weak" },
    { w: "66%", c: "bg-amber-500", label: "Fair" },
    { w: "100%", c: "bg-emerald-500", label: "Strong" },
  ];
  const m = data.password.length === 0 ? null : meter[Math.max(0, score - 1)] || meter[0];
  const mismatch = data.confirmPassword.length > 0 && data.confirmPassword !== data.password;
  return (
    <div>
      <StepHeader title="Secure your account" subtitle="You'll use these credentials to sign in to SUMERGE Online and Mobile Banking." />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Username"><input className={inputCls} value={data.username} onChange={(e) => update("username", e.target.value)} /></Field>
        <div />
        <div className="md:col-span-2">
          <Field label="Password">
            <input type="password" className={inputCls} value={data.password} onChange={(e) => update("password", e.target.value)} />
          </Field>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary/30">
            {m && <div className={`h-full ${m.c} transition-all`} style={{ width: m.w }} />}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {m ? <span className="font-semibold text-foreground">{m.label}. </span> : null}
            Use 8+ characters with a number and a symbol.
          </p>
        </div>
        <div className="md:col-span-2">
          <Field label="Confirm password">
            <input type="password" className={`${inputCls} ${mismatch ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`} value={data.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
          </Field>
          {mismatch && <p className="mt-1.5 text-xs font-semibold text-red-600">Passwords don't match.</p>}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Consent checked={data.agreeTerms} onChange={(v: boolean) => update("agreeTerms", v)}>
          I agree to the <Link to="/" className="font-semibold text-primary hover:underline">Terms &amp; Conditions</Link> and <Link to="/" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
        </Consent>
        <Consent checked={data.agreeCredit} onChange={(v: boolean) => update("agreeCredit", v)}>
          I consent to a credit bureau check as part of this application.
        </Consent>
      </div>
    </div>
  );
}

function Consent({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm text-foreground/80">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${checked ? "border-secondary bg-secondary text-secondary-foreground" : "border-border bg-background"}`}>
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span>{children}</span>
    </label>
  );
}

function SuccessStep() {
  const router = useRouter();
  void router;
  const ref = `SM-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
  const next = [
    { icon: ClipboardCheck, t: "Review (1–2 business days)", d: "Our team will check your details and documents." },
    { icon: PhoneCall, t: "Verification call or SMS", d: "We may contact you to confirm your details." },
    { icon: Sparkles, t: "Account activation", d: "You'll receive a welcome email with your account details and card delivery info." },
  ];
  return (
    <div className="text-center">
      <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-11 w-11" />
      </div>
      <h2 className="mt-6 text-3xl font-bold text-primary">Application submitted</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
        Your reference number is <span className="font-mono font-bold text-foreground">{ref}</span>. A copy has been emailed to you for your records.
      </p>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-card p-6 text-left shadow-elegant md:p-8">
        <h3 className="text-base font-bold text-foreground">What happens next</h3>
        <ul className="mt-5 space-y-5">
          {next.map((row) => {
            const Icon = row.icon;
            return (
              <li key={row.t} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-foreground">{row.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{row.d}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8">
        <Button asChild size="lg" className="h-12 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Link to="/status">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

// Removed unused icons appease tree-shaking
void Users;
void ArrowRight;