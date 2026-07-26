// The 24 official ALPS innovations, in the exact display sequence supplied.
// Titles + long-form content are sourced from the numbered Word documents.
// Icon keys match src/lib/feature-icons.ts.

export type Innovation = {
  n: number;
  slug: string; // icon key in feature-icons.ts
  filterKey?: string; // key used in FEATURES/product filters (may differ)
  title: string;
  intro: string;
  how: string;
  features: string[];
  benefits: string[];
  glance: string[];
};

export const INNOVATIONS: Innovation[] = [
  {
    n: 1,
    slug: "multi-style",
    filterKey: "multi-style",
    title: "multi styles",
    intro:
      "multi styles refer to garments designed to be worn in multiple ways, allowing a single piece of clothing to transform into various looks to suit different occasions or preferences.",
    how: "multiway clothing is engineered so that one garment can be worn in many different ways, enabling the creation of a wide variety of looks from a single item.",
    features: [
      "highly versatile design allowing for multiple styling options",
      "encourages creative expression through fashion",
      "provides a fun and interactive dressing experience",
      "maximizes the utility of a single garment",
    ],
    benefits: [
      "reduces the need for excessive clothing items",
      "perfect for travel or minimalist wardrobes",
      "offers endless outfit possibilities with minimal pieces",
      "supports sustainable fashion practices by increasing garment longevity",
    ],
    glance: ["versatile", "creative", "fun", "transformative"],
  },
  {
    n: 2,
    slug: "instant-heat",
    filterKey: "instant-heat",
    title: "instant heat",
    intro:
      "instant heat represents an evolution from passive warmth to active heat generation in cold weather. it utilizes a new generation of smart textile heating technology, combining carbon nanotube, graphene, and fullerene technologies.",
    how: "this technology uses low-voltage current to achieve heating, making it more effective and safer than traditional conductive fiber methods that require high voltage. the heating module integrates with apparel to provide a comfortable, fashionable, and high-tech experience. users can activate the heat by connecting to a power bank via a USB connector. it operates at a safe low voltage of 5V (far below the human safety threshold of 36V). heat is distributed evenly via a heat sheet, controlled by a button sewn directly onto the garment.",
    features: [
      "warming control range: 38°C to 53°C",
      "four heat levels: 38°C (white), 44°C (green), 49°C (violet), 53°C (red)",
      "high precision thermostatic control with over-heated protection",
      "80% electricity-to-energy conversion",
      "extremely safe, non-wire heat transfer",
      "washable controller",
      "soft electric heating solution",
      "enhances health through far-infrared light (6–14μm)",
    ],
    benefits: [
      "superior technological and comfortable experience",
      "flexible application on various textiles",
      "highly effective and safe compared to conductive fiber",
      "user-friendly operation via USB power bank",
    ],
    glance: ["active heating", "smart technology", "safe", "washable"],
  },
  {
    n: 3,
    slug: "far-infrared",
    filterKey: "far-infrared",
    title: "far infrared",
    intro:
      "far infrared refers to rays of light that have wavelengths longer than those of visible light. traditionally utilized in healthcare practices, far-infrared fabrics are now being applied to help improve physical performance and enhance urban lifestyles.",
    how: "when far infrared is used over an extended period, it can improve blood vessel function. it has been shown to increase blood flow for up to 60 minutes, all while the skin temperature remains the same. studies have found that it increases oxygen levels in the body, which helps reduce fatigue.",
    features: [
      "promotes blood circulation",
      "increases oxygen levels in the blood",
      "helps soothe pain",
      "improves tissue and muscle regeneration",
    ],
    benefits: [
      "supports improved physical performance",
      "enhances urban lifestyles",
      "assists in reducing physical fatigue",
      "utilizes therapeutic light technology for daily wear",
    ],
    glance: ["therapeutic", "performance-enhancing", "revitalizing", "regenerative"],
  },
  {
    n: 4,
    slug: "coolmax",
    filterKey: "coolmax",
    title: "COOLMAX® freshFX™",
    intro:
      "COOLMAX® freshFX™ is a modified fiber that incorporates silver ions directly into the fiber structure to provide permanent antimicrobial and odor-control properties.",
    how: "the technology uses a durable, non-migratory silver-based additive spun directly into the yarn. these silver ions are released from an inorganic cage matrix through ion-exchange to interact with microbes, disrupting their cellular functions and inhibiting their growth. this process suppresses the bacteria that feed on sweat and body oil, preventing the generation of body odor.",
    features: [
      "permanent effect that survives repeated laundering",
      "actively suppresses growth of bacteria, fungi, and algae",
      "moisture-wicking properties for cooling and dryness",
      "dermatologically tested and safe for human contact",
      "compliant with international standards like EPA and OEKO-TEX®",
    ],
    benefits: [
      "keeps wearers cool, dry, and comfortable",
      "prevents buildup of sweat-related odors",
      "highly versatile for sportswear, socks, underwear, and medical applications",
      "maintains freshness for the life of the garment",
    ],
    glance: ["antimicrobial", "moisture-wicking", "odor-control", "durable"],
  },
  {
    n: 5,
    slug: "silver-ion",
    filterKey: "silver-ion",
    title: "silver ion",
    intro:
      "silver ion is a highly effective, natural agent proven safe for humans, animals, and plants, widely used in textiles to inhibit the growth of microorganisms.",
    how: "silver ions attack the DNA of microbes, weakening their biological structure and preventing them from reproducing. specifically, they bind to bacterial cell walls to block transport, enter the cell to block respiratory systems and energy production, and interact with DNA to stop replication.",
    features: [
      "inhibits bacterial growth by 99%",
      "protects against pathogens like E. coli, staph, mold, mildew, and fungus",
      "prevents formation of odors by eliminating bacteria",
      "blocks transmission of bacteria, viruses, and fungi",
    ],
    benefits: [
      "highly effective against Staphylococcus Aureus and Klebsiella Pneumonia",
      "neutralizes microbes before they can multiply",
      "ensures long-term hygiene in textiles",
    ],
    glance: ["antibacterial", "anti-fungal", "odor-neutralizing", "safe"],
  },
  {
    n: 6,
    slug: "anti-virus",
    filterKey: "anti-virus",
    title: "anti-virus",
    intro:
      "antiviral textiles are treated to kill viruses on the fabric surface or inhibit the formation of biofilms, reducing the risk of infection and re-infection.",
    how: "fabrics are treated with biocidal and viricidal agents that block or destroy microbes. one common method involves utilizing silver ion technology to create an environment where viruses cannot thrive.",
    features: [
      "kills viruses on contact",
      "inhibits formation of biofilms",
      "contributes to reduced environmental pollution through reusability",
      "protects users from harmful microbes",
    ],
    benefits: [
      "enhanced personal protection against illness",
      "sustainable solution due to reusability",
      "provides a barrier against microbial threats",
    ],
    glance: ["viricidal", "protective", "sustainable", "hygienic"],
  },
  {
    n: 7,
    slug: "anti-odor",
    filterKey: "anti-odor",
    title: "anti-odor",
    intro:
      "anti-odor technology refers to fabrics treated or infused with antimicrobial compounds to capture, block, or kill odor-causing bacteria found on human skin.",
    how: "bacteria and fungus thrive in humid environments, particularly on textiles holding moisture and heat near the skin. anti-odor technology neutralizes these bacteria before they interact with sweat, preventing the chemical reaction that causes body odor.",
    features: [
      "inhibits growth of bacteria and fungus",
      "neutralizes odor at the source",
      "safe for human skin",
      "environmentally-friendly formulations",
    ],
    benefits: [
      "reduces significant body odor",
      "maintains high-performance protection during wear",
      "safe, comfortable, and hygienic daily use",
    ],
    glance: ["antimicrobial", "odor-preventing", "skin-safe", "high-performance"],
  },
  {
    n: 8,
    slug: "anti-static",
    filterKey: "anti-static",
    title: "anti-static",
    intro:
      "anti-static clothing is designed to prevent the generation of static charges and dissipate them safely into the environment.",
    how: "garments are typically made from polyester or cotton and embedded with a line of carbon. these conductive fibers create a faraday cage around the wearer's body, effectively preventing static buildup.",
    features: [
      "prevents static discharge",
      "dissipates energy into the environment",
      "protects sensitive objects and electrical components",
    ],
    benefits: [
      "increased safety in static-sensitive environments",
      "prevents uncomfortable static shocks",
      "improves safety for handling electronics",
    ],
    glance: ["static-preventing", "conductive", "protective", "safe"],
  },
  {
    n: 9,
    slug: "quick-dry",
    filterKey: "quick-dry",
    title: "quick dry",
    intro:
      "quick dry fabric, also known as moisture-wicking, is engineered to keep wearers feeling fresh by regulating body temperature and reducing sweat visibility.",
    how: "fabrics are designed to absorb sweat from the body and push it toward the outer surface of the garment, facilitating rapid evaporation. this is achieved through special yarn construction or high-tech chemical applications.",
    features: [
      "rapid moisture wicking",
      "highly breathable",
      "reduces visibility of sweat patches",
      "helps reduce odors and skin irritation",
    ],
    benefits: [
      "maintains comfort in extreme weather or strenuous activity",
      "helps regulate body temperature",
      "ideal for athletes and travelers",
    ],
    glance: ["sweat-wicking", "breathable", "temperature-regulating", "fresh"],
  },
  {
    n: 10,
    slug: "breathable",
    filterKey: "breathable",
    title: "breathable",
    intro:
      "breathable fabrics facilitate the evaporation of moisture from the skin into the air, promoting airflow and cooling.",
    how: "breathability is measured by the moisture vapor transmission rate. fabrics achieve this either through natural fiber properties — like cotton, linen, and bamboo — or through specific weave structures in synthetic materials that create pathways for airflow.",
    features: [
      "promotes air circulation",
      "wicks away perspiration",
      "available in both natural fibers and high-tech synthetics like COOLMAX®",
      "facilitates rapid moisture evaporation",
    ],
    benefits: [
      "keeps the body cool",
      "enhances the feeling of freshness",
      "ideal for clothing and bedding",
    ],
    glance: ["airflow", "moisture-transmitting", "fresh", "cooling"],
  },
  {
    n: 11,
    slug: "adhesive",
    filterKey: "adhesive",
    title: "adhesive soft fabric",
    intro:
      "adhesive soft fabric is a novel technology for temporary fasteners that provides a soft, silent, and strong bonding mechanism.",
    how: "this technology replaces traditional plastic hook-and-loop mechanisms with fabric. it utilizes micro-fibers that tangle into even-finer loops at an extremely high density, allowing the fabric to adhere to itself immediately upon contact via frictional force.",
    features: [
      "soft, fleece-like texture",
      "silent operation (produces no sound)",
      "lightweight and durable construction",
      "dries quickly",
    ],
    benefits: [
      "provides freedom in garment design",
      "gentle and soft on the skin",
      "secure bonding that does not pull apart easily",
    ],
    glance: ["silent", "strong", "soft", "lightweight"],
  },
  {
    n: 12,
    slug: "lightfresh",
    filterKey: "self-cleaning",
    title: "self cleaning light FRESH®",
    intro:
      "self cleaning light FRESH® is a patented, award-winning nano-coating technology that decomposes bacteria, viruses, stains, and odors under exposure to daylight or indoor light.",
    how: "this active green technology is based on photocatalysis. when applied to textile surfaces, the nano-coating acts as an agent to break down harmful organic materials, dirt, and stains like coffee or red wine when activated by light.",
    features: [
      "effective anti-bacterial and anti-viral performance",
      "decomposes stains, odors, and harmful substances like formaldehyde and VOCs",
      "durable performance (tested up to 20 washes)",
      "safe, non-toxic, and eco-friendly",
    ],
    benefits: [
      "maintains garment hygiene through self-cleaning",
      "provides deodorization and stain removal",
      "long-lasting effectiveness",
    ],
    glance: ["self-cleaning", "eco-friendly", "sanitizing", "stain-resistant"],
  },
  {
    n: 13,
    slug: "silvalight",
    filterKey: "silvalight",
    title: "silvaLIGHT®",
    intro:
      "silvaLIGHT® is a patented technology that applies a nanoscale thin, transparent layer to textiles to provide anti-bacterial, anti-viral, and anti-odor functionality.",
    how: "the surface acts as a catalyst for a process called photocatalysis. when exposed to sunlight, the layer breaks down viruses, bacteria, odor-causing compounds (like formaldehyde/TVOCs), and color stains (such as coffee).",
    features: [
      "anti-bacterial and anti-viral properties",
      "eliminates up to 99.73% of coronavirus in 10 minutes (MRI test)",
      "removes stains and odors",
      "safe and environmentally friendly",
    ],
    benefits: [
      "high level of hygiene through active breakdown of pathogens",
      "self-cleaning properties for odors and stains",
      "effective viral protection",
    ],
    glance: ["photocatalytic", "anti-viral", "self-cleaning", "safe"],
  },
  {
    n: 14,
    slug: "water-repellent",
    filterKey: "water-repellent",
    title: "water repellent",
    intro:
      "water repellent materials are constructed or treated with a finish to resist the penetration of water, though they are not fully impervious.",
    how: "this is achieved by tightly weaving the fabric or applying a water-repellent film or nano-coating to the surface, which prevents water from easily soaking through.",
    features: [
      "resistance to water penetration",
      "surface coating technology",
      "constructed for protection against light moisture",
    ],
    benefits: [
      "protects the wearer from light rain or splashes",
      "durable surface finish",
      "maintains comfort in damp conditions",
    ],
    glance: ["water-resistant", "coated", "protective"],
  },
  {
    n: 15,
    slug: "uv-resistant",
    filterKey: "uv-resistant",
    title: "UV resistant",
    intro:
      "UV resistance refers to a material's ability to block ultraviolet (UV) light, protecting the wearer from sunlight.",
    how: "protection is achieved through dense weaving, dark dyeing, or by impregnating the fabric with UV-absorbing pigments like titanium oxide or black carbon. minerals such as zinc and titanium can also be woven directly into the fabric to reflect UV rays.",
    features: [
      "provides effective UV protection",
      "available in UPF 50 ratings (blocking 98% of UV rays)",
      "reflects or absorbs radiation",
    ],
    benefits: [
      "reduces skin exposure to harmful UV light",
      "prevents sun damage during outdoor activities",
      "functions similarly to high-SPF sunscreen",
    ],
    glance: ["protective", "blocking", "sun-safe", "durable"],
  },
  {
    n: 16,
    slug: "recycled",
    filterKey: "recycle",
    title: "recycled materials",
    intro:
      "recycled materials are substances that have completed their intended life cycle and are reprocessed to be used in new products, preventing them from becoming solid waste.",
    how: "discarded materials, such as plastic waste, coffee waste, bamboo, or pineapple fibers, are collected and reprocessed into new fibers and yarns for textile production. because the material may degrade during initial use, it is converted into new, functional purposes.",
    features: [
      "reduces fashion and solid waste",
      "promotes sustainability",
      "diverse sources including plastic, coffee, and agricultural by-products",
    ],
    benefits: [
      "supports circular economy",
      "environmentally responsible fashion choice",
      "reduces reliance on virgin materials",
    ],
    glance: ["sustainable", "reprocessed", "eco-friendly"],
  },
  {
    n: 17,
    slug: "bluesign",
    filterKey: "bluesign",
    title: "bluesign® APPROVED",
    intro:
      "bluesign® approved products utilize materials and chemicals that have been verified to be produced in a resource-conserving way, minimizing impact on both people and the environment.",
    how: "founded in Switzerland in 2000, bluesign partners with brands, manufacturers, and chemical suppliers to oversee the entire production process from fiber to finished product, ensuring rigorous sustainability and safety standards.",
    features: [
      "responsible use of resources",
      "highest level of consumer safety",
      "reduced impact on people and the environment",
    ],
    benefits: [
      "supports sustainable manufacturing practices",
      "ensures high safety standards for the end consumer",
      "promotes environmentally conscious fashion",
    ],
    glance: ["sustainable", "responsible", "safe", "resource-conserving"],
  },
  {
    n: 18,
    slug: "oeko-tex",
    filterKey: "oeko-tex",
    title: "OEKO-TEX® STANDARD 100",
    intro:
      "OEKO-TEX® STANDARD 100 is a globally recognized label for textiles that have been rigorously tested for harmful substances, ensuring product safety and consumer confidence.",
    how: "the certification process is conducted by independent partner institutes. it involves testing for a wide range of regulated and non-regulated substances that could potentially be harmful to human health.",
    features: [
      "tested for harmful substances and chemicals",
      "ensures high product safety standards",
      "recognized international testing and certification framework",
    ],
    benefits: [
      "provides peace of mind to consumers",
      "confirms material safety for human health",
      "validates compliance with safety regulations",
    ],
    glance: ["safe", "certified", "tested", "reliable"],
  },
  {
    n: 19,
    slug: "super-soft",
    filterKey: "super-soft",
    title: "super soft",
    intro:
      "super soft materials are characterized by a pleasant, luxurious hand feel, ensuring maximum comfort when in contact with the skin.",
    how: "the softness is typically achieved by using extremely fine fibers or specialized yarn structures that result in a smooth, gentle surface texture.",
    features: [
      "luxurious, soft touch",
      "extremely comfortable against the skin",
      "high-quality fiber/yarn construction",
    ],
    benefits: [
      "enhances garment comfort",
      "provides a high-end, premium feel",
      "ideal for sensitive skin",
    ],
    glance: ["soft", "luxurious", "comfortable", "fine-fiber"],
  },
  {
    n: 20,
    slug: "stretch",
    filterKey: "stretch",
    title: "stretch",
    intro:
      "stretch materials provide flexibility and freedom of movement, making them highly comfortable for various physical activities.",
    how: "stretchability is achieved by incorporating elastane into the fiber blend or by utilizing specific weaving techniques that create mechanical stretch in the fabric.",
    features: [
      "high flexibility and expandability",
      "enhanced comfort due to ease of movement",
      "mechanical or fiber-based stretch options",
    ],
    benefits: [
      "provides more room and comfort for the wearer",
      "facilitates unrestricted physical movement",
      "versatile for various garment styles",
    ],
    glance: ["flexible", "comfortable", "expandable", "mobile"],
  },
  {
    n: 21,
    slug: "natural",
    filterKey: "natural",
    title: "natural",
    intro:
      "natural materials are products or physical matter derived from plants, animals, or the earth, including stones, minerals, and metals, which are not man-made.",
    how: "natural fibers are biodegradable, meaning they can be broken down by bacteria and return to nature without leaving harmful particles. they are renewable resources, essential for sustainable living.",
    features: [
      "sustainable and renewable",
      "typically breathable and moisture-wicking",
      "soft and pleasant natural touch",
      "biodegradable",
    ],
    benefits: [
      "environmentally friendly disposal",
      "comfortable for daily wear",
      "contributes to sustainable lifestyle",
    ],
    glance: ["sustainable", "breathable", "biodegradable", "natural"],
  },
  {
    n: 22,
    slug: "vegan",
    filterKey: "vegan",
    title: "vegan",
    intro:
      "vegan refers to materials, products, or garments that are produced entirely without the use of animal-derived ingredients or components, ensuring a cruelty-free and compassionate choice.",
    how: "vegan products substitute animal fibers — such as wool, silk, leather, or down — with high-quality plant-based or synthetic alternatives, including organic cotton, linen, hemp, bamboo, or advanced recycled materials.",
    features: [
      "100% cruelty-free and animal-friendly",
      "utilizes sustainable plant-based or innovative synthetic fibers",
      "ethical alternative to traditional animal-based fabrics",
      "often promotes environmentally conscious manufacturing",
    ],
    benefits: [
      "aligns with compassionate and ethical lifestyle choices",
      "supports the movement toward more sustainable material sourcing",
      "offers a wide variety of textures, from organic cotton softness to modern, durable synthetics",
      "contributes to a lower environmental footprint when using plant-based, renewable resources",
    ],
    glance: ["cruelty-free", "ethical", "sustainable", "compassionate"],
  },
  {
    n: 23,
    slug: "wind-resistant",
    filterKey: "wind-resistance",
    title: "wind resistant",
    intro:
      "wind resistant refers to a material or design engineered to resist the penetration of wind, effectively blocking airflow to keep the wearer warm and protected from cold drafts.",
    how: "wind resistant materials often use tightly woven fabrics, specialized membranes, or coatings that create a barrier, preventing wind from passing through while typically allowing internal moisture to escape.",
    features: [
      "resistance to cold air penetration",
      "enhanced thermal retention",
      "protective barrier against harsh weather",
      "typically lightweight and functional",
    ],
    benefits: [
      "keeps the wearer warm by preventing wind-chill",
      "ideal for outdoor activities in windy or elevated environments",
      "provides a comfortable microclimate inside the garment",
      "often combined with water-resistant properties for versatile protection",
    ],
    glance: ["protective", "thermal efficiency", "weather-resistant", "highly functional"],
  },
  {
    n: 24,
    slug: "wrinkle-resistant",
    filterKey: "wrinkle-resistant",
    title: "wrinkle resistant",
    intro:
      "wrinkle resistant refers to fabrics or garments treated or engineered to maintain their shape and smooth appearance, actively resisting the formation of creases or folds during wear and laundering.",
    how: "wrinkle resistance is achieved through specific fiber blends (such as polyester or treated cotton) or chemical finishing processes that help the fibers recover their original structure after being bent or compressed.",
    features: [
      "retains a polished, smooth appearance",
      "minimizes the need for ironing or steaming",
      "maintains shape integrity throughout the day",
      "durable resistance to creasing",
    ],
    benefits: [
      "saves time on garment care and maintenance",
      "ideal for travel and professional environments",
      "provides a consistently neat and structured look",
      "reduces wear and tear caused by frequent ironing",
    ],
    glance: ["low-maintenance", "polished", "shape-retaining", "convenient"],
  },
];
