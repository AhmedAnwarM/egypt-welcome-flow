import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

export const DICT: Dict = {
  // brand / chrome
  "brand.tagline": { en: "Personal Banking · Egypt", ar: "الخدمات المصرفية للأفراد · مصر" },
  "nav.products": { en: "Products", ar: "المنتجات" },
  "nav.about": { en: "About Us", ar: "من نحن" },
  "nav.how": { en: "How It Works", ar: "كيف يعمل" },
  "nav.faq": { en: "FAQ", ar: "الأسئلة الشائعة" },
  "nav.contact": { en: "Contact Us", ar: "اتصل بنا" },
  "nav.track": { en: "Track Application", ar: "تتبع الطلب" },
  "nav.getStarted": { en: "Get Started", ar: "ابدأ الآن" },
  "nav.signIn": { en: "Sign in", ar: "تسجيل الدخول" },
  "lang.note": { en: "Arabic interface available — switch with the toggle above.", ar: "الواجهة العربية متاحة — يمكنك التبديل من الأعلى." },
  // footer
  "footer.quickLinks": { en: "Quick Links", ar: "روابط سريعة" },
  "footer.legal": { en: "Legal", ar: "قانوني" },
  "footer.contact": { en: "Contact", ar: "اتصل بنا" },
  "footer.privacy": { en: "Privacy Notice", ar: "إشعار الخصوصية" },
  "footer.terms": { en: "Terms & Conditions", ar: "الشروط والأحكام" },
  "footer.hours": { en: "Sun–Thu, 9 AM–6 PM EET", ar: "الأحد–الخميس، ٩ صباحًا–٦ مساءً بتوقيت مصر" },
  "footer.copy": { en: "SUMERGE Egypt S.A.E. Regulated by the Central Bank of Egypt.", ar: "سوميرج مصر ش.م.م. خاضعة لرقابة البنك المركزي المصري." },
  // splash
  "splash.welcome": { en: "Welcome to SUMERGE", ar: "أهلاً بك في سوميرج" },
  "splash.tagline": { en: "Digital banking for everyone in Egypt", ar: "خدمات مصرفية رقمية لكل مصر" },
  "splash.choose": { en: "Choose your language", ar: "اختر لغتك" },
  "splash.continue": { en: "Continue in English", ar: "المتابعة بالعربية" },
  // tracking
  "track.title": { en: "Track your application", ar: "تتبع طلبك" },
  "track.hint": { en: "Enter your reference number to see the latest status.", ar: "أدخل رقم المرجع لمعرفة حالة طلبك." },
  "track.check": { en: "Check status", ar: "عرض الحالة" },
  "track.stage.registration": { en: "Registration completed", ar: "اكتمل التسجيل" },
  "track.stage.verification": { en: "Identity verification", ar: "التحقق من الهوية" },
  "track.stage.compliance": { en: "Compliance review", ar: "المراجعة الرقابية" },
  "track.stage.approval": { en: "Approval pending", ar: "بانتظار الاعتماد" },
  "track.stage.account": { en: "Account created", ar: "تم إنشاء الحساب" },
  "track.stage.card": { en: "Card issued", ar: "إصدار البطاقة" },
  "track.eta": { en: "Estimated completion", ar: "الوقت المتوقع للإنجاز" },
  // welcome
  "welcome.title": { en: "Welcome aboard", ar: "أهلاً بانضمامك" },
  "welcome.desc": { en: "Your SUMERGE account is ready. Download your welcome kit and activate mobile banking below.", ar: "حسابك في سوميرج جاهز. حمّل دليل الترحيب وفعّل الخدمات المصرفية عبر الهاتف من الأسفل." },
  "welcome.accountNo": { en: "Account number", ar: "رقم الحساب" },
  "welcome.iban": { en: "IBAN", ar: "رقم الآيبان" },
  "welcome.card": { en: "Virtual card", ar: "البطاقة الرقمية" },
  "welcome.download": { en: "Download welcome kit", ar: "تنزيل دليل الترحيب" },
  "welcome.activate": { en: "Activate mobile banking", ar: "تفعيل التطبيق المصرفي" },
  // session
  "session.title": { en: "Are you still there?", ar: "هل ما زلت معنا؟" },
  "session.body": { en: "For your security, you'll be signed out shortly.", ar: "لحمايتك سيتم تسجيل خروجك قريبًا." },
  "session.stay": { en: "Stay signed in", ar: "البقاء" },
  "session.signOut": { en: "Sign out", ar: "تسجيل الخروج" },
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = (localStorage.getItem("sumerge.lang") as Lang | null) ?? "en";
    setLangState(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("sumerge.lang", l);
  };

  const t = (k: string) => {
    const entry = DICT[k];
    if (!entry) return k;
    return entry[lang] ?? entry.en;
  };

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

export function useT() {
  return useContext(LangCtx).t;
}