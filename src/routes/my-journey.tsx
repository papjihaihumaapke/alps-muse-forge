import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { SOCIALS } from "@/lib/alps-data";
import { supabase } from "@/integrations/supabase/client";
import designer from "@/assets/brand/designer-atelier.jpg";

type JourneyItem = {
  id: string;
  kind: "video" | "award" | "shop" | "home_video";
  title: string;
  subtitle: string | null;
  url: string | null;
  image_url: string | null;
  sort_order: number;
};

export const Route = createFileRoute("/my-journey")({
  head: () => ({
    meta: [
      { title: "my journey — annie ling" },
      {
        name: "description",
        content:
          "annie ling founded ALPS Annie Ling in 2015 — uniting fashion, technology and craftsmanship to design enduring clothing that supports wellbeing.",
      },
      { property: "og:title", content: "my journey — annie ling" },
      {
        property: "og:description",
        content: "the story behind ALPS Annie Ling — timeless with a twist, made to make a difference.",
      },
    ],
  }),
  component: MyJourney,
});

function MyJourney() {
  const [items, setItems] = useState<JourneyItem[]>([]);
  useEffect(() => {
    supabase
      .from("journey_items")
      .select("id, kind, title, subtitle, url, image_url, sort_order")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setItems((data ?? []) as JourneyItem[]));
  }, []);

  const byKind = (k: JourneyItem["kind"]) => items.filter((i) => i.kind === k);
  const videos = byKind("video");
  const awards = byKind("award");
  const shops = byKind("shop");

  return (
    <Shell>
      <section className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <img
          src={designer}
          alt="annie ling — atelier portrait"
          className="aspect-[4/5] object-cover bg-muted"
        />
        <div>
          <span className="num text-[11px] tracking-[0.3em] text-primary">designer</span>
          <h1 className="text-4xl font-light mt-3">my journey</h1>
          <p className="mt-4 text-[11px] tracking-[0.25em] uppercase text-foreground/60">
            timeless with a twist · made to make a difference
          </p>
          <div className="mt-8 space-y-5 text-foreground/80 leading-relaxed text-[15px]">
            <p>
              driven by the desire to unite fashion, technology and craftsmanship, designer annie ling
              founded ALPS Annie Ling in 2015. inspired by a new age of active living and cutting-edge
              textile innovations, the brand is committed to designing enduring clothing that supports
              wellbeing.
            </p>
            <p>
              people want to feel good in their clothing. we make this the design code of our
              collections: modern, minimalist, high-quality everyday designs with a twist.
            </p>
            <p className="num text-[11px] tracking-[0.25em] text-primary uppercase pt-2">— annie ling</p>
          </div>
          <div className="mt-10 pt-8 border-t border-border">
            <p className="text-[11px] tracking-[0.25em] uppercase text-foreground/60 mb-3">alumni programmes</p>
            <ul className="space-y-2 text-sm">
              <li><a href={SOCIALS.dipAlumni} target="_blank" rel="noreferrer" className="link-red">design incubation programme (dip) alumni →</a></li>
              <li><a href={SOCIALS.fipAlumni} target="_blank" rel="noreferrer" className="link-red">fashion incubation programme (fip) alumni →</a></li>
            </ul>
          </div>
        </div>
      </section>

      {videos.length > 0 && (
        <Section title="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <a key={v.id} href={v.url ?? "#"} target="_blank" rel="noreferrer" className="group block">
                <div className="aspect-video bg-muted overflow-hidden">
                  {v.image_url && <img src={v.image_url} alt={v.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
                </div>
                <p className="text-sm mt-3 group-hover:text-primary transition-colors">{v.title}</p>
                {v.subtitle && <p className="text-xs text-foreground/60 mt-1">{v.subtitle}</p>}
              </a>
            ))}
          </div>
        </Section>
      )}

      {awards.length > 0 && (
        <Section title="awards & recognition" bg="bg-brand-light">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {awards.map((a) => (
              <div key={a.id} className="flex gap-4 border border-border bg-background p-4">
                {a.image_url && <img src={a.image_url} alt={a.title} loading="lazy" className="h-20 w-20 shrink-0 object-cover" />}
                <div className="min-w-0">
                  <p className="text-sm">{a.title}</p>
                  {a.subtitle && <p className="text-xs text-foreground/60 mt-1">{a.subtitle}</p>}
                  {a.url && <a href={a.url} target="_blank" rel="noreferrer" className="link-red text-[11px] mt-2 inline-block">read more →</a>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {shops.length > 0 && (
        <Section title="stockists & shops">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shops.map((s) => (
              <a key={s.id} href={s.url ?? "#"} target="_blank" rel="noreferrer" className="group block border border-border p-4 hover:border-primary transition-colors">
                {s.image_url && <img src={s.image_url} alt={s.title} loading="lazy" className="h-24 w-full object-cover mb-3" />}
                <p className="text-sm group-hover:text-primary">{s.title}</p>
                {s.subtitle && <p className="text-xs text-foreground/60 mt-1">{s.subtitle}</p>}
              </a>
            ))}
          </div>
        </Section>
      )}
    </Shell>
  );
}

function Section({ title, bg, children }: { title: string; bg?: string; children: React.ReactNode }) {
  return (
    <section className={`${bg ?? ""} border-t border-border py-16`}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-light mb-8">{title}</h2>
        {children}
      </div>
    </section>
  );
}
