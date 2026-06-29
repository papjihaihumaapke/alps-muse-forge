import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";

export const Route = createFileRoute("/personal-care")({
  head: () => ({
    meta: [
      { title: "alps vegan skin & personal care — ALPS Annie Ling" },
      { name: "description", content: "Vegan skin and personal care — made to make a difference." },
      { property: "og:title", content: "alps vegan skin & personal care" },
      { property: "og:description", content: "Made to make a difference." },
    ],
  }),
  component: PersonalCareHub,
});

type Tile = {
  to: "/vegan-skincare" | "/vegan-personal-care" | "/vegan-makeup" | "/vegan-supplement" | "/vegan-tech";
  title: string;
  blurb: string;
};

const TILES: Tile[] = [
  { to: "/vegan-skincare", title: "vegan skincare", blurb: "plant-based daily care" },
  { to: "/vegan-personal-care", title: "vegan personal care", blurb: "clean, conscious essentials — botalab" },
  { to: "/vegan-makeup", title: "vegan makeup", blurb: "colour without compromise" },
  { to: "/vegan-supplement", title: "vegan supplement", blurb: "nourish from within" },
  { to: "/vegan-tech", title: "vegan skin & personal care technology", blurb: "next-gen beauty tech" },
];

function PersonalCareHub() {
  return (
    <Shell>
      <section className="max-w-[1760px] mx-auto px-6 lg:px-10 pt-12 pb-6">
        <h1 className="text-primary text-[15px] tracking-wide">alps vegan skin & personal care</h1>
        <p className="text-foreground/70 text-sm mt-2 max-w-xl">made to make a difference. choose a category below.</p>
      </section>

      <section className="max-w-[1760px] mx-auto px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group block aspect-[4/3] bg-brand-light hover:bg-muted transition-colors border border-border relative overflow-hidden"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
                  {t.title}
                </h2>
                <p className="text-xs text-foreground/60 mt-2">{t.blurb}</p>
                <span className="num text-[10px] tracking-[0.3em] uppercase text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}
