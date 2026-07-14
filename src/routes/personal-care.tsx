import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import skincare from "@/assets/vegan/vegan-skincare.jpg";
import personalCare from "@/assets/vegan/vegan-personal-care.jpg";
import makeup from "@/assets/vegan/vegan-makeup.jpg";
import supplement from "@/assets/vegan/vegan-supplement.jpg";
import tech from "@/assets/vegan/vegan-tech.jpg";

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
  img: string;
};

const TILES: Tile[] = [
  { to: "/vegan-skincare", title: "vegan skincare", img: skincare },
  { to: "/vegan-personal-care", title: "vegan personal care", img: personalCare },
  { to: "/vegan-makeup", title: "vegan makeup", img: makeup },
  { to: "/vegan-supplement", title: "vegan supplement", img: supplement },
  { to: "/vegan-tech", title: "vegan skin & personal care technology", img: tech },
];

function PersonalCareHub() {
  return (
    <Shell>
      <section className="px-3 md:px-6 pt-8 pb-4">
        <h1 className="text-primary text-[15px] tracking-wide">alps vegan skin & personal care</h1>
        <p className="text-foreground/70 text-sm mt-2">made to make a difference.</p>
      </section>

      <section className="px-3 md:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {TILES.map((t, i) => (
            <Link
              key={t.to}
              to={t.to}
              className={`group relative block aspect-[4/3] overflow-hidden border border-border bg-brand-light ${
                i === TILES.length - 1 && TILES.length % 2 === 1 ? "sm:col-span-2 aspect-[8/3]" : ""
              }`}
            >
              <img
                src={t.img}
                alt={t.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-4 left-4 num text-[10px] tracking-[0.3em] uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {t.title} →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}
