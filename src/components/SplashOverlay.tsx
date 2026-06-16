import { useEffect, useState } from "react";
import sumergeLogo from "@/assets/sumerge-logo.png.asset.json";
import { useLang } from "@/lib/i18n";

export default function SplashOverlay() {
  const { setLang, t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem("sumerge.splash.seen")) setShow(true);
  }, []);

  const pick = (l: "en" | "ar") => {
    setLang(l);
    sessionStorage.setItem("sumerge.splash.seen", "1");
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[linear-gradient(180deg,#1c2454_0%,#2E2A6E_100%)] text-white animate-in fade-in">
      <div className="mx-auto w-full max-w-sm px-6 text-center">
        <img src={sumergeLogo.url} alt="SUMERGE" className="mx-auto h-12 brightness-0 invert" />
        <h1 className="mt-8 text-2xl font-bold">{t("splash.welcome")}</h1>
        <p className="mt-2 text-sm text-white/70">{t("splash.tagline")}</p>
        <p className="mt-10 text-xs uppercase tracking-[0.2em] text-white/60">{t("splash.choose")}</p>
        <div className="mt-4 grid gap-3">
          <button
            onClick={() => pick("en")}
            className="h-12 rounded-full bg-white font-semibold text-[#2E2A6E] hover:bg-white/90"
          >
            Continue in English
          </button>
          <button
            onClick={() => pick("ar")}
            className="h-12 rounded-full border border-white/30 font-semibold text-white hover:bg-white/10"
            dir="rtl"
          >
            المتابعة بالعربية
          </button>
        </div>
      </div>
    </div>
  );
}