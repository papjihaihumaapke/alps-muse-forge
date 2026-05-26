import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/alps/Shell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <Shell><div className="p-10">Loading…</div></Shell>;
  if (!user) return (
    <Shell>
      <div className="p-10 max-w-md">
        <h1 className="text-2xl mb-4">Admin</h1>
        <p className="mb-4">Please <Link to="/account" className="link-red">sign in</Link>.</p>
      </div>
    </Shell>
  );
  if (!isAdmin) return <Shell><div className="p-10">Access denied.</div></Shell>;

  return (
    <Shell>
      <div className="px-6 lg:px-10 py-10">
        <h1 className="text-3xl mb-8">Admin Panel</h1>
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="promos">Promo Codes</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="customers"><CustomersTab /></TabsContent>
          <TabsContent value="promos"><PromosTab /></TabsContent>
          <TabsContent value="newsletter"><NewsletterTab /></TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}

/* ----------------- PRODUCTS ----------------- */
type Product = {
  id?: string; slug: string; name: string; category: string;
  description: string | null; price_cad: number; price_hkd: number;
  colors: string[]; sizes: string[]; features: string[]; tags: string[];
  stock: number; hidden: boolean; image_url: string | null;
};

const blankProduct: Product = {
  slug: "", name: "", category: "innovation", description: "",
  price_cad: 0, price_hkd: 0, colors: [], sizes: [], features: [], tags: [],
  stock: 0, hidden: false, image_url: "",
};

