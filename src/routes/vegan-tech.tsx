import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/alps/CategoryPage";
import { ScienceBehindSections, useScienceSections } from "@/components/alps/ScienceBehind";

export const Route = createFileRoute("/vegan-tech")({
  head: () => ({
    meta: [
      { title: "vegan skin & personal care technology — ALPS Annie Ling" },
      { name: "description", content: "Next-generation beauty technology — vegan, science-led." },
      { property: "og:title", content: "vegan skin & personal care technology" },
      { property: "og:description", content: "Next-gen beauty tech." },
    ],
  }),
  component: ScienceBehindPage,
});

/**
 * Write-ups from the admin "the science behind" tab, one per technology. Until the
 * first one exists the page keeps showing the older product-style posts.
 */
function ScienceBehindPage() {
  const { data: sections = [], isLoading } = useScienceSections();
  return (
    <CategoryView
      slug="vegan-tech"
      replaceContent={
        isLoading ? (
          <div className="min-h-[40vh]" />
        ) : sections.length > 0 ? (
          <ScienceBehindSections sections={sections} />
        ) : undefined
      }
    />
  );
}
