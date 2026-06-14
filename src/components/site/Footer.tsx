import { Link } from "@tanstack/react-router";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <p className="text-lg font-bold text-primary tracking-tight">SUMERGE</p>
            <p className="text-sm text-muted-foreground mt-2">Personal Banking · Egypt</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/onboarding" className="text-muted-foreground hover:text-secondary transition-colors">Get Started</Link></li>
              <li><Link to="/status" className="text-muted-foreground hover:text-secondary transition-colors">Track Application</Link></li>
              <li><a href="/#faq" className="text-muted-foreground hover:text-secondary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Privacy Notice</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Terms & Conditions</a></li>
              <li><a href="/#contact" className="text-muted-foreground hover:text-secondary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>19 SUMERGE (786 374)</li>
              <li><a href="mailto:support@sumerge.eg" className="hover:text-secondary transition-colors">support@sumerge.eg</a></li>
              <li>Sun–Thu, 9 AM–6 PM EET</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
          © {year} SUMERGE Egypt S.A.E. Regulated by the Central Bank of Egypt.
        </div>
      </div>
    </footer>
  );
}