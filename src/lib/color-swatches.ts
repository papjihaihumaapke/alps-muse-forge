// Color swatch dot images. Keyed by color/colorway name (lower-case, hyphen-separated).
// Falls back to a flat CSS color in PRODUCT_COLORS when no image is available.

import almond from "@/assets/swatches/almond.png";
import black from "@/assets/swatches/black.png";
import copper from "@/assets/swatches/copper.png";
import fuchsia from "@/assets/swatches/fuchsia.png";
import khaki from "@/assets/swatches/khaki.png";
import lime from "@/assets/swatches/lime.png";
import navy from "@/assets/swatches/navy.png";
import pink from "@/assets/swatches/pink.png";
import red from "@/assets/swatches/red.png";
import titanium from "@/assets/swatches/titanium.png";
import white from "@/assets/swatches/white.png";
import wine from "@/assets/swatches/wine.png";
import yellow from "@/assets/swatches/yellow.png";

import blackCopper from "@/assets/swatches/black-copper.png";
import blackFuchsia from "@/assets/swatches/black-fuchsia.png";
import blackRed from "@/assets/swatches/black-red.png";
import blackTitanium from "@/assets/swatches/black-titanium.png";
import ivoryBlack from "@/assets/swatches/ivory-black.png";
import ivoryFuchsia from "@/assets/swatches/ivory-fuchsia.png";
import ivoryNavy from "@/assets/swatches/ivory-navy.png";
import navyFuchsia from "@/assets/swatches/navy-fuchsia.png";
import navyTitanium from "@/assets/swatches/navy-titanium.png";
import checkRedBlack from "@/assets/swatches/check-red-black.png";

import printLeave from "@/assets/swatches/print-leave.png";
import printCheckBlack from "@/assets/swatches/print-check-black.png";
import printCheckNavy from "@/assets/swatches/print-check-navy.png";
import printCheckRed from "@/assets/swatches/print-check-red.png";
import printTiger from "@/assets/swatches/print-tiger.png";
import printWaveNavy from "@/assets/swatches/print-wave-navy.png";
import printWaveRed from "@/assets/swatches/print-wave-red.png";
import printHoundstoothBlack from "@/assets/swatches/print-houndstooth-black.png";
import printHoundstoothCamel from "@/assets/swatches/print-houndstooth-camel.png";
import printFlowerBlack from "@/assets/swatches/print-flower-black.png";
import printFlowerGrey from "@/assets/swatches/print-flower-grey.png";
import printBauhiniaKhaki from "@/assets/swatches/print-bauhinia-khaki.png";
import printLeopardRed from "@/assets/swatches/print-leopard-red.png";
import printLeopardNavy from "@/assets/swatches/print-leopard-navy.png";
import printLeopardBlack from "@/assets/swatches/print-leopard-black.png";

import lpRedNavy from "@/assets/swatches/lp-red-navy.png";
import lpRoseDay from "@/assets/swatches/lp-rose-day.png";
import lpStarDay from "@/assets/swatches/lp-star-day.png";
import lpRoseNight from "@/assets/swatches/lp-rose-night.png";
import lpStarNight from "@/assets/swatches/lp-star-night.png";
import lpStarBadge from "@/assets/swatches/lp-star-badge.png";
import lpRedBadge from "@/assets/swatches/lp-red-badge.png";

export const COLOR_SWATCHES: Record<string, string> = {
  // solid
  almond, black, copper, fuchsia, khaki, lime, navy, pink, red, titanium, white, wine, yellow,
  ivory: white,
  brown: copper,
  // bi-color (hyphenated keys, both orderings)
  "black-copper": blackCopper, "copper-black": blackCopper,
  "black-fuchsia": blackFuchsia, "fuchsia-black": blackFuchsia,
  "black-red": blackRed, "red-black": blackRed,
  "black-titanium": blackTitanium, "titanium-black": blackTitanium,
  "ivory-black": ivoryBlack, "black-ivory": ivoryBlack, "black-white": ivoryBlack, "white-black": ivoryBlack,
  "ivory-fuchsia": ivoryFuchsia, "fuchsia-ivory": ivoryFuchsia, "white-fuchsia": ivoryFuchsia, "fuchsia-white": ivoryFuchsia,
  "ivory-navy": ivoryNavy, "navy-ivory": ivoryNavy, "white-navy": ivoryNavy, "navy-white": ivoryNavy,
  "navy-fuchsia": navyFuchsia, "fuchsia-navy": navyFuchsia,
  "navy-titanium": navyTitanium, "titanium-navy": navyTitanium,
  "check-red-black": checkRedBlack,
  // prints
  "leave-print": printLeave,
  "check-black": printCheckBlack,
  "check-navy": printCheckNavy,
  "check-red": printCheckRed,
  "tiger-print": printTiger,
  "wave-navy": printWaveNavy,
  "wave-red": printWaveRed,
  "houndstooth-black": printHoundstoothBlack,
  "houndstooth-camel": printHoundstoothCamel,
  "flower-black": printFlowerBlack,
  "flower-grey": printFlowerGrey,
  "bauhinia-khaki": printBauhiniaKhaki,
  "leopard-red": printLeopardRed,
  "leopard-navy": printLeopardNavy,
  "leopard-black": printLeopardBlack,
  // little prince
  "lp-red-navy": lpRedNavy,
  "lp-rose-day": lpRoseDay,
  "lp-star-day": lpStarDay,
  "lp-rose-night": lpRoseNight,
  "lp-star-night": lpStarNight,
  "lp-star-badge": lpStarBadge,
  "lp-red-badge": lpRedBadge,
};

