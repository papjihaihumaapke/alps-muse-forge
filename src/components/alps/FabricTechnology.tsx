import { useEffect } from "react";
import { createPortal } from "react-dom";
import { INNOVATIONS, type Innovation } from "@/lib/innovations";
import { featureIcon } from "@/lib/feature-icons";
import { X } from "lucide-react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import bgSlats from "@/assets/backgrounds/bg-slats.jpg.asset.json";
import { useInnovationId, openInnovation, closeInnovation } from "@/lib/innovation-store";



function InnovationDetail({
  item,
  onClose,
}: {
  item: Innovation | null;
  onClose: () => void;
}) {
  const open = !!item;
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  const icon = item ? featureIcon(item.slug) : undefined;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item?.title}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      style={{
        backgroundImage: `url(${bgSlats.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/45" />
      <div
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="absolute top-3 right-3 z-20 h-8 w-8 flex items-center justify-center border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {item && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-2 pr-10">
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
                <h3 className="text-2xl font-light text-primary mt-1">
                  {item.title}
                </h3>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed pt-2">
              {item.intro}
            </p>

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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const key = item.filterKey!;
                      onClose();
                      navigate({ to: "/innovation", search: { feature: key } });
                    }}
                    className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary hover:underline"
                  >
                    shop products with {item.title} →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}


export function InnovationModal() {
  const hash = useRouterState({ select: (s) => s.location.hash });

  // deep link: /innovation#air-slim opens the matching innovation modal
  useEffect(() => {
    if (!hash) return;
    const target = hash.replace(/^#/, "");
    const match =
      INNOVATIONS.find((i) => i.slug === target) ??
      INNOVATIONS.find((i) => i.filterKey === target);
    if (match) openInnovation(match.slug);
  }, [hash]);

  const id = useInnovationId();
  const item =
    (id && (INNOVATIONS.find((i) => i.slug === id) ?? INNOVATIONS.find((i) => i.filterKey === id))) ||
    null;
  return <InnovationDetail item={item} onClose={closeInnovation} />;
}


