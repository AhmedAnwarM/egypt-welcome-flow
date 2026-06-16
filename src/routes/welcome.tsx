import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Smartphone, CreditCard } from "lucide-react";
import sumergeLogo from "@/assets/sumerge-logo.png.asset.json";
import { generateEGIban, generateAccountNumber, formatIban } from "@/lib/iban";
import { useT } from "@/lib/i18n";
import { auditLog } from "@/lib/audit";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — SUMERGE" },
      { name: "description", content: "Your SUMERGE account is ready." },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  const t = useT();
  const iban = useMemo(() => generateEGIban(), []);
  const account = useMemo(() => generateAccountNumber(), []);
  const cardLast4 = useMemo(() => String(Math.floor(1000 + Math.random() * 9000)), []);

  const downloadKit = () => {
    auditLog("welcome.downloadKit", { account });
    const body = [
      `SUMERGE — Welcome Kit`,
      `=====================`,
      ``,
      `Account Number: ${account}`,
      `IBAN: ${formatIban(iban)}`,
      `Virtual Card: •••• ${cardLast4}`,
      ``,
      `Mobile banking activation: https://app.sumerge.eg/activate/${account}`,
      ``,
      `Thank you for choosing SUMERGE.`,
    ].join("\n");
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sumerge-welcome-${account}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#dff0ea_0%,#e6f3ee_50%,#edf6f2_100%)]">
      <header className="border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" aria-label="SUMERGE home">
            <img src={sumergeLogo.url} alt="SUMERGE" className="h-7 w-auto" />
          </Link>
          <Link to="/tracking" className="text-xs font-semibold text-primary hover:underline">{t("nav.track")}</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold text-primary">{t("welcome.title")}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">{t("welcome.desc")}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("welcome.accountNo")}</p>
            <p className="mt-1 font-mono text-lg font-bold text-primary">{account}</p>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("welcome.iban")}</p>
            <p className="mt-1 font-mono text-sm font-bold text-primary break-all">{formatIban(iban)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#2E2A6E] to-[#4338ca] p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70">{t("welcome.card")}</p>
              <p className="mt-1 text-xs text-white/60">SUMERGE Digital</p>
            </div>
            <CreditCard className="h-6 w-6 text-white/80" />
          </div>
          <p className="mt-8 font-mono text-lg tracking-widest">•••• •••• •••• {cardLast4}</p>
          <div className="mt-4 flex justify-between text-xs text-white/70">
            <span>VALID THRU 12/30</span>
            <span>VIRTUAL · ACTIVE</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button onClick={downloadKit} className="h-12 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4 me-2" /> {t("welcome.download")}
          </Button>
          <Button variant="outline" className="h-12">
            <Smartphone className="h-4 w-4 me-2" /> {t("welcome.activate")}
          </Button>
        </div>
      </main>
    </div>
  );
}