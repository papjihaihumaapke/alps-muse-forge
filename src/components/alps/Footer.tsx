import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Twitter, MessageCircle, Music2 } from "lucide-react";
import { useState } from "react";
import { SOCIALS, FEATURES } from "@/lib/alps-data";
import { AWARDS } from "@/lib/awards";
import { INNOVATIONS } from "@/lib/innovations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SIZE_GROUPS = ["kids", "men", "women", "unisex"];

export function Footer() {
  return (
    <footer className="bg-background text-foreground mt-24 border-t border-border">
      <div
        className="mx-auto max-w-[1760px] px-6 sm:px-8 lg:px-12 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-[11px] leading-[1.4]
          [&>*]:border-l [&>*]:border-t [&>*]:border-border
          [&>*:nth-child(odd)]:border-l-0
          [&>*:nth-child(-n+2)]:border-t-0
          md:[&>*]:border-l md:[&>*]:border-t
          md:[&>*:nth-child(odd)]:border-l md:[&>*:nth-child(3n+1)]:border-l-0
          md:[&>*:nth-child(-n+2)]:border-t md:[&>*:nth-child(-n+3)]:border-t-0
          lg:[&>*:nth-child(3n+1)]:border-l lg:[&>*:nth-child(6n+1)]:border-l-0
          lg:[&>*]:border-t-0"
      >


        <Col title="asia miles">
          <a
            href={SOCIALS.asiaMiles}
            target="_blank"
            rel="noreferrer"
            className="text-foreground/80 hover:text-primary"
          >
            light fresh® technology CABAS 220 shoulder bag
          </a>
        </Col>

        <Col title="size info">
          {SIZE_GROUPS.map((s) => (
            <Link key={s} to="/innovation" className="text-foreground/80 hover:text-primary">
              {s}
            </Link>
          ))}
        </Col>

        <Col title="features">
          <div className="flex flex-col gap-1">
            {FEATURES.map((f) => {
              const innovation = INNOVATIONS.find((i) => i.filterKey === f.key);
              return (
                <Link
                  key={f.key}
                  to="/innovation"
                  hash={innovation?.slug}
                  className="text-foreground/80 hover:text-primary"
                >
                  {f.name}
                </Link>
              );
            })}
          </div>
        </Col>

        <Col title="awards & accolades">
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            {AWARDS.map((a) => (
              <Link
                key={a.id}
                to="/press"
                hash={a.id}
                className="text-foreground/80 hover:text-primary block"
              >
                <span className="block font-medium text-foreground">{a.organization}</span>
                <span className="block text-foreground/70">
                  {a.category} {a.year} — {a.level}
                </span>
              </Link>
            ))}
          </div>
        </Col>


        <Col title="find us">
          <div className="space-y-5">
            <div>
              <p className="text-foreground font-semibold mb-2 text-[12px] tracking-wider">ALPS</p>
              <div className="flex flex-wrap gap-2">
                <SocialIcon href={SOCIALS.facebook} label="ALPS facebook page"><Facebook className="h-4 w-4" fill="currentColor" strokeWidth={0} /></SocialIcon>
                <SocialIcon href={SOCIALS.instagram} label="ALPS instagram"><Instagram className="h-4 w-4" /></SocialIcon>
                <SocialIcon href={SOCIALS.x} label="ALPS x"><Twitter className="h-4 w-4" fill="currentColor" strokeWidth={0} /></SocialIcon>
                <SocialIcon href={SOCIALS.youtube} label="ALPS youtube"><Youtube className="h-4 w-4" fill="currentColor" strokeWidth={0} /></SocialIcon>
                <SocialIcon href={SOCIALS.tiktok} label="ALPS tiktok"><Music2 className="h-4 w-4" /></SocialIcon>
                <SocialIcon href={SOCIALS.threads} label="ALPS threads"><MessageCircle className="h-4 w-4" /></SocialIcon>
              </div>
              <div className="flex gap-2 mt-2">
                <SocialIcon href={SOCIALS.facebookPersonal} label="annie ling facebook"><Facebook className="h-4 w-4" fill="currentColor" strokeWidth={0} /></SocialIcon>
                <SocialIcon href={SOCIALS.instagram2} label="ALPS instagram alt"><Instagram className="h-4 w-4" /></SocialIcon>
              </div>
            </div>
            <div>
              <p className="text-foreground font-semibold mb-2 text-[12px]">vegan skincare</p>
              <div className="flex gap-2">
                <SocialIcon href={SOCIALS.skincareFacebook} label="skincare facebook"><Facebook className="h-4 w-4" fill="currentColor" strokeWidth={0} /></SocialIcon>
                <SocialIcon href={SOCIALS.skincareInstagram} label="skincare instagram (english)"><Instagram className="h-4 w-4" /></SocialIcon>
                <SocialIcon href={SOCIALS.skincareInstagramBilingual} label="skincare instagram (en/zh)"><Instagram className="h-4 w-4" /></SocialIcon>
              </div>

            </div>
            <div>
              <p className="text-foreground font-medium mb-2">support</p>
              <div className="flex flex-col gap-1.5">
                <Link to="/shipping" className="text-foreground/80 hover:text-primary">shipping</Link>
                <Link to="/returns" className="text-foreground/80 hover:text-primary">returns & exchanges</Link>
                <Link to="/terms" className="text-foreground/80 hover:text-primary">terms of service</Link>
                <Link to="/privacy" className="text-foreground/80 hover:text-primary">privacy</Link>
              </div>
            </div>
          </div>
        </Col>

        <Col title="pre-order">
          <Link to="/account" className="text-foreground/80 hover:text-primary">catch up new item</Link>
          <div className="mt-8">
            <p className="text-foreground font-medium mb-2">contact us</p>
            <a href={`mailto:${SOCIALS.email}`} className="text-foreground/80 hover:text-primary block">
              {SOCIALS.email}
            </a>
          </div>
        </Col>
      </div>

      <NewsletterBar />
    </footer>
  );
}

function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = email.trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { toast.error("please enter a valid email"); return; }
    setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: val });
    setBusy(false);
    if (error && !error.message.toLowerCase().includes("duplicate")) { toast.error(error.message); return; }
    toast.success("subscribed — welcome to the ALPS list");
    setEmail("");
  };
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1760px] px-6 lg:px-10 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px]">
        <div className="flex items-center gap-4">
          <span className="tracking-[0.2em] uppercase">stay connected</span>
          <form className="flex items-center" onSubmit={submit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@youremail.com"
              className="bg-white/15 placeholder:text-white/70 text-white px-3 py-1.5 text-[11px] w-64 focus:outline-none"
            />
            <button disabled={busy} className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 text-[11px] tracking-wide border-l border-white/20 disabled:opacity-60">
              {busy ? "…" : "subscribe"}
            </button>
          </form>
        </div>
        <span>© {new Date().getFullYear()} ALPS Annie Ling</span>
      </div>
    </div>
  );
}

function Col({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col px-4 py-4 md:py-3 lg:py-0 ${className}`}>
      <h4 className="text-[13px] tracking-wide text-foreground font-semibold mb-3">{title}</h4>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center h-7 w-7 bg-foreground text-background hover:bg-primary transition-colors"
    >
      {children}
    </a>
  );
}

