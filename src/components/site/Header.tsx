import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LogIn, Globe } from "lucide-react";
import sumergeLogo from "@/assets/sumerge-logo.png.asset.json";
import { useLang, useT } from "@/lib/i18n";

export default function Header({ refId }: { refId?: string }) {
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboarding";
  const { lang, setLang } = useLang();
  const t = useT();
  const NAV = [
    { to: "/#how", label: t("nav.how") },
    { to: "/#products", label: t("nav.accounts") || "Accounts" },
    { to: "/#faq", label: t("nav.faq") },
    { to: "/#contact", label: t("nav.contact") },
  ];
  return (
    <header className="border-b border-border/60 sticky top-0 z-40 backdrop-blur-xl bg-background/90">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img src={sumergeLogo.url} alt="SUMERGE" className="h-8 transition-transform group-hover:scale-105" width={160} height={32} />
        </Link>

        {!isOnboarding && (
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {NAV.map((l) => (
              <a key={l.to} href={l.to} className="text-foreground/80 hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {isOnboarding && refId && (
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Reference number</p>
              <p className="text-sm font-mono font-bold text-primary">{refId}</p>
            </div>
          )}
          {!isOnboarding && (
            <Link to="/tracking" className="hidden md:inline-block text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {t("nav.track") || "Track / Resume"}
            </Link>
          )}
          {!isOnboarding && (
            <Link to="/lending" className="hidden md:inline-block text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {t("nav.lending")}
            </Link>
          )}
          <div className="inline-flex shrink-0 items-center rounded-full border border-border bg-background p-0.5 text-[11px] font-semibold">
            <Globe className="mx-1 h-3 w-3 text-muted-foreground" />
            {(["en", "ar"] as const).map((l) => {
              const active = lang === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`rounded-full px-2 py-0.5 uppercase tracking-wider transition-colors ${active ? "bg-secondary text-secondary-foreground" : "text-foreground/70 hover:text-foreground"}`}
                >
                  {l}
                </button>
              );
            })}
          </div>
          <Link to="/tracking" aria-label={t("nav.signIn")} className="inline-flex">
            <Button size="icon" variant="ghost" className="rounded-full text-foreground/80 hover:text-primary">
              <LogIn className="w-4 h-4" />
            </Button>
          </Link>
          {!isOnboarding && (
            <Link to="/onboarding">
              <Button size="sm" className="rounded-full px-5 h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                {t("nav.getStarted")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}