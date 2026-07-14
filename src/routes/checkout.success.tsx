import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/alps/Shell";
import { useServerFn } from "@tanstack/react-start";
import { verifyStripeCheckoutSession } from "@/lib/stripe-checkout.functions";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({ meta: [{ title: "thank you — ALPS Annie Ling" }, { name: "robots", content: "noindex" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    session_id: typeof s.session_id === "string" ? s.session_id : "",
    order_id: typeof s.order_id === "string" ? s.order_id : "",
  }),
  component: Success,
});

function Success() {
  const { session_id, order_id } = Route.useSearch();
  const verify = useServerFn(verifyStripeCheckoutSession);
  const { clear } = useCart();
  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "error">("loading");

  useEffect(() => {
    if (!session_id || !order_id) { setStatus("error"); return; }
    verify({ data: { sessionId: session_id, orderId: order_id } })
      .then((r) => { setStatus(r.paid ? "paid" : "pending"); if (r.paid) clear(); })
      .catch(() => setStatus("error"));
  }, [session_id, order_id]);

  return (
    <Shell>
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <span className="num text-[11px] tracking-[0.3em] text-primary uppercase">order confirmed</span>
        <h1 className="text-3xl md:text-4xl font-light mt-4">
          {status === "loading" ? "confirming your payment…" : status === "paid" ? "thank you." : status === "pending" ? "payment processing" : "we couldn't verify your payment"}
        </h1>
        <p className="mt-6 text-foreground/70 leading-relaxed">
          {status === "paid"
            ? "your order has been placed. a receipt is on its way to your inbox."
            : status === "pending"
            ? "your payment is still processing. we'll email you as soon as it clears."
            : status === "error"
            ? "please contact us if funds were captured — we'll sort it out immediately."
            : "one moment while we check with stripe."}
        </p>
        <div className="mt-10 flex justify-center gap-6 text-xs">
          <Link to="/account" className="link-red">view my orders →</Link>
          <Link to="/" className="link-red">continue shopping</Link>
        </div>
      </div>
    </Shell>
  );
}
