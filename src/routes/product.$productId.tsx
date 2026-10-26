import { createFileRoute, notFound, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ChevronDown, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useWishlist, useToggleWishlist } from "@/lib/wishlist";
import { Shell } from "@/components/alps/Shell";
import { PRODUCTS, PRODUCT_COLORS, FEATURES, type Product } from "@/lib/alps-data";
import {
  productImageForColor,
  productGallery,
} from "@/lib/accessory-images";
import { colorSwatch } from "@/lib/color-swatches";
import { featureIcon } from "@/lib/feature-icons";
import { INNOVATIONS } from "@/lib/innovations";
import { openInnovation } from "@/lib/innovation-store";
import { isSizeless, variantQty, type VariantStock } from "@/lib/product-fields";
import { useCart, buildCartItem } from "@/lib/cart";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";
import { useDbProductBySlug, dbProductToCatalog } from "@/lib/products-db";
import { SizeChartDialog, inferSizeChartKinds } from "@/components/alps/SizeChart";
import { ProductVideos } from "@/components/alps/ProductVideos";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/product/$productId")({
  head: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.productId);
    return {
      meta: [
        { title: `${p?.name ?? "product"} — ALPS Annie Ling` },
        { name: "description", content: p ? `${p.name} — ALPS Annie Ling` : "ALPS Annie Ling product" },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <Shell>
      <div className="max-w-3xl mx-auto py-32 px-6 text-center">
        <h1 className="text-3xl font-normal">product not found</h1>
        <Link to="/" className="link-red mt-6 inline-block">return home</Link>
      </div>
    </Shell>
  ),
});

