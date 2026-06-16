import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import NeedAssistance from "@/components/site/NeedAssistance";
import SplashOverlay from "@/components/SplashOverlay";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Wallet,
  CreditCard,
  PiggyBank,
  Users,
  Phone,
  Mail,
  MapPin,
  Award,
  Lock,
} from "lucide-react";
import heroBanking from "@/assets/hero-egypt-banking-v3.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SUMERGE — Retail Banking, Egypt" },
      { name: "description", content: "Open a SUMERGE personal account online in minutes. Cards, savings, and instant InstaPay transfers across Egypt." },
      { property: "og:title", content: "SUMERGE — Retail Banking, Egypt" },
      { property: "og:description", content: "Open a SUMERGE personal account online in minutes." },
    ],
  }),
  component: Landing,
});

const PRODUCTS = [
  { icon: PiggyBank, title: "Saving Account", desc: "Earn up to 8.75% interest, paid monthly, quarterly, or yearly. Available in EGP and major foreign currencies." },
  { icon: Wallet, title: "Non-Interest-Bearing Current Account", desc: "Free cash deposits and withdrawals anytime. Cheque book and debit card included. No minimum monthly balance." },
  { icon: Award, title: "Prime Saving Account", desc: "Tiered interest rates calculated on your lowest monthly balance. EGP only, minimum EGP 5,000 to open." },
  { icon: CreditCard, title: "Current Account 365 Days", desc: "Daily interest credited every day. Minimum EGP 5,000 to open. Available for individuals and companies." },
];

const STEPS = [
  { num: "01", title: "Verify your identity", desc: "Scan your national ID or verify instantly via Haweya. A liveness check confirms it's really you.", color: "bg-primary text-primary-foreground" },
  { num: "02", title: "Complete your profile", desc: "Fill in your work details, tax residency, and address. Most fields are auto-filled from your ID.", color: "bg-secondary text-secondary-foreground" },
  { num: "03", title: "Choose your account and sign", desc: "Pick the account that fits you, review your digital agreement, and sign electronically.", color: "bg-accent text-accent-foreground" },
  { num: "04", title: "Start banking", desc: "Your account is active immediately. Card delivery and full limit activation follow within 24 hours.", color: "bg-primary text-primary-foreground" },
];

const ABOUT_TILES = [
  { icon: ShieldCheck, title: "Trusted nationwide", desc: "Serving customers in every governorate of Egypt" },
  { icon: Lock, title: "Security first", desc: "Encryption, biometrics, and 24/7 fraud monitoring" },
  { icon: Users, title: "Human support", desc: "Cairo-based relationship managers and live chat" },
  { icon: Zap, title: "Fast onboarding", desc: "Activate your account within 24 hours" },
];

