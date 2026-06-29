import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/alps/CategoryPage";

export const Route = createFileRoute("/vegan-tech")({
  head: () => ({
    meta: [
      { title: "vegan skin & personal care technology — ALPS Annie Ling" },
      { name: "description", content: "Next-generation beauty technology — vegan, science-led." },
      { property: "og:title", content: "vegan skin & personal care technology" },
      { property: "og:description", content: "Next-gen beauty tech." },
    ],
  }),
  component: () => <CategoryView slug="vegan-tech" />,
});
