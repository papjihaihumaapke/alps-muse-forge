export type CategorySlug =
  | "innovation"
  | "contemporary"
  | "accessories"
  | "collaborations"
  | "personal-care";

export const CATEGORIES: {
  slug: CategorySlug;
  name: string;
  blurb: string;
}[] = [
  { slug: "innovation", name: "alps innovation", blurb: "where fashion meets technology" },
  { slug: "contemporary", name: "alps contemporary", blurb: "timeless with a twist" },
  { slug: "accessories", name: "alps accessories", blurb: "the finishing detail" },
  { slug: "collaborations", name: "alps collaborations", blurb: "designers in dialogue" },
  { slug: "personal-care", name: "alps vegan skin & personal care", blurb: "made to make a difference" },
];

export const PRODUCT_COLORS: Record<string, string> = {
  almond: "#d2c6b6",
  navy: "#112d46",
  titanium: "#a09d9f",
  fuchsia: "#be3366",
  white: "#fefefe",
  ivory: "#fdf3f3",
  red: "#a11929",
  wine: "#5e2934",
  brown: "#825d2b",
  pink: "#e8bfbf",
  lime: "#c0d999",
  khaki: "#3c6029",
  black: "#030303",
  yellow: "#ffd600",
};

export const FEATURES: { key: string; name: string; desc: string }[] = [
  { key: "multi-style", name: "multi style", desc: "engineered to be worn multiple ways — one garment, many silhouettes." },
  { key: "instant-heat", name: "instant heat", desc: "thermo-active fibres warm on contact with the body." },
  { key: "far-infrared", name: "far infrared light", desc: "far-infrared emitting yarns improve micro-circulation." },
  { key: "coolmax", name: "coolmax freshFX", desc: "moisture-wicking fibres keep the body cool and dry." },
  { key: "silver-ion", name: "silver ion", desc: "silver-ion infused fabric inhibits bacterial growth." },
  { key: "anti-virus", name: "anti-virus", desc: "treated surface neutralises common viral particles." },
  { key: "anti-odor", name: "anti-odor", desc: "anti-microbial finish prevents odour build-up." },
  { key: "anti-static", name: "anti-static", desc: "conductive fibres dissipate static charge." },
  { key: "quick-dry", name: "quick-dry", desc: "engineered for rapid moisture release." },
  { key: "breathable", name: "breathable", desc: "high-permeability weave for active comfort." },
  { key: "adhesive", name: "adhesive", desc: "seamless bonded construction without stitching." },
  { key: "self-cleaning", name: "self cleaning light FRESH", desc: "photocatalytic finish breaks down stains under daylight." },
  { key: "silvalight", name: "silvaLIGHT", desc: "proprietary lightweight silver-treated knit." },
  { key: "water-repellent", name: "water repellent", desc: "DWR finish sheds water without coating." },
  { key: "uv-resistant", name: "UV resistant", desc: "UPF50+ protection from solar radiation." },
  { key: "recycle", name: "recycle", desc: "made from post-consumer recycled fibres." },
  { key: "bluesign", name: "bluesign approved", desc: "bluesign® certified responsible production." },
  { key: "oeko-tex", name: "OEKO-TEX standard 100", desc: "tested free from harmful substances." },
  { key: "super-soft", name: "super soft", desc: "brushed micro-fibre hand-feel." },
  { key: "stretch", name: "stretch", desc: "4-way stretch construction for unrestricted movement." },
  { key: "natural", name: "natural", desc: "natural-origin fibres, ethically sourced." },
  { key: "vegan", name: "vegan", desc: "100% animal-free materials and processes." },
];

export type Product = {
  id: string;
  name: string;
  category: CategorySlug;
  priceCAD: number;
  priceHKD: number;
  colors: string[];
  sizes: string[];
  features: string[];
};

export const PRODUCTS: Product[] = [
  { id: "muted-coat", name: "winter II muted coat", category: "innovation", priceCAD: 480, priceHKD: 2800, colors: ["navy", "black"], sizes: ["XS","S","M","L"], features: ["instant-heat","water-repellent","stretch"] },
  { id: "warrior-jacket", name: "summer V warrior jacket", category: "innovation", priceCAD: 420, priceHKD: 2450, colors: ["black","khaki"], sizes: ["S","M","L"], features: ["quick-dry","breathable","uv-resistant"] },
  { id: "bind-dress", name: "winter V bind dress", category: "contemporary", priceCAD: 360, priceHKD: 2100, colors: ["red","wine","black"], sizes: ["XS","S","M","L"], features: ["multi-style","stretch"] },
  { id: "sugar-skirt", name: "summer III sugar crush skirt", category: "contemporary", priceCAD: 220, priceHKD: 1280, colors: ["red","pink","ivory"], sizes: ["XS","S","M"], features: ["super-soft","natural"] },
  { id: "cabas-220", name: "CABAS 220 shoulder bag", category: "accessories", priceCAD: 280, priceHKD: 1650, colors: ["black","almond","navy"], sizes: ["one size"], features: ["water-repellent","self-cleaning"] },
  { id: "checker-socks", name: "checker tube socks", category: "accessories", priceCAD: 28, priceHKD: 160, colors: ["black","white"], sizes: ["S","M","L"], features: ["anti-odor","stretch"] },
  { id: "one-and-all", name: "one and all parade coat", category: "collaborations", priceCAD: 540, priceHKD: 3200, colors: ["navy","red"], sizes: ["S","M","L"], features: ["multi-style","water-repellent"] },
  { id: "travel-mask", name: "travel lite face mask", category: "collaborations", priceCAD: 24, priceHKD: 140, colors: ["black","white","red"], sizes: ["one size"], features: ["anti-virus","silver-ion","breathable"] },
  { id: "vegan-cleanser", name: "riman vegan cleanser", category: "personal-care", priceCAD: 48, priceHKD: 280, colors: ["white"], sizes: ["150ml"], features: ["vegan","natural"] },
  { id: "vegan-cream", name: "riman recovery cream", category: "personal-care", priceCAD: 72, priceHKD: 420, colors: ["ivory"], sizes: ["50ml"], features: ["vegan","super-soft"] },
];

export const SOCIALS = {
  instagram: "https://www.instagram.com/alpsannieling/",
  instagram2: "https://www.instagram.com/alps.annieling/",
  instagram3: "https://www.instagram.com/alpsbyannieling/",
  facebook: "https://www.facebook.com/alps.annieling/",
  x: "https://x.com/annie_ling",
  threads: "https://www.threads.com/@alpsannieling",
  youtube: "https://www.youtube.com/channel/UCQkObngC_R1tDpdfV5Ebcmg",
  asiaMiles: "https://lifestyle.asiamiles.com/en/HK/p/IFC_0152_60001/ac0015-light-fresh-technology-cabas-220-shoulder-bag",
  email: "cs@ALPSannieling.com",
};
