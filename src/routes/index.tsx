import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Shell } from "@/components/alps/Shell";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/backgrounds/bg-01.jpg";
import textile from "@/assets/backgrounds/hightech-red.jpg";
import designerAsset from "@/assets/brand/annie-designer.png.asset.json";
const designer = designerAsset.url;
import logoBlack from "@/assets/brand/alps-logo-white.png";
import catInnovation from "@/assets/categories/innovation.png";
import catContemporary from "@/assets/categories/contemporary.png";
import catAccessories from "@/assets/categories/accessories.png";
import catCollab from "@/assets/categories/collaborations.png";
import veganPersonalCareIcon from "@/assets/vegan-personal-care-icon.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ALPS Annie Ling — timeless with a twist" },
      {
        name: "description",
        content:
          "ALPS Annie Ling — Hong Kong fashion house where innovation meets timeless design. Shop performance outerwear, contemporary ready-to-wear, accessories and vegan personal care.",
      },
      { property: "og:title", content: "ALPS Annie Ling" },
      { property: "og:description", content: "Timeless with a twist — made to make a difference." },
    ],
  }),
  component: Home,
});

const CAT_IMAGES: Record<string, string> = {
  innovation: catInnovation,
  contemporary: catContemporary,
  accessories: catAccessories,
  collaborations: catCollab,
  "personal-care": veganPersonalCareIcon.url,
};


function Home() {
  return (
    <Shell>
      <EditorialHero />
      <BrandVideo />
      <Innovation />
      <BrandIntro />
      <Designer />
    </Shell>
  );
}

type Banner = { slot: string; image_url: string | null; link_url: string | null; title?: string | null; subtitle?: string | null; cta_label?: string | null };

function BannerOverlay({ banner, align = "left", theme = "light" }: { banner?: Banner; align?: "left" | "center"; theme?: "light" | "dark" }) {
  if (!banner || (!banner.title && !banner.subtitle && !banner.cta_label)) return null;
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  const textCls = theme === "dark" ? "text-white" : "text-white";
  return (
    <div className={`absolute inset-0 flex flex-col justify-center ${alignCls} p-6 md:p-10 ${textCls} pointer-events-none`}>
      <div className="max-w-md" style={{ textShadow: "0 1px 20px rgba(0,0,0,0.35)" }}>
        {banner.title && (
          <h3 className="text-xl md:text-3xl font-light leading-tight">{banner.title}</h3>
        )}
        {banner.subtitle && (
          <p className="mt-2 text-xs md:text-sm opacity-90">{banner.subtitle}</p>
        )}
        {banner.cta_label && (
          <span className="mt-3 inline-block text-[11px] tracking-[0.25em] uppercase border-b border-white/80 pb-0.5">
            {banner.cta_label}
          </span>
        )}
      </div>
    </div>
  );
}

function BannerBlock({
  banner,
  fallbackClass,
  fallbackImg,
  alt,
  className,
  overlayAlign = "left",
  overlayTheme = "light",
}: {
  banner?: Banner;
  fallbackClass?: string;
  fallbackImg?: string;
  alt: string;
  className: string;
  overlayAlign?: "left" | "center";
  overlayTheme?: "light" | "dark";
}) {
  const inner = (
    <>
      {banner?.image_url ? (
        <img src={banner.image_url} alt={alt} className="h-full w-full object-cover" />
      ) : fallbackImg ? (
        <img src={fallbackImg} alt={alt} className="h-full w-full object-cover" />
      ) : null}
      <BannerOverlay banner={banner} align={overlayAlign} theme={overlayTheme} />
    </>
  );
  const wrapper = <div className={`${className} ${fallbackClass ?? ""} overflow-hidden relative`}>{inner}</div>;
  if (banner?.link_url) {
    return banner.link_url.startsWith("http") ? (
      <a href={banner.link_url} target="_blank" rel="noreferrer" className="block h-full w-full">{wrapper}</a>
    ) : (
      <Link to={banner.link_url as any} className="block h-full w-full">{wrapper}</Link>
    );
  }
  return wrapper;
}

