import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { SOCIALS } from "@/lib/alps-data";
import { supabase } from "@/integrations/supabase/client";
import designer from "@/assets/brand/annie-designer-portrait.png";
import {
  asArray,
  eventDateLabel,
  kindLabel,
  slugify,
  toEmbedUrl,
  toParagraphs,
  type JourneyImage,
  type JourneyLink,
  type JourneyPost,
  type PageSection,
} from "@/lib/journey";

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

/** Fallback bio, used only until the admin-managed page_sections row loads (or if none exists). */
const FALLBACK_BIO: PageSection = {
  id: "fallback",
  page: "my-journey",
  eyebrow: "designer",
  heading: "my journey",
  subheading: "timeless with a twist · made to make a difference",
  body: [
    "designer annie ling views fashion as an expression of identity, confidence, and modern living. after studying fashion design and technology in canada and completing an MBA at the university of leicester in the united kingdom, she founded ALPS Annie Ling in 2015 — a contemporary fashion label where timeless elegance meets innovation.",
    "with a design language rooted in simplicity, annie is drawn to clean silhouettes elevated by unexpected details, advanced textiles, and intelligent functionality. her collections are created for those who embrace individuality, lead active lifestyles, and appreciate refined design with purpose.",
    "in addition to her eponymous label, annie has worked extensively as a design consultant, partnering with global brands on apparel, lingerie, accessories, and technology-driven product development.",
    "named after annie ling's initials and inspired by the enduring spirit of the alps, the brand reflects resilience, innovation, and exploration. ALPS Annie Ling seamlessly combines timeless aesthetics with sports-inspired functionality and textile innovation, creating versatile, enduring garments designed for contemporary life.",
  ].join("\n\n"),
  image_url: null,
  links: [
    { label: "design incubation programme (dip) alumni", url: SOCIALS.dipAlumni },
    { label: "fashion incubation programme (fip) alumni", url: SOCIALS.fipAlumni },
  ],
  sort_order: 0,
  active: true,
};

