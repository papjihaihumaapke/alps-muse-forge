type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Fabric = () => (
  <path d="M10 46 H54" {...stroke} />
);

const SilverIon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="28" r="6" {...stroke} />
    <ellipse cx="32" cy="28" rx="18" ry="7" {...stroke} />
    <ellipse cx="32" cy="28" rx="18" ry="7" transform="rotate(60 32 28)" {...stroke} />
    <ellipse cx="32" cy="28" rx="18" ry="7" transform="rotate(120 32 28)" {...stroke} />
  </svg>
);

const AntiBacteria = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="30" r="11" {...stroke} />
    <g {...stroke}>
      <path d="M32 19 V14" /><path d="M32 41 V46" />
      <path d="M21 30 H16" /><path d="M43 30 H48" />
      <path d="M24 22 L20 18" /><path d="M40 38 L44 42" />
      <path d="M40 22 L44 18" /><path d="M24 38 L20 42" />
    </g>
    <path d="M14 14 L50 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const AntiOdor = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <path d="M22 22 c2 -4 2 -8 0 -12" {...stroke} />
    <path d="M32 22 c2 -4 2 -8 0 -12" {...stroke} />
    <path d="M42 22 c2 -4 2 -8 0 -12" {...stroke} />
    <Fabric />
    <path d="M14 36 H50 V44 H14 Z" {...stroke} />
    <path d="M18 40 H20 M24 40 H26 M30 40 H32 M36 40 H38 M42 40 H44" {...stroke} />
  </svg>
);

const AntiStatic = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <path d="M34 12 L24 30 H32 L28 44" {...stroke} />
    <path d="M14 36 H50 V44 H14 Z" {...stroke} />
    <path d="M18 40 H20 M24 40 H26 M36 40 H38 M42 40 H44" {...stroke} />
  </svg>
);

const SpfUV = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="22" r="6" {...stroke} />
    <g {...stroke}>
      <path d="M32 10 V6" /><path d="M32 38 V34" />
      <path d="M20 22 H16" /><path d="M48 22 H44" />
      <path d="M24 14 L21 11" /><path d="M40 30 L43 33" />
      <path d="M40 14 L43 11" /><path d="M24 30 L21 33" />
    </g>
    <path d="M14 40 H50 V48 H14 Z" {...stroke} />
    <path d="M18 44 H20 M24 44 H26 M30 44 H32 M36 44 H38 M42 44 H44" {...stroke} />
  </svg>
);

const SelfCleaning = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <circle cx="26" cy="32" r="6" {...stroke} />
    <g {...stroke}>
      <path d="M26 22 V18" /><path d="M26 42 V46" />
      <path d="M16 32 H12" /><path d="M36 32 H40" />
    </g>
    <path d="M44 24 a10 10 0 1 1 -2 16" {...stroke} />
    <path d="M44 18 V26 H36" {...stroke} />
    <circle cx="52" cy="32" r="2.5" fill="currentColor" />
  </svg>
);

const InstantHeat = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <path d="M22 22 c2 -4 2 -8 0 -12" {...stroke} />
    <path d="M32 22 c2 -4 2 -8 0 -12" {...stroke} />
    <path d="M42 22 c2 -4 2 -8 0 -12" {...stroke} />
    <path d="M12 44 L32 28 L52 44 Z" {...stroke} />
  </svg>
);

const FarInfrared = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <path d="M20 32 q4 -10 8 0 t8 0 t8 0 t8 0" {...stroke} />
    <path d="M16 22 V42" {...stroke} />
    <path d="M12 22 V42" {...stroke} />
  </svg>
);

const Breathable = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <path d="M22 22 c2 -4 2 -8 0 -12" {...stroke} />
    <path d="M32 22 c2 -4 2 -8 0 -12" {...stroke} />
    <path d="M42 22 c2 -4 2 -8 0 -12" {...stroke} />
    <path d="M14 36 H50 V44 H14 Z" {...stroke} />
    <path d="M18 40 H20 M24 40 H26 M30 40 H32 M36 40 H38 M42 40 H44" {...stroke} />
  </svg>
);

const QuickDry = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <path d="M26 12 C20 22 16 28 16 34 a10 10 0 0 0 20 0 c0 -6 -4 -12 -10 -22 Z" {...stroke} />
    <circle cx="42" cy="40" r="9" {...stroke} />
    <path d="M42 35 V40 L46 43" {...stroke} />
  </svg>
);

const WaterRepellent = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <path d="M32 10 C24 22 20 28 20 34 a12 12 0 0 0 24 0 c0 -6 -4 -12 -12 -24 Z" {...stroke} />
    <path d="M12 48 H52 V56 H12 Z" {...stroke} />
    <path d="M16 52 H18 M22 52 H24 M30 52 H32 M38 52 H40 M46 52 H48" {...stroke} />
  </svg>
);

const SelfAdhesive = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className}>
    <path d="M14 18 H50 V26 H14 Z" {...stroke} />
    <path d="M14 38 H50 V46 H14 Z" {...stroke} />
    <path d="M32 28 V36" {...stroke} />
    <path d="M28 32 L32 28 L36 32" {...stroke} />
    <path d="M28 34 L32 38 L36 34" {...stroke} />
  </svg>
);

type Feature = {
  label: string;
  Icon: (p: IconProps) => React.ReactElement;
  bg: string;
};

const features: Feature[] = [
  { label: "Silver Ion – Kills 99% bacteria", Icon: SilverIon, bg: "bg-neutral-900" },
  { label: "Anti-bacteria", Icon: AntiBacteria, bg: "bg-[#0b1428]" },
  { label: "Anti-odor", Icon: AntiOdor, bg: "bg-[#c97a6a]" },
  { label: "Anti-static", Icon: AntiStatic, bg: "bg-neutral-900" },
  { label: "SPF UV 50+", Icon: SpfUV, bg: "bg-[#6f7e8c]" },
  { label: "Light induced self-cleaning", Icon: SelfCleaning, bg: "bg-[#c8511c]" },
  { label: "Instant heat", Icon: InstantHeat, bg: "bg-[#d94a1f]" },
  { label: "Far infrared light", Icon: FarInfrared, bg: "bg-neutral-900" },
  { label: "Breathable", Icon: Breathable, bg: "bg-[#a32540]" },
  { label: "Quick dry", Icon: QuickDry, bg: "bg-neutral-700" },
  { label: "Water repellent", Icon: WaterRepellent, bg: "bg-[#d8d2c4]" },
  { label: "Permanent soft fabric self adhesive", Icon: SelfAdhesive, bg: "bg-[#b91c1c]" },
];

export function FabricTechnology() {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Textile Science</p>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight">Engineered fabric technology</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
        {features.map(({ label, Icon, bg }) => {
          const isLight = bg.includes("#d8d2c4");
          return (
            <div key={label} className="flex flex-col">
              <p className="text-sm leading-snug mb-3 min-h-[2.5rem]">{label}</p>
              <div className="border-t border-border pt-3">
                <div className={`w-full aspect-square ${bg} flex items-center justify-center`}>
                  <Icon className={`w-1/2 h-1/2 ${isLight ? "text-neutral-800" : "text-white"}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
