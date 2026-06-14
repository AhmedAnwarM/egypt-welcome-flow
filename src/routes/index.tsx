import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, Smartphone, ArrowRight, Wallet, CreditCard, PiggyBank, Globe2, LogIn, CheckCircle2 } from "lucide-react";
import heroImg from "@/assets/hero-retail-banking.jpg";
import sumergeLogo from "@/assets/sumerge-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SUMERGE — Retail Banking, Egypt" },
      { name: "description", content: "Open a SUMERGE personal account online in minutes. Cards, savings, and instant transfers across Egypt." },
      { property: "og:title", content: "SUMERGE — Retail Banking, Egypt" },
      { property: "og:description", content: "Open a SUMERGE personal account online in minutes." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Stats />
      <ResumeStrip />
      <Products />
      <Steps />
      <About />
      <FAQ />
      <Contact />
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" aria-label="SUMERGE home">
          <img src={sumergeLogo.url} alt="SUMERGE" width={160} height={32} className="h-8 w-auto" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex">
          <a href="#products" className="hover:text-primary">Products</a>
          <a href="#about" className="hover:text-primary">About Us</a>
          <a href="#how" className="hover:text-primary">How It Works</a>
          <a href="#faq" className="hover:text-primary">FAQ</a>
          <a href="#contact" className="hover:text-primary">Contact Us</a>
          <Link to="/status" className="hover:text-primary">Track Application</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/status" className="hidden text-foreground/70 hover:text-primary md:inline-flex" aria-label="Sign in">
            <LogIn className="h-5 w-5" />
          </Link>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
            <Link to="/onboarding">Open an Account</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden text-hero-foreground" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(var(--mint) 1px, transparent 1px), linear-gradient(90deg, var(--mint) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-24 pt-20 md:grid-cols-2 md:pb-32 md:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-3 py-1 text-xs font-medium text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Retail Banking · Egypt
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] md:text-6xl">
            Banking built for{" "}
            <span className="text-mint">your everyday life</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-hero-foreground/75 md:text-lg">
            Open a SUMERGE personal account online in minutes. Spend, save, and send money across Egypt with a card that works wherever you do.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/onboarding">
                Open an Account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <Link to="/status">Track Application</Link>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-hero-foreground/70">
            {["Bank-grade security", "Activate in 24 hours", "100% digital onboarding"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-mint/20 blur-3xl" />
          <img
            src={heroImg}
            alt="SUMERGE retail banking app"
            width={1024}
            height={1024}
            className="relative mx-auto w-full max-w-lg rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: "850k+", l: "Customers in Egypt" },
    { v: "EGP 24B+", l: "Processed annually" },
    { v: "24 hrs", l: "Average activation" },
    { v: "24/7", l: "Customer support" },
  ];
  return (
    <section className="border-b border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
        {items.map((i) => (
          <div key={i.l} className="text-center md:text-left">
            <div className="text-3xl font-bold text-foreground md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>{i.v}</div>
            <div className="mt-1 text-sm text-muted-foreground">{i.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResumeStrip() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-6 md:flex-row md:items-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Already started?</span> Resume your application or track its progress at any time.
        </p>
        <Button asChild variant="outline" size="lg">
          <Link to="/status">Continue or track <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}

function Products() {
  const items = [
    { icon: Wallet, t: "Everyday Accounts", d: "EGP current and savings accounts with no monthly fees and instant InstaPay transfers." },
    { icon: CreditCard, t: "Debit & Credit Cards", d: "Mastercard debit and credit cards with cashback, online controls, and zero FX markup abroad." },
    { icon: PiggyBank, t: "Savings & Goals", d: "Earn competitive returns with flexible savings pots and Sharia-compliant options." },
  ];
  return (
    <section id="products" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-mint">Our products</p>
        <h2 className="mt-3 max-w-2xl text-4xl font-bold md:text-5xl">Everything you need to manage your money</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, t, d }) => (
            <div key={t} className="group rounded-2xl border border-border bg-card p-7 transition-all hover:border-mint/60 hover:shadow-[var(--shadow-elegant)]">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-mint/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              <Link to="/onboarding" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-mint">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps() {
  const steps = [
    { n: "01", t: "Verify with Digital ID", d: "Sign in with Digital Egyptian ID to verify your identity in seconds — no paperwork." },
    { n: "02", t: "Tell us about you", d: "Add your address, employment, and the type of account you want." },
    { n: "03", t: "Start banking today", d: "Get your account number instantly and order your card to your door." },
  ];
  return (
    <section id="how" className="border-b border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-mint">Account opening</p>
        <h2 className="mt-3 max-w-2xl text-4xl font-bold md:text-5xl">Open your account in 3 simple steps</h2>
        <p className="mt-4 max-w-xl text-muted-foreground">A guided digital journey designed for Egyptian residents — no branch visits required.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-7">
              <div className="text-sm font-semibold text-mint">{s.n}</div>
              <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild variant="mint" size="xl">
            <Link to="/onboarding">Start Application <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function About() {
  const items = [
    { icon: Globe2, t: "Trusted nationwide", d: "Serving customers in every governorate of Egypt" },
    { icon: ShieldCheck, t: "Security first", d: "Encryption, biometrics, and 24/7 fraud monitoring" },
    { icon: Smartphone, t: "Mobile-first", d: "Manage everything from the SUMERGE app" },
    { icon: Zap, t: "Fast onboarding", d: "Activate your account within 24 hours" },
  ];
  return (
    <section id="about" className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-mint">About SUMERGE</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Banking that moves at the speed of Egypt</h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            SUMERGE is an Egyptian retail bank built for the way you live today. We combine modern digital experiences with the local service Egyptian customers expect.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
            <Stat label="Customers in Egypt" value="850k+" />
            <Stat label="Branches & ATMs" value="1,200+" />
            <Stat label="App rating" value="4.8 ★" />
            <Stat label="Avg. activation" value="24 hrs" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-mint/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    { q: "Who can apply for a SUMERGE retail account?", a: "Any Egyptian resident aged 18 or older with a valid national ID can apply online in minutes." },
    { q: "What documents are required?", a: "Your national ID and proof of address. Employed applicants can also share a recent salary slip to unlock higher limits." },
    { q: "How long does the process take?", a: "Most applications are reviewed and activated within 24 hours of submission." },
    { q: "Can I save and continue later?", a: "Yes — your progress is saved automatically and you can resume anytime via the Track Application page." },
    { q: "How do I get support?", a: "Call us, email, or chat with us in-app any time. Our Cairo support team is available 24/7." },
  ];
  return (
    <section id="faq" className="border-b border-border bg-secondary/50">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-mint">FAQ</p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">Frequently asked questions</h2>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold">
                {f.q}
                <span className="text-mint transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-mint">Contact us</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Talk to a SUMERGE specialist</h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Our team is available across Egypt to help you choose the right account.
          </p>
          <ul className="mt-8 space-y-5 text-sm">
            <li><div className="font-semibold">Call us</div><div className="text-muted-foreground">19SUMERGE · Sun–Thu, 9 AM–6 PM EET</div></li>
            <li><div className="font-semibold">Email</div><div className="text-muted-foreground">support@sumerge.eg</div></li>
            <li><div className="font-semibold">Head office</div><div className="text-muted-foreground">Smart Village, Giza, Egypt</div></li>
          </ul>
        </div>
        <form className="rounded-2xl border border-border bg-card p-7 shadow-sm" onSubmit={(e) => e.preventDefault()}>
          <h3 className="text-xl font-semibold">Send us a message</h3>
          <p className="mt-1 text-sm text-muted-foreground">We'll get back within one business day.</p>
          <div className="mt-5 grid gap-4">
            <input className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-mint" placeholder="Full name" />
            <input className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-mint" placeholder="Email" type="email" />
            <textarea rows={4} className="rounded-lg border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-mint" placeholder="How can we help?" />
            <Button type="submit" variant="mint" size="lg">Send Message</Button>
          </div>
        </form>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="text-hero-foreground" style={{ background: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="text-4xl font-bold md:text-5xl">Ready to bank smarter?</h2>
        <p className="mt-4 text-hero-foreground/75">Open your SUMERGE personal account today.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="hero" size="xl">
            <Link to="/onboarding">Open an Account <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="heroOutline" size="xl">
            <Link to="/status">Track Application</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-hero-foreground/60">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-mint" /> Regulated by the Central Bank of Egypt</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-mint" /> Deposits insured</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hero-foreground/10 bg-hero-bg-deep text-hero-foreground/70">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs md:flex-row">
        <span>© {new Date().getFullYear()} SUMERGE Egypt S.A.E. All rights reserved.</span>
        <span>Cairo · Alexandria · Giza</span>
      </div>
    </footer>
  );
}
