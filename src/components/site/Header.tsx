import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import sumergeLogo from "@/assets/sumerge-logo.png.asset.json";

const NAV = [
  { to: "/#products", label: "Products" },
  { to: "/#about", label: "About Us" },
  { to: "/#how", label: "How It Works" },
  { to: "/#faq", label: "FAQ" },
  { to: "/#contact", label: "Contact Us" },
  { to: "/status", label: "Track Application" },
];

export default function Header({ refId }: { refId?: string }) {
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboarding";
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
          <Link to="/status" aria-label="Sign in" className="inline-flex">
            <Button size="icon" variant="ghost" className="rounded-full text-foreground/80 hover:text-primary">
              <LogIn className="w-4 h-4" />
            </Button>
          </Link>
          {!isOnboarding && (
            <Link to="/onboarding">
              <Button size="sm" className="rounded-full px-5 h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                Open an Account
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}