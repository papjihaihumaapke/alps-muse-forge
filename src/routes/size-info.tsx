import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/alps/Shell";
import bgSlats from "@/assets/backgrounds/bg-slats.jpg.asset.json";

type Kind = "kids" | "men" | "women" | "unisex";

type Chart = { title: string; headers: string[]; rows: { label: string; values: string[] }[] };

const CHARTS: Record<Kind, Chart> = {
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

function SizeInfoPage() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const [active, setActive] = useState<Kind>("kids");

  useEffect(() => {
    const h = (hash || "").replace(/^#/, "");
    if (h === "kids" || h === "men" || h === "women" || h === "unisex") setActive(h);
  }, [hash]);

  const chart = CHARTS[active];

  return (
    <Shell>
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-light">size info</h1>
        <p className="mt-2 text-sm text-foreground/60">
          measurements are approximate body measurements — not garment dimensions.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {(["kids", "men", "women", "unisex"] as Kind[]).map((k) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`px-5 py-2 text-[11px] tracking-[0.25em] uppercase transition ${
                active === k
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border hover:border-primary"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </section>

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
          <div className="bg-primary text-primary-foreground text-center py-3 px-6">
            <p className="text-sm md:text-base tracking-[0.15em]">{chart.title}</p>
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
    </Shell>
  );
}

export const Route = createFileRoute("/size-info")({
  head: () => ({
    meta: [
      { title: "size info — ALPS Annie Ling" },
      { name: "description", content: "Measurement charts for kids, men, women and unisex sizing." },
      { property: "og:title", content: "size info — ALPS Annie Ling" },
      { property: "og:description", content: "Kids, men, women and unisex measurement charts." },
    ],
  }),
  component: SizeInfoPage,
});