/** Returns swatch image URL for a color name (case-insensitive). */
export function colorSwatch(color: string): string | undefined {
  return COLOR_SWATCHES[color.toLowerCase().trim()];
}

/** Grouped swatch library for the admin picker. */
export type SwatchGroup = "solid" | "bi-color" | "little-prince" | "prints";
export const SWATCH_LIBRARY: Record<SwatchGroup, { key: string; label: string; url: string }[]> = {
  solid: [
    { key: "black", label: "black", url: black },
    { key: "navy", label: "navy", url: navy },
    { key: "red", label: "red", url: red },
    { key: "white", label: "ivory / white", url: white },
    { key: "fuchsia", label: "fuchsia", url: fuchsia },
    { key: "pink", label: "pink", url: pink },
    { key: "yellow", label: "yellow", url: yellow },
    { key: "copper", label: "copper / camel", url: copper },
    { key: "titanium", label: "titanium / grey", url: titanium },
    { key: "wine", label: "wine", url: wine },
    { key: "khaki", label: "khaki / olive", url: khaki },
    { key: "lime", label: "lime / light green", url: lime },
    { key: "almond", label: "almond / beige", url: almond },
  ],
  "bi-color": [
    { key: "black-red", label: "black / red", url: blackRed },
    { key: "black-titanium", label: "black / titanium", url: blackTitanium },
    { key: "navy-titanium", label: "navy / titanium", url: navyTitanium },
    { key: "black-copper", label: "black / copper", url: blackCopper },
    { key: "black-fuchsia", label: "black / fuchsia", url: blackFuchsia },
    { key: "ivory-black", label: "ivory / black", url: ivoryBlack },
    { key: "ivory-fuchsia", label: "ivory / fuchsia", url: ivoryFuchsia },
    { key: "ivory-navy", label: "ivory / navy", url: ivoryNavy },
    { key: "navy-fuchsia", label: "navy / fuchsia", url: navyFuchsia },
    { key: "check-red-black", label: "check red / black", url: checkRedBlack },
  ],
  "little-prince": [
    { key: "lp-star-night", label: "star midnight", url: lpStarNight },
    { key: "lp-star-day", label: "star daylight", url: lpStarDay },
    { key: "lp-star-badge", label: "star badge", url: lpStarBadge },
    { key: "lp-red-badge", label: "red badge", url: lpRedBadge },
    { key: "lp-red-navy", label: "red / navy badge", url: lpRedNavy },
    { key: "lp-rose-day", label: "good day rose", url: lpRoseDay },
    { key: "lp-rose-night", label: "goodnight rose", url: lpRoseNight },
  ],
  prints: [
    { key: "check-navy", label: "check navy", url: printCheckNavy },
    { key: "check-black", label: "check black", url: printCheckBlack },
    { key: "check-red", label: "check red", url: printCheckRed },
    { key: "bauhinia-khaki", label: "bauhinia khaki", url: printBauhiniaKhaki },
    { key: "tiger-print", label: "tiger", url: printTiger },
    { key: "houndstooth-black", label: "houndstooth black", url: printHoundstoothBlack },
    { key: "houndstooth-camel", label: "houndstooth camel", url: printHoundstoothCamel },
    { key: "leave-print", label: "leaves", url: printLeave },
    { key: "flower-grey", label: "flower grey", url: printFlowerGrey },
    { key: "flower-black", label: "flower black", url: printFlowerBlack },
    { key: "wave-navy", label: "wave navy", url: printWaveNavy },
    { key: "wave-red", label: "wave red", url: printWaveRed },
    { key: "leopard-red", label: "leopard red", url: printLeopardRed },
    { key: "leopard-navy", label: "leopard navy", url: printLeopardNavy },
    { key: "leopard-black", label: "leopard black", url: printLeopardBlack },
  ],
};

