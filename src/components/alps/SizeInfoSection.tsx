import { useSizeInfo, closeSizeInfo, type SizeKind } from "@/lib/size-info-store";
import { X } from "lucide-react";
import bgSlats from "@/assets/backgrounds/bg-slats.jpg.asset.json";

type Chart = { title: string; headers: string[]; rows: { label: string; values: string[] }[] };

const CHARTS: Record<SizeKind, Chart> = {
  kids: {
    title: "kid's measurement chart",
    headers: ["age 2-4", "age 5-7", "age 8-10", "age 11-13"],
    rows: [
      { label: "height", values: ["95-105 cm", "105-120 cm", "120-135 cm", "135-150 cm"] },
      { label: "bust", values: ["50-58 cm", "56-64 cm", "62-70 cm", "68-76 cm"] },
      { label: "waist", values: ["50-55 cm", "55-60 cm", "60-65 cm", "65-70 cm"] },
      { label: "hip", values: ["58-64 cm", "64-70 cm", "70-76 cm", "76-82 cm"] },
    ],
  },
  men: {
    title: "men's measurement chart",
    headers: ["size 0 · XS", "size 1 · S", "size 2 · M", "size 3 · L"],
    rows: [
      { label: "height", values: ["160-170 cm", "165-175 cm", "170-180 cm", "175-185 cm"] },
      { label: "bust", values: ["86-94 cm", "94-102 cm", "102-110 cm", "110-118 cm"] },
      { label: "waist", values: ["76-82 cm", "82-88 cm", "88-94 cm", "94-100 cm"] },
      { label: "hip", values: ["84-90 cm", "88-94 cm", "92-98 cm", "96-102 cm"] },
    ],
  },
  women: {
    title: "women's measurement chart",
    headers: ["size 0 · XS", "size 1 · S", "size 2 · M", "size 3 · L"],
    rows: [
      { label: "height", values: ["155-165 cm", "160-170 cm", "165-175 cm", "170-180 cm"] },
      { label: "bust", values: ["80-86 cm", "86-92 cm", "92-98 cm", "98-104 cm"] },
      { label: "waist", values: ["60-66 cm", "66-72 cm", "72-78 cm", "78-84 cm"] },
      { label: "hip", values: ["82-88 cm", "88-94 cm", "94-100 cm", "100-106 cm"] },
    ],
  },
  unisex: {
    title: "unisex measurement chart",
    headers: ["size 0 · XS", "size 1 · S", "size 2 · M", "size 3 · L"],
    rows: [
      { label: "height", values: ["150-160 cm", "160-170 cm", "170-180 cm", "180-190 cm"] },
      { label: "bust", values: ["80-90 cm", "90-100 cm", "100-110 cm", "110-120 cm"] },
      { label: "waist", values: ["60-70 cm", "70-80 cm", "80-90 cm", "90-100 cm"] },
      { label: "hip", values: ["80-90 cm", "85-95 cm", "95-105 cm", "100-110 cm"] },
    ],
  },
};

export function SizeInfoSection() {
  const active = useSizeInfo();
  if (!active) return null;
  const chart = CHARTS[active];

  return (
    <section
      className="relative w-full min-h-[560px] flex items-center justify-center px-6 py-16"
      style={{
        backgroundImage: `url(${bgSlats.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 w-full max-w-3xl bg-background shadow-2xl">
        <div className="relative bg-primary text-primary-foreground text-center py-3 px-6">
          <p className="text-sm md:text-base tracking-[0.15em]">{chart.title}</p>
          <button
            aria-label="close"
            onClick={closeSizeInfo}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 md:p-10 overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-3 pr-4 font-semibold uppercase tracking-wide">measure (cm)</th>
                {chart.headers.map((h) => (
                  <th key={h} className="py-3 px-3 font-medium text-foreground/80 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((r) => (
                <tr key={r.label} className="border-t border-border">
                  <td className="py-3 pr-4 uppercase tracking-wide font-medium">{r.label}</td>
                  {r.values.map((v, i) => (
                    <td key={i} className="py-3 px-3 text-foreground/80 whitespace-nowrap">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
