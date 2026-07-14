import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";

export const Route = createFileRoute("/checkout/cancel")({
  head: () => ({ meta: [{ title: "checkout cancelled — ALPS Annie Ling" }, { name: "robots", content: "noindex" }] }),
  component: Cancel,
});

function Cancel() {
  return (
    <Shell>
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <span className="num text-[11px] tracking-[0.3em] text-primary uppercase">checkout cancelled</span>
        <h1 className="text-3xl md:text-4xl font-light mt-4">no charge made.</h1>
        <p className="mt-6 text-foreground/70">your bag is still saved. you can return to checkout whenever you're ready.</p>
        <div className="mt-10 flex justify-center gap-6 text-xs">
          <Link to="/checkout" className="link-red">return to checkout →</Link>
          <Link to="/cart" className="link-red">edit bag</Link>
        </div>
      </div>
    </Shell>
  );
}
