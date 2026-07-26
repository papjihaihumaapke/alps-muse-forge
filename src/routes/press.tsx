import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { ExternalLink } from "lucide-react";
import { SOCIALS } from "@/lib/alps-data";
import { AWARDS, type Award } from "@/lib/awards";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
      {/* Non-color signifier so gold/silver/bronze are distinguishable without color */}
      <span aria-hidden className="font-semibold">
        {level === "gold" ? "★★★" : level === "silver" ? "★★" : level === "bronze" ? "★" : level === "winner" ? "✓" : "◆"}
      </span>
      {level}
    </span>
  );
}

function AwardCard({ award, onClick }: { award: Award; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${award.organization}, ${award.category}, ${award.year}, ${award.level} — view details`}
      className="group text-left flex flex-col border border-border bg-background hover:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
    >
      <div className="aspect-[4/5] w-full bg-muted overflow-hidden flex items-center justify-center">
        {award.image ? (
          <img
            src={award.image}
            alt={`${award.organization} — ${award.category} ${award.year} ${award.level}`}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="p-6 text-center">
            <p className="num text-[11px] tracking-[0.25em] text-primary">{award.year}</p>
            <p className="mt-3 text-sm font-medium">{award.organization}</p>
            <p className="mt-2 text-xs text-foreground/60">{award.category}</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="num text-[11px] tracking-[0.25em] text-primary">{award.year}</span>
          <LevelBadge level={award.level} />
        </div>
        <p className="text-[13px] font-medium leading-snug">{award.organization}</p>
        <p className="text-xs text-foreground/70">{award.category}</p>
        {award.project && (
          <p className="text-[11px] text-foreground/50 italic">{award.project}</p>
        )}
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {award && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <span className="num text-[11px] tracking-[0.25em] text-primary">{award.year}</span>
                <LevelBadge level={award.level} />
              </div>
              <DialogTitle className="text-xl font-light">
                {award.organization}
              </DialogTitle>
              <DialogDescription className="text-sm text-foreground/70">
                {award.category}
                {award.project ? ` · ${award.project}` : ""}
              </DialogDescription>
            </DialogHeader>

            {(award.certificate || award.image) && (
              <div className="mt-2 bg-muted p-2">
                <img
                  src={award.certificate ?? award.image}
                  alt={`${award.organization} ${award.category} ${award.year} certificate`}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              </div>
            )}

            {award.description && (
              <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
                {award.description}
              </p>
            )}

            {award.href && (
              <a
                href={award.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm link-red"
              >
                view award listing <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PressPage() {
  const [selected, setSelected] = useState<Award | null>(null);

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

        <h2 className="mt-24 text-2xl font-light">awards &amp; accolades</h2>
        <p className="mt-3 text-sm text-foreground/60 max-w-xl">
          tap any award to view the full details, certificate, and category.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {AWARDS.map((a) => (
            <AwardCard key={a.id} award={a} onClick={() => setSelected(a)} />
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
