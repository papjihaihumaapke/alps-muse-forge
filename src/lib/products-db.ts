import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, CategorySlug } from "@/lib/alps-data";

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  tech_info: string | null;
  price_cad: number;
  price_hkd: number;
  colors: string[];
  sizes: string[];
  features: string[];
  tags: string[];
  season: string;
  gallery_urls: string[];
  color_swatches: Array<{ name: string; hex?: string; swatch_url?: string }>;
  image_url: string | null;
  hidden: boolean;
  is_external?: boolean;
  external_url?: string | null;
  stock_ca?: number;
};

/** Convert a DB product row to the shared Product shape used by CategoryView/ProductPage. */
export function dbProductToCatalog(d: DbProduct): Product & {
  description?: string | null;
  techInfo?: string | null;
  galleryUrls?: string[];
  swatches?: DbProduct["color_swatches"];
  season?: string;
  isExternal?: boolean;
  externalUrl?: string | null;
} {
  // Filter out dev-only "/src/assets/..." paths that don't resolve on the published site.
  const isProdSafe = (u: string) => !!u && !u.startsWith("/src/");
  const gallery = (d.gallery_urls ?? []).filter(isProdSafe);
  const fallback = d.image_url && isProdSafe(d.image_url) ? [d.image_url] : [];
  return {
    id: d.slug,
    name: d.name,
    category: d.category as CategorySlug,
    priceCAD: Number(d.price_cad),
    priceHKD: Number(d.price_hkd),
    colors: d.colors,
    sizes: d.sizes.length ? d.sizes : ["one size"],
    features: d.features,
    tags: d.tags as Product["tags"],
    description: d.description,
    techInfo: d.tech_info,
    galleryUrls: gallery.length ? gallery : fallback,
    swatches: d.color_swatches ?? [],
    season: d.season,
    isExternal: d.is_external ?? false,
    externalUrl: d.external_url ?? null,
  };
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
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as DbProduct[];
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
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as DbProduct[];
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
      return data ? (data as unknown as DbProduct) : null;
    },
    staleTime: 60_000,
  });
}
