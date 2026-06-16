import { useState } from "react";
import { Camera, Check, FileText, Pen, ShieldCheck, Sparkles, Wallet, PiggyBank, Users, Banknote, IdCard, Smartphone, Upload, X, Loader2, Eye, Trash2 } from "lucide-react";
import { biometrics } from "@/lib/integrations";
import { auditLog } from "@/lib/audit";

export const EXTENDED_STEP_TITLES = [
  "Selfie & liveness",
  "Confirm products",
  "Review consents",
  "Upload documents",
  "Digital signature",
  "Review & submit",
] as const;

/* -------- Selfie & passive liveness -------- */
export function SelfieStep({ data, update }: any) {
  const [stage, setStage] = useState<"idle" | "capture" | "analyzing" | "done">(
    data.selfieDone ? "done" : "idle"
  );
  const [score, setScore] = useState<{ live: number; match: number } | null>(
    data.selfieDone ? { live: 0.94, match: 0.91 } : null
  );

  const capture = async () => {
    setStage("capture");
    await new Promise((r) => setTimeout(r, 1200));
    setStage("analyzing");
    auditLog("biometrics.start");
    const live = await biometrics.livenessCheck();
    const match = await biometrics.faceMatch();
    auditLog("biometrics.done", { live: live.score, match: match.score });
    setScore({ live: live.score, match: match.score });
    setStage("done");
    update("selfieDone", true);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-primary">Selfie & liveness check</h2>
      <p className="mt-1 text-sm text-muted-foreground">We'll compare a quick selfie against your ID photo. Make sure you're in a well-lit space.</p>

      <div className="mt-6 grid place-items-center rounded-2xl border-2 border-dashed border-border bg-secondary/10 py-10">
        {stage === "idle" && (
          <button onClick={capture} className="grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant hover:scale-105 transition">
            <Camera className="h-10 w-10" />
          </button>
        )}
        {stage === "capture" && <div className="grid h-24 w-24 place-items-center rounded-full bg-primary/20 animate-pulse"><Camera className="h-10 w-10 text-primary" /></div>}
        {stage === "analyzing" && (
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-3 text-sm font-semibold text-primary">Analyzing liveness…</p>
            <p className="mt-1 text-xs text-muted-foreground">Blink, then turn slightly left and right.</p>
          </div>
        )}
        {stage === "done" && score && (
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white"><Check className="h-8 w-8" /></div>
            <p className="mt-3 text-sm font-semibold text-emerald-600">Verified</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-white px-3 py-2"><span className="text-muted-foreground">Liveness </span><span className="font-bold">{(score.live * 100).toFixed(0)}%</span></div>
              <div className="rounded-lg bg-white px-3 py-2"><span className="text-muted-foreground">Face match </span><span className="font-bold">{(score.match * 100).toFixed(0)}%</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------- Product confirmation / catalog -------- */
const PRODUCTS = [
  { id: "savings", icon: PiggyBank, name: "Savings Account", desc: "Earn interest with flexible withdrawals.", min: 0 },
  { id: "current", icon: Wallet, name: "Current Account", desc: "Everyday banking with debit card.", min: 0 },
  { id: "youth", icon: Users, name: "Youth Account", desc: "For customers under 25.", min: 0, ageMax: 25 },
  { id: "payroll", icon: Banknote, name: "Payroll Account", desc: "Salary domiciled · fee-waived.", min: 5000 },
  { id: "premium", icon: Sparkles, name: "Premium Account", desc: "Concierge banking · priority support.", min: 50000 },
  { id: "digital", icon: Smartphone, name: "Digital Account", desc: "100% mobile-first banking.", min: 0 },
] as const;

export function ConfirmProductsStep({ data, update }: any) {
  const income = Number(String(data.income || "0").replace(/[^\d]/g, "")) || 0;
  const age = data.dob ? Math.floor((Date.now() - new Date(data.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : 30;
  const eligible = PRODUCTS.filter((p) => income >= p.min && (!("ageMax" in p) || age <= (p as any).ageMax));
  const selected: string[] = data.confirmedProducts || (data.productChoice ? [data.productChoice] : []);
  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    update("confirmedProducts", next);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-primary">Confirm your products</h2>
      <p className="mt-1 text-sm text-muted-foreground">Based on your profile, you're eligible for the following accounts. Add one or more.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {eligible.map((p) => {
          const active = selected.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={`relative rounded-2xl border-2 p-4 text-start transition ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
            >
              <p.icon className="h-6 w-6 text-primary" />
              <p className="mt-3 font-semibold text-foreground">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              {active && <span className="absolute top-3 end-3 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span>}
            </button>
          );
        })}
      </div>
      {selected.length === 0 && <p className="mt-3 text-xs text-muted-foreground">Select at least one product to continue.</p>}
    </div>
  );
}

/* -------- Consents -------- */
const CONSENTS = [
  { id: "terms", name: "Terms & Conditions", version: "v3.2 · 2026-01-15", required: true },
  { id: "privacy", name: "Privacy Policy", version: "v2.1 · 2026-01-15", required: true },
  { id: "data", name: "Data Processing Consent", version: "v1.4 · 2026-01-15", required: true },
  { id: "marketing", name: "Marketing Communications", version: "v1.0 · 2026-01-15", required: false },
  { id: "sharing", name: "Third-party Data Sharing", version: "v1.0 · 2026-01-15", required: false },
  { id: "openbanking", name: "Open Banking (future)", version: "v1.0 · 2026-01-15", required: false },
];

export function ConsentsStep({ data, update }: any) {
  const consents: Record<string, { ts: number } | undefined> = data.consents || {};
  const toggle = (id: string) => {
    const next = { ...consents };
    if (next[id]) delete next[id];
    else next[id] = { ts: Date.now() };
    update("consents", next);
    auditLog("consent.toggle", { id, granted: !!next[id] });
  };
  return (
    <div>
      <h2 className="text-xl font-bold text-primary">Review and consent</h2>
      <p className="mt-1 text-sm text-muted-foreground">Required consents are marked. Each is versioned and timestamped.</p>
      <ul className="mt-5 space-y-2">
        {CONSENTS.map((c) => {
          const granted = !!consents[c.id];
          return (
            <li key={c.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <input
                id={`c-${c.id}`}
                type="checkbox"
                checked={granted}
                onChange={() => toggle(c.id)}
                className="mt-1 h-4 w-4 accent-[#2E2A6E]"
              />
              <label htmlFor={`c-${c.id}`} className="flex-1 text-sm">
                <span className="font-semibold text-foreground">{c.name}</span>
                {c.required && <span className="ms-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Required</span>}
                <p className="mt-0.5 text-xs text-muted-foreground">{c.version}</p>
              </label>
              <a href="#" className="text-xs font-semibold text-primary hover:underline">View</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function isConsentsValid(data: any) {
  const consents = data.consents || {};
  return CONSENTS.filter((c) => c.required).every((c) => consents[c.id]);
}

/* -------- Document upload -------- */
const DOC_TYPES = [
  { id: "national_id_front", name: "National ID — front", required: true, accept: "image/*,application/pdf" },
  { id: "national_id_back", name: "National ID — back", required: true, accept: "image/*,application/pdf" },
  { id: "address", name: "Proof of address", required: true, accept: "image/*,application/pdf" },
  { id: "utility", name: "Utility bill (≤ 3 months)", required: true, accept: "image/*,application/pdf" },
  { id: "salary", name: "Salary certificate / income proof", required: false, accept: "image/*,application/pdf" },
];

export function DocumentsStep({ data, update }: any) {
  const docs: Record<string, { name: string; size: number } | undefined> = data.documents || {};
  const set = (id: string, file: File | null) => {
    const next = { ...docs };
    if (file) next[id] = { name: file.name, size: file.size };
    else delete next[id];
    update("documents", next);
    auditLog("documents.upload", { id, name: file?.name, size: file?.size });
  };
  return (
    <div>
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-primary md:text-[28px]">Upload supporting documents</h2>
        <p className="mt-2 text-sm text-muted-foreground">Photo or PDF. Each file up to 10 MB.</p>
      </header>
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_120px_180px] items-center gap-4 border-b border-border bg-background px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div>Documents</div>
          <div className="text-center">Status</div>
          <div className="text-center">Actions</div>
        </div>
        {DOC_TYPES.map((d) => {
          const uploaded = docs[d.id];
          const done = !!uploaded;
          return (
            <div key={d.id} className="flex flex-col gap-3 border-t border-border px-4 py-4 first:border-t-0 sm:grid sm:grid-cols-[minmax(0,1fr)_120px_180px] sm:items-center sm:gap-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/60 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{d.name}</span>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${d.required ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{d.required ? "Required" : "Optional"}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Max 10MB · {d.accept.includes("pdf") ? ".jpg, .png, .pdf" : ".jpg, .png"}</div>
                  {done && (
                    <button type="button" className="mt-1 truncate text-xs font-medium text-primary hover:underline">{uploaded!.name} · {(uploaded!.size / 1024).toFixed(0)} KB</button>
                  )}
                </div>
              </div>
              <div className={`text-left text-sm font-medium sm:text-center ${done ? "text-primary" : "text-muted-foreground"}`}>
                {done ? "Uploaded" : "Pending"}
              </div>
              {done ? (
                <div className="flex items-center justify-start gap-4 text-sm font-medium sm:justify-center">
                  <button type="button" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                    <Eye className="h-4 w-4" /> Open
                  </button>
                  <button type="button" onClick={() => set(d.id, null)} className="inline-flex items-center gap-1.5 text-destructive hover:underline">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-stretch gap-1 sm:items-center">
                  <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary sm:max-w-[180px]">
                    <Upload className="h-4 w-4" /> Upload
                    <input type="file" accept={d.accept} className="hidden" onChange={(e) => set(d.id, e.target.files?.[0] || null)} />
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function isDocumentsValid(data: any) {
  const docs = data.documents || {};
  return DOC_TYPES.filter((d) => d.required).every((d) => docs[d.id]);
}

/* -------- Digital signature -------- */
export function SignatureStep({ data, update }: any) {
  const [otp, setOtp] = useState(data.signatureOtp || "");
  const [signed, setSigned] = useState(!!data.signedAt);
  const sign = () => {
    if (otp.length !== 6 || !data.signatureName?.trim()) return;
    const ts = Date.now();
    update("signedAt", ts);
    update("signatureOtp", otp);
    auditLog("signature.sign", { name: data.signatureName, ts });
    setSigned(true);
  };
  return (
    <div>
      <h2 className="text-xl font-bold text-primary">e-signature</h2>
      <p className="mt-1 text-sm text-muted-foreground">Type your full legal name and confirm with the OTP we sent to your mobile.</p>

      <div className="mt-5 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5" /> SUMERGE Account Agreement · v3.2
        </div>
        <div className="mt-3 h-32 overflow-y-auto rounded-lg bg-secondary/15 p-3 text-xs text-foreground/80">
          By signing, you agree to SUMERGE's Account Terms, Privacy Notice, and authorize SUMERGE to perform identity, AML, and credit checks in line with Central Bank of Egypt regulations. The signed agreement will be stored and a copy emailed to you.
        </div>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full legal name</label>
        <input
          value={data.signatureName || ""}
          onChange={(e) => update("signatureName", e.target.value)}
          placeholder="As shown on your National ID"
          disabled={signed}
          className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-secondary/30 italic font-serif"
        />

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">OTP (sent to mobile)</label>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          maxLength={6}
          disabled={signed}
          placeholder="••••••"
          className="mt-1 h-11 w-40 rounded-lg border border-border bg-background px-3 text-center font-mono tracking-[0.4em] outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-secondary/30"
        />

        {!signed ? (
          <button
            onClick={sign}
            disabled={otp.length !== 6 || !data.signatureName?.trim()}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            <Pen className="h-4 w-4" /> Sign agreement
          </button>
        ) : (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <Check className="h-4 w-4" /> Signed · {new Date(data.signedAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------- Review & submit -------- */
export function ReviewStep({ data, goToStep }: any) {
  const Row = ({ label, value, step }: { label: string; value: any; step: number }) => (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 py-2.5 last:border-0">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value || "—"}</p>
      </div>
      <button onClick={() => goToStep(step)} className="text-xs font-semibold text-primary hover:underline">Edit</button>
    </div>
  );
  return (
    <div>
      <h2 className="text-xl font-bold text-primary">Review your application</h2>
      <p className="mt-1 text-sm text-muted-foreground">Confirm everything looks right before final submission.</p>

      <Section title="Contact" icon={Smartphone}>
        <Row label="Mobile" value={`+20 ${data.phone}`} step={1} />
        <Row label="Email" value={data.email} step={1} />
      </Section>
      <Section title="Identity" icon={IdCard}>
        <Row label="Full name" value={data.fullName} step={0} />
        <Row label={data.docType === "passport" ? "Passport" : "National ID"} value={data.docType === "passport" ? data.passportNumber : data.nationalId} step={0} />
        <Row label="Nationality" value={data.nationality} step={0} />
      </Section>
      <Section title="Work & income" icon={Wallet}>
        <Row label="Employment" value={data.employment} step={2} />
        <Row label="Employer" value={data.employer} step={2} />
        <Row label="Monthly income" value={data.income} step={2} />
      </Section>
      <Section title="Address" icon={FileText}>
        <Row label="Address" value={[data.street, data.city, data.governorate].filter(Boolean).join(", ")} step={3} />
      </Section>
      <Section title="Products" icon={Sparkles}>
        <Row label="Confirmed" value={(data.confirmedProducts || []).join(", ")} step={4} />
      </Section>
      <Section title="Compliance" icon={ShieldCheck}>
        <Row label="PEP status" value={data.pepStatus} step={2} />
        <Row label="US person" value={data.fatcaUs} step={2} />
        <Row label="Documents uploaded" value={Object.keys(data.documents || {}).length} step={4} />
        <Row label="Signed at" value={data.signedAt ? new Date(data.signedAt).toLocaleString() : "—"} step={5} />
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      {children}
    </div>
  );
}
