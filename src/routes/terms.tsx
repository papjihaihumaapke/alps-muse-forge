import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "terms of service — ALPS Annie Ling" },
      { name: "description", content: "Terms of service for ALPS Annie Ling." },
    ],
  }),
  component: () => (
    <Shell>
      <article className="max-w-3xl mx-auto px-6 py-20">
        <span className="num text-[11px] tracking-[0.3em] text-primary">legal</span>
        <h1 className="text-4xl font-light mt-3 mb-8">terms of service</h1>
        <div className="space-y-5 text-foreground/80 leading-relaxed text-sm">
          <p>by accessing or purchasing from ALPS Annie Ling, you agree to the following terms.</p>
          <h2 className="text-primary text-lg font-medium mt-8">orders & pricing</h2>
          <p>all prices are listed in CAD or HKD as shown. we reserve the right to refuse or cancel any order suspected of fraud or error.</p>
          <h2 className="text-primary text-lg font-medium mt-8">intellectual property</h2>
          <p>all designs, text, imagery and trademarks are the property of ALPS Annie Ling and may not be reproduced without written consent.</p>
          <h2 className="text-primary text-lg font-medium mt-8">liability</h2>
          <p>ALPS Annie Ling is not liable for indirect, incidental or consequential damages arising from use of our products or website.</p>
          <h2 className="text-primary text-lg font-medium mt-8">changes</h2>
          <p>these terms may be updated at any time. continued use of the site constitutes acceptance of the current version.</p>
        </div>
      </article>
    </Shell>
  ),
});
