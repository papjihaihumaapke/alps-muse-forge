import nySmart2022Cert from "@/assets/awards/ny-2022-smart-fashion-cert.png";
import nySmart2022Letter from "@/assets/awards/ny-2022-smart-fashion-letter-v2.png";
import nySmart2022Card from "@/assets/awards/ny-2022-smart-fashion-card.png";
import nyWomens2022Cert from "@/assets/awards/ny-2022-womenswear-certificate.png";
import nyWomens2022Letter from "@/assets/awards/ny-2022-womenswear-letter.png";
import nyWomens2022Card from "@/assets/awards/ny-2022-womenswear-card.png";
import nySmart2021Cert from "@/assets/awards/ny-2021-smart-fashion-cert.png";
import nySmart2021Badge from "@/assets/awards/ny-smart-fashion-2021-badge.png";
import nySmart2021Letter from "@/assets/awards/ny-2021-smart-fashion-letter.png";
import nyWomens2021Cert from "@/assets/awards/ny-2021-womenswear-cert.png";
import nyWomens2021Badge from "@/assets/awards/ny-womenswear-2021-badge.png";
import nyWomens2021Letter from "@/assets/awards/ny-2021-womenswear-letter.png";
import hkmob2022Statue from "@/assets/awards/hkmob-2022-statue.png";
import hkmos2021Statue from "@/assets/awards/hkmos-2021-statue.png";
import ida2021ApparelSilver from "@/assets/awards/ida-2021-apparel-silver.png";
import ida2021SustainableBronze from "@/assets/awards/ida-2021-sustainable-bronze.png";
import ida2021ApparelHm from "@/assets/awards/ida-2021-apparel-hm.png";
import ida2021PretHm from "@/assets/awards/ida-2021-pret-hm.png";
import ida2018SportswearSilver from "@/assets/awards/ida-2018-sportswear-silver.png";
import dip2019BestPresenter from "@/assets/awards/dip-2019-best-presenter-cert.jpg";

export type AwardLevel = "gold" | "silver" | "bronze" | "honourable mention" | "winner";

export type Award = {
  id: string;
  organization: string;
  category: string;
  project?: string;
  year: number;
  level: AwardLevel;
  description?: string;
  image?: string;
  certificate?: string;
  /** Additional related images (award letter, extra photos) shown as thumbnails inside the popup. */
  gallery?: string[];
  href?: string;
};

// Shared awards collection — consumed by /press page and the site footer so
// both stay in sync. Sorted newest first; grouped by organization within a year.
export const AWARDS: Award[] = [
  // 2022 · NY Product Design Awards
  {
    id: "ny-2022-smart-fashion",
    organization: "new york product design awards",
    category: "smart fashion",
    project: "collection ONE and ALL",
    year: 2022,
    level: "silver",
    image: nySmart2022Cert,
    certificate: nySmart2022Cert,
    gallery: [nySmart2022Letter, nySmart2022Card],
    description:
      "silver winner in the clothing & accessories — smart fashion category for the ONE and ALL collection, recognising textile innovation and intelligent functionality.",
  },
  {
    id: "ny-2022-womenswear",
    organization: "new york product design awards",
    category: "womenswear",
    project: "collection ONE and ALL",
    year: 2022,
    level: "silver",
    image: nyWomens2022Cert,
    certificate: nyWomens2022Cert,
    gallery: [nyWomens2022Letter, nyWomens2022Card],
    description: "silver winner in the clothing & accessories — womenswear category for the ONE and ALL collection.",
  },
  {
    id: "hkmoba-2022",
    organization: "hong kong most outstanding business awards",
    category: "best fashion innovation",
    year: 2022,
    level: "winner",
    image: hkmob2022Statue,
    gallery: [hkmob2022Statue],
    description: "recognised as the best fashion innovation of 2022 by the hong kong most outstanding business awards.",
  },

  // 2021 · NY Product Design Awards
  {
    id: "ny-2021-smart-fashion",
    organization: "new york product design awards",
    category: "smart fashion",
    project: "collection warrior",
    year: 2021,
    level: "gold",
    image: nySmart2021Cert,
    certificate: nySmart2021Cert,
    gallery: [nySmart2021Letter, nySmart2021Badge],
    description: "gold winner in the clothing & accessories — smart fashion category for the warrior collection.",
  },
  {
    id: "ny-2021-womenswear",
    organization: "new york product design awards",
    category: "womenswear",
    project: "collection warrior",
    year: 2021,
    level: "silver",
    image: nyWomens2021Cert,
    certificate: nyWomens2021Cert,
    gallery: [nyWomens2021Letter, nyWomens2021Badge],
    description: "silver winner in the clothing & accessories — womenswear category for the warrior collection.",
  },

  // 2021 · International Design Awards
  {
    id: "ida-2021-apparel-silver",
    organization: "international design awards",
    category: "apparel project",
    project: "collection warrior",
    year: 2021,
    level: "silver",
    image: ida2021ApparelSilver,
    href: "https://www.idesignawards.com/winners-old/zoom.php?eid=9-34162-21",
    description: "silver — apparel category, apparel projects for the warrior collection.",
  },
  {
    id: "ida-2021-sustainable-bronze",
    organization: "international design awards",
    category: "recycled & sustainable fashion",
    project: "collection warrior",
    year: 2021,
    level: "bronze",
    image: ida2021SustainableBronze,
    description: "bronze — other fashion designs, recycled & sustainable fashion for the warrior collection.",
  },
  {
    id: "ida-2021-apparel-hm",
    organization: "international design awards",
    category: "apparel category",
    project: "collection warrior",
    year: 2021,
    level: "honourable mention",
    image: ida2021ApparelHm,
    description: "honourable mention — apparel category for the warrior collection.",
  },
  {
    id: "ida-2021-pret-hm",
    organization: "international design awards",
    category: "prêt-à-porter",
    project: "collection warrior",
    year: 2021,
    level: "honourable mention",
    image: ida2021PretHm,
    description: "honourable mention — prêt-à-porter for the warrior collection.",
  },
  {
    id: "hkmosa-2021",
    organization: "hong kong most outstanding services awards",
    category: "best fashion design brand",
    year: 2021,
    level: "winner",
    image: hkmos2021Statue,
    gallery: [hkmos2021Statue],
    description:
      "recognised as the best fashion design brand of 2021 by the hong kong most outstanding services awards.",
  },

  // 2019
  {
    id: "dip-2019-best-presenter",
    organization: "DIP 2019 Best Presenter",
    category: "Shark Tank pitching",
    year: 2019,
    level: "winner",
    image: dip2019BestPresenter,
    certificate: dip2019BestPresenter,
    description: "best presenter award at the dip graduation ceremony 2019 shark tank pitching.",
  },

  // 2018
  {
    id: "ida-2018-sportswear",
    organization: "international design awards",
    category: "sportswear",
    project: "permanent 99% germs killing instant warming vest",
    year: 2018,
    level: "silver",
    image: ida2018SportswearSilver,
    description: "silver — apparel category, sportswear for the permanent 99% germs killing instant warming vest.",
  },
];

export function awardShortLabel(a: Award): string {
  const org = a.organization;
  const lvl = capitalize(a.level);
  return `${org} — ${a.category} ${a.year}, ${lvl}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const LEVEL_ORDER: Record<AwardLevel, number> = {
  gold: 0,
  silver: 1,
  bronze: 2,
  winner: 3,
  "honourable mention": 4,
};
