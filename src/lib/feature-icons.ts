// Official ALPS feature icons (line-art glyphs). Use as overlay/badge alongside
// macro photos and on product detail feature chips.

import multiStyle from "@/assets/features/multi-style.png";
import instantHeat from "@/assets/features/instant-heat.png";
import farInfrared from "@/assets/features/far-infrared.png";
import coolmax from "@/assets/features/coolmax.png";
import silverIon from "@/assets/features/silver-ion.png";
import antiVirus from "@/assets/features/anti-virus.png";
import antiOdor from "@/assets/features/anti-odor.png";
import antiStatic from "@/assets/features/anti-static.png";
import quickDry from "@/assets/features/quick-dry.png";

export const FEATURE_ICONS: Record<string, string> = {
  "multi-style": multiStyle,
  "instant-heat": instantHeat,
  "far-infrared": farInfrared,
  "coolmax": coolmax,
  "silver-ion": silverIon,
  "anti-virus": antiVirus,
  "anti-odor": antiOdor,
  "anti-static": antiStatic,
  "quick-dry": quickDry,
};

export function featureIcon(key: string): string | undefined {
  return FEATURE_ICONS[key];
}
