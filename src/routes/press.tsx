import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";

const PRESS = [
  { year: "2024", outlet: "DFA Awards", title: "design for asia — fashion innovation finalist" },
  { year: "2023", outlet: "Asia Miles Lifestyle", title: "cabas 220 — featured technology bag" },
  { year: "2023", outlet: "Tatler Asia", title: "hong kong designers to watch" },
  { year: "2022", outlet: "HKTDC", title: "made in hong kong — fashion innovation showcase" },
  { year: "2022", outlet: "Vogue HK", title: "the science of timeless" },
  { year: "2021", outlet: "Pinkoi Brands", title: "designer spotlight — annie ling" },
];

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "press & awards — ALPS Annie Ling" },
      { name: "description", content: "Press features and design awards for ALPS Annie Ling." },
      { property: "og:title", content: "press & awards — ALPS Annie Ling" },
      { property: "og:description", content: "Press and recognition." },
    ],
  }),
  component: () => (
    <Shell>
      <section className="max-w-5xl mx-auto px-6 py-20">
        <span className="num text-[11px] tracking-[0.3em] text-primary">archive</span>
        <h1 className="text-4xl font-light mt-3">press & awards</h1>
        <ul className="mt-12 divide-y divide-border border-y border-border">
          {PRESS.map((p, i) => (
            <li key={i} className="py-6 grid grid-cols-12 gap-4 items-baseline hover:bg-muted/40 px-2 transition">
              <span className="num col-span-2 text-primary text-sm">{p.year}</span>
              <span className="col-span-4 text-sm">{p.outlet}</span>
              <span className="col-span-6 text-sm text-foreground/70">{p.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  ),
});