const FAQS = [
  { q: "Who can apply for a SUMERGE retail account?", a: "Any Egyptian national aged 18 or above with a valid national ID. Foreign nationals with a valid passport can also apply — some account types may have eligibility restrictions." },
  { q: "What documents are required?", a: "For Egyptian nationals: your national ID (we scan it automatically). For foreign nationals: your passport. You may also be asked for proof of address or income in some cases." },
  { q: "How long does the process take?", a: "The application takes about 10 minutes. Your account is provisionally active as soon as you submit. Full activation and card delivery follow within 24 hours." },
  { q: "Can I save and continue later?", a: "Yes. Click 'Save and continue later' on any step. Your reference number lets you pick up exactly where you left off." },
  { q: "How do I get support?", a: "Call 19786374 (Sun–Thu, 9 AM–6 PM EET), email support@sumerge.eg, or use the live chat button on this page." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SplashOverlay />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.06] pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24 relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary bg-secondary/10 border border-secondary/30 px-3 py-1.5 rounded-full mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Retail Banking · Egypt
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
                Banking built for{" "}
                <span className="text-secondary">your everyday</span> life
              </h1>
              <p className="text-base lg:text-lg text-primary-foreground/75 mb-8 max-w-lg leading-relaxed">
                Open a SUMERGE personal account online in minutes. Spend, save, and send money across Egypt with a card that works wherever you do.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/onboarding">
                  <Button size="lg" className="rounded-full px-7 h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow-secondary group">
                    Open your account <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-primary-foreground/70">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Bank-grade security</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Account ready in minutes</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-secondary" /> 100% digital onboarding</span>
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-primary-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Identity verified by Haweya · Certified by the Central Bank of Egypt
              </p>
            </div>

            <div className="relative lg:translate-x-10 xl:translate-x-16">
              <img
                src={heroBanking.url}
                alt="SUMERGE retail banking"
                width={1264}
                height={842}
                className="w-full h-auto object-contain scale-110 lg:scale-125 origin-center mix-blend-luminosity opacity-80 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_75%)]"
              />
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary font-bold mb-2">Accounts</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Choose the account that fits you
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PRODUCTS.map((p) => (
              <div key={p.title} className="bg-card border border-border rounded-2xl p-7 hover:border-primary/30 hover:shadow-elegant transition-all">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                <Link to="/onboarding" className="text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-1">
                  Open this account <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-secondary font-bold mb-1">Retail lending</p>
              <h3 className="text-lg font-semibold text-foreground">Need a credit card, loan or mortgage?</h3>
              <p className="text-sm text-muted-foreground mt-1">Apply for SUMERGE retail lending products in minutes — fully digital.</p>
            </div>
            <Link to="/lending">
              <Button size="lg" className="rounded-full px-6">
                Apply for loan / card <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Account opening steps */}
        <section id="how" className="bg-muted/40 border-y border-border">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary font-bold mb-2">Account opening</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Open your account in 4 simple steps
              </h2>
              <p className="text-muted-foreground mt-3 text-sm">
                A guided digital journey designed for Egyptian residents — no branch visits required.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {STEPS.map((s) => (
                <div key={s.num} className="bg-card border border-border rounded-2xl p-7 hover:shadow-elegant transition-all">
                  <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl font-bold text-sm mb-5 ${s.color}`}>
                    {s.num}
                  </span>
                  <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-secondary font-bold mb-2">About SUMERGE</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-4 leading-tight">
                Banking that moves at the speed of Egypt
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                SUMERGE is an Egyptian retail bank built for the way you live today. We combine modern digital experiences with the local service Egyptian customers expect.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ABOUT_TILES.map((t) => (
                  <div key={t.title} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                    <t.icon className="w-5 h-5 text-secondary shrink-0 mt-0.5" strokeWidth={1.75} />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary text-primary-foreground rounded-2xl p-6 col-span-1 row-span-2 flex flex-col justify-end min-h-[280px] relative overflow-hidden">
                <Users className="w-8 h-8 text-secondary mb-auto" strokeWidth={1.5} />
                <p className="text-3xl font-bold tracking-tight">850k+</p>
                <p className="text-xs text-primary-foreground/70 mt-1">Customers banking with SUMERGE</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <Globe className="w-7 h-7 text-secondary mb-3" strokeWidth={1.5} />
                <p className="text-2xl font-bold text-foreground tracking-tight">1,200+</p>
                <p className="text-xs text-muted-foreground mt-1">Branches & ATMs nationwide</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <Award className="w-7 h-7 text-secondary mb-3" strokeWidth={1.5} />
                <p className="text-2xl font-bold text-foreground tracking-tight">4.8 ★</p>
                <p className="text-xs text-muted-foreground mt-1">App store rating</p>
              </div>
              <div className="bg-secondary text-secondary-foreground rounded-2xl p-6 col-span-2">
                <Zap className="w-7 h-7 mb-3" strokeWidth={1.5} />
                <p className="text-2xl font-bold tracking-tight">24 hours</p>
                <p className="text-xs text-secondary-foreground/85 mt-1">Average account activation</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary font-bold mb-2">FAQ</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible defaultValue="q-0" className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="bg-card border border-border rounded-xl px-5 last:border-border">
                <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline py-4">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-muted/40 border-y border-border">
          <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-secondary font-bold mb-2">Contact us</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-3 leading-tight">
                Talk to a SUMERGE specialist
              </h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Our team is available across Egypt to help you choose the right account and onboarding path.
              </p>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Call us</p>
                    <p className="text-muted-foreground">19 SUMERGE · Sun–Thu, 9 AM–6 PM EET</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground">support@sumerge.eg</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Head Office</p>
                    <p className="text-muted-foreground">Smart Village, Giza, Egypt</p>
                  </div>
                </li>
              </ul>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="bg-card border border-border rounded-2xl p-7 shadow-sm">
              <h3 className="font-semibold text-foreground mb-1">Send us a message</h3>
              <p className="text-xs text-muted-foreground mb-5">We'll get back within one business day.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input placeholder="Full name" className="bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary/50" />
                <input placeholder="Mobile" className="bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary/50" />
              </div>
              <input placeholder="Email" type="email" className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 mb-3" />
              <input placeholder="National ID (optional)" className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 mb-3" />
              <textarea placeholder="How can we help?" rows={4} className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 mb-4 resize-none" />
              <Button className="w-full rounded-lg h-11 bg-primary hover:bg-primary/90 text-primary-foreground">Send Message</Button>
            </form>
          </div>
        </section>

      </main>

      <Footer />
      <NeedAssistance />
    </div>
  );
}
