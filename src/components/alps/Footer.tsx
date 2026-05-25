import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { SOCIALS, FEATURES } from "@/lib/alps-data";

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-offwhite mt-24" style={{ borderTop: "2px solid var(--brand-red)" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 text-[12px]">
        <Col title="asia miles">
          <a href={SOCIALS.asiaMiles} target="_blank" rel="noreferrer" className="link-red">cabas 220 shoulder bag</a>
        </Col>
        <Col title="pinkoi">
          <a href="https://www.pinkoi.com/" target="_blank" rel="noreferrer" className="link-red">view shop</a>
        </Col>
        <Col title="size info">
          <span>kids</span><span>men</span><span>women</span><span>unisex</span>
        </Col>
        <Col title="features">
          {FEATURES.slice(0, 8).map((f) => (
            <span key={f.key} className="truncate">{f.name}</span>
          ))}
        </Col>
        <Col title="find us">
          <div className="flex gap-3 text-brand-offwhite">
            <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" aria-label="instagram"><Instagram className="h-4 w-4" /></a>
            <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" aria-label="facebook"><Facebook className="h-4 w-4" /></a>
            <a href={SOCIALS.x} target="_blank" rel="noreferrer" aria-label="x"><Twitter className="h-4 w-4" /></a>
            <a href={SOCIALS.youtube} target="_blank" rel="noreferrer" aria-label="youtube"><Youtube className="h-4 w-4" /></a>
          </div>
        </Col>
        <Col title="contact">
          <a href={`mailto:${SOCIALS.email}`} className="link-red">{SOCIALS.email}</a>
          <Link to="/contact" className="link-red">contact form</Link>
        </Col>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-brand-mid">
          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} ALPS annie ling. all rights reserved.</span>
            <button className="link-red">eng / 中文</button>
          </div>
          <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="catch up new item — your email"
              className="bg-transparent border border-white/20 px-3 py-2 text-[11px] w-72 focus:outline-none focus:border-primary"
            />
            <button className="bg-primary text-primary-foreground px-4 py-2 text-[11px] tracking-wide hover:opacity-90">
              subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-[11px] tracking-[0.15em] uppercase text-brand-mid mb-2">{title}</h4>
      {children}
    </div>
  );
}