function MyJourney() {
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [posts, setPosts] = useState<JourneyPost[]>([]);
  const [sections, setSections] = useState<PageSection[] | null>(null);

  useEffect(() => {
    supabase
      .from("journey_items")
      .select("id, kind, title, subtitle, url, image_url, sort_order")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setItems((data ?? []) as JourneyItem[]));

    supabase
      .from("page_sections")
      .select("*")
      .eq("page", "my-journey")
      .eq("active", true)
      .order("sort_order")
      .then(({ data, error }) => {
        if (error) return setSections([]);
        setSections(
          (data ?? []).map((r) => ({ ...r, links: asArray<JourneyLink>(r.links) })) as PageSection[],
        );
      });

    supabase
      .from("journey_posts")
      .select("*")
      .eq("published", true)
      .order("event_year", { ascending: false })
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) return;
        setPosts(
          (data ?? []).map((r) => ({
            ...r,
            images: asArray<JourneyImage>(r.images),
            links: asArray<JourneyLink>(r.links),
          })) as JourneyPost[],
        );
      });
  }, []);

  const byKind = (k: JourneyItem["kind"]) => items.filter((i) => i.kind === k);
  const videos = byKind("video");
  const awards = byKind("award");
  const shops = byKind("shop");

  // sections === null means "still loading" — show the fallback bio so the page is never bare
  const resolved = sections === null ? [FALLBACK_BIO] : sections.length > 0 ? sections : [FALLBACK_BIO];
  const [bio, ...extraSections] = resolved;

  // group posts by year, preserving the query's ordering
  const years: number[] = [];
  const grouped = new Map<number, JourneyPost[]>();
  for (const p of posts) {
    if (!grouped.has(p.event_year)) {
      grouped.set(p.event_year, []);
      years.push(p.event_year);
    }
    grouped.get(p.event_year)!.push(p);
  }

  return (
    <Shell>
      <BioSection section={bio} isPrimary />

      {extraSections.map((s) => (
        <BioSection key={s.id} section={s} />
      ))}

      {years.length > 0 && (
        <section className="border-t border-border py-16 bg-brand-light">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-light mb-2">journal</h2>
            <p className="text-[11px] tracking-[0.25em] uppercase text-foreground/60">
              shows · events · press · collaborations
            </p>

            <nav className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
              {years.map((y) => (
                <a key={y} href={`#year-${y}`} className="num text-[11px] tracking-[0.2em] link-red">
                  {y}
                </a>
              ))}
            </nav>

            <div className="mt-12 space-y-16">
              {years.map((year) => (
                <div key={year} id={`year-${year}`} className="scroll-mt-24">
                  <h3 className="num text-[13px] tracking-[0.3em] text-primary border-b border-border pb-3">
                    {year}
                  </h3>
                  <div className="mt-8 space-y-14">
                    {grouped.get(year)!.map((post) => (
                      <PostEntry key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

/**
 * An admin-managed prose block. The first one on the page is the designer bio and renders
 * beside the portrait with an <h1>; any section she adds later (brand philosophy, etc.)
 * renders below it — two-column if it has its own image, full-width prose otherwise.
 */
function BioSection({ section, isPrimary = false }: { section: PageSection; isPrimary?: boolean }) {
  const paragraphs = toParagraphs(section.body);
  const image = isPrimary ? section.image_url ?? designer : section.image_url;
  const copy = (
    <div>
      {section.eyebrow && (
        <span className="num text-[11px] tracking-[0.3em] text-primary">{section.eyebrow}</span>
      )}
      {section.heading &&
        (isPrimary ? (
          <h1 className="text-4xl font-light mt-3">{section.heading}</h1>
        ) : (
          <h2 className="text-3xl font-light mt-3">{section.heading}</h2>
        ))}
      {section.subheading && (
        <p className="mt-4 text-[11px] tracking-[0.25em] uppercase text-foreground/60">
          {section.subheading}
        </p>
      )}
      {paragraphs.length > 0 && (
        <div className="mt-8 space-y-5 text-foreground/80 leading-relaxed text-[15px]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {section.links.length > 0 && (
        <div className="mt-10 pt-8 border-t border-border">
          <ul className="space-y-2 text-sm">
            {section.links.map((l, i) => (
              <li key={i}>
                <a href={l.url} target="_blank" rel="noreferrer" className="link-red">
                  {l.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (!image) {
    return (
      <section className={`max-w-3xl mx-auto px-6 ${isPrimary ? "py-20" : "pb-20"}`}>{copy}</section>
    );
  }

  return (
    <section
      className={`max-w-5xl mx-auto px-6 ${isPrimary ? "py-20" : "pb-20"} grid grid-cols-1 md:grid-cols-2 gap-12`}
    >
      <img
        src={image}
        alt={isPrimary ? "annie ling — atelier portrait" : section.heading ?? ""}
        className="aspect-[4/5] object-cover bg-muted"
        loading={isPrimary ? undefined : "lazy"}
      />
      {copy}
    </section>
  );
}

function PostEntry({ post }: { post: JourneyPost }) {
  const paragraphs = toParagraphs(post.content);
  const embed = toEmbedUrl(post.video_url);
  const anchor = post.slug ?? slugify(post.title);

  return (
    <article id={anchor} className="scroll-mt-24">
      <header>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="num text-[11px] tracking-[0.25em] text-foreground/60">
            {eventDateLabel(post)}
          </span>
          {post.kind !== "journal" && (
            <span className="text-[10px] tracking-[0.2em] uppercase text-primary">
              {kindLabel(post.kind)}
            </span>
          )}
        </div>
        <h4 className="text-2xl font-light mt-2">{post.title}</h4>
        {post.excerpt && <p className="mt-3 text-[15px] text-foreground/70 italic">{post.excerpt}</p>}
      </header>

      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          loading="lazy"
          className="mt-6 w-full object-cover bg-muted"
        />
      )}

      {paragraphs.length > 0 && (
        <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed text-[15px]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {post.images.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {post.images.map((img, i) => (
            <figure key={i}>
              <img
                src={img.url}
                alt={img.caption || post.title}
                loading="lazy"
                className="w-full object-cover bg-muted"
              />
              {img.caption && (
                <figcaption className="mt-2 text-[11px] text-foreground/60">{img.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {embed ? (
        <div className="mt-8 aspect-video bg-muted">
          <iframe
            src={embed}
            title={`${post.title} — video`}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        post.video_url && (
          <p className="mt-6">
            <a href={post.video_url} target="_blank" rel="noreferrer" className="link-red text-sm">
              watch the video →
            </a>
          </p>
        )
      )}

      {post.links.length > 0 && (
        <ul className="mt-6 space-y-2">
          {post.links.map((l, i) => (
            <li key={i}>
              <a href={l.url} target="_blank" rel="noreferrer" className="link-red text-sm">
                {l.label} →
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
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
