import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { auditLog } from "@/lib/audit";

const IDLE_MS = 10 * 60 * 1000; // 10 min
const WARNING_MS = 60 * 1000; // 1 min warning

export default function SessionTimeout({ onSignOut }: { onSignOut?: () => void }) {
  const t = useT();
  const [warn, setWarn] = useState(false);
  const [remaining, setRemaining] = useState(WARNING_MS / 1000);
  const idleRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const reset = () => {
    if (idleRef.current) window.clearTimeout(idleRef.current);
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    setWarn(false);
    setRemaining(WARNING_MS / 1000);
    idleRef.current = window.setTimeout(() => {
      auditLog("session.warning");
      setWarn(true);
      countdownRef.current = window.setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            window.clearInterval(countdownRef.current!);
            auditLog("session.timeout");
            onSignOut?.();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }, IDLE_MS - WARNING_MS);
  };

  useEffect(() => {
    const events: Array<keyof WindowEventMap> = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    const handler = () => {
      if (!warn) reset();
    };
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (idleRef.current) window.clearTimeout(idleRef.current);
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warn]);

  if (!warn) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-elegant">
        <h3 className="text-lg font-bold text-primary">{t("session.title")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("session.body")}</p>
        <p className="mt-3 text-2xl font-mono font-bold text-primary">0:{String(remaining).padStart(2, "0")}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onSignOut?.()}>{t("session.signOut")}</Button>
          <Button onClick={reset} className="bg-primary text-primary-foreground">{t("session.stay")}</Button>
        </div>
      </div>
    </div>
  );
}