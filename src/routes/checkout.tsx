import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "checkout — ALPS Annie Ling" }, { name: "description", content: "Secure checkout." }] }),
  component: Checkout,
});

function Checkout() {
  return (
    <Shell>
      <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <Step n="01" title="customer info">
            <Field label="name" />
            <Field label="email" type="email" />
            <Field label="mobile" />
            <Field label="address" />
          </Step>
          <Step n="02" title="shipping">
            <p className="text-xs text-foreground/60">
              currency auto-detects from shipping address. hong kong local — HKD 30 flat. canada — CAD + GST/HST.
              international — quoted within 24 hours.
            </p>
            <div className="space-y-2 mt-3">
              <Radio label="standard — 5–7 business days" />
              <Radio label="FedEx (live rates — coming soon)" />
            </div>
          </Step>
          <Step n="03" title="payment">
            <p className="text-xs text-foreground/60">
              card processing will be enabled once payments are connected.
            </p>
            <div className="space-y-2 mt-3">
              <Radio label="credit card (stripe)" />
              <Radio label="moneris (coming soon)" />
            </div>
            <Field label="promo code" />
          </Step>
        </div>
        <aside className="bg-card border border-border p-6 h-fit">
          <h3 className="text-[11px] tracking-[0.25em] uppercase">order summary</h3>
          <div className="num text-sm mt-6 space-y-2">
            <Row k="subtotal" v="—" />
            <Row k="shipping" v="—" />
            <Row k="tax" v="—" />
            <div className="border-t border-border pt-2 mt-2 flex justify-between font-medium">
              <span>total</span><span>—</span>
            </div>
          </div>
          <button className="w-full mt-6 bg-primary text-primary-foreground py-3 text-xs tracking-[0.2em] uppercase">
            place order
          </button>
        </aside>
      </div>
    </Shell>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-5">
        <span className="num text-primary text-sm tracking-[0.2em]">{n}</span>
        <h2 className="text-xl font-light">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-wide text-foreground/60">{label}</span>
      <input type={type} className="mt-1 w-full bg-card border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary" />
    </label>
  );
}
function Radio({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-3 text-sm cursor-pointer">
      <input type="radio" name="opt" className="accent-primary" />
      {label}
    </label>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between text-foreground/70"><span>{k}</span><span>{v}</span></div>;
}
