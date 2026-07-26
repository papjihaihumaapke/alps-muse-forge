import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/alps/Shell";
import { SOCIALS } from "@/lib/alps-data";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import bgSlats from "@/assets/backgrounds/bg-slats.jpg.asset.json";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "contact — ALPS Annie Ling" },
      { name: "description", content: "Get in touch with ALPS Annie Ling — wholesale, press, custom orders." },
      { property: "og:title", content: "contact — ALPS Annie Ling" },
      { property: "og:description", content: "Get in touch." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.message) { toast.error("please fill in name, email and message"); return; }
    setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: f.email });
    setBusy(false);
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      toast.error(error.message);
      return;
    }
    toast.success("thanks — we'll be in touch shortly");
    window.location.href = `mailto:${SOCIALS.email}?subject=${encodeURIComponent(f.subject || "website enquiry")}&body=${encodeURIComponent(`from: ${f.name} <${f.email}>\n\n${f.message}`)}`;
    setF({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Shell>
      {/* Hero with background image + centered contact panel */}
      <section
        className="relative w-full min-h-[520px] md:min-h-[600px] flex items-center justify-center px-6 py-16"
        style={{
          backgroundImage: `url(${bgSlats.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div aria-hidden className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 w-full max-w-2xl bg-background/95 backdrop-blur-sm shadow-2xl px-8 md:px-12 py-10 md:py-12">
          <span className="num text-[11px] tracking-[0.3em] text-primary">say hello</span>
          <h1 className="text-3xl md:text-4xl font-light mt-3">contact</h1>
          <p className="mt-5 text-sm text-foreground/80 leading-relaxed">
            for orders, wholesale enquiries, press requests and custom collaborations —
            please reach out below.
          </p>

          <div className="mt-8 space-y-4 text-sm">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-foreground/60">hong kong office</p>
              <p className="mt-1 text-foreground/85">7/F, CITA, 63 Tai Yip Street, Kowloon Bay</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-foreground/60">vancouver office</p>
              <p className="mt-1 text-foreground/85">address: TBC</p>
            </div>
            <a
              href={`mailto:${SOCIALS.email}`}
              className="inline-flex items-center gap-3 pt-2 text-foreground hover:text-primary"
            >
              <Mail className="h-4 w-4 text-primary" />
              {SOCIALS.email}
            </a>
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-light">send a message</h2>
        <p className="mt-2 text-sm text-foreground/60">
          fill in the form below and we'll be in touch shortly.
        </p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <Field label="name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <Field label="email" type="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
          <Field label="subject" value={f.subject} onChange={(v) => setF({ ...f, subject: v })} />
          <label className="block">
            <span className="text-[11px] tracking-wide text-foreground/60">message</span>
            <textarea rows={6} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className="mt-1 w-full bg-card border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </label>
          <button disabled={busy} className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase disabled:opacity-60">
            {busy ? "sending…" : "send"}
          </button>
        </form>
      </section>
    </Shell>
  );
}

function Field({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-wide text-foreground/60">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full bg-card border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary" />
    </label>
  );
}
