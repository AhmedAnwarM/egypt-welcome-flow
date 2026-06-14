import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, FileSearch, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Track your application — SUMERGE" },
      { name: "description", content: "Resume or track the status of your SUMERGE retail account application." },
    ],
  }),
  component: StatusPage,
});

function StatusPage() {
  const [ref, setRef] = useState("");
  const [shown, setShown] = useState(false);

  const stages = [
    { icon: CheckCircle2, t: "Application received", d: "We have your submission.", done: true },
    { icon: FileSearch, t: "Documents under review", d: "Verifying your ID and address.", done: true },
    { icon: Clock, t: "Final compliance check", d: "Usually completes within a few hours.", done: false, active: true },
    { icon: Sparkles, t: "Account activated", d: "Card and account details sent by SMS.", done: false },
  ];

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>SUMERGE</Link>
          <Button asChild variant="outline" size="sm"><Link to="/onboarding">Start new application</Link></Button>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold">Track your application</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your reference number or national ID to see the latest status.</p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="e.g. SMG-2026-018245"
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-mint"
            />
            <Button variant="mint" size="lg" onClick={() => setShown(true)} disabled={!ref.trim()}>
              Check status <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {shown && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Reference</div>
                <div className="font-semibold">{ref}</div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-3 py-1 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" /> In review
              </span>
            </div>
            <ol className="mt-6 space-y-5">
              {stages.map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${s.done ? "bg-mint text-mint-foreground" : s.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 border-b border-border pb-5 last:border-0">
                    <div className="font-semibold">{s.t}</div>
                    <div className="text-sm text-muted-foreground">{s.d}</div>
                    {s.active && <div className="mt-1 text-xs text-mint">In progress</div>}
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