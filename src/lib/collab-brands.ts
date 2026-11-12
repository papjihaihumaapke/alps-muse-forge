import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toPageSection } from "@/lib/journey";
import littlePrinceIcon from "@/assets/brands/little-prince.png";
import tatouIcon from "@/assets/brands/tatou.png";

/**
 * Collaboration partners ("brands") on the collaborations page. A product's brand is
 * the "collaboration partner" typed on it in the admin panel. Each brand shows as a
 * round icon; the icon picture can be swapped in the admin "collaboration brands"
 * tab, which stores it as a page_sections row (page = BRAND_ICON_PAGE, heading =
 * brand name, images[0] = icon). Brands without an uploaded icon use the built-in
 * one below, or else their first product photo.
 */
export const BRAND_ICON_PAGE = "collab-brands";

export const BUILT_IN_BRAND_ICONS: Record<string, string> = {
  "little prince": littlePrinceIcon,
  tatou: tatouIcon,
};

export function brandKey(name: string): string {
  return name.trim().toLowerCase();
}

/** Brand of a collaboration product: its admin partner field, else read from the name. */
export function collabBrand(name: string, partner: string | null | undefined): string | null {
  if (partner?.trim()) return brandKey(partner);
  if (/little\s*prince/i.test(name)) return "little prince";
  if (/\btatou\b/i.test(name)) return "tatou";
  return null;
}

export type BrandIconRow = { id: string; name: string; url: string | null };

/** Uploaded brand icons, keyed by brand name. */
export function useBrandIcons() {
  return useQuery({
    queryKey: ["brand-icons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page", BRAND_ICON_PAGE);
      if (error) throw error;
      return (data ?? [])
        .map((r) => toPageSection(r))
        .filter((s) => s.heading?.trim())
        .map((s): BrandIconRow => ({
          id: s.id,
          name: brandKey(s.heading!),
          url: s.images[0]?.url ?? null,
        }));
    },
    staleTime: 60_000,
  });
}
