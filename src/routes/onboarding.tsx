import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  CheckCircle2,
  User,
  Users,
  ShieldCheck,
  LogIn,
  ChevronDown,
} from "lucide-react";
import Header from "@/components/site/Header";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Open a Corporate Account — SUMERGE" },
      { name: "description", content: "Open your SUMERGE corporate account in minutes — verified through Egypt Digital ID." },
    ],
  }),
  component: Onboarding,
});

const steps = [
  "Account & Verification",
  "Plan & Documents",
  "Company Details",
  "Ownership Structure",
  "Biometric Information",
  "Business Details",
  "Declarations",
  "Finalize & Submit",
] as const;

function Onboarding() {
  const [step, setStep] = useState(0);
  const refId = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const rnd = Math.floor(100 + Math.random() * 900);
    return `CMB${pad(d.getDate())}${pad(d.getMonth() + 1)}${String(d.getFullYear()).slice(2)}-${rnd}`;
  }, []);

  const [data, setData] = useState({
    firstName: "Ahmed",
    lastName: "Hassan",
    email: "ahmed.hassan@email.com",
    confirmEmail: "ahmed.hassan@email.com",
    phone: "",
    turnover: "",
    structure: "" as "single" | "partnership" | "",
    tagRm: false,
    optIn: false,
    agree: false,
  });
  const update = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const canContinue = (() => {
    switch (step) {
      case 0:
        return (
          data.firstName.trim().length > 1 &&
          data.lastName.trim().length > 1 &&
          /\S+@\S+\.\S+/.test(data.email) &&
          data.email === data.confirmEmail &&
          data.phone.length >= 10 &&
          !!data.turnover &&
          !!data.structure &&
          data.agree
        );
      default:
        return true;
    }
  })();

  const next = () => setStep((s) => Math.min(steps.length, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const progress = Math.round((step / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint/30 via-background to-mint/20">
      <Header refId={refId} />
      {step >= steps.length ? (
        <div className="mx-auto max-w-3xl px-6 py-16">
          <SuccessStep />
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <ProgressCard step={step} progress={progress} />
            <SideStepper current={step} />
          </aside>

          <section>
            <div className="rounded-2xl border border-border/60 bg-card shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)] p-8 md:p-10">
              {step === 0 && <AccountVerificationStep data={data} update={update} />}
              {step > 0 && <PlaceholderStep title={steps[step]} />}

              <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={back}
                  disabled={step === 0}
                  className="rounded-full px-7 text-sm font-semibold disabled:opacity-40"
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={next}
                  disabled={!canContinue}
                  className="rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {step === steps.length - 1 ? "Submit application" : "Continue"}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ProgressCard({ step, progress }: { step: number; progress: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Application Completion Progress
      </p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-base font-bold text-foreground">Step {step} of {steps.length}</p>
        <p className="text-sm font-bold text-primary">{progress}%</p>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function SideStepper({ current }: { current: number }) {
  return (
    <nav className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <ol className="space-y-4">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1 ${
                  done
                    ? "bg-mint text-mint-foreground ring-mint"
                    : active
                    ? "bg-card text-mint ring-mint"
                    : "bg-muted text-muted-foreground ring-border"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : active ? <span className="h-2 w-2 rounded-full bg-mint" /> : ""}
              </span>
              <span
                className={`text-sm leading-tight ${
                  active ? "font-semibold text-mint" : done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function AccountVerificationStep({ data, update }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground md:text-[26px]">Open your new corporate account</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Provide the key business and contact details to begin your application.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-mint/40 bg-mint/15 px-4 py-3">
        <DigitalIdBadge />
        <p className="text-sm text-foreground">
          Your identity has been verified via <span className="font-semibold">Digital ID</span>. Pre-filled fields are locked.
        </p>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Field label="First Name" required verified>
          <LockedInput value={data.firstName} onChange={(v) => update("firstName", v)} />
        </Field>
        <Field label="Last Name" required verified>
          <LockedInput value={data.lastName} onChange={(v) => update("lastName", v)} />
        </Field>
        <Field label="Email Address" required verified>
          <LockedInput type="email" value={data.email} onChange={(v) => update("email", v)} />
        </Field>
        <Field label="Confirm Email Address" required>
          <input
            type="email"
            className={inputCls}
            placeholder="ahmed.hassan@email.com"
            value={data.confirmEmail}
            onChange={(e) => update("confirmEmail", e.target.value)}
          />
        </Field>
        <Field label="Mobile Number" required verified>
          <div className="flex h-12 items-stretch overflow-hidden rounded-md border border-border bg-background">
            <button
              type="button"
              className="flex items-center gap-1.5 border-r border-border bg-muted/40 px-3 text-sm font-semibold text-foreground"
            >
              <span aria-hidden className="inline-flex h-4 w-6 overflow-hidden rounded-sm">
                <span className="h-full w-1/3 bg-[#ce1126]" />
                <span className="h-full w-1/3 bg-white" />
                <span className="h-full w-1/3 bg-black" />
              </span>
              +20 <ChevronDown className="h-3 w-3" />
            </button>
            <input
              className="flex-1 bg-transparent px-3 text-sm outline-none"
              placeholder="10 1234 5678"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
              maxLength={11}
            />
          </div>
        </Field>
        <Field label="Expected Annual Turnover" required>
          <div className="flex h-12 items-center rounded-md border border-border bg-background px-3">
            <span className="text-sm font-semibold text-foreground">EGP</span>
            <input
              inputMode="numeric"
              className="ml-2 h-full flex-1 bg-transparent text-sm outline-none"
              placeholder="0"
              value={data.turnover}
              onChange={(e) => update("turnover", e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </Field>
      </div>

      <div className="mt-8">
        <p className="text-sm font-bold text-foreground">How is the company structured?</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <StructureCard
            id="single"
            icon={User}
            label="Single Owner"
            selected={data.structure === "single"}
            onClick={() => update("structure", "single")}
          />
          <StructureCard
            id="partnership"
            icon={Users}
            label="Partnership"
            selected={data.structure === "partnership"}
            onClick={() => update("structure", "partnership")}
          />
        </div>
      </div>

      <div className="mt-7 space-y-3">
        <CheckRow checked={data.tagRm} onChange={(v) => update("tagRm", v)} label="Tag your Relationship Manager (RM)." />
        <CheckRow checked={data.optIn} onChange={(v) => update("optIn", v)} label="Send me updates about Sumerge offers." />
        <CheckRow
          checked={data.agree}
          onChange={(v) => update("agree", v)}
          label={
            <span>
              I agree to the{" "}
              <Link to="/" className="text-primary underline-offset-2 hover:underline">Terms and Conditions</Link>{" "}
              and{" "}
              <Link to="/" className="text-primary underline-offset-2 hover:underline">Privacy Policy</Link>.
            </span>
          }
        />
      </div>
    </div>
  );
}

function PlaceholderStep({ title }: { title: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This section will be available once we finalise the requirements for {title.toLowerCase()}.
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-border/80 bg-muted/30 p-10 text-center text-sm text-muted-foreground">
        Coming soon
      </div>
    </div>
  );
}

function DigitalIdBadge() {
  return (
    <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-md bg-mint/50 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-mint-foreground">
      <ShieldCheck className="h-3 w-3" /> Digital ID
    </span>
  );
}

function Field({
  label,
  required,
  verified,
  children,
}: {
  label: string;
  required?: boolean;
  verified?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </span>
        {verified && <DigitalIdBadge />}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function LockedInput({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      readOnly
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} cursor-not-allowed bg-muted/40 text-muted-foreground`}
    />
  );
}

function StructureCard({
  icon: Icon,
  label,
  selected,
  onClick,
}: {
  id: string;
  icon: typeof User;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all ${
        selected
          ? "border-mint bg-mint/15 ring-2 ring-mint/40"
          : "border-border bg-background hover:border-mint/60"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          selected ? "bg-mint text-mint-foreground" : "bg-mint/30 text-mint-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="font-semibold text-foreground">{label}</span>
    </button>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}

function SuccessStep() {
  const router = useRouter();
  void router;
  return (
    <div className="rounded-2xl border border-border bg-card p-10 py-12 text-center shadow-sm">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-mint/30 text-mint-foreground">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <h2 className="mt-5 text-2xl font-bold">Application submitted</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Thank you! We've received your corporate application. A SUMERGE Relationship Manager will reach out within one business day.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/status">Track application</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

// keep tree-shaker happy for icons referenced via map types only
void Upload;
void LogIn;
void ArrowLeft;