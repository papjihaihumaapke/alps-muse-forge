import { Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { CATEGORIES, PRODUCTS, PRODUCT_COLORS, type CategorySlug } from "@/lib/alps-data";

export function CategoryView({ slug }: { slug: CategorySlug }) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) throw notFound();
  const items = PRODUCTS.filter((p) => p.category === slug);

  return (
    <Shell>
      <section className="bg-brand-black text-white py-20 md:py-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <span className="num text-[11px] tracking-[0.3em] text-primary">collection</span>
          <h1 className="text-4xl md:text-6xl font-light mt-3">{cat.name}</h1>
          <p className="mt-4 text-white/70 max-w-xl">{cat.blurb}</p>
        </div>
      </section>

      <section className="border-b border-border bg-background sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-wrap gap-6 text-[11px] tracking-wide">
          <Filter label="colour" options={["all", "black", "navy", "red", "ivory", "khaki"]} />
          <Filter label="size" options={["all", "XS", "S", "M", "L", "XL"]} />
          <Filter label="feature" options={["all", "water repellent", "stretch", "vegan"]} />
          <span className="ml-auto num text-foreground/60 self-center">{items.length} items</span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        {items.length === 0 ? (
          <p className="text-foreground/60 text-sm">new pieces dropping soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {items.map((p) => (
              <Link
                key={p.id}
                to="/product/$productId"
                params={{ productId: p.id }}
                className="group block"
              >
                <div className="aspect-[3/4] bg-brand-light flex items-center justify-center overflow-hidden">
                  <span className="text-foreground/30 text-xs tracking-wide px-6 text-center">{p.name}</span>
                </div>
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm group-hover:text-primary transition">{p.name}</h3>
                    <p className="num text-[12px] text-foreground/70 mt-1">
                      CAD {p.priceCAD} · HKD {p.priceHKD}
                    </p>
                  </div>
                  <div className="flex gap-1.5 mt-1">
                    {p.colors.slice(0, 4).map((c) => (
                      <span
                        key={c}
                        title={c}
                        className="h-3 w-3 border border-border"
                        style={{ background: PRODUCT_COLORS[c] }}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}

function Filter({ label, options }: { label: string; options: string[] }) {
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none link-red select-none">
        {label} <span className="text-foreground/40">▾</span>
      </summary>
      <div className="absolute left-0 top-full mt-2 bg-card border border-border p-3 flex flex-col gap-2 z-20 min-w-[140px]">
        {options.map((o) => (
          <button key={o} className="text-left hover:text-primary">{o}</button>
        ))}
      </div>
    </details>
  );
}
