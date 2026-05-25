import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import designer from "@/assets/designer.jpg";

export const Route = createFileRoute("/my-journey")({
  head: () => ({
    meta: [
      { title: "my journey — annie ling" },
      { name: "description", content: "The story of annie ling — designer, founder of ALPS." },
      { property: "og:title", content: "my journey — annie ling" },
      { property: "og:description", content: "The designer behind ALPS." },
    ],
  }),
  component: () => (
    <Shell>
      <section className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <img src={designer} alt="annie ling atelier" className="aspect-[4/5] object-cover" />
        <div>
          <span className="num text-[11px] tracking-[0.3em] text-primary">designer</span>
          <h1 className="text-4xl font-light mt-3">my journey</h1>
          <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
            <p>
              i grew up between hong kong and london, moving between two cities that taught me how clothing carries
              culture. i studied at central saint martins and the hong kong polytechnic university school of design,
              and worked in performance textile development before founding ALPS.
            </p>
            <p>
              ALPS exists for the person who wants clothing to do more than be looked at. every piece is built
              around a textile decision — a yarn, a finish, a construction — and the silhouette follows.
            </p>
            <p className="num text-[11px] tracking-[0.25em] text-primary uppercase">— annie ling</p>
          </div>
        </div>
      </section>
    </Shell>
  ),
});
