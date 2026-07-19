import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { useWishlist, useToggleWishlist } from "@/lib/wishlist";
import { PRODUCTS } from "@/lib/alps-data";
import { productImageForColor } from "@/lib/accessory-images";
import { useAuth } from "@/lib/auth";
import { X } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "wishlist — ALPS Annie Ling" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { user } = useAuth();
  const { data: slugs = [], isLoading } = useWishlist();
  const remove = useToggleWishlist();

  if (!user) {
    return (
      <Shell>
        <div className="max-w-2xl mx-auto text-center py-24 px-6">
          <h1 className="text-3xl font-light">wishlist</h1>
          <p className="mt-4 text-foreground/70">sign in to view and save your favourite items.</p>
          <Link to="/account" className="link-red mt-6 inline-block">sign in →</Link>
        </div>
      </Shell>
    );
  }

  const items = slugs.map((s) => PRODUCTS.find((p) => p.id === s)).filter(Boolean);

  return (
    <Shell>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <span className="num text-[11px] tracking-[0.3em] text-primary">saved</span>
        <h1 className="text-4xl font-light mt-3 mb-10">wishlist</h1>
        {isLoading ? (
          <p className="text-foreground/60">loading…</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground/60">your wishlist is empty.</p>
            <Link to="/" className="link-red mt-4 inline-block">start browsing →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((p) => p && (
              <div key={p.id} className="relative group">
                <button
                  aria-label="remove"
                  onClick={() => remove.mutate({ slug: p.id, on: false })}
                  className="absolute top-2 right-2 z-10 bg-background/80 border border-border p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="h-3 w-3" />
                </button>
                <Link to="/product/$productId" params={{ productId: p.id }}>
                  <img src={productImageForColor(p, p.colors?.[0])} alt={p.name} className="w-full aspect-square object-cover bg-card" />
                  <p className="mt-3 text-sm">{p.name}</p>
                  <p className="num text-xs text-primary mt-1">CA${p.priceCAD}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}
