import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { SOCIALS } from "@/lib/alps-data";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "privacy policy — ALPS Annie Ling" },
      { name: "description", content: "How ALPS Annie Ling handles your personal data." },
    ],
  }),
  component: () => (
    <Shell>
      <article className="max-w-3xl mx-auto px-6 py-20">
        <span className="num text-[11px] tracking-[0.3em] text-primary">legal</span>
        <h1 className="text-4xl font-light mt-3 mb-8">privacy</h1>
        <div className="space-y-5 text-foreground/80 leading-relaxed text-sm">
          <p>we collect only the information needed to fulfil your order and improve your experience: name, contact details, shipping address, and payment reference (handled by our payment processor — we never store card numbers).</p>
          <p>we do not sell your data. we may share order details with couriers, our payment processor (Stripe) and email service so that we can deliver what you bought.</p>
          <p>you may request access to, correction of, or deletion of your personal data at any time by emailing <a href={`mailto:${SOCIALS.email}`} className="link-red">{SOCIALS.email}</a>.</p>
        </div>
      </article>
    </Shell>
  ),
});
