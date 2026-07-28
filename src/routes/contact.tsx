import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/alps/Shell";
import { SOCIALS } from "@/lib/alps-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import bgPebbles from "@/assets/backgrounds/bg-pebbles.jpg";
import alpsLogo from "@/assets/brand/alps-logo-black.png";


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
      {/* Hero: pebble background with centered contact card */}
      <section
        className="relative w-full min-h-[560px] md:min-h-[640px] flex items-center justify-center px-6 py-16"
        style={{
          backgroundImage: `url(${bgPebbles})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="relative z-10 w-full max-w-3xl grid grid-cols-1 md:grid-cols-[1.15fr_1fr] shadow-2xl"
        >
          {/* Left: grey info panel */}
          <div className="bg-[#8f8f8f] text-white px-8 md:px-10 py-10 md:py-12">
            <p className="text-sm md:text-base tracking-[0.35em] uppercase text-center">contact</p>

            <div className="mt-8 space-y-6 text-[13px] leading-relaxed">
              <div>
                <p className="font-semibold">hong kong office</p>
              </div>
              <div>
                <p className="font-semibold">vancouver office</p>
              </div>
              <div>
                <p className="text-white/90">
                  email&nbsp;:{" "}
                  <a href={`mailto:${SOCIALS.email}`} className="underline underline-offset-4 hover:text-white">
                    {SOCIALS.email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right: official ALPS Annie Ling logo */}
          <div className="relative bg-white px-8 py-10 md:py-12 flex items-center justify-center">
            {/* Red vertical divider that meets the grey panel */}
            <div
              aria-hidden
              className="hidden md:block absolute left-0 top-0 bottom-0 w-[3px] bg-primary"
            />
            <img
              src={alpsLogo}
              alt="ALPS Annie Ling"
              className="w-full max-w-[260px] h-auto object-contain"
              loading="lazy"
            />
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
