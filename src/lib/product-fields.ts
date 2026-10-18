/** Split a pasted list on "/" or "," (Annie's sheets use slashes; older entries use commas). */
export function splitList(s: string): string[] {
  return s.split(/[/,]/).map((x) => x.trim()).filter(Boolean);
}

export function joinList(items: readonly string[]): string {
  return items.join(" / ");
}

/** Stock per colour + size, keyed "<colour>|<size>". */
export type VariantStock = Record<string, { hk?: number; ca?: number }>;

export const variantKey = (color: string, size: string) => `${color}|${size}`;

/** Units of this colour/size in the region, or null when no per-variant count was entered. */
export function variantQty(
  stock: VariantStock | null | undefined,
  color: string,
  size: string,
  region: "hk" | "ca",
): number | null {
  const v = stock?.[variantKey(color, size)];
  if (!v || v[region] == null) return null;
  return Number(v[region]);
}

/** Categories sold without sizing (accessories are one size, personal care has none). */
export function isSizeless(category: string): boolean {
  return category === "accessories" || category === "personal-care" || category.startsWith("vegan-");
}

export const SEASON_LABELS: Record<string, string> = {
  "spring-summer": "spring / summer",
  "fall-winter": "fall / winter",
  "all-season": "all season",
  spring: "spring",
  summer: "summer",
  fall: "fall",
  winter: "winter",
};
