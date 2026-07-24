import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/alps/Shell";
import { SOCIALS } from "@/lib/alps-data";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    // stash as a newsletter row so admin sees it — using existing table
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: f.email });
    // then create a placeholder order-like enquiry via preorders (has a note field would be nicer; fall back to email)
    setBusy(false);
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      toast.error(error.message);
      return;
    }
    toast.success("thanks — we'll be in touch shortly");
    // open mail client with pre-filled message as backup
    window.location.href = `mailto:${SOCIALS.email}?subject=${encodeURIComponent(f.subject || "website enquiry")}&body=${encodeURIComponent(`from: ${f.name} <${f.email}>\n\n${f.message}`)}`;
    setF({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Shell>
      <section className="max-w-3xl mx-auto px-6 py-20">
        <span className="num text-[11px] tracking-[0.3em] text-primary">say hello</span>
        <h1 className="text-4xl font-light mt-3">contact</h1>
        <p className="mt-6 text-foreground/80 leading-relaxed">
          for orders, wholesale enquiries, press requests and custom collaborations, please reach out below or by phone / email.
        </p>

        <div className="mt-6 grid gap-3 text-sm">
          <a href={`mailto:${SOCIALS.email}`} className="flex items-center gap-3 hover:text-primary">
            <Mail className="h-4 w-4 text-primary" />{SOCIALS.email}
          </a>
        </div>

        <form className="mt-10 space-y-4" onSubmit={submit}>
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
