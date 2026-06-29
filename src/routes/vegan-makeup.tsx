import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/alps/CategoryPage";

export const Route = createFileRoute("/vegan-makeup")({
  head: () => ({
    meta: [
      { title: "vegan makeup — ALPS Annie Ling" },
      { name: "description", content: "Colour without compromise — vegan, cruelty-free makeup." },
      { property: "og:title", content: "vegan makeup" },
      { property: "og:description", content: "Colour without compromise." },
    ],
  }),
  component: () => <CategoryView slug="vegan-makeup" />,
});
