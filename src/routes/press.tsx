import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { ExternalLink, Award as AwardIcon } from "lucide-react";
import { SOCIALS } from "@/lib/alps-data";
import { AWARDS, type Award } from "@/lib/awards";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import bgWood from "@/assets/backgrounds/bg-wood.jpg.asset.json";

const ARTICLES = [
  {
    year: "2024",
    outlet: "Asia Miles Lifestyle",
    title: "CABAS 220 — light fresh® technology shoulder bag",
    href: SOCIALS.asiaMiles,
  },
  {
    year: "2023",
    outlet: "HKFIP",
    title: "fashion incubation programme — brand introduction",
    href: SOCIALS.fipAlumni,
  },
  {
    year: "2023",
    outlet: "HK Design Incubation",
    title: "DIP alumni — ALPS Annie Ling brand introduction",
    href: SOCIALS.dipAlumni,
  },
];

const LEVEL_STYLES: Record<string, string> = {
  gold: "bg-[#c9a227] text-white",
  silver: "bg-[#9aa0a6] text-white",
  bronze: "bg-[#a56b3a] text-white",
  winner: "bg-primary text-primary-foreground",
  "honourable mention": "bg-foreground/80 text-background",
};

function LevelBadge({ level }: { level: Award["level"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] tracking-[0.18em] uppercase ${LEVEL_STYLES[level]}`}
    >
      <span aria-hidden className="font-semibold">
        {level === "gold" ? "★★★" : level === "silver" ? "★★" : level === "bronze" ? "★" : level === "winner" ? "✓" : "◆"}
      </span>
      {level}
    </span>
  );
}

/** Feature-style icon tile for an award. */
function AwardIconTile({ award, onClick }: { award: Award; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${award.organization}, ${award.category}, ${award.year}, ${award.level} — view details`}
      className="group flex flex-col items-center text-center gap-3 p-5 border border-border bg-background hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition"
    >
      <div className="h-24 w-24 flex items-center justify-center bg-muted/40 rounded-full overflow-hidden">
        {award.image ? (
          <img
            src={award.image}
            alt={`${award.organization} ${award.category} ${award.year}`}
            loading="lazy"
            className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <AwardIcon className="h-10 w-10 text-primary" />
        )}
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="num text-[10px] tracking-[0.25em] text-primary">{award.year}</span>
        <LevelBadge level={award.level} />
        <p className="text-[12px] font-medium leading-tight mt-1">{award.organization}</p>
        <p className="text-[11px] text-foreground/70 leading-tight">{award.category}</p>
      </div>
    </button>
  );
}

function AwardDialog({
  award,
  open,
  onOpenChange,
}: {
  award: Award | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const images = award
    ? [award.certificate ?? award.image, ...(award.gallery ?? [])].filter(
        (v): v is string => Boolean(v),
      )
    : [];
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (open) setActiveIdx(0);
  }, [open, award?.id]);
  const active = images[activeIdx];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[96vw] p-0 border-0 bg-transparent shadow-none max-h-[92vh] overflow-y-auto">
        {award && (
          <div
            className="relative w-full min-h-[80vh] flex flex-col items-center justify-center p-6 md:p-10"
            style={{
              backgroundImage: `url(${bgWood.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.78) 100%)",
              }}
            />
            <div className="relative z-10 w-full flex flex-col items-center gap-5">
              <div className="text-center text-white">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="num text-[11px] tracking-[0.25em] text-white/90">{award.year}</span>
                  <LevelBadge level={award.level} />
                </div>
                <DialogTitle className="text-xl md:text-2xl font-light">
                  {award.organization}
                </DialogTitle>
                <DialogDescription className="text-sm text-white/85 mt-1">
                  {award.category}
                  {award.project ? ` · ${award.project}` : ""}
                </DialogDescription>
              </div>

              {active && (
                <img
                  src={active}
                  alt={`${award.organization} ${award.category} ${award.year}`}
                  className="max-h-[62vh] w-auto max-w-full object-contain drop-shadow-2xl"
                />
              )}

              {images.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={`h-16 w-12 md:h-20 md:w-14 overflow-hidden border-2 transition ${
                        i === activeIdx
                          ? "border-primary"
                          : "border-white/40 hover:border-white"
                      }`}
                      aria-label={`view image ${i + 1}`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover bg-white/5" />
                    </button>
                  ))}
                </div>
              )}

              {award.description && (
                <p className="text-sm text-white/90 leading-relaxed max-w-2xl text-center">
                  {award.description}
                </p>
              )}

              {award.href && (
                <a
                  href={award.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white hover:text-primary-foreground bg-primary px-4 py-2 tracking-[0.15em] uppercase text-[11px]"
                >
                  view award listing <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PressPage() {
  const [selected, setSelected] = useState<Award | null>(null);
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    const match = AWARDS.find((a) => a.id === id);
    if (match) {
      setSelected(match);
      requestAnimationFrame(() => {
        document.getElementById("awards")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [hash]);

  return (
    <Shell>
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-light">press</h1>
        <p className="mt-4 text-sm text-foreground/60 max-w-xl">
          selected articles and editorial features written about the brand.
        </p>
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {ARTICLES.map((p, i) => (
            <li key={i}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="py-6 grid grid-cols-12 gap-4 items-baseline hover:bg-muted/40 px-2 transition group"
              >
                <span className="num col-span-2 text-primary text-sm">{p.year}</span>
                <span className="col-span-4 text-sm">{p.outlet}</span>
                <span className="col-span-5 text-sm text-foreground/70 group-hover:text-foreground">
                  {p.title}
                </span>
                <ExternalLink className="col-span-1 h-3.5 w-3.5 text-foreground/40 group-hover:text-primary justify-self-end" />
              </a>
            </li>
          ))}
        </ul>

        <h2 id="awards" className="mt-24 text-2xl font-light">awards &amp; accolades</h2>
        <p className="mt-3 text-sm text-foreground/60 max-w-xl">
          tap any award to view the full details and certificate.
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {AWARDS.map((a) => (
            <AwardIconTile key={a.id} award={a} onClick={() => setSelected(a)} />
          ))}
        </div>
      </section>

      <AwardDialog
        award={selected}
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
      />
    </Shell>
  );
}

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "press — ALPS Annie Ling" },
      {
        name: "description",
        content:
          "press features, editorial coverage and design awards for ALPS Annie Ling — including New York Product Design Awards, International Design Awards and Hong Kong Most Outstanding Awards.",
      },
      { property: "og:title", content: "press — ALPS Annie Ling" },
      { property: "og:description", content: "press features and awards for ALPS Annie Ling." },
    ],
  }),
  component: PressPage,
});
