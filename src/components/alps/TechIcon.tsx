// Clean white line-icons for fabric technology features.
// All icons share a common stroke style (1.5 stroke, round caps/joins, no fill).

type Props = { feature: string; className?: string };

const COMMON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" {...COMMON} aria-hidden="true">
      {children}
    </svg>
  );
}

export function TechIcon({ feature, className }: Props) {
  return (
    <span className={className} style={{ color: "white", display: "inline-block" }}>
      {renderIcon(feature)}
    </span>
  );
}

function renderIcon(k: string) {
  switch (k) {
    case "multi-style":
      return (
        <Wrap>
          {/* layered garments */}
          <path d="M16 22l8-6h4l4 4 4-4h4l8 6-4 6h-4v18H24V28h-4z" />
          <path d="M28 16c0 2.5 1.8 4 4 4s4-1.5 4-4" />
        </Wrap>
      );
    case "instant-heat":
      return (
        <Wrap>
          {/* flame */}
          <path d="M32 8c2 6 8 9 8 16a8 8 0 11-16 0c0-3 1.5-5 3-7 0 3 1.5 5 3 5 0-6-2-9 2-14z" />
        </Wrap>
      );
    case "far-infrared":
      return (
        <Wrap>
          {/* sun-rays */}
          <circle cx="32" cy="32" r="8" />
          <path d="M32 12v6M32 46v6M12 32h6M46 32h6M18 18l4 4M42 42l4 4M46 18l-4 4M22 42l-4 4" />
        </Wrap>
      );
    case "coolmax":
      return (
        <Wrap>
          {/* snowflake */}
          <path d="M32 8v48M14 18l36 28M14 46l36-28" />
          <path d="M32 14l-4 4M32 14l4 4M32 50l-4-4M32 50l4-4" />
        </Wrap>
      );
    case "silver-ion":
    case "silvalight":
      return (
        <Wrap>
          {/* atom */}
          <circle cx="32" cy="32" r="3" />
          <ellipse cx="32" cy="32" rx="20" ry="8" />
          <ellipse cx="32" cy="32" rx="20" ry="8" transform="rotate(60 32 32)" />
          <ellipse cx="32" cy="32" rx="20" ry="8" transform="rotate(120 32 32)" />
        </Wrap>
      );
    case "anti-virus":
      return (
        <Wrap>
          {/* virus with slash */}
          <circle cx="32" cy="32" r="10" />
          <path d="M32 18v-4M32 50v-4M18 32h-4M50 32h-4M22 22l-3-3M45 45l3 3M22 42l-3 3M45 19l3-3" />
          <path d="M14 50L50 14" />
        </Wrap>
      );
    case "anti-odor":
      return (
        <Wrap>
          {/* wave + slash */}
          <path d="M12 28c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
          <path d="M12 40c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
          <path d="M14 50L50 14" />
        </Wrap>
      );
    case "anti-static":
      return (
        <Wrap>
          {/* lightning + slash */}
          <path d="M34 8L18 36h12l-4 20 20-30H34l4-18z" />
          <path d="M14 50L50 14" />
        </Wrap>
      );
    case "quick-dry":
      return (
        <Wrap>
          {/* drop with arrows */}
          <path d="M32 12c-6 8-10 13-10 19a10 10 0 0020 0c0-6-4-11-10-19z" />
          <path d="M14 50h36M18 54l-4-4 4-4M46 54l4-4-4-4" />
        </Wrap>
      );
    case "breathable":
      return (
        <Wrap>
          {/* lungs / airflow */}
          <path d="M16 20c8 0 8 8 8 14s-2 14-8 14-6-10-6-16 2-12 6-12z" />
          <path d="M48 20c-8 0-8 8-8 14s2 14 8 14 6-10 6-16-2-12-6-12z" />
          <path d="M32 14v28" />
        </Wrap>
      );
    case "adhesive":
      return (
        <Wrap>
          {/* two overlapping rectangles */}
          <rect x="10" y="20" width="28" height="14" rx="2" />
          <rect x="26" y="30" width="28" height="14" rx="2" />
        </Wrap>
      );
    case "self-cleaning":
      return (
        <Wrap>
          {/* sparkle drop */}
          <path d="M32 14c-5 7-8 11-8 16a8 8 0 0016 0c0-5-3-9-8-16z" />
          <path d="M46 18l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
        </Wrap>
      );
    case "water-repellent":
      return (
        <Wrap>
          {/* drop with shield/slash */}
          <path d="M32 10c-7 10-12 16-12 22a12 12 0 0024 0c0-6-5-12-12-22z" />
          <path d="M14 50L50 14" />
        </Wrap>
      );
    case "uv-resistant":
      return (
        <Wrap>
          {/* sun + shield */}
          <circle cx="32" cy="26" r="6" />
          <path d="M32 12v4M32 36v4M18 26h4M42 26h-4M22 16l3 3M42 36l-3-3M22 36l3-3M42 16l-3 3" />
          <path d="M20 46l12-4 12 4v4c0 4-5 8-12 10-7-2-12-6-12-10v-4z" />
        </Wrap>
      );
    case "recycle":
      return (
        <Wrap>
          {/* recycle triangle arrows */}
          <path d="M32 12l8 14h-6l-6-10M48 36l-2 16-12-8M16 36l10 14 4-12" />
          <path d="M40 26l-2-2M30 16l4-4M34 50l-2-2M44 42l2 2M26 50l-4-2M20 38l-4-2" />
        </Wrap>
      );
    case "bluesign":
      return (
        <Wrap>
          {/* checkmark in circle */}
          <circle cx="32" cy="32" r="20" />
          <path d="M22 32l8 8 14-16" />
        </Wrap>
      );
    case "oeko-tex":
      return (
        <Wrap>
          {/* shield with check */}
          <path d="M16 16l16-6 16 6v18c0 10-8 16-16 20-8-4-16-10-16-20V16z" />
          <path d="M24 32l6 6 10-12" />
        </Wrap>
      );
    case "super-soft":
      return (
        <Wrap>
          {/* cloud */}
          <path d="M20 40a8 8 0 010-16 10 10 0 0119-4 8 8 0 015 14H20z" />
        </Wrap>
      );
    case "stretch":
      return (
        <Wrap>
          {/* horizontal stretch arrows */}
          <path d="M10 32h44" />
          <path d="M16 26l-6 6 6 6M48 26l6 6-6 6" />
          <path d="M22 18c4 4 16 4 20 0M22 46c4-4 16-4 20 0" />
        </Wrap>
      );
    case "natural":
      return (
        <Wrap>
          {/* leaf */}
          <path d="M14 50c0-20 16-36 36-36 0 20-16 36-36 36z" />
          <path d="M20 44L46 18" />
        </Wrap>
      );
    case "vegan":
      return (
        <Wrap>
          {/* leaf + V */}
          <path d="M14 50c0-20 16-36 36-36 0 20-16 36-36 36z" />
          <path d="M22 26l6 12 6-12" />
        </Wrap>
      );
    default:
      return (
        <Wrap>
          <circle cx="32" cy="32" r="14" />
        </Wrap>
      );
  }
}
