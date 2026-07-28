import { useState } from "react";
import { Ruler } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import bgSlats from "@/assets/backgrounds/bg-slats.jpg.asset.json";

export type SizeChartKind = "kids" | "men" | "women" | "unisex";

type Row = { label: string; values: string[] };
type Chart = {
  title: string;
  headers: string[];
  rows: Row[];
};

const CHARTS: Record<SizeChartKind, Chart> = {
  kids: {
    title: "kid's measurement chart",
    headers: ["age 2-4", "age 5-7", "age 8-10", "age 11-13"],
    rows: [
      { label: "height", values: ["100-115 cm", "110-125 cm", "120-135 cm", "130-145 cm"] },
      { label: "bust", values: ["50-56 cm", "56-62 cm", "62-68 cm", "68-74 cm"] },
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

/** Infer which chart(s) to show from product tags/category. */
export function inferSizeChartKinds(tags: string[] = [], category = ""): SizeChartKind[] {
  const t = new Set(tags.map((x) => x.toLowerCase()));
  const out: SizeChartKind[] = [];
  if (t.has("kids")) out.push("kids");
  if (t.has("men")) out.push("men");
  if (t.has("women")) out.push("women");
  if (t.has("unisex")) out.push("unisex");
  if (out.length === 0) {
    const c = category.toLowerCase();
    if (c === "personal-care" || c.startsWith("vegan-") || c === "accessories") return [];
    out.push("unisex");
  }
  return out;
}

function ChartPanel({ chart }: { chart: Chart }) {
  return (
    <div className="w-full max-w-3xl bg-background shadow-2xl">
      <div className="bg-primary text-primary-foreground text-center py-3 px-6">
        <p className="text-sm md:text-base tracking-[0.15em]">{chart.title}</p>
      </div>
      <div className="p-6 md:p-8 overflow-x-auto">
        <table className="w-full text-xs md:text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-3 pr-4 font-semibold uppercase tracking-wide text-foreground">
                measure (cm)
              </th>
              {chart.headers.map((h) => (
                <th key={h} className="py-3 px-3 font-medium text-foreground/80 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((r) => (
              <tr key={r.label} className="border-t border-border">
                <td className="py-3 pr-4 uppercase tracking-wide font-medium text-foreground">
                  {r.label}
                </td>
                {r.values.map((v, i) => (
                  <td key={i} className="py-3 px-3 text-foreground/80 whitespace-nowrap">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SizeChartDialog({ kinds }: { kinds: SizeChartKind[] }) {
  const [active, setActive] = useState<SizeChartKind | null>(null);
  if (kinds.length === 0) return null;

  return (
    <Dialog onOpenChange={(o) => !o && setActive(null)}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={() => setActive(kinds[0])}
          className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-primary hover:underline underline-offset-4"
        >
          <Ruler className="h-3.5 w-3.5" />
          view size & measurement chart
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-5xl w-[96vw] p-0 border-0 bg-transparent shadow-none max-h-[92vh] overflow-y-auto"
      >
        <div
          className="relative w-full min-h-[70vh] flex flex-col items-center justify-center p-6 md:p-10"
          style={{
            backgroundImage: `url(${bgSlats.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div aria-hidden className="absolute inset-0 bg-black/25" />
          <div className="relative z-10 w-full flex flex-col items-center gap-6">
            {/* Category picker */}
            <div className="flex flex-wrap justify-center gap-2">
              {(["kids", "men", "women", "unisex"] as SizeChartKind[])
                .filter((k) => kinds.includes(k))
                .map((k) => (
                  <button
                    key={k}
                    onClick={() => setActive(k)}
                    className={`px-4 py-2 text-[11px] tracking-[0.25em] uppercase transition ${
                      active === k
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/90 text-foreground hover:bg-background"
                    }`}
                  >
                    {k}
                  </button>
                ))}
            </div>

            {active && <ChartPanel chart={CHARTS[active]} />}

            <p className="text-[11px] text-white/85 max-w-2xl text-center leading-relaxed">
              measurements are approximate body measurements — not garment dimensions.
              for a personal fitting consultation, please contact us.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Standalone size-info section — used on pages where the visitor should pick
 * a category (kids/men/women/unisex) and see the corresponding chart inline.
 */
export function SizeChartPicker() {
  const [active, setActive] = useState<SizeChartKind>("kids");
  return (
    <section
      className="relative w-full py-16 px-6"
      style={{
        backgroundImage: `url(${bgSlats.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-2">
          {(["kids", "men", "women", "unisex"] as SizeChartKind[]).map((k) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`px-5 py-2 text-[11px] tracking-[0.25em] uppercase transition ${
                active === k
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/90 text-foreground hover:bg-background"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <ChartPanel chart={CHARTS[active]} />
      </div>
    </section>
  );
}
