import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, LogIn, Upload, CheckCircle2, IdCard, Wallet, Users, PiggyBank, Banknote, CalendarClock, Pencil, ClipboardCheck, PhoneCall, Sparkles, FileText, Eye, Trash2, Info, Plus, X, BookUser, ShieldCheck, Smartphone, KeyRound, Globe, Loader2, BookmarkPlus } from "lucide-react";
import sumergeLogo from "@/assets/sumerge-logo.png.asset.json";
import Footer from "@/components/site/Footer";
import { useLang } from "@/lib/i18n";
import SessionTimeout from "@/components/SessionTimeout";
import { auditLog } from "@/lib/audit";
import { SelfieStep, ConfirmProductsStep, ConsentsStep, DocumentsStep, SignatureStep, ReviewStep, isConsentsValid, isDocumentsValid } from "@/components/onboarding/ExtendedSteps";

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
  "Tax details",
  "Account setup",
  "Address details",
  "Create login credentials",
  "Selfie & liveness",
  "Confirm products",
  "Review consents",
  "Upload documents",
  "Digital signature",
  "Review & submit",
] as const;

function Onboarding() {
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [residencyType, setResidencyType] = useState<"" | "egyptian" | "foreign">("");
  const { lang, setLang } = useLang();
  const router = useRouter();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyStage, setVerifyStage] = useState<"idle" | "checking" | "done">("idle");
  const [resumed, setResumed] = useState(false);
  const refId = useMemo(() => `SM-2026-${String(Math.floor(100000 + Math.random() * 900000))}`, []);
  const [data, setData] = useState({
    productChoice: "",
    phone: "",
    email: "",
    confirmEmail: "",
    promo: "",
    otpSent: false,
    otp: "",
    mobileCode: "",
    emailCode: "",
    nationalId: "",
    fullName: "",
    firstName: "",
    lastName: "",
    nationality: "Egyptian",
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
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreeCredit: false,
    pepStatus: "" as "" | "yes" | "no",
    pepRole: "",
    pepCountry: "",
    pepRelationship: "",
    pepDates: "",
    mfaMethod: "sms" as "sms" | "app",
    idDoc: false,
    // Document type for step 3
    docType: "nationalId" as "nationalId" | "passport",
    passportNumber: "",
    dob: "",
    proofResidence: false,
    // Tax details
    fatcaUs: "" as "" | "yes" | "no",
    usTin: "",
    crsOther: "" as "" | "yes" | "no",
    crsRows: [] as { country: string; tin: string }[],
    taxDeclaration: false,
    // Contact extras
    phone2: "",
    homePhone: "",
    statementFrequency: "Monthly" as "Monthly" | "Quarterly",
    statementDelivery: "Email",
    correspondenceLanguage: "English" as "Arabic" | "English",
    // Additional personal details
    gender: "" as "" | "Male" | "Female",
    placeOfBirth: "",
    countryOfBirth: "",
    maritalStatus: "",
    education: "",
    hasOtherNationalities: "" as "" | "yes" | "no",
    otherNationalities: "",
    residenceClassification: "" as "" | "resEgy" | "nonResEgy" | "resFor" | "nonResFor",
    specialNeeds: "" as "" | "yes" | "no",
    specialNeedsType: "",
    // Work extras
    employmentStartDate: "",
    workPhone: "",
    previousOccupation: "",
    expectedTxVolume: "",
    // Address extras
    residenceType: "" as "" | "Owned" | "Rented" | "Other",
    residenceTypeOther: "",
    // Additional declarations (step 5)
    realBeneficiary: "" as "" | "yes" | "no",
    hasPoA: "" as "" | "yes" | "no",
    hasOtherBankAccounts: "" as "" | "yes" | "no",
    dealsInSecurities: "" as "" | "yes" | "no",
    smsConsent: "yes" as "" | "yes" | "no",
    // Account setup (new step 6)
    accountPurpose: "",
    accountCurrency: "",
    linkDebitCard: "yes" as "" | "yes" | "no",
    cardType: "Standard" as "Standard" | "Premium",
    nameOnCard: "",
    nameOnCardAr: "",
    authorizedPersons: [] as { cif: string; name: string; authType: string; docType: string }[],
    phoneBanking: "yes" as "" | "yes" | "no",
  });
  const update = (k: keyof typeof data, v: any) => setData((d) => ({ ...d, [k]: v }));
  const advance = () =>
    setStep((s) => {
      const n = Math.min(steps.length, s + 1);
      setMaxStep((m) => Math.max(m, n));
      return n;
    });
  const next = () => {
    if (step === 1 && !otpVerified) {
      setOtpStage(true);
      return;
    }
    advance();
  };
  const back = () => {
    if (step === 1 && otpStage) {
      setOtpStage(false);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };
  const verifyOtpAndContinue = () => {
    setOtpVerified(true);
    setOtpStage(false);
    advance();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("resume") === "1") {
      setResumed(true);
      setResidencyType("egyptian");
      setStep(0);
      setMaxStep(0);
    }
  }, []);

  // Step 3 verification simulation: when ID doc uploaded, cycle through statuses
  useEffect(() => {
    if (!data.idDoc) {
      setVerifyStage("idle");
      return;
    }
    setVerifyStage("checking");
    const t = setTimeout(() => setVerifyStage("done"), 4500);
    return () => clearTimeout(t);
  }, [data.idDoc]);

  const handleLang = (l: "en" | "ar") => setLang(l);

  const selectResidency = (r: "egyptian" | "foreign") => {
    setResidencyType(r);
    const dt = r === "foreign" ? "passport" : "nationalId";
    setData((d) => ({
      ...d,
      docType: dt,
      nationality: dt === "nationalId" ? "Egyptian" : "",
    }));
  };

  const canContinue = (() => {
    switch (step) {
      case 0: return !!data.productChoice;
      case 1: return data.phone.length >= 10 && /\S+@\S+/.test(data.email) && data.email === data.confirmEmail && !!data.statementFrequency && !!data.statementDelivery && !!data.correspondenceLanguage;
      case 2: {
        if (!data.idDoc || data.fullName.trim().length <= 3) return false;
        if (verifyStage !== "done") return false;
        if (data.docType === "passport") {
          if (!(data.passportNumber.trim() && data.nationality.trim() && data.dob && data.expiry)) return false;
        } else {
          if (data.nationalId.length !== 14) return false;
        }
        if (!data.gender || !data.placeOfBirth.trim() || !data.countryOfBirth || !data.maritalStatus || !data.education) return false;
        if (!data.hasOtherNationalities) return false;
        if (data.hasOtherNationalities === "yes" && !data.otherNationalities.trim()) return false;
        if (!data.residenceClassification) return false;
        if (!data.specialNeeds) return false;
        if (data.specialNeeds === "yes" && !data.specialNeedsType) return false;
        return true;
      }
      case 3: {
        const baseOk = !!data.employment && !!data.income && !!data.employer.trim() && !!data.jobTitle.trim() && !!data.sourceOfFunds;
        const isBiz = data.employment === "Self-employed" || data.employment === "Business owner";
        if (!baseOk) return false;
        if (isBiz && !data.businessReg.trim()) return false;
        if (!data.expectedTxVolume) return false;
        if ((data.employment === "Employed" || data.employment === "Self-employed") && !data.employmentStartDate) return false;
        if (data.employment === "Retired" && !data.previousOccupation.trim()) return false;
        return true;
      }
      case 4: {
        if (!data.fatcaUs || !data.crsOther || !data.taxDeclaration) return false;
        if (data.fatcaUs === "yes" && !data.usTin.trim()) return false;
        if (data.crsOther === "yes") {
          if (data.crsRows.length === 0) return false;
          if (!data.crsRows.some((r: any) => r.country && r.tin.trim())) return false;
        }
        if (!data.pepStatus) return false;
        if (data.pepStatus === "yes" && (!data.pepRole.trim() || !data.pepCountry.trim() || !data.pepRelationship.trim() || !data.pepDates.trim())) return false;
        if (data.realBeneficiary !== "yes") return false;
        if (!data.hasPoA || !data.hasOtherBankAccounts || !data.dealsInSecurities || !data.smsConsent) return false;
        return true;
      }
      case 5: {
        if (!data.accountPurpose || !data.accountCurrency || !data.linkDebitCard) return false;
        if (data.linkDebitCard === "yes" && (!data.cardType || !data.nameOnCard.trim())) return false;
        return true;
      }
      case 6: {
        if (!data.residenceType) return false;
        if (data.residenceType === "Other" && !data.residenceTypeOther.trim()) return false;
        return !!data.governorate && !!data.city.trim() && !!data.street.trim();
      }
      case 7: {
        const pwOk = data.password.length >= 8 && data.password === data.confirmPassword;
        return /\S+@\S+/.test(data.email) && pwOk && data.agreeTerms && data.agreeCredit && !!data.mfaMethod;
      }
      case 8: return !!(data as any).selfieDone;
      case 9: return ((data as any).confirmedProducts || []).length > 0;
      case 10: return isConsentsValid(data);
      case 11: return isDocumentsValid(data);
      case 12: return !!(data as any).signedAt;
      case 13: return true;
      default: return true;
    }
  })();

  const onFinalSubmit = () => {
    auditLog("application.submit", { ref: refId }, refId);
    router.navigate({ to: "/welcome" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,#dff0ea_0%,#e6f3ee_50%,#edf6f2_100%)]">
      <TopBar refId="EGY140626-476" lang={lang} onLang={handleLang} />
      <main className="flex-1">
      {resumed && (
        <div className="mx-auto mt-4 max-w-3xl px-4 sm:px-6">
          <div className="flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/15 px-4 py-3 text-sm text-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <p><span className="font-semibold">Welcome back</span> — resuming your application. Your reference is <span className="font-mono font-bold">{refId}</span>.</p>
          </div>
        </div>
      )}
      {!residencyType ? (
        <div className="mx-auto max-w-3xl px-6 py-14">
          <CardToolbar onSave={() => setShowSaveModal(true)} />
          <ResidencyPrescreen onSelect={selectResidency} />
        </div>
      ) : step >= steps.length ? (
        <div className="mx-auto max-w-3xl px-6 py-16">
          <SuccessStep />
        </div>
      ) : (
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 md:py-10">
          <HorizontalStepper current={step} maxReached={maxStep} onJump={(i) => setStep(i)} />
          <section className="mt-6 min-h-[560px]">
            <div className="rounded-2xl bg-card p-6 md:p-10 shadow-elegant">
              <CardToolbar onSave={() => setShowSaveModal(true)} />
              {step === 0 && <ChooseOptionStep data={data} update={update} residencyType={residencyType} />}
              {step === 1 && !otpStage && <ContactStep data={data} update={update} />}
              {step === 1 && otpStage && (
                <OtpPanel data={data} update={update} />
              )}
              {step === 2 && <CaptureIdStep data={data} update={update} goToStep={(i: number) => setStep(i)} verifyStage={verifyStage} />}
              {step === 3 && <WorkProductStep data={data} update={update} onChangeProduct={() => setStep(0)} />}
              {step === 4 && <TaxStep data={data} update={update} />}
              {step === 5 && <AccountSetupStep data={data} update={update} />}
              {step === 6 && <AddressStep data={data} update={update} />}
              {step === 7 && <CredentialsStep data={data} update={update} />}
              {step === 8 && <SelfieStep data={data} update={update} />}
              {step === 9 && <ConfirmProductsStep data={data} update={update} />}
              {step === 10 && <ConsentsStep data={data} update={update} />}
              {step === 11 && <DocumentsStep data={data} update={update} />}
              {step === 12 && <SignatureStep data={data} update={update} />}
              {step === 13 && <ReviewStep data={data} goToStep={(i: number) => setStep(i)} />}

              <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0 && !otpStage}
                  className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground/80 hover:bg-secondary/40 disabled:opacity-40"
                >
                  Back
                </button>
                {otpStage ? (
                  <Button
                    size="lg"
                    onClick={verifyOtpAndContinue}
                    disabled={!(data.mobileCode.length === 6 && data.emailCode.length === 6)}
                    className="h-11 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2"
                  >
                    Verify and continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={step === steps.length - 1 ? onFinalSubmit : next}
                    disabled={!canContinue}
                    className="h-11 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2"
                  >
                    {step === steps.length - 1 ? "Submit application" : "Continue"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
      </main>
      <Footer />
      {showSaveModal && <SaveModal refId={refId} onClose={() => setShowSaveModal(false)} />}
      <SessionTimeout onSignOut={() => router.navigate({ to: "/" })} />
    </div>
  );
}

function TopBar({ refId, lang, onLang }: { refId?: string; lang: "en" | "ar"; onLang: (l: "en" | "ar") => void }) {
  return (
    <header className="bg-background/90 backdrop-blur border-b border-border/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-10 sm:py-5">
        <Link to="/" aria-label="SUMERGE home" className="flex items-center">
          <img src={sumergeLogo.url} alt="SUMERGE" className="h-7 w-auto sm:h-8" />
        </Link>
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {refId && (
            <div className="min-w-0 text-right leading-tight">
              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-semibold sm:text-[10px]">Reference</p>
              <p className="truncate text-xs font-mono font-bold text-primary sm:text-sm">{refId}</p>
            </div>
          )}
          <LangToggle lang={lang} onChange={onLang} />
          <Link to="/" aria-label="Sign in" className="shrink-0 text-foreground/70 hover:text-primary">
            <LogIn className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function LangToggle({ lang, onChange }: { lang: "en" | "ar"; onChange: (l: "en" | "ar") => void }) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex shrink-0 items-center rounded-full border border-border bg-background p-0.5 text-[11px] font-semibold"
    >
      <Globe className="mx-1 h-3 w-3 text-muted-foreground" />
      {(["en", "ar"] as const).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => onChange(l)}
            className={`rounded-full px-2 py-0.5 uppercase tracking-wider transition-colors ${active ? "bg-secondary text-secondary-foreground" : "text-foreground/70 hover:text-foreground"}`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

function CardToolbar({ onSave }: { onSave: () => void }) {
  return (
    <div className="mb-4 flex justify-end">
      <button
        type="button"
        onClick={onSave}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5"
      >
        <BookmarkPlus className="h-3.5 w-3.5" />
        Save and continue later
      </button>
    </div>
  );
}

function SaveModal({ refId, onClose }: { refId: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/30 text-secondary">
            <BookmarkPlus className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-primary">Save your progress</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your application reference number can be used to resume where you left off.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-secondary/15 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Reference</p>
          <p className="text-base font-mono font-bold text-primary">{refId}</p>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          We've also emailed this reference to you. You can resume from the SUMERGE landing page anytime.
        </p>
        <div className="mt-5 flex justify-end">
          <Button onClick={onClose} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}

function OtpField({ label, value, onChange, resendIn, onResend }: { label: string; value: string; onChange: (v: string) => void; resendIn: number; onResend: () => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      <input
        inputMode="numeric"
        maxLength={6}
        placeholder="••••••"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="h-12 w-full rounded-md border border-border bg-background px-3 text-center text-lg font-mono tracking-[0.5em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <div className="mt-1.5 text-xs">
        {resendIn > 0 ? (
          <span className="text-muted-foreground">Resend in 0:{String(resendIn).padStart(2, "0")}</span>
        ) : (
          <button type="button" onClick={onResend} className="font-semibold text-primary hover:underline">
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}

function OtpPanel({ data, update }: any) {
  const [resendIn, setResendIn] = useState(30);
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);
  const resend = () => setResendIn(30);
  return (
    <div>
      <StepHeader title="Verify your contact details" subtitle="Enter the codes we sent to your mobile and email" />
      <div className="rounded-xl border border-border bg-secondary/10 p-4 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span><Smartphone className="mr-1 inline h-3.5 w-3.5 text-primary" />+20 {data.phone || "your mobile"}</span>
          <span><PhoneCall className="mr-1 inline h-3.5 w-3.5 text-primary" />{data.email || "your email"}</span>
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <OtpField label="Mobile code" value={data.mobileCode} onChange={(v) => update("mobileCode", v)} resendIn={resendIn} onResend={resend} />
        <OtpField label="Email code" value={data.emailCode} onChange={(v) => update("emailCode", v)} resendIn={resendIn} onResend={resend} />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        For this demo, any 6-digit code is accepted.
      </p>
    </div>
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

function SideStepper({ current, maxReached, onJump }: { current: number; maxReached: number; onJump: (i: number) => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <ol className="space-y-5">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = i <= maxReached;
          return (
            <li key={label}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onJump(i)}
                className={`flex w-full items-center gap-3 rounded-md text-left ${clickable ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}`}
              >
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
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function HorizontalStepper({ current, maxReached, onJump }: { current: number; maxReached: number; onJump: (i: number) => void }) {
  const total = steps.length;
  const safeCurrent = Math.min(current, total - 1);
  const pct = Math.round(((safeCurrent + 1) / total) * 100);
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-[11px]">Application Progress</p>
          <p className="mt-0.5 truncate text-sm font-bold text-foreground">
            Step {safeCurrent + 1} of {total} — {steps[safeCurrent]}
          </p>
        </div>
        <span className="shrink-0 text-sm font-bold text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/30">
        <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-4 flex items-center justify-between gap-1">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = i <= maxReached;
          return (
            <li key={label} className="flex flex-1 justify-center">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onJump(i)}
                title={label}
                aria-label={label}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-semibold ${
                  done
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : active
                      ? "border-secondary bg-card text-primary"
                      : "border-border bg-card text-muted-foreground"
                } ${clickable ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}`}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </button>
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

function ResidencyPrescreen({ onSelect }: { onSelect: (r: "egyptian" | "foreign") => void }) {
  const opts: { id: "egyptian" | "foreign"; label: string; icon: any; desc: string }[] = [
    { id: "egyptian", label: "Egyptian national", icon: IdCard, desc: "I'll verify with my Egyptian National ID." },
    { id: "foreign", label: "Passport", icon: BookUser, desc: "I'll verify with my passport." },
  ];
  return (
    <div className="rounded-2xl bg-card p-6 md:p-10 shadow-elegant">
      <StepHeader title="Let's find the right account for you" subtitle="Are you opening this account as..." />
      <div className="grid gap-4 md:grid-cols-2">
        {opts.map((o) => {
          const Icon = o.icon;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onSelect(o.id)}
              className="flex flex-col items-center gap-4 rounded-xl border border-border bg-background p-8 text-center transition-all hover:border-primary/60 hover:bg-primary/5"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-8 w-8" />
              </span>
              <div>
                <div className="text-base font-bold text-foreground">{o.label}</div>
                <div className="mt-1 text-sm text-muted-foreground">{o.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChooseOptionStep({ data, update, residencyType }: any) {
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
      availableTo: ["egyptian", "foreign"],
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
      availableTo: ["egyptian", "foreign"],
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
      availableTo: ["egyptian", "foreign"],
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
      availableTo: ["egyptian", "foreign"],
    },
  ];
  return (
    <div>
      <StepHeader title="How can SUMERGE work for you?" subtitle="Explore and select an account that works for you:" />
      <div className="space-y-3">
        {options.map((o) => {
          const Icon = o.icon;
          const selected = data.productChoice === o.id;
          const disabled = residencyType && !o.availableTo.includes(residencyType);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => !disabled && update("productChoice", o.id)}
              disabled={!!disabled}
              className={`flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-all ${disabled ? "border-border bg-muted/40 opacity-60 cursor-not-allowed" : selected ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-background hover:border-primary/40"}`}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                {o.badge ? <span className="text-xs">{o.badge}</span> : <Icon className="h-5 w-5" />}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-foreground">{o.t}</span>
                  {disabled && (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Not available for foreign nationals</span>
                  )}
                </div>
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
          <Field label="Mobile No. 2 (optional)">
            <div className="flex h-12 items-center rounded-md border border-border bg-background px-3">
              <span className="text-sm font-semibold text-foreground">+20</span>
              <input
                className="ml-2 h-full flex-1 bg-transparent text-sm outline-none"
                placeholder="1XX XXX XXXX"
                value={data.phone2}
                onChange={(e) => update("phone2", e.target.value.replace(/\D/g, ""))}
                maxLength={11}
              />
            </div>
          </Field>
          <Field label="Home phone (optional)">
            <div className="flex h-12 items-center rounded-md border border-border bg-background px-3">
              <span className="text-sm font-semibold text-foreground">+20</span>
              <input
                className="ml-2 h-full flex-1 bg-transparent text-sm outline-none"
                placeholder="2 XXXX XXXX"
                value={data.homePhone}
                onChange={(e) => update("homePhone", e.target.value.replace(/\D/g, ""))}
                maxLength={11}
              />
            </div>
          </Field>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Email"><input type="email" className={inputCls} value={data.email} onChange={(e) => update("email", e.target.value)} /></Field>
          <Field label="Confirm Email"><input type="email" className={inputCls} value={data.confirmEmail} onChange={(e) => update("confirmEmail", e.target.value)} /></Field>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Statement frequency">
            <PillToggle
              options={[{ v: "Monthly", label: "Monthly" }, { v: "Quarterly", label: "Quarterly" }]}
              value={data.statementFrequency}
              onChange={(v) => update("statementFrequency", v)}
            />
          </Field>
          <Field label="Statement delivery method">
            <select className={inputCls} value={data.statementDelivery} onChange={(e) => update("statementDelivery", e.target.value)}>
              <option value="">Select method</option>
              <option>Email</option>
              <option>Mobile app</option>
              <option>Post (mailing address)</option>
            </select>
          </Field>
        </div>
        <Field label="Correspondence language">
          <PillToggle
            options={[{ v: "Arabic", label: "Arabic" }, { v: "English", label: "English" }]}
            value={data.correspondenceLanguage}
            onChange={(v) => update("correspondenceLanguage", v)}
          />
        </Field>
        <div>
          <p className="mb-1.5 text-sm font-semibold text-foreground">Have a promo code? (Optional)</p>
          <input className={inputCls} placeholder="Promo code" value={data.promo} onChange={(e) => update("promo", e.target.value)} />
        </div>
        <p className="text-sm text-muted-foreground">If we sense an issue during your application, we may reach out via email, mobile, or WhatsApp to help you complete the process.</p>
      </div>
    </div>
  );
}

function CaptureIdStep({ data, update, goToStep, verifyStage }: any) {
  const isPassport = data.docType === "passport";
  const impliedResidency = isPassport ? "foreign" : "egyptian";
  // Look up selected product's availability — kept in sync with ChooseOptionStep (placeholder all-allowed).
  const PRODUCT_AVAILABILITY: Record<string, string[]> = {
    "saving": ["egyptian", "foreign"],
    "current": ["egyptian", "foreign"],
    "prime-saving": ["egyptian", "foreign"],
    "current-365": ["egyptian", "foreign"],
  };
  const productAvail = PRODUCT_AVAILABILITY[data.productChoice] || ["egyptian", "foreign"];
  const mismatch = data.productChoice && !productAvail.includes(impliedResidency);
  const handleUploadNid = () => {
    update("idDoc", true);
    update("fullName", "Mohamed Ahmed Hassan");
    update("nationalId", "29001011234567");
    update("nationality", "Egyptian");
    update("expiry", "2030-05-12");
    update("gender", "Male");
    update("placeOfBirth", "Cairo");
    update("countryOfBirth", "Egypt");
  };
  const handleUploadPassport = () => {
    update("idDoc", true);
    update("fullName", "John Michael Smith");
    update("passportNumber", "P12345678");
    update("nationality", "United Kingdom");
    update("dob", "1990-04-22");
    update("expiry", "2031-09-15");
    update("gender", "Male");
    update("placeOfBirth", "London");
    update("countryOfBirth", "United Kingdom");
  };
  const onDocTypeChange = (v: string) => {
    update("docType", v);
    // Reset upload + OCR fields when switching
    update("idDoc", false);
    update("fullName", "");
    update("nationalId", "");
    update("passportNumber", "");
    update("nationality", v === "nationalId" ? "Egyptian" : "");
    update("dob", "");
    update("expiry", "");
  };
  const showOcr = data.idDoc && verifyStage === "done";
  const showChecking = data.idDoc && verifyStage === "checking";
  return (
    <div>
      <StepHeader title="Verify your identity" subtitle="Choose the document you'd like to use to verify your identity." />
      {mismatch && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            {PRODUCT_LABELS[data.productChoice]} isn't available with this document type. Please go back and choose a different account.
          </p>
          <button
            type="button"
            onClick={() => goToStep(0)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400 bg-background px-4 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
          >
            Back to step 1
          </button>
        </div>
      )}
      <h3 className="mb-4 text-lg font-bold text-primary">
        {isPassport
          ? "Please capture/upload your passport"
          : "Please capture/upload your National ID"}
      </h3>
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_120px_180px] items-center gap-4 border-b border-border bg-background px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div>Documents</div>
          <div className="text-center">Status</div>
          <div className="text-center">Actions</div>
        </div>
        {isPassport ? (
          <UploadRow
            label="Passport (bio page)"
            fileName="passport.jpg"
            done={data.idDoc}
            onClick={handleUploadPassport}
            onDelete={() => update("idDoc", false)}
          />
        ) : (
          <UploadRow
            label="National ID"
            fileName="NID.jpg"
            done={data.idDoc}
            onClick={handleUploadNid}
            onDelete={() => update("idDoc", false)}
          />
        )}
      </div>

      {showChecking && (
        <VerifyingCard />
      )}

      {showOcr && !isPassport && (
        <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold">Great! Please check the captured details</h3>
            <VerifiedBadge />
          </div>
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
                <input readOnly className={`${inputCls} bg-secondary/20 cursor-not-allowed`} value={data.nationality} />
              </Field>
              <Field label="Expiry date">
                <input type="date" className={inputCls} value={data.expiry} onChange={(e) => update("expiry", e.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      )}

      {showOcr && isPassport && (
        <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold">Great! Please check the captured details</h3>
            <VerifiedBadge />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Your personal info has been captured from your passport</p>
          <div className="mt-5 rounded-lg border border-border bg-background p-5">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <IdCard className="h-5 w-5 text-primary" />
              <input
                className="flex-1 bg-transparent text-base font-semibold outline-none"
                placeholder="Full name as per passport"
                value={data.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Passport number">
                <input className={inputCls} value={data.passportNumber} onChange={(e) => update("passportNumber", e.target.value)} />
              </Field>
              <Field label="Nationality">
                <select className={inputCls} value={data.nationality} onChange={(e) => update("nationality", e.target.value)}>
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Date of birth">
                <input type="date" className={inputCls} value={data.dob} onChange={(e) => update("dob", e.target.value)} />
              </Field>
              <Field label="Expiry date">
                <input type="date" className={inputCls} value={data.expiry} onChange={(e) => update("expiry", e.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      )}

      {showOcr && (
        <AdditionalPersonalDetails data={data} update={update} />
      )}
    </div>
  );
}

function UploadRow({ label, fileName, done, onClick, onDelete, optional }: { label: string; fileName: string; done: boolean; onClick: () => void; onDelete: () => void; optional?: boolean }) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:grid sm:grid-cols-[minmax(0,1fr)_120px_180px] sm:items-center sm:gap-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/60 text-primary">
          <FileText className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-foreground">{label}</span>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${optional ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>{optional ? "Optional" : "Required"}</span>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">Max 5MB</div>
          {done && (
            <button type="button" className="mt-1 truncate text-xs font-medium text-primary hover:underline">{fileName}</button>
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
          <button type="button" onClick={onDelete} className="inline-flex items-center gap-1.5 text-destructive hover:underline">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-stretch gap-1 sm:items-center">
          <button
            type="button"
            onClick={onClick}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary sm:max-w-[180px]"
          >
            <Upload className="h-4 w-4" /> Upload
          </button>
          <span className="text-[11px] text-muted-foreground sm:text-center">Accepts .jpg, .png</span>
        </div>
      )}
    </div>
  );
}

const PRODUCT_LABELS: Record<string, string> = {
  "saving": "Saving Account",
  "current": "Non-Interest-Bearing Current Account",
  "prime-saving": "Prime Saving Account",
  "current-365": "Current Account 365 Days",
};

function VerifyingCard() {
  const messages = [
    "Checking document authenticity...",
    "Verifying against national ID records...",
    "Extracting your details...",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 1500);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mt-8 flex items-center gap-4 rounded-xl border border-secondary/40 bg-secondary/20 p-5">
      <Loader2 className="h-6 w-6 shrink-0 animate-spin text-primary" />
      <div>
        <p className="text-sm font-bold text-primary">Verifying your document</p>
        <p className="mt-0.5 text-sm text-foreground/80">{messages[idx]}</p>
      </div>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
      <ShieldCheck className="h-3.5 w-3.5" /> Verified
    </span>
  );
}

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
  const showStartDate = data.employment === "Employed" || data.employment === "Self-employed";
  const showPrevOcc = data.employment === "Retired";
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
        <Field label="Annual income (EGP)">
          <select className={inputCls} value={data.income} onChange={(e) => update("income", e.target.value)}>
            <option value="">Select range</option>
            {["Less than EGP 5K","EGP 5K–10K","EGP 10K–20K","EGP 20K–30K","EGP 30K–70K","EGP 70K–100K","EGP 100K–200K","EGP 200K–300K","EGP 300K–400K","EGP 400K–1,000K","More than EGP 1,000K"].map((g) => <option key={g}>{g}</option>)}
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
        {showStartDate && (
          <Field label="Employment start date">
            <input type="date" className={inputCls} value={data.employmentStartDate} onChange={(e) => update("employmentStartDate", e.target.value)} />
          </Field>
        )}
        <Field label="Work phone (optional)">
          <div className="flex h-12 items-center rounded-md border border-border bg-background px-3">
            <span className="text-sm font-semibold text-foreground">+20</span>
            <input
              className="ml-2 h-full flex-1 bg-transparent text-sm outline-none"
              placeholder="2 XXXX XXXX"
              value={data.workPhone}
              onChange={(e) => update("workPhone", e.target.value.replace(/\D/g, ""))}
              maxLength={11}
            />
          </div>
        </Field>
        {showPrevOcc && (
          <div className="md:col-span-2">
            <Field label="Previous occupation"><input className={inputCls} value={data.previousOccupation} onChange={(e) => update("previousOccupation", e.target.value)} /></Field>
          </div>
        )}
        <div className="md:col-span-2">
          <Field label="Expected monthly transaction volume">
            <select className={inputCls} value={data.expectedTxVolume} onChange={(e) => update("expectedTxVolume", e.target.value)}>
              <option value="">Select range</option>
              {["Under EGP 10,000","EGP 10,000 – 50,000","EGP 50,000 – 200,000","Over EGP 200,000"].map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
        </div>
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
      // postal code not retrieved from National ID
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
      <div className="mb-6">
        <Field label="Type of residence">
          <PillToggle
            options={[{ v: "Owned", label: "Owned" }, { v: "Rented", label: "Rented" }, { v: "Other", label: "Other" }]}
            value={data.residenceType}
            onChange={(v) => update("residenceType", v)}
          />
        </Field>
        {data.residenceType === "Other" && (
          <div className="mt-3">
            <Field label="Please specify"><input className={inputCls} value={data.residenceTypeOther} onChange={(e) => update("residenceTypeOther", e.target.value)} /></Field>
          </div>
        )}
      </div>
      {data.docType !== "passport" && (
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
      )}
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
      <p className="mt-3 text-[12px] text-muted-foreground">This address is used for card delivery and official correspondence.</p>
      {data.docType === "passport" && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-bold text-foreground">Proof of residence in Egypt <span className="font-normal text-muted-foreground">(optional)</span></h3>
          <p className="mb-3 text-xs text-muted-foreground">Upload a recent utility bill or rental contract that confirms your address in Egypt.</p>
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_120px_180px] items-center gap-4 border-b border-border bg-background px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <div>Document</div>
              <div className="text-center">Status</div>
              <div className="text-center">Actions</div>
            </div>
            <UploadRow
              label="Utility bill or rental contract"
              fileName="proof-of-residence.pdf"
              done={data.proofResidence}
              onClick={() => update("proofResidence", true)}
              onDelete={() => update("proofResidence", false)}
              optional
            />
          </div>
        </div>
      )}
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
        <div className="md:col-span-2">
          <Field label="Email (your username)">
            <input type="email" readOnly className={`${inputCls} bg-secondary/20 cursor-not-allowed`} value={data.email} />
          </Field>
          <p className="mt-1.5 text-xs text-muted-foreground">We'll use the email you provided in your contact info as your sign-in username.</p>
        </div>
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

      <MfaSection data={data} update={update} />

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

function MfaSection({ data, update }: any) {
  const opts: { id: "sms" | "app"; icon: any; title: string; desc: string }[] = [
    { id: "sms", icon: Smartphone, title: "SMS verification codes", desc: "Codes sent to your mobile number for each login." },
    { id: "app", icon: KeyRound, title: "Authenticator app", desc: "Use an app like Google Authenticator for login codes." },
  ];
  return (
    <div className="mt-8 border-t border-border/60 pt-6">
      <h3 className="text-base font-bold text-primary">Set up extra security</h3>
      <p className="mt-1 text-sm text-muted-foreground">Add an extra layer of protection to your account.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {opts.map((o) => {
          const Icon = o.icon;
          const selected = data.mfaMethod === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => update("mfaMethod", o.id)}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${selected ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-background hover:border-primary/40"}`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-bold text-foreground">{o.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{o.desc}</div>
              </div>
              <span className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border"}`}>
                {selected && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
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
  // placeholder anchor
  return <SuccessStepInner />;
}

const COUNTRIES = ["United Arab Emirates","Saudi Arabia","United Kingdom","United States","Canada","Germany","France","Italy","Spain","Netherlands","Switzerland","Sweden","Australia","Japan","China","India","Turkey","Lebanon","Jordan","Kuwait","Qatar","Bahrain","Oman","Morocco","Tunisia","Sudan","South Africa","Other"];

function Segmented({ value, onChange }: { value: "" | "yes" | "no"; onChange: (v: "yes" | "no") => void }) {
  const opts: { v: "yes" | "no"; label: string }[] = [
    { v: "yes", label: "Yes" },
    { v: "no", label: "No" },
  ];
  return (
    <div className="inline-flex rounded-full border border-border bg-background p-1">
      {opts.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`min-w-[80px] rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${active ? "bg-secondary text-secondary-foreground" : "text-foreground/70 hover:text-foreground"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function PillToggle<T extends string>({ options, value, onChange }: { options: { v: T; label: string }[]; value: T | ""; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-background p-1">
      {options.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`min-w-[100px] rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${active ? "bg-secondary text-secondary-foreground" : "text-foreground/70 hover:text-foreground"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function InfoHint({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <Info className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 hidden w-64 -translate-x-1/2 rounded-md bg-foreground px-3 py-2 text-[11px] font-medium text-background shadow-lg group-hover:block">
        {text}
      </span>
    </span>
  );
}

function TaxStep({ data, update }: any) {
  const rows: { country: string; tin: string }[] = data.crsRows;
  const setRows = (r: { country: string; tin: string }[]) => update("crsRows", r);
  const addRow = () => setRows([...rows, { country: "", tin: "" }]);
  const updRow = (i: number, patch: Partial<{ country: string; tin: string }>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const removeRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i));

  const toggleCrs = (v: "yes" | "no") => {
    update("crsOther", v);
    if (v === "yes" && rows.length === 0) setRows([{ country: "", tin: "" }]);
    if (v === "no") setRows([]);
  };
  const toggleFatca = (v: "yes" | "no") => {
    update("fatcaUs", v);
    if (v === "no") update("usTin", "");
  };

  // For foreign nationals (passport): default CRS to "yes" and pre-fill nationality
  useEffect(() => {
    if (data.docType === "passport" && data.crsOther === "") {
      update("crsOther", "yes");
      const prefill = data.nationality && data.nationality !== "Egyptian" ? data.nationality : "";
      if (rows.length === 0) setRows([{ country: prefill, tin: "" }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <StepHeader
        title="Tax residency declaration"
        subtitle="Under FATCA and the Common Reporting Standard (CRS), banks are required by law to collect tax residency information from account holders and share it with the relevant tax authorities where applicable."
      />

      {/* Section 1 — Egypt */}
      <div className="rounded-xl border border-border bg-secondary/20 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-base shadow-sm">🇪🇬</span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Primary tax residency</div>
            <div className="text-sm font-bold text-foreground">Based on your National ID, you are a tax resident of Egypt</div>
          </div>
        </div>
      </div>

      {/* Section 2 — FATCA */}
      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">US tax status (FATCA)</h3>
              <InfoHint text="Required under the US Foreign Account Tax Compliance Act (FATCA)." />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Are you a US citizen, US resident, or do you hold a US Green Card?</p>
          </div>
          <Segmented value={data.fatcaUs} onChange={toggleFatca} />
        </div>
        {data.fatcaUs === "yes" && (
          <div className="mt-5">
            <Field label="US Tax Identification Number (SSN or ITIN)">
              <input className={inputCls} value={data.usTin} onChange={(e) => update("usTin", e.target.value)} />
            </Field>
          </div>
        )}
      </div>

      {/* Section 3 — CRS */}
      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Other tax residencies (CRS)</h3>
              <InfoHint text="Required under the OECD Common Reporting Standard (CRS) for international tax transparency." />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Are you a tax resident of any country other than Egypt?</p>
          </div>
          <Segmented value={data.crsOther} onChange={toggleCrs} />
        </div>
        {data.crsOther === "yes" && (
          <div className="mt-5 space-y-4">
            {rows.map((row, i) => (
              <div key={i} className="grid items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
                <Field label="Country of tax residency">
                  <select className={inputCls} value={row.country} onChange={(e) => updRow(i, { country: e.target.value })}>
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Tax Identification Number">
                  <input className={inputCls} value={row.tin} onChange={(e) => updRow(i, { tin: e.target.value })} />
                </Field>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  aria-label="Remove row"
                  className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
            >
              <Plus className="h-4 w-4" /> Add another country
            </button>
          </div>
        )}
      </div>

      {/* Section 4 — Declaration */}
      {/* Section 3.5 — PEP */}
      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <h3 className="text-sm font-bold text-foreground">Politically exposed person (PEP) status</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          This is a standard regulatory question — not an accusation. Banks are required to identify customers who hold or have held prominent public positions, or who are close family members or associates of such people.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-sm text-foreground/90">
            Are you, or is an immediate family member or close associate, a current or former senior government official, judge, military officer, or executive of a state-owned enterprise?
          </p>
          <Segmented value={data.pepStatus} onChange={(v: "yes" | "no") => update("pepStatus", v)} />
        </div>
        {data.pepStatus === "yes" && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Role / position">
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. Member of Parliament"
                value={data.pepRole}
                onChange={(e) => update("pepRole", e.target.value)}
              />
            </Field>
            <Field label="Country">
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. Egypt"
                value={data.pepCountry}
                onChange={(e) => update("pepCountry", e.target.value)}
              />
            </Field>
            <Field label="Relationship">
              <input
                type="text"
                className={inputCls}
                placeholder="Self / spouse / parent / associate"
                value={data.pepRelationship}
                onChange={(e) => update("pepRelationship", e.target.value)}
              />
            </Field>
            <Field label="Dates held (from – to)">
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. 2015 – 2020"
                value={data.pepDates}
                onChange={(e) => update("pepDates", e.target.value)}
              />
            </Field>
          </div>
        )}
      </div>

      {/* Section 4 — Declaration */}
      <div className="mt-6">
        <Consent checked={data.taxDeclaration} onChange={(v: boolean) => update("taxDeclaration", v)}>
          I declare that the information provided in this section is true, accurate, and complete, and I will notify SUMERGE of any change in circumstances that affects my tax residency status.
        </Consent>
      </div>
      <AdditionalDeclarations data={data} update={update} />
    </div>
  );
}

function SuccessStepInner() {
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
    </div>
  );
}

// Removed unused icons appease tree-shaking
void Users;
void ArrowRight;