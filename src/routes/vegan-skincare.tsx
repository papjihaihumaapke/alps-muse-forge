import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/alps/CategoryPage";

export const Route = createFileRoute("/vegan-skincare")({
  head: () => ({
    meta: [
      { title: "vegan skincare — ALPS Annie Ling" },
      { name: "description", content: "Plant-based daily skincare — vegan, cruelty-free, made in small batches." },
      { property: "og:title", content: "vegan skincare" },
      { property: "og:description", content: "Plant-based daily skincare." },
    ],
  }),
  component: () => <CategoryView slug="vegan-skincare" />,
});
