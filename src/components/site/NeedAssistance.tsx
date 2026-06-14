import { useState } from "react";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NeedAssistance() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-card border border-border rounded-2xl shadow-xl w-80 p-5 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">We're here to help you</h3>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Type your query below, and our team will get back to you shortly.</p>
          <textarea value={query} onChange={(e) => setQuery(e.target.value)} className="w-full border border-border rounded-lg p-3 text-sm bg-background text-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <Button className="w-full mt-3 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={() => { setQuery(""); setOpen(false); }}>Submit Query</Button>
          <Button variant="outline" className="w-full mt-2 rounded-xl border-secondary/40 text-secondary hover:bg-secondary/10 hover:text-secondary">Call me back</Button>
          <div className="flex items-center gap-2 my-3">
            <hr className="flex-1 border-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <hr className="flex-1 border-border" />
          </div>
          <p className="text-xs text-muted-foreground mb-2">Reach out to us on below contact details</p>
          <div className="space-y-2">
            <a href="mailto:support@sumerge.eg" className="flex items-center gap-2 text-sm text-secondary hover:underline"><Mail className="w-4 h-4" /> support@sumerge.eg</a>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Phone className="w-4 h-4 text-secondary" />
              <span>19 SUMERGE<br /><span className="text-xs text-muted-foreground">(Sun–Thu, 9:00 am to 6:00 pm)</span></span>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-5 py-3 shadow-lg flex items-center gap-2 text-sm font-semibold transition-all">
        <MessageCircle className="w-5 h-5" /> Need assistance?
      </button>
    </div>
  );
}