function ProductsTab() {
  const [rows, setRows] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Product[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = { ...editing };
    const { error } = payload.id
      ? await supabase.from("products").update(payload).eq("id", payload.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg">{rows.length} products</h2>
        <Button onClick={() => setEditing({ ...blankProduct })}>+ New Product</Button>
      </div>

      {editing && <ProductEditor product={editing} onChange={setEditing} onSave={save} onCancel={() => setEditing(null)} />}

      <table className="w-full text-sm border-t border-border">
        <thead><tr className="text-left text-muted-foreground">
          <th className="py-2">Slug</th><th>Name</th><th>Category</th><th>Stock</th><th>CAD</th><th>HKD</th><th>Hidden</th><th></th>
        </tr></thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="py-2 font-mono text-xs">{p.slug}</td>
              <td>{p.name}</td><td>{p.category}</td><td className="num">{p.stock}</td>
              <td className="num">{p.price_cad}</td><td className="num">{p.price_hkd}</td>
              <td>{p.hidden ? "yes" : ""}</td>
              <td className="text-right">
                <button onClick={() => setEditing(p)} className="link-red mr-3">edit</button>
                <button onClick={() => remove(p.id!)} className="link-red">delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductEditor({ product, onChange, onSave, onCancel }:{
  product: Product; onChange: (p: Product) => void; onSave: () => void; onCancel: () => void;
}) {
  const set = (k: keyof Product, v: any) => onChange({ ...product, [k]: v });
  const arr = (s: string) => s.split(",").map(x => x.trim()).filter(Boolean);

  return (
    <div className="border border-border p-6 bg-card space-y-4">
      <h3 className="text-lg">{product.id ? "Edit" : "New"} product</h3>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Slug"><Input value={product.slug} onChange={e => set("slug", e.target.value)} /></Field>
        <Field label="Name"><Input value={product.name} onChange={e => set("name", e.target.value)} /></Field>
        <Field label="Category">
          <select className="w-full h-9 border border-input bg-background px-3 text-sm" value={product.category} onChange={e => set("category", e.target.value)}>
            <option value="innovation">innovation</option>
            <option value="contemporary">contemporary</option>
            <option value="accessories">accessories</option>
            <option value="collaborations">collaborations</option>
            <option value="personal-care">personal-care</option>
          </select>
        </Field>
        <Field label="Image URL"><Input value={product.image_url ?? ""} onChange={e => set("image_url", e.target.value)} /></Field>
        <Field label="Price CAD"><Input type="number" value={product.price_cad} onChange={e => set("price_cad", Number(e.target.value))} /></Field>
        <Field label="Price HKD"><Input type="number" value={product.price_hkd} onChange={e => set("price_hkd", Number(e.target.value))} /></Field>
        <Field label="Stock"><Input type="number" value={product.stock} onChange={e => set("stock", Number(e.target.value))} /></Field>
        <Field label="Hidden">
          <div className="flex items-center h-9"><Switch checked={product.hidden} onCheckedChange={v => set("hidden", v)} /></div>
        </Field>
        <Field label="Colors (comma-sep)"><Input value={product.colors.join(", ")} onChange={e => set("colors", arr(e.target.value))} /></Field>
        <Field label="Sizes (comma-sep)"><Input value={product.sizes.join(", ")} onChange={e => set("sizes", arr(e.target.value))} /></Field>
        <Field label="Features (comma-sep)"><Input value={product.features.join(", ")} onChange={e => set("features", arr(e.target.value))} /></Field>
        <Field label="Tags (comma-sep)"><Input value={product.tags.join(", ")} onChange={e => set("tags", arr(e.target.value))} /></Field>
      </div>
      <Field label="Description"><Textarea rows={4} value={product.description ?? ""} onChange={e => set("description", e.target.value)} /></Field>
      <div className="flex gap-3">
        <Button onClick={onSave}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

function Field({ label, children }:{ label: string; children: React.ReactNode }) {
  return <div><Label className="text-xs text-muted-foreground mb-1 block">{label}</Label>{children}</div>;
}

/* ----------------- ORDERS ----------------- */
function OrdersTab() {
  const [rows, setRows] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);
  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated"); load();
  };
  return (
    <div className="py-6">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-muted-foreground border-b border-border">
          <th className="py-2">Order #</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th><th></th>
        </tr></thead>
        <tbody>
          {rows.map(o => (
            <tr key={o.id} className="border-b border-border align-top">
              <td className="py-3 font-mono text-xs">{o.order_number}</td>
              <td className="text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
              <td><div>{o.full_name}</div><div className="text-xs text-muted-foreground">{o.email}</div></td>
              <td className="num">{o.currency} {Number(o.total).toFixed(2)}</td>
              <td>
                <select value={o.status} onChange={e => setStatus(o.id, e.target.value)} className="border border-input bg-background px-2 py-1 text-xs">
                  {["pending","paid","shipped","delivered","cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td className="text-xs">{(o.order_items ?? []).length} items</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------- CUSTOMERS ----------------- */
function CustomersTab() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setRows(data ?? []));
  }, []);
  return (
    <div className="py-6">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-muted-foreground border-b border-border">
          <th className="py-2">Name</th><th>Mobile</th><th>Newsletter</th><th>Joined</th>
        </tr></thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.id} className="border-b border-border">
              <td className="py-2">{p.full_name || "—"}</td>
              <td>{p.mobile || "—"}</td>
              <td>{p.newsletter_opt_in ? "yes" : "no"}</td>
              <td className="text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------- PROMOS ----------------- */
type Promo = {
  id?: string; code: string; discount_type: string; amount: number;
  currency: string | null; usage_limit: number | null; used_count: number;
  active: boolean; expires_at: string | null; applicable_products: string[] | null;
};
const blankPromo: Promo = { code: "", discount_type: "percent", amount: 10, currency: null, usage_limit: null, used_count: 0, active: true, expires_at: null, applicable_products: null };

function PromosTab() {
  const [rows, setRows] = useState<Promo[]>([]);
  const [editing, setEditing] = useState<Promo | null>(null);
  const load = async () => {
    const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Promo[]);
  };
  useEffect(() => { load(); }, []);
  const save = async () => {
    if (!editing) return;
    const p = { ...editing };
    const { error } = p.id
      ? await supabase.from("promo_codes").update(p).eq("id", p.id)
      : await supabase.from("promo_codes").insert(p);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("promo_codes").delete().eq("id", id);
    load();
  };
  return (
    <div className="py-6 space-y-6">
      <div className="flex justify-between"><h2>{rows.length} codes</h2><Button onClick={() => setEditing({ ...blankPromo })}>+ New Code</Button></div>
      {editing && (
        <div className="border border-border p-6 bg-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Code"><Input value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value.toUpperCase() })} /></Field>
            <Field label="Type">
              <select className="w-full h-9 border border-input bg-background px-3 text-sm" value={editing.discount_type} onChange={e => setEditing({ ...editing, discount_type: e.target.value })}>
                <option value="percent">percent</option>
                <option value="fixed">fixed</option>
              </select>
            </Field>
            <Field label="Amount"><Input type="number" value={editing.amount} onChange={e => setEditing({ ...editing, amount: Number(e.target.value) })} /></Field>
            <Field label="Currency (fixed only)"><Input value={editing.currency ?? ""} onChange={e => setEditing({ ...editing, currency: e.target.value || null })} placeholder="CAD or HKD" /></Field>
            <Field label="Usage limit"><Input type="number" value={editing.usage_limit ?? ""} onChange={e => setEditing({ ...editing, usage_limit: e.target.value ? Number(e.target.value) : null })} /></Field>
            <Field label="Expires (ISO)"><Input value={editing.expires_at ?? ""} onChange={e => setEditing({ ...editing, expires_at: e.target.value || null })} placeholder="2026-12-31" /></Field>
            <Field label="Active"><div className="flex h-9 items-center"><Switch checked={editing.active} onCheckedChange={v => setEditing({ ...editing, active: v })} /></div></Field>
          </div>
          <div className="flex gap-3"><Button onClick={save}>Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      )}
      <table className="w-full text-sm">
        <thead><tr className="text-left text-muted-foreground border-b border-border">
          <th className="py-2">Code</th><th>Type</th><th>Amount</th><th>Used</th><th>Active</th><th></th>
        </tr></thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.id} className="border-b border-border">
              <td className="py-2 font-mono">{p.code}</td><td>{p.discount_type}</td>
              <td className="num">{p.amount}{p.discount_type === "percent" ? "%" : ` ${p.currency ?? ""}`}</td>
              <td className="num">{p.used_count}{p.usage_limit ? `/${p.usage_limit}` : ""}</td>
              <td>{p.active ? "yes" : "no"}</td>
              <td className="text-right">
                <button onClick={() => setEditing(p)} className="link-red mr-3">edit</button>
                <button onClick={() => remove(p.id!)} className="link-red">delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------- NEWSLETTER ----------------- */
function NewsletterTab() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setRows(data ?? []));
  }, []);
  const csv = () => {
    const text = "email,created_at\n" + rows.map(r => `${r.email},${r.created_at}`).join("\n");
    const blob = new Blob([text], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "subscribers.csv"; a.click();
  };
  return (
    <div className="py-6 space-y-4">
      <div className="flex justify-between"><h2>{rows.length} subscribers</h2><Button onClick={csv} variant="outline">Export CSV</Button></div>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-muted-foreground border-b border-border"><th className="py-2">Email</th><th>Subscribed</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b border-border">
              <td className="py-2">{r.email}</td>
              <td className="text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
