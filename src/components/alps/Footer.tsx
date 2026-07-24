import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Twitter, MessageCircle, Music2 } from "lucide-react";
import { useState } from "react";
import { SOCIALS, FEATURES } from "@/lib/alps-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AWARDS = [
  { outlet: "new york product design awards", detail: "smart fashion 2022 – silver" },
  { outlet: "new york product design awards", detail: "fashion and lifestyle" },
  { outlet: "hong kong most outstanding business awards", detail: "best fashion innovation 2022" },
  { outlet: "new york product design awards", detail: "smart fashion 2021 – gold" },
  { outlet: "new york product design awards", detail: "womenswear 2021 – silver" },
  { outlet: "international design awards", detail: "apparel project 2021 – silver" },
  { outlet: "international design awards", detail: "recycle and sustainable fashion 2021 – bronze" },
  { outlet: "international design awards", detail: "apparel category 2021 – honourable" },
  { outlet: "international design awards 2021", detail: "prêt-à-porter 2021 – honourable" },
  { outlet: "international design awards", detail: "sportswear 2018 – silver" },
];

const SIZE_GROUPS = ["kids", "men", "women", "unisex"];

export function Footer() {
  return (
    <footer className="bg-background text-foreground mt-24 border-t border-border">
      <div className="mx-auto max-w-[1760px] px-8 lg:px-12 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-[11px] leading-[1.4]">

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
            {FEATURES.map((f) => (
              <Link
                key={f.key}
                to="/innovation"
                search={{ feature: f.key }}
                className="text-foreground/80 hover:text-primary"
              >
                {f.name}
              </Link>
            ))}
          </div>
        </Col>

        <Col title="awards & accolades">
          <div className="flex flex-col gap-2">
            {AWARDS.map((a, i) => (
              <Link key={i} to="/press" className="text-foreground/80 hover:text-primary block">
                <span className="block font-medium text-foreground">{a.outlet}</span>
                <span className="block text-foreground/70">{a.detail}</span>
              </Link>
            ))}
          </div>
        </Col>

        <Col title="find us">
          <div className="space-y-5">
            <div>
              <p className="text-foreground font-medium mb-2">ALPS</p>
              <div className="flex flex-wrap gap-3 text-foreground/80">
                <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" aria-label="ALPS facebook page" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
                <a href={SOCIALS.facebookPersonal} target="_blank" rel="noreferrer" aria-label="annie ling facebook" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
                <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" aria-label="ALPS instagram" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
                <a href={SOCIALS.instagram2} target="_blank" rel="noreferrer" aria-label="ALPS instagram alt" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
                <a href={SOCIALS.x} target="_blank" rel="noreferrer" aria-label="ALPS x" className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
                <a href={SOCIALS.youtube} target="_blank" rel="noreferrer" aria-label="ALPS youtube" className="hover:text-primary"><Youtube className="h-5 w-5" /></a>
                <a href={SOCIALS.tiktok} target="_blank" rel="noreferrer" aria-label="ALPS tiktok" className="hover:text-primary"><Music2 className="h-5 w-5" /></a>
                <a href={SOCIALS.threads} target="_blank" rel="noreferrer" aria-label="ALPS threads" className="hover:text-primary"><MessageCircle className="h-5 w-5" /></a>
              </div>
            </div>
            <div>
              <p className="text-foreground font-medium mb-2">vegan skincare</p>
              <div className="flex gap-3 text-foreground/80">
                <a href={SOCIALS.skincareFacebook} target="_blank" rel="noreferrer" aria-label="skincare facebook" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
                <a href={SOCIALS.skincareInstagram} target="_blank" rel="noreferrer" aria-label="skincare instagram (english)" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
                <a href={SOCIALS.skincareInstagramBilingual} target="_blank" rel="noreferrer" aria-label="skincare instagram (en/zh)" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
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
    <div className={`flex flex-col ${className}`}>
      <h4 className="text-[13px] tracking-wide text-foreground font-semibold mb-3">{title}</h4>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}
