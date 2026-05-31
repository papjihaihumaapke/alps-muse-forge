import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { ExternalLink } from "lucide-react";

const ARTICLES = [
  { year: "2023", outlet: "Asia Miles Lifestyle", title: "cabas 220 — featured technology bag", href: "#" },
  { year: "2023", outlet: "Tatler Asia", title: "hong kong designers to watch", href: "#" },
  { year: "2022", outlet: "Vogue HK", title: "the science of timeless", href: "#" },
  { year: "2021", outlet: "Pinkoi Brands", title: "designer spotlight — annie ling", href: "#" },
];

const AWARDS = [
  { year: "2024", outlet: "DFA Awards", title: "design for asia — fashion innovation finalist" },
  { year: "2022", outlet: "HKTDC", title: "made in hong kong — fashion innovation showcase" },
];

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "press — ALPS Annie Ling" },
      { name: "description", content: "Press features and articles about ALPS Annie Ling." },
      { property: "og:title", content: "press — ALPS Annie Ling" },
      { property: "og:description", content: "Articles and recognition for ALPS." },
    ],
  }),
  component: () => (
    <Shell>
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-light">press</h1>
        <p className="mt-4 text-sm text-foreground/60 max-w-xl">
          Selected articles and editorial features written about the brand.
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

        <h2 className="mt-24 text-2xl font-light">awards & accolades</h2>
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {AWARDS.map((a, i) => (
            <li key={i} className="py-6 grid grid-cols-12 gap-4 items-baseline px-2">
              <span className="num col-span-2 text-primary text-sm">{a.year}</span>
              <span className="col-span-4 text-sm">{a.outlet}</span>
              <span className="col-span-6 text-sm text-foreground/70">{a.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  ),
});
