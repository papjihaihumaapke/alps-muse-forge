import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Play, ArrowDown, X } from "lucide-react";
import { Shell } from "@/components/alps/Shell";
import { CATEGORIES, FEATURES } from "@/lib/alps-data";
import hero from "@/assets/hero.jpg";
import textile from "@/assets/innovation-textile.jpg";
import designer from "@/assets/designer.jpg";
import logoBlack from "@/assets/alps-logo-black.png";
import catInnovation from "@/assets/cat-innovation.png";
import catContemporary from "@/assets/cat-contemporary.png";
import catAccessories from "@/assets/cat-accessories.png";
import catCollab from "@/assets/cat-collaborations.jpg";
import catPersonal from "@/assets/cat-personalcare.png";

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
  "personal-care": catPersonal,
};

const VIDEOS = [
  "ALPS anti-bacteria travel lite face mask",
  "ALPS anti-bacteria travel collection",
  "ALPS anti-bacteria instant warm vest",
  "light fresh self-cleaning short",
  "winter II muted",
  "summer II tropical in iceland",
  "summer III sugar crush",
  "summer IV mutant",
  "summer V warrior",
  "winter V bind",
  "summer VI one and all",
  "CABAS 220",
  "one and all highlight",
  "one and all parade series",
];

function Home() {
  return (
    <Shell>
      <EditorialHero />
      <BrandVideo />
      <Innovation />
      <BrandIntro />
      <Designer />
      <Features />
    </Shell>
  );
}

function EditorialHero() {
  const cards = [
    { slug: "innovation", label: "innovation", img: catInnovation },
    { slug: "contemporary", label: "contemporary", img: catContemporary },
    { slug: "accessories", label: "accessories", img: catAccessories },
    { slug: "collaborations", label: "collaborations", img: catCollab },
  ] as const;

  return (
    <section className="relative bg-background px-6 lg:px-10 pt-6 pb-40">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-3">
          {/* Top-left: white framed hero image */}
          <div className="col-span-12 lg:col-span-9">
            <div className="aspect-[16/7] w-full border border-border bg-card overflow-hidden">
              <img src={hero} alt="ALPS editorial" className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Top-right: solid red */}
          <div className="col-span-6 lg:col-span-3">
            <div className="aspect-[16/7] lg:aspect-auto lg:h-full w-full bg-primary" />
          </div>

          {/* Bottom-left: black band */}
          <div className="col-span-12 lg:col-span-9">
            <div className="aspect-[16/6] w-full bg-brand-black" />
          </div>

          {/* Bottom-right: two grey blocks stacked */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
            <div className="flex-[3] min-h-[140px] bg-muted" />
            <div className="flex-[1] min-h-[40px] bg-muted-foreground/40" />
          </div>
        </div>

        {/* Floating category cards overlapping the black band */}
        <div className="relative -mt-24 md:-mt-32 flex justify-center pointer-events-none">
          <div className="pointer-events-auto bg-background px-6 md:px-10 pt-8 pb-10 w-full max-w-3xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {cards.map((c) => (
                <Link key={c.slug} to={`/${c.slug}`} className="group flex flex-col items-center text-center">
                  <div className="text-[11px] tracking-[0.15em] leading-tight">
                    <div className="font-medium">ALPS</div>
                    <div className="text-foreground/80">{c.label}</div>
                  </div>
                  <div className="mt-3 w-full aspect-square overflow-hidden bg-muted">
                    <img
                      src={c.img}
                      alt={`ALPS ${c.label}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span className="link-red text-[11px] mt-3 inline-block">view all</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandVideo() {
  return (
    <section className="bg-brand-black text-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="num text-[11px] tracking-[0.3em] text-primary">02 / film</span>
            <h2 className="text-3xl md:text-4xl mt-3 font-light">brand film</h2>
          </div>
        </div>
        <div className="relative aspect-video bg-zinc-900 overflow-hidden group cursor-pointer">
          <iframe
            className="absolute inset-0 h-full w-full"
            src="https://www.youtube.com/embed/videoseries?list=UUQkObngC_R1tDpdfV5Ebcmg&autoplay=1&mute=1&loop=1"
            title="ALPS Annie Ling — brand film"
            allow="autoplay; encrypted-media"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {VIDEOS.map((v, i) => (
            <button
              key={v}
              className="aspect-video bg-zinc-800 hover:bg-zinc-700 transition p-3 text-left text-[10px] leading-tight"
            >
              <span className="num text-primary block mb-2">{String(i + 1).padStart(2, "0")}</span>
              {v}
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
            ALPS is a hong kong fashion house founded by designer annie ling. we work at the intersection of
            performance textile science and editorial design — making garments that move with the body, protect
            against the elements, and last beyond a season.
          </p>
          <p className="mt-4 leading-relaxed opacity-90">
            every collection answers a single question: what should clothing be able to do?
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
              annie ling trained at central saint martins and the hong kong polytechnic university school of design.
              her work has been recognised by the dfa awards, hktdc and asia miles for its precision tailoring and
              material innovation.
            </p>
            <p>
              her practice is grounded in a single principle — clothing should be functional, modern, scientific
              and aspirational. nothing decorative. nothing without purpose.
            </p>
            <Link to="/my-journey" className="link-red text-[12px] tracking-wide inline-block mt-4">
              read my journey →
            </Link>
          </div>
        </div>
        <img src={designer} alt="atelier — mannequins" loading="lazy" className="aspect-[5/6] object-cover" />
      </div>
    </section>
  );
}

function Features() {
  const [active, setActive] = useState<null | (typeof FEATURES)[number]>(null);

  return (
    <section className="bg-brand-light py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <span className="num text-[11px] tracking-[0.3em] text-primary">05 / technology</span>
          <h2 className="text-3xl md:text-4xl mt-3 font-light">features</h2>
          <p className="text-foreground/70 mt-3 max-w-xl text-sm">
            click any icon to read about the technology behind it.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-px bg-border">
          {FEATURES.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f)}
              className="bg-card aspect-square flex flex-col items-center justify-center p-3 text-center hover:bg-primary hover:text-primary-foreground transition group"
            >
              <span className="num text-[10px] opacity-60 group-hover:opacity-100">
                {String(FEATURES.indexOf(f) + 1).padStart(2, "0")}
              </span>
              <span className="text-[10px] leading-tight mt-2">{f.name}</span>
            </button>
          ))}
        </div>

        {active && (
          <div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
            onClick={() => setActive(null)}
          >
            <div
              className="bg-card max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                aria-label="close"
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 text-foreground/60 hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="num text-[11px] text-primary tracking-[0.3em]">feature</span>
              <h3 className="text-2xl font-light mt-2">{active.name}</h3>
              <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{active.desc}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
