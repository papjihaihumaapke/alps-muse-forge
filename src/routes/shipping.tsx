import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { SOCIALS } from "@/lib/alps-data";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "shipping — ALPS Annie Ling" },
      { name: "description", content: "Shipping rates and delivery times for ALPS Annie Ling." },
    ],
  }),
  component: () => (
    <Shell>
      <article className="max-w-3xl mx-auto px-6 py-20">
        <span className="num text-[11px] tracking-[0.3em] text-primary">delivery</span>
        <h1 className="text-4xl font-light mt-3 mb-8">shipping</h1>
        <div className="space-y-5 text-foreground/80 leading-relaxed text-sm">
          <h2 className="text-primary text-lg font-medium">rates</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><b>hong kong:</b> HK$30 flat, 2–4 business days</li>
            <li><b>canada:</b> CA$25 flat, 3–7 business days</li>
            <li><b>international:</b> quoted within 24 hours of your order — email <a href={`mailto:${SOCIALS.email}`} className="link-red">{SOCIALS.email}</a></li>
          </ul>
          <h2 className="text-primary text-lg font-medium mt-8">processing</h2>
          <p>orders placed before 12:00 (local origin time) monday–friday ship the same day. weekend and holiday orders ship the next business day.</p>
          <h2 className="text-primary text-lg font-medium mt-8">tracking</h2>
          <p>you'll receive a tracking link by email as soon as your parcel is dispatched.</p>
          <h2 className="text-primary text-lg font-medium mt-8">duties & taxes</h2>
          <p>canadian orders include applicable sales tax at checkout. international orders may be subject to duties and taxes on arrival, payable by the recipient.</p>
        </div>
      </article>
    </Shell>
  ),
});
