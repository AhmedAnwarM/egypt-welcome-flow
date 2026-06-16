import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, FileSearch, Sparkles, ArrowRight, ShieldCheck, CreditCard, Wallet } from "lucide-react";
import sumergeLogo from "@/assets/sumerge-logo.png.asset.json";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Application Tracking — SUMERGE" },
      { name: "description", content: "Track your SUMERGE onboarding application in real time." },
    ],
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const t = useT();
  const [ref, setRef] = useState("");
  const [shown, setShown] = useState(false);

  const stages = [
    { icon: CheckCircle2, key: "track.stage.registration", state: "done" as const },
    { icon: FileSearch, key: "track.stage.verification", state: "done" as const },
    { icon: ShieldCheck, key: "track.stage.compliance", state: "active" as const },
    { icon: Clock, key: "track.stage.approval", state: "pending" as const },
    { icon: Wallet, key: "track.stage.account", state: "pending" as const },
    { icon: CreditCard, key: "track.stage.card", state: "pending" as const },
  ];

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" aria-label="SUMERGE home">
            <img src={sumergeLogo.url} alt="SUMERGE" width={140} height={28} className="h-7 w-auto" />
          </Link>
          <Button asChild variant="outline" size="sm"><Link to="/onboarding">{t("nav.getStarted")}</Link></Button>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold">{t("track.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("track.hint")}</p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="SM-2026-018245"
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button size="lg" onClick={() => setShown(true)} disabled={!ref.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t("track.check")} <ArrowRight className="h-4 w-4 ms-1" />
            </Button>
          </div>
        </div>

        {shown && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Ref</div>
                <div className="font-semibold">{ref}</div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t("track.stage.compliance")}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{t("track.eta")}: ~4 hours</p>
            <ol className="mt-6 space-y-5">
              {stages.map((s) => (
                <li key={s.key} className="flex gap-4">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${s.state === "done" ? "bg-emerald-500 text-white" : s.state === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 border-b border-border pb-5 last:border-0">
                    <div className="font-semibold">{t(s.key)}</div>
                    {s.state === "active" && <div className="mt-1 text-xs text-primary">In progress</div>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}