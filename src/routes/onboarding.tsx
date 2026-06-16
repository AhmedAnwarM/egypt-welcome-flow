import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, LogIn, Upload, CheckCircle2, IdCard, Wallet, Users, PiggyBank, Banknote, CalendarClock, Pencil, ClipboardCheck, PhoneCall, Sparkles, FileText, Eye, Trash2, Info, Plus, X, BookUser, ShieldCheck, Smartphone, KeyRound, Globe, Loader2, BookmarkPlus } from "lucide-react";
import sumergeLogo from "@/assets/sumerge-logo.png.asset.json";
import Footer from "@/components/site/Footer";
import { useLang } from "@/lib/i18n";
import SessionTimeout from "@/components/SessionTimeout";
import { auditLog } from "@/lib/audit";
import { ConfirmProductsStep, DocumentsStep, SignatureStep, ReviewStep, isDocumentsValid } from "@/components/onboarding/ExtendedSteps";

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
  "About you & contact",
  "Work & tax details",
  "Account & address",
  "Products & documents",
  "Sign & review",
  "Secure your account",
] as const;

function Onboarding() {
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [residencyType, setResidencyType] = useState<"" | "egyptian" | "foreign">("");
  const [nidGateDone, setNidGateDone] = useState(false);
  const { lang, setLang } = useLang();
  const router = useRouter();
  const [showSaveModal, setShowSaveModal] = useState(false);
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
    phoneVerified: false,
    emailVerified: false,
    nationalId: "",
    fullName: "",
    firstName: "",
    lastName: "",
    nationality: "Egyptian",
    expiry: "",
    employment: "Employed",
    employer: "",
    jobTitle: "Employee",
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
    advance();
  };
  const back = () => {
    if (step === 0) {
      if (residencyType === "egyptian" && nidGateDone) {
        setNidGateDone(false);
      } else {
        setResidencyType("");
      }
      return;
    }
    setStep((s) => Math.max(0, s - 1));
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


  const handleLang = (l: "en" | "ar") => setLang(l);

  const selectResidency = (r: "egyptian" | "foreign") => {
    setResidencyType(r);
    const dt = r === "foreign" ? "passport" : "nationalId";
      if (r === "foreign") {
        setNidGateDone(true);
        setData((d) => ({
          ...d,
          docType: dt,
          nationality: "United Kingdom",
          productChoice: "saving",
          fullName: "John Michael Smith",
          firstName: "John",
          lastName: "Michael Smith",
          passportNumber: "P12345678",
          dob: "1990-04-22",
          expiry: "2031-09-15",
          gender: "Male",
          placeOfBirth: "London",
          countryOfBirth: "United Kingdom",
        }));
      } else {
      setNidGateDone(false);
      setData((d) => ({
        ...d,
        docType: dt,
        nationality: "Egyptian",
        productChoice: "saving",
        fullName: "",
        passportNumber: "",
        dob: "",
        expiry: "",
        gender: "",
        placeOfBirth: "",
        countryOfBirth: "",
      }));
    }
  };

  const canContinue = (() => {
    // Sub-validators (keyed to the granular step indices)
    const v0 = () => {
        if (!data.gender || !data.placeOfBirth.trim() || !data.countryOfBirth || !data.maritalStatus || !data.education) return false;
        if (!data.hasOtherNationalities) return false;
        if (data.hasOtherNationalities === "yes" && !data.otherNationalities.trim()) return false;
        if (!data.residenceClassification) return false;
        if (!data.specialNeeds) return false;
        if (data.specialNeeds === "yes" && !data.specialNeedsType) return false;
        if (!(data.phone.length >= 10 && /\S+@\S+/.test(data.email) && data.email === data.confirmEmail)) return false;
        if (!data.statementFrequency || !data.statementDelivery || !data.correspondenceLanguage) return false;
        if (data.realBeneficiary !== "yes") return false;
        if (!data.hasPoA || !data.smsConsent) return false;
        return true;
    };
    const v1 = () => !!data.phoneVerified && !!data.emailVerified;
    const v2 = () => {
        const baseOk = !!data.employment && !!data.income && !!data.employer.trim() && !!data.jobTitle.trim() && !!data.sourceOfFunds;
        const isBiz = data.employment === "Self-employed" || data.employment === "Business owner";
        if (!baseOk) return false;
        if (isBiz && !data.businessReg.trim()) return false;
        if (!data.expectedTxVolume) return false;
        if ((data.employment === "Employed" || data.employment === "Self-employed") && !data.employmentStartDate) return false;
        if (data.employment === "Retired" && !data.previousOccupation.trim()) return false;
        return true;
    };
    const v3 = () => {
        if (!data.fatcaUs || !data.crsOther || !data.taxDeclaration) return false;
        if (data.fatcaUs === "yes" && !data.usTin.trim()) return false;
        if (data.crsOther === "yes") {
          if (data.crsRows.length === 0) return false;
          if (!data.crsRows.some((r: any) => r.country && r.tin.trim())) return false;
        }
        if (!data.pepStatus) return false;
        if (data.pepStatus === "yes" && (!data.pepRole.trim() || !data.pepCountry.trim() || !data.pepRelationship.trim() || !data.pepDates.trim())) return false;
        return true;
    };
    const v4 = () => {
        if (!data.accountPurpose || !data.accountCurrency || !data.linkDebitCard) return false;
        if (data.linkDebitCard === "yes" && (!data.cardType || !data.nameOnCard.trim())) return false;
        return true;
    };
    const v5 = () => {
        if (!data.residenceType) return false;
        if (data.residenceType === "Other" && !data.residenceTypeOther.trim()) return false;
        return !!data.governorate && !!data.city.trim() && !!data.street.trim();
    };
    const v6 = () => ((data as any).confirmedProducts || []).length > 0;
    const v7 = () => isDocumentsValid(data);
    const v8 = () => !!(data as any).signedAt;
    const v9 = () => true;
    const v10 = () => {
        const pwOk = data.password.length >= 8 && data.password === data.confirmPassword;
        return /\S+@\S+/.test(data.email) && pwOk && data.agreeTerms && data.agreeCredit;
    };
    switch (step) {
      case 0: return v0() && v1();
      case 1: return v2() && v3();
      case 2: return v4() && v5();
      case 3: return v6() && v7();
      case 4: return v8() && v9();
      case 5: return v10();
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
      ) : residencyType === "egyptian" && !nidGateDone ? (
        <div className="mx-auto max-w-3xl px-6 py-14">
          <CardToolbar onSave={() => setShowSaveModal(true)} />
          <NidOtpGate
            initialNid={data.nationalId}
            initialMobile={data.phone}
            onBack={() => setResidencyType("")}
            onVerified={(nid, mobile) => {
              setData((d) => ({
                ...d,
                nationalId: nid,
                phone: mobile,
                phoneVerified: true,
                fullName: d.docType === "nationalId" ? "Mohamed Ahmed Hassan" : d.fullName,
                firstName: d.docType === "nationalId" ? "Mohamed" : d.firstName,
                lastName: d.docType === "nationalId" ? "Ahmed Hassan" : d.lastName,
                nationality: d.docType === "nationalId" ? "Egyptian" : d.nationality,
                dob: d.docType === "nationalId" ? "1985-03-15" : d.dob,
                expiry: d.docType === "nationalId" ? "2030-05-12" : d.expiry,
                gender: d.docType === "nationalId" ? "Male" : d.gender,
                placeOfBirth: d.docType === "nationalId" ? "Cairo" : d.placeOfBirth,
                countryOfBirth: d.docType === "nationalId" ? "Egypt" : d.countryOfBirth,
              }));
              setNidGateDone(true);
              auditLog("onboarding.nidOtpVerified", { mobile });
            }}
          />
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
              {step === 0 && (
                <div className="space-y-10">
                  <KnowYouBetterStep data={data} update={update} />
                  <div className="border-t border-border/60 pt-8">
                    <ContactVerificationStep data={data} update={update} />
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-10">
                  <WorkProductStep data={data} update={update} />
                  <div className="border-t border-border/60 pt-8">
                    <TaxStep data={data} update={update} />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-10">
                  <AccountSetupStep data={data} update={update} />
                  <div className="border-t border-border/60 pt-8">
                    <AddressStep data={data} update={update} />
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-10">
                  <ConfirmProductsStep data={data} update={update} />
                  <div className="border-t border-border/60 pt-8">
                    <DocumentsStep data={data} update={update} />
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="space-y-10">
                  <SignatureStep data={data} update={update} />
                  <div className="border-t border-border/60 pt-8">
                    <ReviewStep data={data} goToStep={(i: number) => setStep(i)} />
                  </div>
                </div>
              )}
              {step === 5 && <CredentialsStep data={data} update={update} />}

              <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground/80 hover:bg-secondary/40 disabled:opacity-40"
                >
                  Back
                </button>
                <Button
                    size="lg"
                    onClick={step === steps.length - 1 ? onFinalSubmit : next}
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
    { id: "egyptian", label: "National ID", icon: IdCard, desc: "I'll verify with my Egyptian National ID." },
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
  return ChooseOptionStepImpl({ data, update, residencyType });
}

function NidOtpGate({
  initialNid,
  initialMobile,
  onBack,
  onVerified,
}: {
  initialNid: string;
  initialMobile: string;
  onBack: () => void;
  onVerified: (nid: string, mobile: string) => void;
}) {
  const [nidUploaded, setNidUploaded] = useState(false);
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);
  const [nid, setNid] = useState(initialNid || "");
  const [mobile, setMobile] = useState(initialMobile || "");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mobileValid = /^01\d{9}$/.test(mobile);
  const nidValid = /^\d{14}$/.test(nid);

  const handleUpload = async () => {
    setNidUploaded(true);
    setError(null);
    setOcrRunning(true);
    await new Promise((r) => setTimeout(r, 1400));
    const generated = nid && nidValid
      ? nid
      : "2" + String(Math.floor(900000000000 + Math.random() * 99999999999)).padStart(13, "0").slice(0, 13);
    setNid(generated);
    setOcrRunning(false);
    setOcrDone(true);
    auditLog("onboarding.nidOcrCompleted", {});
  };

  const resetUpload = () => {
    setNidUploaded(false);
    setOcrRunning(false);
    setOcrDone(false);
    setNid("");
    setSent(false);
    setOtp("");
  };

  const sendOtp = async () => {
    setError(null);
    if (!mobileValid) {
      setError("Please enter a valid Egyptian mobile (e.g. 01XXXXXXXXX).");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSent(true);
    setSending(false);
    auditLog("onboarding.nidOtpSent", { mobile });
  };

  const verify = async () => {
    setError(null);
    if (otp.length !== 6) {
      setError("Enter the 6-digit code sent to your mobile.");
      return;
    }
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 900));
    setVerifying(false);
    onVerified(nid, mobile);
  };

  return (
    <div className="rounded-2xl bg-card p-6 md:p-10 shadow-elegant space-y-8">
      <StepHeader
        title="Verify your identity"
        subtitle="Upload your Egyptian National ID and confirm your mobile number to get started."
      />

      {/* 1. Upload */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-foreground">1. Upload your National ID</h3>
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_120px_180px] items-center gap-4 border-b border-border bg-background px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <div>Documents</div>
            <div className="text-center">Status</div>
            <div className="text-center">Actions</div>
          </div>
          <UploadRow
            label="National ID"
            fileName="NID.jpg"
            done={nidUploaded}
            onClick={handleUpload}
            onDelete={resetUpload}
          />
        </div>
      </section>

      {/* 2. OCR result */}
      {nidUploaded && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-foreground">2. Confirm your National ID number</h3>
          <div className="rounded-xl border border-border bg-background p-5">
            {ocrRunning ? (
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Extracting National ID number…
              </div>
            ) : (
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle2 className="h-4 w-4" /> National ID detected
                </div>
                <Field label="National ID number">
                  <input
                    inputMode="numeric"
                    maxLength={14}
                    className={inputCls}
                    value={nid}
                    onChange={(e) => setNid(e.target.value.replace(/\D/g, ""))}
                  />
                </Field>
                <p className="mt-2 text-xs text-muted-foreground">Please confirm the number matches your card.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Mobile */}
      {ocrDone && nidValid && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-foreground">3. Verify your mobile number</h3>
          <p className="mb-3 text-xs text-muted-foreground">Enter your Egyptian mobile number. We'll send a one-time code to confirm it.</p>
          <Field label="Mobile number">
            <input
              inputMode="tel"
              maxLength={11}
              className={inputCls}
              placeholder="01XXXXXXXXX"
              value={mobile}
              disabled={sent}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            />
          </Field>

          {!sent ? (
            <div className="mt-3">
              <Button onClick={sendOtp} disabled={sending || !mobileValid} size="sm">
                {sending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending</>) : (<>Send code <ArrowRight className="ml-2 h-4 w-4" /></>)}
              </Button>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-background p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                <KeyRound className="h-4 w-4" /> Enter the 6-digit code sent to {mobile}
              </div>
              <input
                inputMode="numeric"
                maxLength={6}
                className={`${inputCls} tracking-[0.5em] text-center text-lg font-bold`}
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                onClick={() => { setSent(false); setOtp(""); }}
                className="mt-3 text-xs font-medium text-muted-foreground hover:text-primary"
              >
                Change number or resend
              </button>
            </div>
          )}
        </section>
      )}

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button type="button" onClick={onBack} className="text-sm font-semibold text-muted-foreground hover:text-primary">← Back</button>
        <Button onClick={verify} disabled={!sent || verifying || otp.length !== 6}>
          {verifying ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying</>) : (<>Verify & continue <ArrowRight className="ml-2 h-4 w-4" /></>)}
        </Button>
      </div>
    </div>
  );
}