function EditorialHero() {
  const [banners, setBanners] = useState<Record<string, Banner>>({});
  useEffect(() => {
    supabase.from("homepage_banners").select("slot, image_url, link_url, title, subtitle, cta_label").then(({ data }) => {
      const map: Record<string, Banner> = {};
      (data ?? []).forEach((r: any) => { map[r.slot] = r as Banner; });
      setBanners(map);
    });
  }, []);

  const cards = [
    { slug: "innovation", label: "innovation", img: catInnovation },
    { slug: "contemporary", label: "contemporary", img: catContemporary },
    { slug: "accessories", label: "accessories", img: catAccessories },
    { slug: "collaborations", label: "collaborations", img: catCollab },
    { slug: "personal-care", label: "vegan skin & personal care", img: veganPersonalCareIcon.url },
  ] as const;

  return (
    <section className="relative bg-background">
      {/* Slim top artwork — mosaic band + shorter black title band, edge-to-edge */}
      <div className="w-full px-4 md:px-6 pt-4">
        <BannerBlock
          banner={banners.hero}
          fallbackImg={hero}
          alt="ALPS editorial"
          className="aspect-[32/4] md:aspect-[32/3.2] w-full border border-border bg-card"
          overlayAlign="left"
          overlayTheme="light"
        />
        <div className="mt-3">
          <BannerBlock
            banner={banners.black}
            fallbackClass="bg-brand-black"
            alt="promo"
            className="aspect-[32/3] md:aspect-[32/2.2] w-full"
            overlayAlign="left"
            overlayTheme="light"
          />
        </div>
      </div>

      {/* Full-bleed category row — 5 evenly spaced tiles edge-to-edge */}
      <div className="w-full pt-10 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-0">
          {cards.map((c) => (
            <Link
              key={c.slug}
              to={`/${c.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square overflow-hidden bg-muted">
                <img
                  src={c.img}
                  alt={c.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-[12px] tracking-[0.15em] text-foreground/80 px-2">
                {c.label}
              </div>
              <span className="link-red text-[11px] mt-2 inline-block">view all</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


const FASHION_SHOW_VIDEOS = [
  { id: "hOwILjHbycM", title: "summer VI — one and all" },
  { id: "JaQfMZ2WeFQ", title: "summer V — warrior" },
  { id: "8W-xg0TIxZY", title: "summer IV — mutant" },
  { id: "QCctsSVdBk8", title: "summer II — tropical in iceland" },
  { id: "qdgqm0mWtC4", title: "winter II — muted" },
];

function BrandVideo() {
  const [index, setIndex] = useState(0);
  const current = FASHION_SHOW_VIDEOS[index];
  const next = () => setIndex((i) => (i + 1) % FASHION_SHOW_VIDEOS.length);
  const prev = () => setIndex((i) => (i - 1 + FASHION_SHOW_VIDEOS.length) % FASHION_SHOW_VIDEOS.length);
  // No YouTube `playlist`/`loop` params — those let YouTube auto-play unrelated
  // clips. We drive the strict 5-video sequence ourselves via the IFrame API
  // `onStateChange` postMessage below.
  const src =
    `https://www.youtube.com/embed/${current.id}` +
    `?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&enablejsapi=1`;

  // Listen for the video ending and advance to the next approved fashion show.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.data !== "string") return;
      try {
        const msg = JSON.parse(e.data);
        // state 0 === ended
        if (msg?.event === "onStateChange" && msg?.info === 0) {
          setIndex((i) => (i + 1) % FASHION_SHOW_VIDEOS.length);
        }
      } catch {
        /* not a YT message */
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Ask the YouTube iframe to start sending state events once it loads.
  const onIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    e.currentTarget.contentWindow?.postMessage(
      JSON.stringify({ event: "listening" }),
      "*",
    );
    e.currentTarget.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }),
      "*",
    );
  };


  return (
    <section className="bg-brand-black text-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-light">ALPS fashion shows</h2>
          <span className="num text-[11px] tracking-[0.25em] text-white/60">
            {String(index + 1).padStart(2, "0")} / {String(FASHION_SHOW_VIDEOS.length).padStart(2, "0")}
          </span>
        </div>
        <div className="relative aspect-video bg-zinc-900 overflow-hidden">
          <iframe
            key={current.id}
            className="absolute inset-0 h-full w-full"
            src={src}
            onLoad={onIframeLoad}
            title={`ALPS fashion show — ${current.title}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm tracking-wide text-white/80">{current.title}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="px-4 py-2 text-[11px] tracking-[0.2em] uppercase border border-white/30 hover:border-white transition"
            >
              prev
            </button>
            <button
              onClick={next}
              className="px-4 py-2 text-[11px] tracking-[0.2em] uppercase border border-white/30 hover:border-white transition"
            >
              next
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FASHION_SHOW_VIDEOS.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setIndex(i)}
              className={`text-left p-3 border transition ${
                i === index ? "border-primary bg-primary/10" : "border-white/20 hover:border-white/60"
              }`}
            >
              <span className="num text-[10px] tracking-[0.25em] text-white/50 block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-xs mt-1 block">{v.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}


function Innovation() {
  return (
    <section className="bg-brand-light py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <img src={textile} alt="performance textile" loading="lazy" className="aspect-square object-cover" />
        <div>
          <span className="num text-[11px] tracking-[0.3em] text-primary">03 / innovation</span>
          <h2 className="text-3xl md:text-5xl mt-3 font-light text-primary">alps fashion innovation</h2>
          <p className="mt-6 text-foreground/80 leading-relaxed">
            we build garments around performance science — far-infrared yarns, silver-ion antimicrobial knits,
            photocatalytic self-cleaning finishes and bluesign-approved recycled fibres. each piece is engineered
            to behave like technology and read like fashion.
          </p>
          <p className="mt-4 text-foreground/80 leading-relaxed">
            the result is clothing made to make a difference — quietly, precisely, every day.
          </p>
          <Link to="/innovation" className="link-red text-[12px] tracking-wide mt-8 inline-block">
            explore the innovation collection →
          </Link>
        </div>
      </div>
    </section>
  );
}

function BrandIntro() {
  return (
    <section className="bg-primary text-primary-foreground py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img src={logoBlack} alt="ALPS annie ling logo" className="w-full max-w-md" />
        <div>
          <span className="num text-[11px] tracking-[0.3em] opacity-80">brand introduction</span>
          <h2 className="text-3xl md:text-4xl mt-3 font-light leading-tight">
            timeless with a twist — <br />made to make a difference.
          </h2>
          <p className="mt-8 leading-relaxed opacity-90">
            driven by the desire to unite fashion and craftsmanship, ALPS aims to bring work and life
            balance into its design. inspired by a new age of active living and cutting-edge textile
            innovations, the brand is committed to designing enduring clothing that supports wellbeing.
          </p>
          <p className="mt-4 leading-relaxed opacity-90">
            ALPS integrates fun and unexpected details with sports and technology elements into its
            designs. this unique combination differentiates ALPS from normal fashion brands —
            effortlessly stylish, highly versatile and wearable every day.
          </p>
        </div>
      </div>
    </section>
  );
}

function Designer() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="num text-[11px] tracking-[0.3em] text-primary">04 / designer</span>
          <h2 className="text-3xl md:text-4xl mt-3 font-light">annie ling</h2>
          <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
            <p>
              designer annie ling views fashion as an expression of identity, confidence, and modern living.
              after studying fashion design and technology in canada and completing an MBA at the university of
              leicester in the united kingdom, she founded ALPS Annie Ling in 2015 — a contemporary fashion
              label where timeless elegance meets innovation.
            </p>
            <p>
              named after annie ling's initials and inspired by the enduring spirit of the alps, the brand
              reflects resilience, innovation, and exploration. ALPS Annie Ling seamlessly combines timeless
              aesthetics with sports-inspired functionality and textile innovation, creating versatile, enduring
              garments designed for contemporary life.
            </p>
            <Link to="/my-journey" className="link-red text-[12px] tracking-wide inline-block mt-4">
              read my journey →
            </Link>
          </div>
        </div>
        <img src={designer} alt="annie ling — atelier portrait" loading="lazy" className="aspect-[4/5] object-cover" />
      </div>
    </section>
  );
}

