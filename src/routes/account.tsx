import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "account — ALPS Annie Ling" }, { name: "description", content: "Sign in to your ALPS account." }] }),
  component: Account,
});

function Account() {
  return (
    <Shell>
      <section className="max-w-md mx-auto px-6 py-20">
        <span className="num text-[11px] tracking-[0.3em] text-primary">members</span>
        <h1 className="text-3xl font-light mt-3">sign in</h1>
        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Field label="email" type="email" />
          <Field label="password" type="password" />
          <button className="w-full bg-primary text-primary-foreground py-3 text-xs tracking-[0.2em] uppercase">
            sign in
          </button>
        </form>
        <p className="text-xs text-foreground/60 mt-6">
          new to alps? <Link to="/account" className="link-red">create an account</Link>
        </p>
      </section>
    </Shell>
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
