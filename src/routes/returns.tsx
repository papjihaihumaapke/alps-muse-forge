import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { SOCIALS } from "@/lib/alps-data";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "returns & exchanges — ALPS Annie Ling" },
      { name: "description", content: "ALPS Annie Ling returns and exchange policy." },
    ],
  }),
  component: () => (
    <Shell>
      <article className="max-w-3xl mx-auto px-6 py-20 prose-invert">
        <span className="num text-[11px] tracking-[0.3em] text-primary">policy</span>
        <h1 className="text-4xl font-light mt-3 mb-8">returns & exchanges</h1>
        <div className="space-y-5 text-foreground/80 leading-relaxed text-sm">
          <p>we want you to love what you receive. if something isn't right, we'll make it right.</p>
          <h2 className="text-primary text-lg font-medium mt-8">eligibility</h2>
          <p>unworn, unwashed items with original tags may be returned within <b>14 days</b> of delivery. sale items, custom orders, personal-care and skincare products are final sale for hygiene reasons.</p>
          <h2 className="text-primary text-lg font-medium mt-8">how to start a return</h2>
          <p>email <a href={`mailto:${SOCIALS.email}`} className="link-red">{SOCIALS.email}</a> with your order number and the reason for return. we'll reply within one business day with return instructions.</p>
          <h2 className="text-primary text-lg font-medium mt-8">refunds</h2>
          <p>refunds are issued to the original payment method within 5–10 business days of us receiving your return. original shipping is non-refundable; return shipping is the customer's responsibility unless the item arrived damaged or incorrect.</p>
          <h2 className="text-primary text-lg font-medium mt-8">damaged or wrong items</h2>
          <p>please email us within 48 hours of delivery with photos — we'll cover return shipping and send a replacement or full refund.</p>
        </div>
      </article>
    </Shell>
  ),
});
