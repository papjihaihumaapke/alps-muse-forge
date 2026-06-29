import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/alps/CategoryPage";

export const Route = createFileRoute("/vegan-supplement")({
  head: () => ({
    meta: [
      { title: "vegan supplement — ALPS Annie Ling" },
      { name: "description", content: "Plant-based wellness — nourish from within." },
      { property: "og:title", content: "vegan supplement" },
      { property: "og:description", content: "Nourish from within." },
    ],
  }),
  component: () => <CategoryView slug="vegan-supplement" />,
});
