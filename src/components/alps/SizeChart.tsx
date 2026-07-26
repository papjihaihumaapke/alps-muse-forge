import { useState } from "react";
import { Ruler } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type SizeChartKind = "kids" | "men" | "women" | "unisex";

type Row = { label: string; values: string[] };
type Chart = {
  title: string;
  headers: string[];
  rows: Row[];
  note?: string;
};

const CHARTS: Record<SizeChartKind, Chart> = {
  kids: {
    title: "kids — measurement (cm)",
    headers: [
      "size 110 · age 2-4",
      "size 120 · age 5-7",
      "size 130 · age 8-10",
      "size 140 · age 11-13",
    ],
    rows: [
      { label: "height", values: ["105-115cm", "110-125cm", "120-135cm", "130-145cm"] },
      { label: "bust", values: ["50-56cm", "56-62cm", "62-68cm", "68-74cm"] },
      { label: "waist", values: ["50-55cm", "55-60cm", "60-65cm", "65-70cm"] },
      { label: "hip", values: ["58-64cm", "64-70cm", "70-76cm", "76-82cm"] },
    ],
  },
  men: {
    title: "men — measurement (cm)",
    headers: ["size 0 · XS", "size 1 · S", "size 2 · M", "size 3 · L"],
    rows: [
      { label: "height", values: ["160-170cm", "165-175cm", "170-180cm", "175-185cm"] },
      { label: "bust", values: ["86-94cm", "94-102cm", "102-110cm", "110-118cm"] },
      { label: "waist", values: ["76-82cm", "82-88cm", "88-94cm", "94-100cm"] },
      { label: "hip", values: ["84-90cm", "88-94cm", "92-98cm", "96-102cm"] },
    ],
  },
  women: {
    title: "women — measurement (cm)",
    headers: ["size 0 · XS", "size 1 · S", "size 2 · M", "size 3 · L"],
    rows: [
      { label: "height", values: ["155-165cm", "160-170cm", "165-175cm", "170-180cm"] },
      { label: "bust", values: ["80-86cm", "86-92cm", "92-98cm", "98-104cm"] },
      { label: "waist", values: ["60-66cm", "66-72cm", "72-78cm", "78-84cm"] },
      { label: "hip", values: ["82-88cm", "88-94cm", "94-100cm", "100-106cm"] },
    ],
  },
  unisex: {
    title: "unisex — measurement (cm)",
    headers: ["size 0 · XS", "size 1 · S", "size 2 · M", "size 3 · L"],
    rows: [
      { label: "height", values: ["150-160cm", "160-170cm", "170-180cm", "180-190cm"] },
      { label: "bust", values: ["80-90cm", "90-100cm", "100-110cm", "110-120cm"] },
      { label: "waist", values: ["60-70cm", "70-80cm", "80-90cm", "90-100cm"] },
      { label: "hip", values: ["80-90cm", "85-95cm", "95-105cm", "100-110cm"] },
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
    // Personal-care / accessories one-size items don't need a chart
    const c = category.toLowerCase();
    if (c === "personal-care" || c.startsWith("vegan-") || c === "accessories") return [];
    out.push("unisex");
  }
  return out;
}

function ChartTable({ chart }: { chart: Chart }) {
  return (
    <div className="mt-4">
      <p className="text-[11px] tracking-[0.25em] uppercase text-primary mb-3">{chart.title}</p>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted/60">
            <tr>
              <th className="p-2 text-left font-medium border-r border-border sticky left-0 bg-muted/60 min-w-[110px]">
                measure (cm)
              </th>
              {chart.headers.map((h) => (
                <th key={h} className="p-2 text-left font-medium border-r border-border last:border-r-0 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((r) => (
              <tr key={r.label} className="border-t border-border">
                <td className="p-2 font-medium uppercase tracking-wide border-r border-border sticky left-0 bg-background">
                  {r.label}
                </td>
                {r.values.map((v, i) => (
                  <td key={i} className="p-2 border-r border-border last:border-r-0 whitespace-nowrap">
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
  const [active, setActive] = useState<SizeChartKind>(kinds[0] ?? "unisex");
  if (kinds.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-primary hover:underline underline-offset-4"
        >
          <Ruler className="h-3.5 w-3.5" />
          view size & measurement chart
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-light">size & measurement chart</DialogTitle>
        </DialogHeader>
        {kinds.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {kinds.map((k) => (
              <button
                key={k}
                onClick={() => setActive(k)}
                className={`px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase border transition ${
                  active === k
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        )}
        <ChartTable chart={CHARTS[active]} />
        <p className="mt-4 text-[11px] text-foreground/60 leading-relaxed">
          measurements are approximate body measurements — not garment dimensions. for a personal
          fitting consultation, please contact us.
        </p>
      </DialogContent>
    </Dialog>
  );
}
