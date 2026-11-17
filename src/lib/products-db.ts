import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, CategorySlug } from "@/lib/alps-data";
import { localizeAssetUrl } from "@/lib/local-asset-images";
import type { VariantStock } from "@/lib/product-fields";
import { signMediaUrls } from "@/lib/storage-url";
import { resolveSwatchUrl } from "@/lib/color-swatches";

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  tech_info: string | null;
  design_features?: string | null;
  composition?: string | null;
  care_instructions?: string | null;
  video_urls?: string[];
  price_cad: number;
  price_hkd: number;
  colors: string[];
  sizes: string[];
  features: string[];
  tags: string[];
  season: string;
  gallery_urls: string[];
  color_swatches: Array<{ name: string; hex?: string; swatch_url?: string; image_url?: string; image_urls?: string[] }>;
  image_url: string | null;
  hidden: boolean;
  is_external?: boolean;
  external_url?: string | null;
  stock?: number;
  stock_ca?: number;
  variant_stock?: VariantStock;
  collection?: string | null;
};

/** Colour list = legacy colours CSV plus every named swatch added in the admin panel. */
function mergeColors(colors: string[] | null, swatches: DbProduct["color_swatches"] | null): string[] {
  const out = [...(colors ?? [])];
  for (const s of swatches ?? []) {
    const name = s.name?.trim();
    if (name && !out.includes(name)) out.push(name);
  }
  return out;
}

/** Convert a DB product row to the shared Product shape used by CategoryView/ProductPage. */
export function dbProductToCatalog(d: DbProduct): Product & {
  description?: string | null;
  techInfo?: string | null;
  designFeatures?: string | null;
  composition?: string | null;
  careInstructions?: string | null;
  videoUrls?: string[];
  galleryUrls?: string[];
  swatches?: DbProduct["color_swatches"];
  season?: string;
  isExternal?: boolean;
  externalUrl?: string | null;
  variantStock?: VariantStock;
} {
  // Filter out dev-only "/src/assets/..." paths that don't resolve on the published site.
  const isProdSafe = (u: string) => !!u && !u.startsWith("/src/");
  // A few source files (.psd) leaked into the galleries during import; browsers
  // can't render them, so they'd show as an empty slot.
  const isRenderable = (u: string) => !/\.(psd|ai|tiff?|heic)$/i.test(u);
  const gallery = (d.gallery_urls ?? []).filter(isProdSafe).filter(isRenderable).map(localizeAssetUrl);
  const fallback = d.image_url && isProdSafe(d.image_url) ? [localizeAssetUrl(d.image_url)] : [];
  return {
    id: d.slug,
    name: d.name,
    category: d.category as CategorySlug,
    priceCAD: Number(d.price_cad),
    priceHKD: Number(d.price_hkd),
    colors: mergeColors(d.colors, d.color_swatches),
    sizes: d.sizes.length ? d.sizes : ["one size"],
    features: d.features,
    tags: d.tags as Product["tags"],
    description: d.description,
    techInfo: d.tech_info,
    designFeatures: d.design_features ?? null,
    composition: d.composition ?? null,
    careInstructions: d.care_instructions ?? null,
    videoUrls: (d.video_urls ?? []).filter(Boolean),
    galleryUrls: gallery.length ? gallery : fallback,
    // Colour photos come from the same gallery, so resolve them the same way.
    swatches: (d.color_swatches ?? []).map((sw) => {
      const imgs = (sw.image_urls?.length ? sw.image_urls : sw.image_url ? [sw.image_url] : [])
        .filter(isProdSafe).filter(isRenderable).map(localizeAssetUrl);
      return { ...sw, swatch_url: resolveSwatchUrl(sw.swatch_url), image_urls: imgs, image_url: imgs[0] };
    }),
    season: d.season,
    isExternal: d.is_external ?? false,
    externalUrl: d.external_url ?? null,
    variantStock: d.variant_stock ?? {},
  };
}

/**
 * Admin uploads live in the private `product-media` bucket, so their saved
 * /object/public/ urls answer "Bucket not found" for visitors. Swap every stored
 * photo/video url on the rows for a signed one (one request per bucket).
 */
async function withSignedMedia(rows: DbProduct[]): Promise<DbProduct[]> {
  const urls: string[] = [];
  for (const r of rows) {
    if (r.image_url) urls.push(r.image_url);
    urls.push(...(r.gallery_urls ?? []), ...(r.video_urls ?? []));
    for (const sw of r.color_swatches ?? []) {
      if (sw.swatch_url) urls.push(sw.swatch_url);
      if (sw.image_url) urls.push(sw.image_url);
      urls.push(...(sw.image_urls ?? []));
    }
  }
  const signed = await signMediaUrls(urls);
  if (!signed.size) return rows;
  const sign = (u: string) => signed.get(u) ?? u;
  const signOpt = <T extends string | null | undefined>(u: T): T => (u ? (sign(u) as T) : u);
  return rows.map((r) => ({
    ...r,
    image_url: signOpt(r.image_url),
    gallery_urls: (r.gallery_urls ?? []).map(sign),
    video_urls: (r.video_urls ?? []).map(sign),
    color_swatches: (r.color_swatches ?? []).map((sw) => ({
      ...sw,
      swatch_url: signOpt(sw.swatch_url),
      image_url: signOpt(sw.image_url),
      image_urls: sw.image_urls?.map(sign),
    })),
  }));
}

/** Fetch every visible DB product (cached). */
export function useDbProducts() {
  return useQuery({
    queryKey: ["db-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("hidden", false)
        .order("display_order", { ascending: true })
        .order("name");
      if (error) throw error;
      return withSignedMedia((data ?? []) as unknown as DbProduct[]);
    },
    staleTime: 60_000,
  });
}

/** Fetch DB products filtered by category slug. */
export function useDbProductsByCategory(slug: string) {
  return useQuery({
    queryKey: ["db-products", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("hidden", false)
        .eq("category", slug)
        .order("display_order", { ascending: true })
        .order("name");
      if (error) throw error;
      return withSignedMedia((data ?? []) as unknown as DbProduct[]);
    },
    staleTime: 60_000,
  });
}

/** Fetch a single DB product by slug (the public-facing product id). */
export function useDbProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["db-product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("hidden", false)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const [row] = await withSignedMedia([data as unknown as DbProduct]);
      return row;
    },
    staleTime: 60_000,
  });
}