function ProductPage() {
  const { productId } = Route.useParams();
  const staticProduct = PRODUCTS.find((p) => p.id === productId);
  const { data: dbRow, isLoading: dbLoading } = useDbProductBySlug(productId);

  const product = useMemo<Product | undefined>(() => {
    if (dbRow) return dbProductToCatalog(dbRow) as Product;
    return staticProduct;
  }, [dbRow, staticProduct]);

  const dbExtras = (product ?? {}) as Product & {
    description?: string | null;
    techInfo?: string | null;
    designFeatures?: string | null;
    composition?: string | null;
    careInstructions?: string | null;
    videoUrls?: string[];
    galleryUrls?: string[];
    variantStock?: VariantStock;
    swatches?: Array<{ name: string; hex?: string; swatch_url?: string; image_url?: string; image_urls?: string[] }>;
  };

  const isPersonalCare = product
    ? product.category === "personal-care" || product.category.startsWith("vegan-")
    : false;

  const [color, setColor] = useState(product?.colors[0] ?? "default");
  const [size, setSize] = useState(product?.sizes[0] ?? "one size");
  const [qty, setQty] = useState(1);

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    const seen = new Set<string>();
    const out: string[] = [];
    const push = (u?: string) => { if (u && !seen.has(u)) { seen.add(u); out.push(u); } };
    const swatches = dbExtras.swatches ?? [];
    const colourImages = swatches.find((s) => s.name === color)?.image_urls ?? [];
    if (colourImages.length) {
      // Only this colour's photos.
      colourImages.forEach(push);
      return out;
    }
    swatches.forEach((s) => push(s.image_url));
    (dbExtras.galleryUrls ?? []).forEach(push);
    productGallery(product.id, product.colors).forEach(push);
    return out;
  }, [product, color, dbExtras.galleryUrls, dbExtras.swatches]);

  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  const [zoomOpen, setZoomOpen] = useState(false);
  const zoomIndex = Math.max(0, activeImage ? gallery.indexOf(activeImage) : 0);
  const stepImage = (dir: 1 | -1) => {
    if (gallery.length < 2) return;
    setActiveImage(gallery[(zoomIndex + dir + gallery.length) % gallery.length]);
  };

  // Initialize / sync active image when product resolves or colour changes.
  useEffect(() => {
    if (!product) return;
    const dbMatch = dbExtras.swatches?.find((s) => s.name === color);
    if (dbMatch?.image_url) { setActiveImage(dbMatch.image_url); return; }
    const next = productImageForColor(product.id, color);
    if (next) { setActiveImage(next); return; }
    if (gallery[0]) setActiveImage(gallery[0]);
  }, [color, product, dbExtras.swatches, gallery]);

  // Sync colour default when product resolves from DB.
  useEffect(() => {
    if (product && !product.colors.includes(color)) {
      setColor(product.colors[0] ?? "default");
    }
    if (product && !product.sizes.includes(size)) {
      setSize(product.sizes[0] ?? "one size");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const { add, currency } = useCart();
  const onAdd = () => {
    if (!product) return;
    // DB-only products aren't in the static catalog, so build from the resolved product.
    const it = buildCartItem(product.id, color, size, qty) ?? {
      productId: product.id, name: product.name, color, size, qty,
      priceCAD: product.priceCAD, priceHKD: product.priceHKD,
    };
    add(it); toast.success("added to bag");
  };

  // Early returns AFTER all hooks so hook order stays stable.
  if (!product && !dbLoading) throw notFound();
  if (!product) {
    return <Shell><div className="p-10 text-center text-foreground/50">loading…</div></Shell>;
  }


  const sizeless = isSizeless(product.category) && product.sizes.every((s) => s === "one size");
  const region = currency === "CAD" ? "ca" : "hk";
  const variantLeft = variantQty(dbExtras.variantStock, color, size, region);
  const soldOut = variantLeft !== null && variantLeft <= 0;

  return (
    <Shell>
      <div className="px-6 lg:px-10 py-10">
        {/* LEFT: heading, price, pictures, then the detail sections · RIGHT: buying controls,
            description and technology. On phones it stacks pictures → buying → details. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,min(50%,78vh))_minmax(0,1fr)] lg:grid-rows-[auto_1fr] gap-x-14 gap-y-8">
          <div className="lg:col-start-1 lg:row-start-1">
            <span className="num text-xs tracking-[0.3em] text-primary uppercase">
              {product.category.replace(/-/g, " ")}
            </span>
            <h1 className="text-3xl md:text-4xl mt-2 leading-tight">{product.name}</h1>
            <p className="num text-lg mt-3 text-primary font-medium">
              CAD {product.priceCAD} <span className="text-foreground/40">·</span> HKD {product.priceHKD}
            </p>

            <div
              className="mt-6 aspect-square flex items-center justify-center overflow-hidden bg-brand-light"
              style={!activeImage ? { background: isPersonalCare ? "var(--muted)" : PRODUCT_COLORS[color] } : undefined}
            >
              {activeImage ? (
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  className="h-full w-full cursor-zoom-in"
                  aria-label="enlarge image"
                >
                  <img
                    key={activeImage}
                    src={activeImage}
                    alt={`${product.name} — ${color}`}
                    className="h-full w-full object-cover transition-opacity duration-300"
                  />
                </button>
              ) : (
                <span className={`text-sm tracking-wide px-6 text-center ${isPersonalCare ? "text-foreground/60" : "text-white/80 mix-blend-difference"}`}>
                  {product.name}
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {gallery.map((url, i) => {
                  const active = url === activeImage;
                  return (
                    <button
                      key={url + i}
                      onClick={() => setActiveImage(url)}
                      className={`h-20 w-20 shrink-0 overflow-hidden border-2 transition ${
                        active ? "border-primary" : "border-border hover:border-foreground/60"
                      }`}
                      aria-label={`view ${i + 1}`}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}

            <ProductVideos urls={dbExtras.videoUrls ?? []} title={product.name} />

            <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
              <DialogContent
                className="max-w-[min(96vw,1400px)] w-full p-2 sm:p-4 bg-background"
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") stepImage(1);
                  if (e.key === "ArrowLeft") stepImage(-1);
                }}
              >
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                {/* Fixed-size stage so the window doesn't jump between photos of different dimensions. */}
                <div className="relative flex items-center justify-center h-[82vh] w-full">
                  {activeImage && (
                    <img
                      src={activeImage}
                      alt={`${product.name} — enlarged`}
                      className="h-full w-full object-contain"
                    />
                  )}
                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => stepImage(-1)}
                        aria-label="previous image"
                        className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/80 p-2 hover:bg-background"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => stepImage(1)}
                        aria-label="next image"
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/80 p-2 hover:bg-background"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <span className="num absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 px-2 py-0.5 text-xs">
                        {zoomIndex + 1} / {gallery.length}
                      </span>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
            {!isPersonalCare && product.colors.length > 0 && (
              <div>
                <h3 className="text-xs tracking-[0.25em] uppercase text-foreground/70 mb-3">
                  colour — <span className="text-foreground">{color}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c) => {
                    const dbSw = dbExtras.swatches?.find((s) => s.name === c);
                    const sw = dbSw?.swatch_url ?? colorSwatch(c);
                    const bg = dbSw?.hex ?? PRODUCT_COLORS[c] ?? "#cccccc";
                    const selected = color === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`group flex flex-col items-center gap-1.5 transition ${selected ? "" : "opacity-80 hover:opacity-100"}`}
                        title={c}
                        aria-label={c}
                        aria-pressed={selected}
                      >
                        <span
                          className={`h-12 w-12 rounded-full overflow-hidden flex items-center justify-center ring-offset-2 ring-offset-background transition ${
                            selected ? "ring-2 ring-[var(--brand-red)]" : "ring-1 ring-border group-hover:ring-foreground/60"
                          }`}
                          style={{ background: bg }}
                        >
                          {sw && <img src={sw} alt="" className="h-full w-full object-cover" />}
                        </span>
                        <span className={`text-xs tracking-wide ${selected ? "text-foreground" : "text-foreground/60"}`}>{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!sizeless && (
              <div className="mt-6">
                <h3 className="text-xs tracking-[0.25em] uppercase text-foreground/70 mb-3">size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const left = variantQty(dbExtras.variantStock, color, s, region);
                    const out = left !== null && left <= 0;
                    return (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        title={out ? "sold out in this colour" : undefined}
                        className={`min-w-11 px-4 py-2 text-sm border ${
                          size === s ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                        } ${out ? "line-through opacity-50" : ""}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                <SizeChartDialog kinds={inferSizeChartKinds(product.tags as string[], product.category)} />
              </div>
            )}
            {sizeless && product.category === "accessories" && (
              <p className="mt-6 text-sm text-foreground/70">one size</p>
            )}

            <div className="mt-6">
              <h3 className="text-xs tracking-[0.25em] uppercase text-foreground/70 mb-3">quantity</h3>
              <div className="inline-flex items-center border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                <span className="num w-10 text-center">{qty}</span>
                <button onClick={() => setQty(variantLeft !== null ? Math.min(variantLeft, qty + 1) : qty + 1)} className="p-2 hover:bg-muted"><Plus className="h-3 w-3" /></button>
              </div>
              {variantLeft !== null && variantLeft > 0 && variantLeft <= 3 && (
                <p className="mt-2 text-xs text-primary">only {variantLeft} left</p>
              )}
            </div>

            <div className="mt-8 flex gap-2">
              <button
                onClick={onAdd}
                disabled={soldOut}
                className="flex-1 bg-primary text-primary-foreground py-4 text-sm tracking-[0.2em] uppercase hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {soldOut ? "sold out" : "add to bag"}
              </button>
              <WishlistButton slug={product.id} />
            </div>

            {dbExtras.description && (
              <p className="mt-10 text-base text-foreground/85 leading-relaxed whitespace-pre-line">
                {dbExtras.description}
              </p>
            )}

            {(dbExtras.techInfo || product.features.length > 0) && (
              <div className="mt-8">
                <h3 className="text-xs tracking-[0.25em] uppercase text-primary mb-3">technology benefits</h3>
                {dbExtras.techInfo && <ListText text={dbExtras.techInfo} />}
                {product.features.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.features.map((fk) => (
                      <FeatureChip key={fk} featureKey={fk} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {(dbExtras.designFeatures || dbExtras.composition || dbExtras.careInstructions) && (
            <div className="lg:col-start-1 lg:row-start-2 lg:self-start divide-y divide-border border-y border-border">
              {dbExtras.designFeatures && (
                <Accordion title={isPersonalCare ? "benefits" : "design features"} defaultOpen>
                  <ListText text={dbExtras.designFeatures} />
                </Accordion>
              )}
              {dbExtras.composition && (
                <Accordion title={isPersonalCare ? "ingredients" : "composition"} defaultOpen>
                  <ListText text={dbExtras.composition} />
                </Accordion>
              )}
              {dbExtras.careInstructions && (
                <Accordion title={isPersonalCare ? "how to use" : "care"} defaultOpen>
                  <ListText text={dbExtras.careInstructions} />
                </Accordion>
              )}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

/** One line per point with a little air between them; blank lines in the pasted text are ignored. */
function ListText({ text }: { text: string }) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return (
    <div className="space-y-2 text-sm text-foreground/80 leading-relaxed">
      {lines.map((l, i) => <p key={i}>{l}</p>)}
    </div>
  );
}

/** Technology icon: opens the full innovation page when there is one, otherwise a short popover. */
function FeatureChip({ featureKey }: { featureKey: string }) {
  const [open, setOpen] = useState(false);
  const f = FEATURES.find((x) => x.key === featureKey);
  if (!f) return null;
  const icon = featureIcon(featureKey);
  const innovation = INNOVATIONS.find((i) => i.filterKey === featureKey || i.slug === featureKey);
  const chip = (
    <button
      type="button"
      onClick={innovation ? () => openInnovation(innovation.slug) : undefined}
      className="flex items-center gap-2 text-xs tracking-wide px-3 py-1.5 border border-border hover:bg-muted transition-colors cursor-pointer"
      aria-label={`${f.name} — details`}
    >
      {icon && <img src={icon} alt="" className="w-5 h-5 object-contain" />}
      {f.name}
    </button>
  );
  if (innovation) return chip;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{chip}</PopoverTrigger>
      <PopoverContent side="top" className="w-72 text-sm leading-relaxed">
        <div className="flex items-center gap-2 mb-2">
          {icon && <img src={icon} alt="" className="w-5 h-5 object-contain" />}
          <span className="font-medium tracking-wide uppercase text-xs">{f.name}</span>
        </div>
        <p className="text-foreground/80">{f.desc}</p>
      </PopoverContent>
    </Popover>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-base hover:text-primary"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

function WishlistButton({ slug }: { slug: string }) {
  const { data: slugs = [] } = useWishlist();
  const toggle = useToggleWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const on = slugs.includes(slug);
  const onClick = () => {
    if (!user) {
      toast("sign in to save items to your wishlist", {
        action: { label: "sign in", onClick: () => navigate({ to: "/account" }) },
      });
      return;
    }
    toggle.mutate({ slug, on: !on });
  };
  return (
    <button
      onClick={onClick}
      aria-label={on ? "remove from wishlist" : "save to wishlist"}
      title={on ? "remove from wishlist" : "save to wishlist"}
      className={`px-4 border transition ${on ? "border-primary text-primary" : "border-border hover:border-foreground"}`}
    >
      <Heart className={`h-4 w-4 ${on ? "fill-current" : ""}`} />
    </button>
  );
}
