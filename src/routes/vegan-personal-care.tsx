import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/alps/CategoryPage";

export const Route = createFileRoute("/vegan-personal-care")({
  head: () => ({
    meta: [
      { title: "vegan personal care — ALPS Annie Ling" },
      { name: "description", content: "Clean, conscious vegan personal care essentials by botalab." },
      { property: "og:title", content: "vegan personal care" },
      { property: "og:description", content: "Clean, conscious essentials." },
    ],
  }),
  component: () => <CategoryView slug="vegan-personal-care" />,
});
