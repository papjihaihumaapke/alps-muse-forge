import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "cart — ALPS Annie Ling" }, { name: "description", content: "Your shopping bag." }] }),
  component: Cart,
});

function Cart() {
  return (
    <Shell>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-light">your bag</h1>
        <p className="text-foreground/60 mt-4">your bag is empty.</p>
        <div className="mt-6 flex gap-4">
          <Link to="/" className="link-red text-sm">continue shopping</Link>
          <Link to="/checkout" className="bg-primary text-primary-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase">proceed to checkout</Link>
        </div>
      </div>
    </Shell>
  );
}
