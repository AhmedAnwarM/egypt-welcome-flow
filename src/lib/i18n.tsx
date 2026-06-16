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
  // lending
  "nav.lending": { en: "Apply for loan / card", ar: "تقديم قرض / بطاقة" },
  "lending.title": { en: "Retail lending", ar: "التمويل الشخصي" },
  "lending.subtitle": { en: "Apply for a credit card, personal loan, auto loan or mortgage in minutes.", ar: "تقدّم بطلب بطاقة ائتمان، قرض شخصي، قرض سيارة أو رهن عقاري في دقائق." },
  "lending.cta.start": { en: "Start your application", ar: "ابدأ طلبك" },
  "lending.step.product": { en: "Product & channel", ar: "المنتج والقناة" },
  "lending.step.identity": { en: "Profile & identity", ar: "الملف والهوية" },
  "lending.step.affordability": { en: "Employment & affordability", ar: "العمل والقدرة على السداد" },
  "lending.step.documents": { en: "Documents", ar: "المستندات" },
  "lending.step.decision": { en: "Decisioning", ar: "القرار" },
  "lending.step.review": { en: "Review & sign", ar: "المراجعة والتوقيع" },
  "lending.product.credit_card": { en: "Credit card", ar: "بطاقة ائتمان" },
  "lending.product.personal_loan": { en: "Personal loan", ar: "قرض شخصي" },
  "lending.product.auto_loan": { en: "Auto loan", ar: "قرض سيارة" },
  "lending.product.mortgage": { en: "Mortgage", ar: "رهن عقاري" },
  "lending.channel.digital": { en: "Mobile / Web", ar: "الهاتف / الويب" },
  "lending.channel.branch": { en: "Branch assisted", ar: "بمساعدة الفرع" },
  "lending.channel.rm": { en: "Sales / Relationship manager", ar: "مدير العلاقة" },
  "lending.customer.etb": { en: "Existing SUMERGE customer", ar: "عميل حالي لسوميرج" },
  "lending.customer.ntb": { en: "New to SUMERGE", ar: "عميل جديد" },
  "lending.decision.instant_pre_approval": { en: "Instant pre-approval", ar: "موافقة مبدئية فورية" },
  "lending.decision.conditional_approval": { en: "Conditional approval", ar: "موافقة مشروطة" },
  "lending.decision.refer_credit_risk": { en: "Referred to credit risk", ar: "محال لإدارة المخاطر" },
  "lending.decision.outright_reject": { en: "Application declined", ar: "تم رفض الطلب" },
  "lending.success.title": { en: "Application submitted", ar: "تم تقديم الطلب" },
  "lending.success.body": { en: "We've recorded your lending application. You'll receive updates on your registered mobile and email.", ar: "تم تسجيل طلبك. ستصلك تحديثات الحالة على هاتفك وبريدك المسجلين." },
  // lending — section headings & customer hints
  "lending.section.product": { en: "Choose a product", ar: "اختر المنتج" },
  "lending.section.channel": { en: "Application channel", ar: "قناة التقديم" },
  "lending.section.customer": { en: "Customer type", ar: "نوع العميل" },
  "lending.customer.etbHint": { en: "We'll prefill your details from Core Banking.", ar: "سنقوم بتعبئة بياناتك من النظام المصرفي الأساسي." },
  "lending.customer.ntbHint": { en: "We'll verify your identity via Haweya.", ar: "سنتحقق من هويتك عبر هوية." },
  // lending — identity step
  "lending.identity.etbTitle": { en: "Fetch your profile from Core Banking", ar: "استرجاع بياناتك من النظام المصرفي الأساسي" },
  "lending.identity.ntbTitle": { en: "Verify your identity via Haweya", ar: "التحقق من هويتك عبر هوية" },
  "lending.identity.privacy": { en: "No real data leaves this device.", ar: "لا تغادر أي بيانات حقيقية هذا الجهاز." },
  "lending.identity.load": { en: "Load my details", ar: "تحميل بياناتي" },
  "lending.identity.verify": { en: "Verify identity", ar: "تحقق من الهوية" },
  "lending.identity.verified": { en: "Identity verified.", ar: "تم التحقق من الهوية." },
  // lending — fields
  "lending.field.fullName": { en: "Full name", ar: "الاسم الكامل" },
  "lending.field.nationalId": { en: "National ID", ar: "الرقم القومي" },
  "lending.field.mobile": { en: "Mobile", ar: "رقم الهاتف" },
  "lending.field.email": { en: "Email", ar: "البريد الإلكتروني" },
  "lending.field.employer": { en: "Employer", ar: "جهة العمل" },
  "lending.field.employmentType": { en: "Employment type", ar: "نوع العمل" },
  "lending.field.sector": { en: "Sector", ar: "القطاع" },
  "lending.field.sectorPlaceholder": { en: "e.g. Technology", ar: "مثال: التكنولوجيا" },
  "lending.field.netIncome": { en: "Net monthly income (EGP)", ar: "صافي الدخل الشهري (ج.م)" },
  "lending.field.obligations": { en: "Existing monthly obligations (EGP)", ar: "الالتزامات الشهرية الحالية (ج.م)" },
  "lending.field.requestedAmount": { en: "Requested amount (EGP)", ar: "المبلغ المطلوب (ج.م)" },
  "lending.field.requestedLimit": { en: "Requested limit (EGP)", ar: "الحد الائتماني المطلوب (ج.م)" },
  "lending.field.tenor": { en: "Tenor (months)", ar: "مدة السداد (شهر)" },
  // lending — employment options
  "lending.empType.permanent": { en: "Permanent", ar: "دائم" },
  "lending.empType.contract": { en: "Contract", ar: "بعقد" },
  "lending.empType.self_employed": { en: "Self-employed", ar: "أعمال حرة" },
  "lending.empType.government": { en: "Government", ar: "حكومي" },
  // lending — metrics
  "lending.metric.installment": { en: "Monthly installment", ar: "القسط الشهري" },
  "lending.metric.dbr": { en: "Debt burden ratio", ar: "نسبة عبء الدين" },
  // lending — documents
  "lending.docs.intro": { en: "Upload the required documents. Files stay on this device.", ar: "ارفع المستندات المطلوبة. تبقى الملفات على هذا الجهاز." },
  "lending.doc.salary_slip": { en: "Latest salary slip", ar: "أحدث كشف راتب" },
  "lending.doc.hr_letter": { en: "HR / employer letter", ar: "خطاب من جهة العمل" },
  "lending.doc.bank_statement": { en: "Bank statement (3 months)", ar: "كشف حساب بنكي (٣ أشهر)" },
  "lending.doc.id_doc": { en: "National ID / Passport", ar: "الرقم القومي / جواز السفر" },
  "lending.doc.collateral": { en: "Collateral / asset document", ar: "مستند الضمان / الأصل" },
  "lending.doc.optional": { en: "optional", ar: "اختياري" },
  "lending.doc.fileHint": { en: "PDF, JPG or PNG · up to 5 MB", ar: "PDF أو JPG أو PNG · حتى ٥ ميجابايت" },
  "lending.doc.upload": { en: "Upload", ar: "رفع" },
  "lending.doc.replace": { en: "Replace", ar: "استبدال" },
  // lending — decision step
  "lending.decision.runIntro": { en: "We'll run AML/PEP, fraud, I-Score and affordability checks now.", ar: "سنقوم الآن بفحوصات مكافحة غسل الأموال، الاحتيال، آي-سكور والقدرة على السداد." },
  "lending.decision.runButton": { en: "Run automated decisioning", ar: "تشغيل المنح الآلي" },
  "lending.stat.iscore": { en: "I-Score", ar: "آي-سكور" },
  "lending.stat.dbr": { en: "DBR", ar: "نسبة عبء الدين" },
  "lending.stat.aml": { en: "AML / Sanctions", ar: "غسل الأموال / العقوبات" },
  "lending.stat.fraud": { en: "Fraud", ar: "احتيال" },
  "lending.stat.hit": { en: "Hit", ar: "تنبيه" },
  "lending.stat.clear": { en: "Clear", ar: "سليم" },
  // lending — alternatives
  "lending.alt.intro": { en: "Choose an alternative that fits within policy:", ar: "اختر بديلًا يتوافق مع السياسة:" },
  "lending.alt.none": { en: "No policy-compliant alternative is available; case will be referred to Credit Risk.", ar: "لا يوجد بديل متوافق مع السياسة؛ سيُحال الطلب إلى إدارة مخاطر الائتمان." },
  "lending.alt.noneSubmit": { en: "No policy-compliant alternative is available; this case will be submitted for Credit Risk review.", ar: "لا يوجد بديل متوافق مع السياسة؛ سيتم تقديم الطلب لمراجعة إدارة مخاطر الائتمان." },
  "lending.alt.longerTenor": { en: "Longer tenor", ar: "مدة سداد أطول" },
  "lending.alt.lowerAmount": { en: "Lower amount", ar: "مبلغ أقل" },
  "lending.alt.combined": { en: "Lower amount + longer tenor", ar: "مبلغ أقل + مدة أطول" },
  "lending.alt.amount": { en: "Amount", ar: "المبلغ" },
  "lending.alt.tenor": { en: "Tenor", ar: "المدة" },
  "lending.alt.installment": { en: "Installment", ar: "القسط" },
  "lending.alt.dbr": { en: "DBR", ar: "نسبة عبء الدين" },
  "lending.alt.months": { en: "m", ar: "ش" },
  "lending.reject.body": { en: "You can return to the home page or apply for a different product later.", ar: "يمكنك العودة للصفحة الرئيسية أو التقديم لمنتج آخر لاحقًا." },
  // lending — decision reasons
  "lending.reason.compliance": { en: "Compliance / fraud screening hit.", ar: "تنبيه في فحوصات الالتزام أو الاحتيال." },
  "lending.reason.scoreLow": { en: "Credit bureau score below minimum.", ar: "درجة الاستعلام الائتماني أقل من الحد الأدنى." },
  "lending.reason.scoreReview": { en: "Credit bureau score requires manual review.", ar: "درجة الاستعلام الائتماني تتطلب مراجعة يدوية." },
  "lending.reason.strong": { en: "Strong score and affordability within policy.", ar: "درجة قوية وقدرة على السداد ضمن السياسة." },
  "lending.reason.dbrHigh": { en: "Affordability exceeds 50% DBR — alternatives proposed.", ar: "نسبة عبء الدين تتجاوز ٥٠٪ — تم اقتراح بدائل." },
  "lending.reason.borderline": { en: "Borderline profile — manual underwriting required.", ar: "ملف حدّي — يتطلب اكتتابًا يدويًا." },
  // lending — review & nav
  "lending.review.product": { en: "Product", ar: "المنتج" },
  "lending.review.amount": { en: "Amount", ar: "المبلغ" },
  "lending.review.limit": { en: "Limit", ar: "الحد" },
  "lending.review.tenor": { en: "Tenor", ar: "المدة" },
  "lending.review.installment": { en: "Monthly installment", ar: "القسط الشهري" },
  "lending.review.dbr": { en: "DBR", ar: "نسبة عبء الدين" },
  "lending.review.decision": { en: "Decision", ar: "القرار" },
  "lending.review.months": { en: "months", ar: "شهر" },
  "lending.review.signTitle": { en: "Digital acceptance", ar: "القبول الرقمي" },
  "lending.review.otp": { en: "6-digit OTP", ar: "رمز التحقق المكوّن من ٦ أرقام" },
  "lending.review.signName": { en: "Type your full name to sign", ar: "اكتب اسمك الكامل للتوقيع" },
  "lending.review.signPlaceholder": { en: "Your full name", ar: "اسمك الكامل" },
  "lending.nav.back": { en: "Back", ar: "السابق" },
  "lending.nav.continue": { en: "Continue", ar: "متابعة" },
  "lending.nav.submit": { en: "Submit application", ar: "تقديم الطلب" },
  "lending.nav.save": { en: "Save and continue later", ar: "احفظ وأكمل لاحقًا" },
  "lending.nav.cancel": { en: "Cancel and return home", ar: "إلغاء والعودة للرئيسية" },
  "lending.welcomeBack": { en: "Welcome back — we've restored your draft.", ar: "أهلًا بعودتك — تم استرجاع مسودتك." },
  "lending.saved": { en: "Draft saved. You can resume from the same device.", ar: "تم حفظ المسودة. يمكنك المتابعة من نفس الجهاز." },
  "lending.savedRef": { en: "Reference {ref} saved on this device. Resume later from {path}.", ar: "تم حفظ المرجع {ref} على هذا الجهاز. يمكنك المتابعة لاحقًا من {path}." },
  "lending.savedLocalOnly": { en: "This draft is stored on this device only.", ar: "تُحفظ المسودة على هذا الجهاز فقط." },
  // lending — validation
  "lending.validation.amountRange": { en: "Amount must be between {min} and {max}.", ar: "يجب أن يكون المبلغ بين {min} و{max}." },
  "lending.validation.tenorRange": { en: "Tenor must be between {min} and {max} months.", ar: "يجب أن تكون المدة بين {min} و{max} شهرًا." },
  // lending — success screen
  "lending.success.reference": { en: "Reference", ar: "رقم المرجع" },
  "lending.success.timelineTitle": { en: "Status timeline", ar: "مراحل الطلب" },
  "lending.success.stage.received": { en: "Application received", ar: "تم استلام الطلب" },
  "lending.success.stage.screening": { en: "Compliance & risk screening", ar: "فحوصات الالتزام والمخاطر" },
  "lending.success.stage.recorded": { en: "Credit decision recorded", ar: "تم تسجيل قرار الائتمان" },
  "lending.success.stage.disbursement": { en: "Disbursement / card issuance", ar: "الصرف / إصدار البطاقة" },
  "lending.success.bodyReferred": { en: "Your application has been submitted and is pending manual credit risk review. We'll contact you with the outcome.", ar: "تم تقديم طلبك وهو قيد المراجعة اليدوية لإدارة مخاطر الائتمان. سنتواصل معك بالنتيجة." },
  "lending.success.stage.pendingRisk": { en: "Pending Credit Risk review", ar: "بانتظار مراجعة إدارة المخاطر" },
  "lending.success.stage.finalPending": { en: "Final approval / booking pending", ar: "الموافقة النهائية / التسجيل قيد الانتظار" },
  "lending.success.backHome": { en: "Back to home", ar: "العودة للرئيسية" },
  "lending.success.track": { en: "Track application", ar: "تتبع الطلب" },
  // landing — lending teaser
  "home.lending.kicker": { en: "Retail lending", ar: "التمويل الشخصي" },
  "home.lending.title": { en: "Need a credit card, loan or mortgage?", ar: "تحتاج بطاقة ائتمان أو قرضًا أو رهنًا عقاريًا؟" },
  "home.lending.body": { en: "Apply for SUMERGE retail lending products in minutes — fully digital.", ar: "تقدّم بطلب منتجات التمويل الشخصي من سوميرج في دقائق — رقميًا بالكامل." },
  "home.lending.cta": { en: "Apply for loan / card", ar: "تقديم قرض / بطاقة" },
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