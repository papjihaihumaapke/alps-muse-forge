import { useEffect, useState } from "react";
import { INNOVATIONS, type Innovation } from "@/lib/innovations";
import { featureIcon } from "@/lib/feature-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link, useRouterState } from "@tanstack/react-router";

function InnovationCard({
  item,
  onOpen,
}: {
  item: Innovation;
  onOpen: () => void;
}) {
  const icon = featureIcon(item.slug);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${item.title} — learn more`}
      className="group flex flex-col text-left border border-border bg-background hover:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
    >
      <div className="relative aspect-square w-full bg-muted flex items-center justify-center p-6 sm:p-8">
        <span
          aria-hidden
          className="num absolute top-2 left-2 text-[10px] tracking-[0.2em] text-foreground/40"
        >
          {String(item.n).padStart(2, "0")}
        </span>
        {icon ? (
          <img
            src={icon}
            alt={item.title}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            style={{ width: "70%", height: "70%", objectFit: "contain" }}
          />
        ) : (
          <span className="text-xs text-foreground/40">{item.title}</span>
        )}
      </div>
      <div className="border-t border-border p-4 flex flex-col gap-1.5 min-h-[6.5rem]">
        <p className="text-[13px] font-medium leading-snug text-primary">
          {item.title}
        </p>
        <p className="text-[11.5px] leading-snug text-foreground/70 line-clamp-3">
          {item.intro}
        </p>
        <span className="mt-1 text-[10px] tracking-[0.2em] uppercase text-foreground/50 group-hover:text-primary">
          learn more →
        </span>
      </div>
    </button>
  );
}

function InnovationDetail({
  item,
  open,
  onOpenChange,
}: {
  item: Innovation | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const icon = item ? featureIcon(item.slug) : undefined;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        {item && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4 mb-2">
                {icon && (
                  <div className="h-16 w-16 shrink-0 bg-muted flex items-center justify-center p-2">
                    <img
                      src={icon}
                      alt=""
                      aria-hidden
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="num text-[10px] tracking-[0.3em] text-foreground/40 uppercase">
                    innovation {String(item.n).padStart(2, "0")}
                  </p>
                  <DialogTitle className="text-2xl font-light text-primary mt-1">
                    {item.title}
                  </DialogTitle>
                </div>
              </div>
              <DialogDescription className="text-sm text-foreground/80 leading-relaxed pt-2">
                {item.intro}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-6 text-sm">
              <section>
                <h4 className="text-[11px] tracking-[0.25em] uppercase text-primary mb-2">
                  how does it work
                </h4>
                <p className="text-foreground/80 leading-relaxed">{item.how}</p>
              </section>

              <section>
                <h4 className="text-[11px] tracking-[0.25em] uppercase text-primary mb-2">
                  key features
                </h4>
                <ul className="space-y-1.5 text-foreground/80">
                  {item.features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden className="text-primary mt-0.5">·</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="text-[11px] tracking-[0.25em] uppercase text-primary mb-2">
                  benefits
                </h4>
                <ul className="space-y-1.5 text-foreground/80">
                  {item.benefits.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden className="text-primary mt-0.5">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="text-[11px] tracking-[0.25em] uppercase text-primary mb-2">
                  features at a glance
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.glance.map((g, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-[11px] tracking-wide border border-border bg-muted/50"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </section>

              {item.filterKey && (
                <div className="pt-2 border-t border-border">
                  <Link
                    to="/innovation"
                    search={{ feature: item.filterKey }}
                    onClick={() => onOpenChange(false)}
                    className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary hover:underline"
                  >
                    shop products with {item.title} →
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function FabricTechnology() {
  const [active, setActive] = useState<Innovation | null>(null);
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    const match =
      INNOVATIONS.find((i) => i.slug === id) ??
      INNOVATIONS.find((i) => i.filterKey === id);
    if (match) {
      setActive(match);
      requestAnimationFrame(() => {
        document.getElementById("fabric-technology")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [hash]);


  return (
    <section id="fabric-technology" className="container mx-auto px-6 py-20">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
          textile science
        </p>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-primary">
          engineered fabric technology
        </h2>
        <p className="text-sm text-muted-foreground mt-3">
          twenty-four proprietary innovations engineered into every alps garment. tap any item to view the full technology.
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {INNOVATIONS.map((item) => (
          <InnovationCard
            key={item.slug}
            item={item}
            onOpen={() => setActive(item)}
          />
        ))}
      </div>

      <InnovationDetail
        item={active}
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
      />
    </section>
  );
}
