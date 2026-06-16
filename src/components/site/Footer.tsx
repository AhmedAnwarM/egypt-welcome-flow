import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export default function Footer() {
  const t = useT();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <p className="text-lg font-bold text-primary tracking-tight">SUMERGE</p>
            <p className="text-sm text-muted-foreground mt-2">{t("brand.tagline")}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] font-semibold text-foreground mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/onboarding" className="text-muted-foreground hover:text-secondary transition-colors">{t("nav.getStarted")}</Link></li>
              <li><Link to="/tracking" className="text-muted-foreground hover:text-secondary transition-colors">{t("nav.track")}</Link></li>
              <li><a href="/#faq" className="text-muted-foreground hover:text-secondary transition-colors">{t("nav.faq")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] font-semibold text-foreground mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">{t("footer.privacy")}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">{t("footer.terms")}</a></li>
              <li><a href="/#contact" className="text-muted-foreground hover:text-secondary transition-colors">{t("footer.contact")}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
          © {year} {t("footer.copy")}
        </div>
      </div>
    </footer>
  );
}