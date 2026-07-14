import type { Currency } from "@/lib/cart";
import type { DbProduct } from "@/lib/products-db";

/** True when the product is available for purchase in the given region.
 *  HK (HKD): hide if HK stock is 0 AND CA stock is > 0 (CA-only).
 *  CA (CAD): hide if CA stock is 0 AND HK stock is > 0 (HK-only).
 *  When both are 0 (uncounted / static catalog) we still show the item. */
export function productAvailableInRegion(
  p: { stock?: number | null; stock_ca?: number | null; is_external?: boolean | null },
  currency: Currency,
): boolean {
  if (p.is_external) return true;
  const hk = Number(p.stock ?? 0);
  const ca = Number(p.stock_ca ?? 0);
  if (currency === "CAD") return !(ca === 0 && hk > 0);
  return !(hk === 0 && ca > 0);
}

export function filterProductsForRegion<T extends Partial<DbProduct>>(rows: T[], currency: Currency): T[] {
  return rows.filter((r) => productAvailableInRegion(r, currency));
}