function ChooseOptionStepImpl({ data, update, residencyType }: any) {
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

function KnowYouBetterStep({ data, update }: any) {
  return (
    <div>
      <StepHeader title="Let's get to know you better!" subtitle="Tell us about yourself and how we can reach you." />
      <AdditionalPersonalDetails data={data} update={update} />
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-bold text-primary">Contact details</h3>
        <p className="mt-1 text-sm text-muted-foreground">We'll verify your mobile number and email in the next step.</p>
        <div className="mt-5 space-y-5">
          <Field label="Mobile Number">
            <div className="flex h-12 items-center rounded-md border border-border bg-background px-3">
              <span className="text-sm font-semibold text-foreground">+20</span>
              <input
                className="ml-2 h-full flex-1 bg-transparent text-sm outline-none"
                placeholder="1XX XXX XXXX"
                value={data.phone}
                onChange={(e) => { update("phone", e.target.value.replace(/\D/g, "")); if (data.phoneVerified) update("phoneVerified", false); }}
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
          <Field label="Email">
            <input
              type="email"
              className={inputCls}
              value={data.email}
              onChange={(e) => { update("email", e.target.value); if (data.emailVerified) update("emailVerified", false); }}
            />
          </Field>
          <Field label="Confirm Email">
            <input type="email" className={inputCls} value={data.confirmEmail} onChange={(e) => update("confirmEmail", e.target.value)} />
          </Field>
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
        
        </div>
      </div>
      <AdditionalDeclarations data={data} update={update} />
    </div>
  );
}

function ContactVerificationStep({ data, update }: any) {
  return (
    <div>
      <StepHeader title="Verify your contact details" subtitle="We'll send a one-time code to your mobile and email." />
      <div className="space-y-5 rounded-xl border border-border bg-card p-6">
        <VerifiableContactField
          label="Mobile Number"
          kind="phone"
          value={data.phone}
          verified={!!data.phoneVerified}
          onChange={(v) => { update("phone", v); if (data.phoneVerified) update("phoneVerified", false); }}
          onVerified={() => update("phoneVerified", true)}
        />
        <VerifiableContactField
          label="Email"
          kind="email"
          value={data.email}
          verified={!!data.emailVerified}
          onChange={(v) => { update("email", v); if (data.emailVerified) update("emailVerified", false); }}
          onVerified={() => update("emailVerified", true)}
        />
      </div>
    </div>
  );
}

function VerifiableContactField({
  label, kind, value, verified, onChange, onVerified,
}: {
  label: string;
  kind: "phone" | "email";
  value: string;
  verified: boolean;
  onChange: (v: string) => void;
  onVerified: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const valid = kind === "phone" ? value.length >= 10 : /\S+@\S+\.\S+/.test(value);
  const handleSend = () => { setSent(true); setErr(""); setCode(""); };
  const handleVerify = () => {
    if (code.length === 6) { onVerified(); setSent(false); setErr(""); }
    else setErr("Enter the 6-digit code");
  };
  return (
    <div>
      <Field label={label}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {kind === "phone" ? (
            <div className="flex h-12 flex-1 items-center rounded-md border border-border bg-background px-3">
              <span className="text-sm font-semibold text-foreground">+20</span>
              <input
                className="ml-2 h-full flex-1 bg-transparent text-sm outline-none disabled:opacity-70"
                placeholder="1XX XXX XXXX"
                value={value}
                disabled={verified}
                onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
                maxLength={11}
              />
            </div>
          ) : (
            <input
              type="email"
              className={`${inputCls} flex-1 ${verified ? "opacity-70" : ""}`}
              value={value}
              disabled={verified}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
          {verified ? (
            <span className="inline-flex h-12 items-center gap-1.5 rounded-full bg-emerald-100 px-4 text-sm font-bold text-emerald-700">
              <ShieldCheck className="h-4 w-4" /> Verified
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!valid}
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {sent ? "Resend code" : `Send ${kind === "phone" ? "SMS" : "email"} code`}
            </button>
          )}
        </div>
      </Field>
      {sent && !verified && (
        <div className="mt-2 flex flex-col gap-2 rounded-lg border border-border bg-background p-3 sm:flex-row sm:items-center">
          <input
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className={`${inputCls} sm:max-w-[200px]`}
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={code.length !== 6}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Verify
          </button>
        </div>
      )}
      {err && <p className="mt-1 text-xs font-semibold text-destructive">{err}</p>}
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


function SelectionRecap({ data, onChange }: any) {
  const label = PRODUCT_LABELS[data.productChoice] || "Account selected";
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card p-4">
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

function WorkProductStep({ data, update }: any) {
  const isBiz = data.employment === "Self-employed" || data.employment === "Business owner";
  const employerLabel = isBiz ? "Business name" : "Employer name";
  const showStartDate = data.employment === "Employed" || data.employment === "Self-employed";
  const showPrevOcc = data.employment === "Retired";
  return (
    <div>
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
    </div>
  );
}

function AdditionalDeclarationsStep({ data, update }: any) {
  return (
    <div>
      <StepHeader title="Additional declarations" subtitle="Required by CBE regulations. Please answer each question." />
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

const COUNTRIES_FULL = ["Egypt", ...COUNTRIES];

function AdditionalPersonalDetails({ data, update }: any) {
  const residenceOpts: { v: "resEgy" | "nonResEgy" | "resFor" | "nonResFor"; label: string }[] = [
    { v: "resEgy", label: "Resident Egyptian" },
    { v: "nonResEgy", label: "Non-resident Egyptian" },
    { v: "resFor", label: "Resident foreigner" },
    { v: "nonResFor", label: "Non-resident foreigner" },
  ];
  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-bold text-primary">Personal Details</h3>
      <p className="mt-1 text-sm text-muted-foreground">Required for account opening per CBE guidelines.</p>
      <div className="mt-5 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name">
            <input className={inputCls} value={data.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="As shown on National ID" />
          </Field>
          <Field label="Date of birth">
            <input
              type="date"
              className={inputCls}
              value={data.dob}
              onChange={(e) => update("dob", e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </Field>
          <Field label="Gender">
            <PillToggle
              options={[{ v: "Male", label: "Male" }, { v: "Female", label: "Female" }]}
              value={data.gender}
              onChange={(v) => update("gender", v)}
            />
          </Field>
          <Field label="Place of birth">
            <input className={inputCls} value={data.placeOfBirth} onChange={(e) => update("placeOfBirth", e.target.value)} />
          </Field>
          <Field label="Age">
            <input
              className={inputCls}
              value={(() => {
                if (!data.dob) return "";
                const dob = new Date(data.dob);
                if (isNaN(dob.getTime())) return "";
                const now = new Date();
                let age = now.getFullYear() - dob.getFullYear();
                const m = now.getMonth() - dob.getMonth();
                if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
                return age >= 0 && age < 130 ? String(age) : "";
              })()}
              readOnly
              placeholder="Auto-calculated from date of birth"
            />
          </Field>
          <Field label="Country of birth">
            <select className={inputCls} value={data.countryOfBirth} onChange={(e) => update("countryOfBirth", e.target.value)}>
              <option value="">Select country</option>
              {COUNTRIES_FULL.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Marital status">
            <select className={inputCls} value={data.maritalStatus} onChange={(e) => update("maritalStatus", e.target.value)}>
              <option value="">Select</option>
              {["Single","Married","Divorced","Widowed"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Educational status">
            <select className={inputCls} value={data.education} onChange={(e) => update("education", e.target.value)}>
              <option value="">Select</option>
              {["Illiterate","Primary","Secondary","Post-secondary non-tertiary","Tertiary (undergraduate)","Postgraduate","PhD"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-foreground">Do you have other nationalities?</p>
          <Segmented value={data.hasOtherNationalities} onChange={(v) => update("hasOtherNationalities", v)} />
        </div>
        {data.hasOtherNationalities === "yes" && (
          <Field label="Please state other nationalities">
            <input className={inputCls} value={data.otherNationalities} onChange={(e) => update("otherNationalities", e.target.value)} />
          </Field>
        )}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Residence classification</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {residenceOpts.map((o) => {
              const selected = data.residenceClassification === o.v;
              return (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => update("residenceClassification", o.v)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left text-sm transition-all ${selected ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-background hover:border-primary/40"}`}
                >
                  <span className="font-semibold text-foreground">{o.label}</span>
                  <span className={`h-4 w-4 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border"}`} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-foreground">Special needs customer?</p>
          <Segmented value={data.specialNeeds} onChange={(v) => update("specialNeeds", v)} />
        </div>
        {data.specialNeeds === "yes" && (
          <Field label="Type of special needs">
            <select className={inputCls} value={data.specialNeedsType} onChange={(e) => update("specialNeedsType", e.target.value)}>
              <option value="">Select</option>
              {["Visual impairment","Hearing impairment","Physical disability","Other"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
        )}
      </div>
    </div>
  );
}

function AdditionalDeclarations({ data, update }: any) {
  const Row = ({ title, desc, value, onChange, children }: any) => (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {desc && <p className="mt-1 text-xs text-muted-foreground">{desc}</p>}
        </div>
        <Segmented value={value} onChange={onChange} />
      </div>
      {children}
    </div>
  );
  return (
    <div className="mt-6">
      <h3 className="text-base font-bold text-primary">Additional declarations</h3>
      <div className="mt-3 space-y-3">
        <Row
          title="I am the real and sole beneficiary of this account"
          desc="Required by CBE regulations to confirm beneficial ownership."
          value={data.realBeneficiary}
          onChange={(v: "yes" | "no") => update("realBeneficiary", v)}
        >
          {data.realBeneficiary === "no" && (
            <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
              Please visit a branch to complete your application with the beneficiary present.
            </div>
          )}
        </Row>
        <Row
          title="There is a power of attorney on this account"
          desc="If yes, you can add authorized persons in the next step."
          value={data.hasPoA}
          onChange={(v: "yes" | "no") => update("hasPoA", v)}
        >
          {data.hasPoA === "yes" && (
            <p className="mt-3 text-xs text-muted-foreground">You will be able to add authorized persons in the next step.</p>
          )}
        </Row>
        <Row
          title="I consent to receive SMS transaction notifications on my registered mobile number"
          desc="Recommended — receive instant alerts for activity on your account."
          value={data.smsConsent}
          onChange={(v: "yes" | "no") => update("smsConsent", v)}
        />
      </div>
    </div>
  );
}

function AccountSetupStep({ data, update }: any) {
  const isEgpOnly = data.productChoice === "prime-saving" || data.productChoice === "current-365";
  const currencies = isEgpOnly
    ? ["Egyptian Pound (EGP)"]
    : ["Egyptian Pound (EGP)","US Dollar (USD)","Euro (EUR)","British Pound (GBP)","Saudi Riyal (SAR)"];

  useEffect(() => {
    if (isEgpOnly && data.accountCurrency !== "Egyptian Pound (EGP)") {
      update("accountCurrency", "Egyptian Pound (EGP)");
    }
    if (!data.nameOnCard && data.fullName) {
      update("nameOnCard", data.fullName.slice(0, 26).toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persons: { cif: string; name: string; authType: string; docType: string }[] = data.authorizedPersons || [];
  const setPersons = (p: typeof persons) => update("authorizedPersons", p);
  const addPerson = () => persons.length < 4 && setPersons([...persons, { cif: "", name: "", authType: "Full operation", docType: "Power of attorney" }]);
  const updPerson = (i: number, patch: Partial<typeof persons[number]>) =>
    setPersons(persons.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const removePerson = (i: number) => setPersons(persons.filter((_, idx) => idx !== i));

  return (
    <div>
      <StepHeader title="Account setup" subtitle="Configure your account, card, and digital services." />

      {/* Section A — Account details */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h3 className="text-sm font-bold text-primary">Account details</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field label="Purpose of opening this account">
            <select className={inputCls} value={data.accountPurpose} onChange={(e) => update("accountPurpose", e.target.value)}>
              <option value="">Select purpose</option>
              {["Salary deposit","Savings","Business transactions","Investment","Daily expenses","Other"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Account currency">
            <select disabled={isEgpOnly} className={`${inputCls} ${isEgpOnly ? "bg-secondary/20 cursor-not-allowed" : ""}`} value={data.accountCurrency} onChange={(e) => update("accountCurrency", e.target.value)}>
              <option value="">Select currency</option>
              {currencies.map((c) => <option key={c}>{c}</option>)}
            </select>
            {isEgpOnly && <p className="mt-1.5 text-xs text-muted-foreground">This account is EGP only.</p>}
          </Field>
          <div className="md:col-span-2 flex items-center justify-between rounded-md border border-border bg-secondary/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Link account to debit card</p>
              <p className="text-xs text-muted-foreground">A debit card will be issued and linked to this account.</p>
            </div>
            <Segmented value={data.linkDebitCard} onChange={(v: "yes" | "no") => update("linkDebitCard", v)} />
          </div>
        </div>
      </section>

      {/* Section B — Debit card */}
      {data.linkDebitCard === "yes" && (
        <section className="mt-5 rounded-xl border border-border bg-background p-5">
          <h3 className="text-sm font-bold text-primary">Debit card details</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(["Standard", "Premium"] as const).map((t) => {
              const selected = data.cardType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => update("cardType", t)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${selected ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-background hover:border-primary/40"}`}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full ${selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                    <Wallet className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-foreground">{t}</div>
                    <div className="text-xs text-muted-foreground">{t === "Standard" ? "Everyday banking essentials" : "Enhanced benefits and limits"}</div>
                  </div>
                  <span className={`h-4 w-4 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border"}`} />
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <Field label="Name to be printed on card">
                <input maxLength={26} className={inputCls} value={data.nameOnCard} onChange={(e) => update("nameOnCard", e.target.value.slice(0, 26))} />
              </Field>
              <p className="mt-1 text-[11px] text-muted-foreground text-right">{data.nameOnCard.length}/26</p>
            </div>
            <Field label="Name in Arabic (optional)">
              <input dir="rtl" className={inputCls} value={data.nameOnCardAr} onChange={(e) => update("nameOnCardAr", e.target.value)} />
            </Field>
          </div>
        </section>
      )}

      {/* Section C — Authorized persons */}
      <section className="mt-5 rounded-xl border border-border bg-background p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-primary">Authorized persons</h3>
          <span className="text-xs text-muted-foreground">{persons.length}/4</span>
        </div>
        {data.hasPoA !== "yes" && (
          <p className="mt-1 text-xs text-muted-foreground">Add authorized persons to operate your account — optional.</p>
        )}
        <div className="mt-4 space-y-4">
          {persons.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-secondary/10 px-4 py-6 text-center text-sm text-muted-foreground">
              No authorized persons added
            </div>
          ) : (
            persons.map((p, i) => (
              <div key={i} className="rounded-md border border-border bg-secondary/10 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="CIF of authorized person">
                    <input className={inputCls} value={p.cif} onChange={(e) => updPerson(i, { cif: e.target.value })} />
                  </Field>
                  <Field label="Full name">
                    <input className={inputCls} value={p.name} onChange={(e) => updPerson(i, { name: e.target.value })} />
                  </Field>
                  <Field label="Authorization type">
                    <select className={inputCls} value={p.authType} onChange={(e) => updPerson(i, { authType: e.target.value })}>
                      {["Full operation","Inquiry only","Deposits only"].map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </Field>
                  <Field label="Relationship document type">
                    <select className={inputCls} value={p.docType} onChange={(e) => updPerson(i, { docType: e.target.value })}>
                      {["Power of attorney","Court order","Other"].map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </Field>
                </div>
                {i > 0 && (
                  <div className="mt-3 flex justify-end">
                    <button type="button" onClick={() => removePerson(i)} className="inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:underline">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          {persons.length < 4 && (
            <button type="button" onClick={addPerson} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              <Plus className="h-4 w-4" /> Add authorized person
            </button>
          )}
        </div>
      </section>

      {/* Section D — Digital services */}
      <section className="mt-5 rounded-xl border border-border bg-background p-5">
        <h3 className="text-sm font-bold text-primary">Digital services enrollment</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-secondary/10 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Subscribe to phone banking</p>
              <p className="text-xs text-muted-foreground">Access your account 24/7 via our automated phone line.</p>
            </div>
            <Segmented value={data.phoneBanking} onChange={(v: "yes" | "no") => update("phoneBanking", v)} />
          </div>
          <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-secondary/10 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Subscribe to internet and mobile banking</p>
              <p className="text-xs text-muted-foreground">Required — your login credentials are set up in the final step.</p>
            </div>
            <span className="inline-flex h-9 items-center rounded-full bg-secondary px-4 text-sm font-semibold text-secondary-foreground">Yes</span>
          </div>
        </div>
      </section>
    </div>
  );
}