import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { CATEGORIES, FEATURES, PRODUCTS, type Product } from "@/lib/alps-data";
import { productImage } from "@/lib/accessory-images";
import { dbProductToCatalog, useDbProducts } from "@/lib/products-db";
import { formatMoney, useCart } from "@/lib/cart";

// "personal-care" rows are leftovers from the first import that no store page lists.
const HIDDEN_CATEGORIES = new Set(["personal-care"]);
const MAX_RESULTS = 24;

type Item = Product & { galleryUrls?: string[]; description?: string | null; subcategory?: string };

const categoryName = new Map(CATEGORIES.map((c) => [c.slug, c.name]));
const featureName = new Map(FEATURES.map((f) => [f.key, f.name]));

/** Lower-cased text a query is matched against, plus the name on its own for ranking. */
function haystack(p: Item) {
  return [
    p.name,
    p.id,
    categoryName.get(p.category) ?? p.category,
    p.subcategory ?? "",
    ...(p.tags ?? []),
    ...(p.colors ?? []),
    ...(p.features ?? []).map((f) => featureName.get(f) ?? f),
    p.description ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { currency } = useCart();
  const { data: dbRows = [], isLoading } = useDbProducts();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Same catalogue the category pages show: database products, plus static pieces
  // that aren't in the database yet.
  const catalogue = useMemo(() => {
    const map = new Map<string, Item>();
    for (const p of PRODUCTS) map.set(p.id, p);
    for (const r of dbRows) {
      const p = dbProductToCatalog(r) as Item;
      map.set(p.id, { ...p, subcategory: r.subcategory ?? undefined });
    }
    return [...map.values()]
      .filter((p) => !HIDDEN_CATEGORIES.has(p.category))
      .map((p) => ({ p, text: haystack(p), name: p.name.toLowerCase() }));
  }, [dbRows]);

  const results = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return catalogue
      .filter((c) => words.every((w) => c.text.includes(w)))
      .map((c) => ({ ...c, score: words.filter((w) => c.name.includes(w)).length }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, MAX_RESULTS)
      .map((c) => c.p);
  }, [catalogue, query]);

  const trimmed = query.trim();

  return (
    <>
      {/* The header's backdrop-blur makes it the containing block for fixed children,
          so the dimmed backdrop hangs below it as an absolute, screen-tall layer. */}
      <div
        className="absolute left-0 right-0 top-full h-screen z-40 bg-black/20"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute left-0 right-0 top-full z-50 bg-background border-b border-border shadow-lg">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <div className="flex items-center gap-3 border-b border-foreground/40 pb-2">
            <Search className="h-4 w-4 shrink-0 text-foreground/60" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search products — e.g. bucket hat, silver ion, JK1601"
              aria-label="search products"
              className="w-full bg-transparent text-base outline-none placeholder:text-foreground/40"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="close search"
              className="hover:text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {!trimmed ? null : isLoading && !results.length ? (
              <p className="py-4 text-sm text-foreground/60">searching…</p>
            ) : !results.length ? (
              <p className="py-4 text-sm text-foreground/60">no products match “{trimmed}”.</p>
            ) : (
              <ul className="divide-y divide-border">
                {results.map((p) => {
                  const img = p.galleryUrls?.[0] || productImage(p.id);
                  const price = currency === "CAD" ? p.priceCAD : p.priceHKD;
                  const isNews = p.category === "vegan-tech";
                  return (
                    <li key={p.id}>
                      <Link
                        to="/product/$productId"
                        params={{ productId: p.id }}
                        onClick={onClose}
                        className="flex items-center gap-4 py-3 hover:bg-muted px-2 transition-colors"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden bg-muted">
                          {img && (
                            <img
                              src={img}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-snug line-clamp-2">{p.name}</p>
                          <p className="mt-1 text-[0.706rem] tracking-wide text-foreground/50">
                            {categoryName.get(p.category) ?? p.category}
                          </p>
                        </div>
                        {!isNews && (
                          <p className="num shrink-0 text-sm text-foreground/70">
                            {price > 0 ? formatMoney(price, currency) : "price on request"}
                          </p>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
