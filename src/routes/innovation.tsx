import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { CategoryView } from "@/components/alps/CategoryPage";
import { FabricTechnology } from "@/components/alps/FabricTechnology";

const searchSchema = z.object({
  feature: z.string().optional(),
});

export const Route = createFileRoute("/innovation")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "alps innovation — ALPS Annie Ling" },
      { name: "description", content: "Performance outerwear engineered around textile science. Where fashion meets innovation." },
      { property: "og:title", content: "alps innovation" },
      { property: "og:description", content: "Where fashion meets innovation." },
    ],
  }),
  component: InnovationPage,
});

function InnovationPage() {
  const { feature } = Route.useSearch();
  const navigate = useNavigate();
  return (
    <CategoryView
      slug="innovation"
      featureFilter={feature}
      onClearFeature={() => navigate({ to: "/innovation", search: {} })}
      afterContent={
        <div className="border-t border-border bg-brand-light">
          <FabricTechnology />
        </div>
      }
    />
  );
}
