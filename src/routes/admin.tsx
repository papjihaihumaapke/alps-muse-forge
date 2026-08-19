import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
import { useServerFn } from "@tanstack/react-start";
import { listAdmins, grantAdminByEmail, revokeAdmin } from "@/lib/admin.functions";
import { PRODUCTS, FEATURES, PRODUCT_COLORS } from "@/lib/alps-data";
import { productImage } from "@/lib/accessory-images";
import { featureIcon } from "@/lib/feature-icons";
import { ChevronDown, ChevronRight, X, Plus, Image as ImageIcon, Palette } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { SWATCH_LIBRARY, type SwatchGroup } from "@/lib/color-swatches";
import {
  asArray,
  eventDateLabel,
  kindLabel,
  slugify,
  JOURNEY_POST_KINDS,
  type JourneyImage,
  type JourneyLink,
  type JourneyPost,
  type PageSection,
} from "@/lib/journey";
import type { Json } from "@/integrations/supabase/types";
import { normalizeUrl } from "@/lib/utils";
import { useMediaUrl } from "@/lib/storage-url";

export const Route = createFileRoute("/admin")({ component: AdminPage });

/* ============================================================
   AUTH WRAPPER
   ============================================================ */
function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) toast.error(error);
  };
  return (
    <Shell>
      <div className="p-10 max-w-sm mx-auto">
        <h1 className="text-2xl mb-6">admin sign in</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">email</Label>
            <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">password</Label>
            <Input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full">{busy ? "signing in…" : "sign in"}</Button>
        </form>
      </div>
    </Shell>
  );
}

function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();

  // Safety: never block the page on auth >2s.
  const [softLoading, setSoftLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSoftLoading(false), 2000);
    if (!loading) setSoftLoading(false);
    return () => clearTimeout(t);
  }, [loading]);

  if (loading && softLoading) {
    return <Shell><div className="p-10 text-sm text-muted-foreground">loading admin…</div></Shell>;
  }
  if (!user) return <AdminLogin />;
  if (!isAdmin) {
    return (
      <Shell>
        <div className="p-10 max-w-md">
          <h1 className="text-2xl mb-4">access denied</h1>
          <p className="mb-4 text-sm text-muted-foreground">signed in as {user.email} — this account is not an admin.</p>
          <Button variant="outline" onClick={signOut}>sign out</Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="px-6 lg:px-10 py-10 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light">admin panel</h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{user.email}</span>
            <button onClick={signOut} className="link-red">sign out</button>
          </div>
        </div>
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">products</TabsTrigger>
            <TabsTrigger value="banners">homepage banners</TabsTrigger>
            <TabsTrigger value="orders">orders</TabsTrigger>
            <TabsTrigger value="customers">customers</TabsTrigger>
            <TabsTrigger value="journal">journey posts</TabsTrigger>
            <TabsTrigger value="page-content">design path content</TabsTrigger>
            <TabsTrigger value="milestones">milestones</TabsTrigger>
            <TabsTrigger value="journey">journey extras</TabsTrigger>
            <TabsTrigger value="promos">promo codes</TabsTrigger>
            <TabsTrigger value="newsletter">newsletter</TabsTrigger>
            <TabsTrigger value="admins">admins</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="banners"><BannersTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="customers"><CustomersTab /></TabsContent>
          <TabsContent value="journal"><JourneyPostsTab /></TabsContent>
          <TabsContent value="page-content"><PageSectionsTab /></TabsContent>
          <TabsContent value="milestones">
            <PageSectionsTab
              page="milestones"
              title="milestones — pictures & text"
              subtitle="picture-and-text blocks shown below the awards on the milestones page. each block takes an image, a heading and as much copy as you like; they alternate sides down the page."
              firstLabel="milestone block"
              restLabel="milestone block"
              firstImageLabel="image (optional — adds a side-by-side layout)"
              emptyHint='no blocks yet — click "add section" to put a picture and some text on the milestones page.'
            />
          </TabsContent>
          <TabsContent value="journey"><JourneyTab /></TabsContent>
          <TabsContent value="promos"><PromosTab /></TabsContent>
          <TabsContent value="newsletter"><NewsletterTab /></TabsContent>
          <TabsContent value="admins"><AdminsTab /></TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}

/* ============================================================
   PRODUCTS
   ============================================================ */
type Swatch = { name: string; hex?: string; swatch_url?: string; image_url?: string };
type ProductRow = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  design_features: string | null;
  tech_info: string | null;
  composition: string | null;
  care_instructions: string | null;
  package_size: string | null;
  package_weight: string | null;
  price_cad: number;
  price_hkd: number;
  colors: string[];
  sizes: string[];
  features: string[];
  tags: string[];
  hashtags: string[];
  stock: number;
  stock_ca: number;
  hidden: boolean;
  is_external: boolean;
  external_url: string | null;
  image_url: string | null;
  gallery_urls: string[];
  color_swatches: Swatch[];
  season: "spring" | "summer" | "fall" | "winter" | "all-season";
  display_order: number;
};

const SEASONS: ProductRow["season"][] = ["spring", "summer", "fall", "winter", "all-season"];

const CATEGORY_GROUPS: { slug: string; label: string }[] = [
  { slug: "innovation", label: "alps innovation" },
  { slug: "contemporary", label: "alps contemporary" },
  { slug: "accessories", label: "alps accessories" },
  { slug: "collaborations", label: "alps collaborations" },
  { slug: "personal-care", label: "personal care (legacy)" },
  { slug: "vegan-skincare", label: "vegan skincare" },
  { slug: "vegan-personal-care", label: "vegan personal care" },
  { slug: "vegan-makeup", label: "vegan makeup" },
  { slug: "vegan-supplement", label: "vegan supplement" },
  { slug: "vegan-tech", label: "vegan skin & personal care tech" },
];

const blankProduct = (): ProductRow => ({
  slug: "", name: "", category: "vegan-skincare",
  subcategory: "", description: "", design_features: "", tech_info: "",
  composition: "", care_instructions: "", package_size: "", package_weight: "",
  price_cad: 0, price_hkd: 0,
  colors: [], sizes: [], features: [], tags: [], hashtags: [],
  stock: 0, stock_ca: 0, hidden: false,
  is_external: false, external_url: "",
  image_url: "",
  gallery_urls: [], color_swatches: [], season: "all-season", display_order: 0,
});

function ProductsTab() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [search, setSearch] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({
    "vegan-skincare": true, "vegan-personal-care": true, "vegan-makeup": true,
    "vegan-supplement": true, "vegan-tech": true,
  });
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products").select("*")
      .order("category").order("display_order").order("name");
    if (error) { setLoadErr(error.message); setLoading(false); return; }
    setRows((data ?? []) as unknown as ProductRow[]);
    setLoadErr(null);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter((p) => `${p.name} ${p.slug} ${p.subcategory ?? ""}`.toLowerCase().includes(q));
  }, [rows, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, ProductRow[]>();
    for (const c of CATEGORY_GROUPS) map.set(c.slug, []);
    for (const p of filtered) {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    }
    return map;
  }, [filtered]);

  const save = async (p: ProductRow) => {
    const payload: any = { ...p };
    payload.color_swatches = payload.color_swatches ?? [];
    payload.gallery_urls = payload.gallery_urls ?? [];
    payload.hashtags = payload.hashtags ?? [];
    if (!payload.slug) return toast.error("slug is required");
    if (!payload.name) return toast.error("name is required");
    const { error } = payload.id
      ? await supabase.from("products").update(payload).eq("id", payload.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("saved"); setEditing(null); load();
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`delete "${name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("deleted"); load();
  };

  const [syncing, setSyncing] = useState(false);
  const syncCatalog = async () => {
    if (!confirm(`import ${PRODUCTS.length} static-catalog products into the DB? existing rows (matched by slug) will be updated.`)) return;
    setSyncing(true);
    try {
      const payload = PRODUCTS.map((p) => ({
        slug: p.id, name: p.name, category: p.category,
        price_cad: p.priceCAD ?? 0, price_hkd: p.priceHKD ?? 0,
        colors: p.colors ?? [], sizes: p.sizes ?? [],
        features: p.features ?? [], tags: (p.tags as string[] | undefined) ?? [],
        stock: 0, hidden: false, image_url: productImage(p.id) ?? null,
      }));
      const { error } = await supabase.from("products").upsert(payload, { onConflict: "slug" });
      if (error) throw error;
      toast.success(`synced ${payload.length} products`);
      load();
    } catch (e: any) {
      toast.error(e.message ?? "sync failed");
    } finally { setSyncing(false); }
  };

  return (
    <div className="py-6 space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h2 className="text-lg">{rows.length} products in database</h2>
          <p className="text-xs text-muted-foreground">grouped by category. click a category to expand.</p>
        </div>
        <div className="flex gap-2">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search name / slug…" className="w-64" />
          <Button variant="outline" onClick={syncCatalog} disabled={syncing}>{syncing ? "syncing…" : "sync static catalog"}</Button>
          <Button onClick={() => setEditing(blankProduct())}><Plus className="h-4 w-4 mr-1" />new product</Button>
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">loading products…</p>}
      {loadErr && <p className="text-sm text-destructive">failed to load: {loadErr}</p>}

      {/* Category groups */}
      <div className="space-y-3">
        {CATEGORY_GROUPS.map((cat) => {
          const items = grouped.get(cat.slug) ?? [];
          const open = openCats[cat.slug] ?? items.length < 8;
          return (
            <div key={cat.slug} className="border border-border bg-card">
              <button
                onClick={() => setOpenCats((s) => ({ ...s, [cat.slug]: !open }))}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40"
              >
                <div className="flex items-center gap-2">
                  {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="font-medium">{cat.label}</span>
                  <span className="text-xs text-muted-foreground">({items.length})</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditing({ ...blankProduct(), category: cat.slug }); }}
                  className="text-xs link-red"
                >+ add to {cat.label}</button>
              </button>

              {open && items.length > 0 && (
                <div className="border-t border-border divide-y divide-border">
                  {items.map((p) => {
                    const thumb = p.gallery_urls?.[0] || p.image_url;
                    return (
                      <div key={p.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30">
                        <div className="h-14 w-14 shrink-0 bg-muted overflow-hidden flex items-center justify-center">
                          {thumb
                            ? <img src={thumb} alt="" className="h-full w-full object-cover" />
                            : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{p.name || <em className="text-muted-foreground">untitled</em>}</div>
                          <div className="text-xs text-muted-foreground font-mono truncate">{p.slug}</div>
                        </div>
                        <div className="text-xs text-muted-foreground hidden md:block w-24">{p.season}</div>
                        <div className="text-xs num text-primary w-28 text-right">CAD {p.price_cad} · HKD {p.price_hkd}</div>
                        <div className="text-xs w-16 text-center">
                          {(p.gallery_urls ?? []).length || (p.image_url ? 1 : 0)} img
                        </div>
                        <div className="text-xs w-16 text-center">{p.hidden ? <span className="text-muted-foreground">hidden</span> : <span className="text-primary">live</span>}</div>
                        <div className="flex gap-3 text-xs">
                          <button onClick={() => setEditing(p)} className="link-red">edit</button>
                          <button onClick={() => remove(p.id!, p.name)} className="link-red">delete</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {open && items.length === 0 && (
                <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
                  no products yet in this category
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <ProductEditor
          product={editing}
          onChange={setEditing}
          onSave={() => save(editing)}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

/* ---------- Upload helper ---------- */
async function uploadProductImage(file: File, slug: string): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${slug || "untitled"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("product-media").upload(path, file, { upsert: false });
  if (error) { toast.error(error.message); return null; }
  const { data } = supabase.storage.from("product-media").getPublicUrl(path);
  return data.publicUrl;
}

/* ---------- Editor modal ---------- */
function ProductEditor({ product, onChange, onSave, onCancel }: {
  product: ProductRow; onChange: (p: ProductRow) => void; onSave: () => void; onCancel: () => void;
}) {
  const set = <K extends keyof ProductRow>(k: K, v: ProductRow[K]) => onChange({ ...product, [k]: v });
  const csv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
  const [uploading, setUploading] = useState(false);

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const u = await uploadProductImage(f, product.slug);
      if (u) urls.push(u);
    }
    setUploading(false);
    if (urls.length) {
      const next = [...(product.gallery_urls ?? []), ...urls];
      onChange({ ...product, gallery_urls: next, image_url: product.image_url || urls[0] });
      toast.success(`uploaded ${urls.length} image${urls.length > 1 ? "s" : ""}`);
    }
  };

  const removeGalleryUrl = (url: string) => {
    set("gallery_urls", (product.gallery_urls ?? []).filter((u) => u !== url));
  };

  const swatchUpload = async (idx: number, file: File) => {
    const u = await uploadProductImage(file, `${product.slug}-swatches`);
    if (!u) return;
    const next = [...product.color_swatches];
    next[idx] = { ...next[idx], swatch_url: u };
    set("color_swatches", next);
  };

  const swatchImageUpload = async (idx: number, file: File) => {
    const u = await uploadProductImage(file, `${product.slug}-color-${product.color_swatches[idx]?.name || idx}`);
    if (!u) return;
    const next = [...product.color_swatches];
    next[idx] = { ...next[idx], image_url: u };
    set("color_swatches", next);
  };

  const addColorRow = () => {
    set("color_swatches", [...(product.color_swatches ?? []), { name: "" }]);
  };

  const toggleFeature = (key: string) => {
    const has = product.features.includes(key);
    set("features", has ? product.features.filter((k) => k !== key) : [...product.features, key]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 overflow-y-auto">
      <div className="max-w-5xl mx-auto my-8 bg-card border border-border shadow-lg">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg">
            {product.id ? "edit product" : "new product"}
            {product.name && <span className="text-muted-foreground text-sm ml-2">· {product.name}</span>}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>cancel</Button>
            <Button onClick={onSave}>save</Button>
            <button onClick={onCancel} className="ml-2 p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* SECTION: Basics */}
          <Section title="basics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="product name *"><Input value={product.name} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="slug (url id) *"><Input value={product.slug} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. botalab-cleanser" /></Field>
              <Field label="category">
                <select className="w-full h-9 border border-input bg-background px-3 text-sm" value={product.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORY_GROUPS.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="subcategory (free text)">
                <Input value={product.subcategory ?? ""} onChange={(e) => set("subcategory", e.target.value)} placeholder="e.g. botalab" />
              </Field>
              <Field label="season">
                <select className="w-full h-9 border border-input bg-background px-3 text-sm" value={product.season} onChange={(e) => set("season", e.target.value as ProductRow["season"])}>
                  {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="display order">
                <Input type="number" value={product.display_order} onChange={(e) => set("display_order", Number(e.target.value))} />
              </Field>
              <Field label="price CAD"><Input type="number" value={product.price_cad} onChange={(e) => set("price_cad", Number(e.target.value))} /></Field>
              <Field label="price HKD"><Input type="number" value={product.price_hkd} onChange={(e) => set("price_hkd", Number(e.target.value))} /></Field>
              <Field label="stock (HK)"><Input type="number" value={product.stock} onChange={(e) => set("stock", Number(e.target.value))} /></Field>
              <Field label="stock (Canada)"><Input type="number" value={product.stock_ca} onChange={(e) => set("stock_ca", Number(e.target.value))} /></Field>
              <Field label="hidden from site">
                <div className="flex items-center h-9"><Switch checked={product.hidden} onCheckedChange={(v) => set("hidden", v)} /></div>
              </Field>
              <Field label="external referral (no cart)">
                <div className="flex items-center h-9"><Switch checked={product.is_external} onCheckedChange={(v) => set("is_external", v)} /></div>
              </Field>
              <Field label="external product url">
                <Input value={product.external_url ?? ""} onChange={(e) => set("external_url", e.target.value)} placeholder="https://vendor-site.com/product" />
              </Field>
            </div>
          </Section>

          {/* SECTION: Copy */}
          <Section title="description & content">
            <Field label="description">
              <Textarea rows={4} value={product.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="what this product is, who it's for, what makes it special" />
            </Field>
            <Field label="design features">
              <Textarea rows={3} value={product.design_features ?? ""} onChange={(e) => set("design_features", e.target.value)} placeholder="silhouette, construction, details — what you can see" />
            </Field>
            <Field label="technology benefits">
              <Textarea rows={3} value={product.tech_info ?? ""} onChange={(e) => set("tech_info", e.target.value)} placeholder="what the technology does for the wearer / user" />
            </Field>
            <Field label="composition">
              <Textarea rows={2} value={product.composition ?? ""} onChange={(e) => set("composition", e.target.value)} placeholder="e.g. 78% recycled polyester, 22% elastane / aqua, glycerin, niacinamide…" />
            </Field>
            <Field label="care instructions">
              <Textarea rows={2} value={product.care_instructions ?? ""} onChange={(e) => set("care_instructions", e.target.value)} placeholder="washing / handling / storage" />
            </Field>
          </Section>

          {/* SECTION: Feature icons */}
          <Section title="properties / feature icons" subtitle="click to toggle. selected icons show on the product page.">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {FEATURES.map((f) => {
                const active = product.features.includes(f.key);
                const ic = featureIcon(f.key);
                return (
                  <button
                    type="button"
                    key={f.key}
                    onClick={() => toggleFeature(f.key)}
                    className={`flex items-center gap-2 p-2 border text-left transition ${
                      active ? "border-primary bg-primary/5" : "border-border hover:border-foreground/60"
                    }`}
                  >
                    {ic ? <img src={ic} alt="" className="h-6 w-6 object-contain shrink-0" /> : <div className="h-6 w-6 bg-muted shrink-0" />}
                    <span className="text-xs leading-tight">{f.name}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* SECTION: Sizes */}
          <Section title="sizes">
            <Field label="sizes (comma-separated)">
              <Input value={product.sizes.join(", ")} onChange={(e) => set("sizes", csv(e.target.value))} placeholder="e.g. XS, S, M, L, XL  or  30ml, 50ml, 100ml" />
            </Field>
          </Section>

          {/* SECTION: Colors + swatches */}
          <Section title="colors & swatches" subtitle="add each color the product comes in. upload a swatch image for each.">
            <div className="space-y-2">
              {(product.color_swatches ?? []).map((s, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 p-2 border border-border bg-background">
                  <Input
                    className="w-40" value={s.name} placeholder="color name"
                    onChange={(e) => {
                      const next = [...product.color_swatches];
                      next[i] = { ...next[i], name: e.target.value };
                      set("color_swatches", next);
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      className="w-28" value={s.hex ?? ""} placeholder="#hex (optional)"
                      onChange={(e) => {
                        const next = [...product.color_swatches];
                        next[i] = { ...next[i], hex: e.target.value };
                        set("color_swatches", next);
                      }}
                    />
                    <div
                      className="h-7 w-7 border border-border"
                      style={{ background: s.hex || PRODUCT_COLORS[s.name] || "#eee" }}
                      title="color preview"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {s.swatch_url
                      ? <img src={s.swatch_url} alt="" className="h-10 w-10 rounded-full object-cover border border-border" />
                      : <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>}
                    <SwatchLibraryPicker
                      onPick={(item) => {
                        const next = [...product.color_swatches];
                        next[i] = { ...next[i], name: next[i].name || item.key, swatch_url: item.url };
                        set("color_swatches", next);
                      }}
                    />
                    <input
                      type="file" accept="image/*" className="text-xs"
                      onChange={(e) => e.target.files?.[0] && swatchUpload(i, e.target.files[0])}
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">photo for this color</span>
                    {s.image_url
                      ? <img src={s.image_url} alt="" className="h-10 w-10 object-cover border border-border" />
                      : <div className="h-10 w-10 bg-muted flex items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>}
                    <input
                      type="file" accept="image/*" className="text-xs w-44"
                      onChange={(e) => e.target.files?.[0] && swatchImageUpload(i, e.target.files[0])}
                    />
                    <button
                      onClick={() => set("color_swatches", product.color_swatches.filter((_, j) => j !== i))}
                      className="link-red text-xs"
                    >remove</button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addColorRow}><Plus className="h-3 w-3 mr-1" />add color</Button>
              <p className="text-xs text-muted-foreground">
                colors list (used by old site & cart): also keep this CSV in sync:
              </p>
              <Input
                value={product.colors.join(", ")} onChange={(e) => set("colors", csv(e.target.value))}
                placeholder="comma-sep, e.g. ivory, navy, black"
              />
            </div>
          </Section>

          {/* SECTION: Gallery */}
          <Section title="product images (gallery)" subtitle="upload 7–9 images. first image is the cover.">
            <input
              type="file" multiple accept="image/*"
              onChange={(e) => handleGalleryUpload(e.target.files)}
              className="text-xs"
            />
            {uploading && <p className="text-xs text-muted-foreground mt-2">uploading…</p>}
            {(product.gallery_urls ?? []).length > 0 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-3">
                {product.gallery_urls.map((url, idx) => (
                  <div key={url} className="relative group aspect-square border border-border">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    {idx === 0 && <span className="absolute bottom-0 left-0 text-[9px] bg-primary text-primary-foreground px-1">cover</span>}
                    <button
                      onClick={() => removeGalleryUrl(url)}
                      className="absolute top-1 right-1 bg-background/90 text-[10px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100"
                    >remove</button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* SECTION: Packaging */}
          <Section title="packaging & shipping">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="package size">
                <Input value={product.package_size ?? ""} onChange={(e) => set("package_size", e.target.value)} placeholder="e.g. 20 × 12 × 6 cm" />
              </Field>
              <Field label="package weight">
                <Input value={product.package_weight ?? ""} onChange={(e) => set("package_weight", e.target.value)} placeholder="e.g. 350 g" />
              </Field>
            </div>
          </Section>

          {/* SECTION: Tags / hashtags */}
          <Section title="tags & hashtags">
            <Field label="filter tags (comma-sep — used by accessories filter)">
              <Input value={product.tags.join(", ")} onChange={(e) => set("tags", csv(e.target.value))} placeholder="e.g. all-season, women, unisex, wearable" />
            </Field>
            <Field label="hashtags (comma-sep — for marketing / social)">
              <Input
                value={product.hashtags.join(", ")}
                onChange={(e) => set("hashtags", csv(e.target.value).map((h) => h.replace(/^#/, "")))}
                placeholder="e.g. veganbeauty, cleanbeauty, madeinhk"
              />
              {product.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.hashtags.map((h) => (
                    <span key={h} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">#{h}</span>
                  ))}
                </div>
              )}
            </Field>
          </Section>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>cancel</Button>
          <Button onClick={onSave}>save product</Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="border-b border-border pb-2">
        <h4 className="text-sm tracking-[0.2em] uppercase text-primary">{title}</h4>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-xs text-muted-foreground mb-1 block">{label}</Label>{children}</div>;
}

/* ============================================================
   ADMINS
   ============================================================ */
function AdminsTab() {
  const list = useServerFn(listAdmins);
  const grant = useServerFn(grantAdminByEmail);
  const revoke = useServerFn(revokeAdmin);
  const [rows, setRows] = useState<Array<{ user_id: string; email: string; created_at: string }>>([]);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try { setRows(await list()); }
    catch (e: any) { toast.error(e.message); }
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await grant({ data: { email } });
      toast.success("admin granted");
      setEmail("");
      load();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const remove = async (user_id: string, em: string) => {
    if (!confirm(`revoke admin from ${em}?`)) return;
    try { await revoke({ data: { user_id } }); toast.success("revoked"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="py-6 space-y-6">
      <form onSubmit={add} className="flex gap-3 items-end max-w-xl">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground mb-1 block">grant admin by email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
        </div>
        <Button type="submit" disabled={busy}>grant</Button>
      </form>
      <p className="text-xs text-muted-foreground">user must have signed up first.</p>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-muted-foreground border-b border-border">
          <th className="py-2">email</th><th>granted</th><th></th>
        </tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.user_id} className="border-b border-border">
              <td className="py-2">{r.email}</td>
              <td className="text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
              <td className="text-right">
                <button onClick={() => remove(r.user_id, r.email)} className="link-red">revoke</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   ORDERS
   ============================================================ */
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
    toast.success("updated"); load();
  };
  return (
    <div className="py-6">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-muted-foreground border-b border-border">
          <th className="py-2">order #</th><th>date</th><th>customer</th><th>total</th><th>status</th><th></th>
        </tr></thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-b border-border align-top">
              <td className="py-3 font-mono text-xs">{o.order_number}</td>
              <td className="text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
              <td><div>{o.full_name}</div><div className="text-xs text-muted-foreground">{o.email}</div></td>
              <td className="num">{o.currency} {Number(o.total).toFixed(2)}</td>
              <td>
                <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="border border-input bg-background px-2 py-1 text-xs">
                  {["pending", "paid", "shipped", "delivered", "cancelled"].map((s) => <option key={s}>{s}</option>)}
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

/* ============================================================
   CUSTOMERS
   ============================================================ */
function CustomersTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [imported, setImported] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [source, setSource] = useState("");
  const load = () => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setRows(data ?? []));
    supabase.from("imported_customers").select("*").order("imported_at", { ascending: false })
      .then(({ data }) => setImported(data ?? []));
  };
  useEffect(() => { load(); }, []);

  const importCsv = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 1) throw new Error("empty file");
      const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const idx = (name: string) => header.indexOf(name);
      const iName = idx("name") >= 0 ? idx("name") : idx("full_name");
      const iEmail = idx("email");
      const iPhone = idx("phone") >= 0 ? idx("phone") : idx("mobile");
      const iNotes = idx("notes");
      const rows = lines.slice(1).map((line) => {
        const cells = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        return {
          full_name: iName >= 0 ? cells[iName] : null,
          email: iEmail >= 0 ? cells[iEmail] : null,
          phone: iPhone >= 0 ? cells[iPhone] : null,
          notes: iNotes >= 0 ? cells[iNotes] : null,
          source: source || file.name,
        };
      }).filter((r) => r.full_name || r.email || r.phone);
      if (rows.length === 0) throw new Error("no valid rows found");
      const { error } = await supabase.from("imported_customers").insert(rows);
      if (error) throw error;
      toast.success(`imported ${rows.length} customers`);
      load();
    } catch (e: any) {
      toast.error(e.message ?? "import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="py-6 space-y-8">
      <div className="border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium">import previous customers (CSV)</h3>
        <p className="text-xs text-muted-foreground">
          headers accepted: <code>name</code> (or <code>full_name</code>), <code>email</code>, <code>phone</code> (or <code>mobile</code>), <code>notes</code>.
        </p>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <Label className="text-xs text-muted-foreground mb-1 block">source label (optional)</Label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. shopify-2023, mailchimp" />
          </div>
          <label className="inline-flex items-center gap-2 text-xs border border-input px-3 py-2 cursor-pointer hover:bg-muted">
            <Plus className="h-3 w-3" />
            {importing ? "importing…" : "upload CSV"}
            <input type="file" accept=".csv,text/csv" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) importCsv(f); e.currentTarget.value = ""; }} />
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">registered accounts ({rows.length})</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground border-b border-border">
            <th className="py-2">name</th><th>mobile</th><th>newsletter</th><th>joined</th>
          </tr></thead>
          <tbody>
            {rows.map((p) => (
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

      <div>
        <h3 className="text-sm font-medium mb-3">imported customers ({imported.length})</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground border-b border-border">
            <th className="py-2">name</th><th>email</th><th>phone</th><th>source</th><th>imported</th>
          </tr></thead>
          <tbody>
            {imported.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="py-2">{p.full_name || "—"}</td>
                <td>{p.email || "—"}</td>
                <td>{p.phone || "—"}</td>
                <td className="text-xs">{p.source || "—"}</td>
                <td className="text-xs">{new Date(p.imported_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   PROMOS
   ============================================================ */
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
    toast.success("saved"); setEditing(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm("delete?")) return;
    await supabase.from("promo_codes").delete().eq("id", id);
    load();
  };
  return (
    <div className="py-6 space-y-6">
      <div className="flex justify-between"><h2>{rows.length} codes</h2><Button onClick={() => setEditing({ ...blankPromo })}>+ new code</Button></div>
      {editing && (
        <div className="border border-border p-6 bg-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="code"><Input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} /></Field>
            <Field label="type">
              <select className="w-full h-9 border border-input bg-background px-3 text-sm" value={editing.discount_type} onChange={(e) => setEditing({ ...editing, discount_type: e.target.value })}>
                <option value="percent">percent</option>
                <option value="fixed">fixed</option>
              </select>
            </Field>
            <Field label="amount"><Input type="number" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} /></Field>
            <Field label="currency (fixed only)"><Input value={editing.currency ?? ""} onChange={(e) => setEditing({ ...editing, currency: e.target.value || null })} placeholder="CAD or HKD" /></Field>
            <Field label="usage limit"><Input type="number" value={editing.usage_limit ?? ""} onChange={(e) => setEditing({ ...editing, usage_limit: e.target.value ? Number(e.target.value) : null })} /></Field>
            <Field label="expires (ISO)"><Input value={editing.expires_at ?? ""} onChange={(e) => setEditing({ ...editing, expires_at: e.target.value || null })} placeholder="2026-12-31" /></Field>
            <Field label="active"><div className="flex h-9 items-center"><Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} /></div></Field>
          </div>
          <div className="flex gap-3"><Button onClick={save}>save</Button><Button variant="outline" onClick={() => setEditing(null)}>cancel</Button></div>
        </div>
      )}
      <table className="w-full text-sm">
        <thead><tr className="text-left text-muted-foreground border-b border-border">
          <th className="py-2">code</th><th>type</th><th>amount</th><th>used</th><th>active</th><th></th>
        </tr></thead>
        <tbody>
          {rows.map((p) => (
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

/* ============================================================
   NEWSLETTER
   ============================================================ */
function NewsletterTab() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setRows(data ?? []));
  }, []);
  const csv = () => {
    const text = "email,created_at\n" + rows.map((r) => `${r.email},${r.created_at}`).join("\n");
    const blob = new Blob([text], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "subscribers.csv"; a.click();
  };
  return (
    <div className="py-6 space-y-4">
      <div className="flex justify-between"><h2>{rows.length} subscribers</h2><Button onClick={csv} variant="outline">export CSV</Button></div>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-muted-foreground border-b border-border"><th className="py-2">email</th><th>subscribed</th></tr></thead>
        <tbody>
          {rows.map((r) => (
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

/* ============================================================
   SWATCH LIBRARY PICKER
   ============================================================ */
function SwatchLibraryPicker({ onPick }: { onPick: (item: { key: string; label: string; url: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<SwatchGroup>("solid");
  const groups: SwatchGroup[] = ["solid", "bi-color", "little-prince", "prints"];
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="h-8 px-2 text-xs gap-1">
          <Palette className="h-3 w-3" /> library
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-3" align="start">
        <div className="flex gap-1 mb-3 flex-wrap">
          {groups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g)}
              className={`text-[10px] uppercase tracking-wider px-2 py-1 border ${
                group === g ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
              }`}
            >
              {g.replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-2 max-h-72 overflow-y-auto">
          {SWATCH_LIBRARY[group].map((item) => (
            <button
              key={item.key}
              type="button"
              title={item.label}
              onClick={() => { onPick(item); setOpen(false); }}
              className="flex flex-col items-center gap-1 p-1 rounded hover:bg-muted transition"
            >
              <img src={item.url} alt={item.label} className="h-12 w-12 rounded-full object-cover border border-border" />
              <span className="text-[9px] text-center leading-tight text-muted-foreground line-clamp-2">{item.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}


/* ============================================================
   HOMEPAGE BANNERS
   ============================================================ */
type BannerSlot = "hero" | "red" | "black" | "grey_large" | "grey_small";
type BannerRow = { slot: BannerSlot; image_url: string | null; link_url: string | null; title: string | null; subtitle: string | null; cta_label: string | null };
const SLOT_META: { slot: BannerSlot; label: string; hint: string }[] = [
  { slot: "hero", label: "hero (top-left wide)", hint: "recommended ~1600×300" },
  { slot: "red", label: "top-right (red block)", hint: "recommended ~400×300" },
  { slot: "black", label: "bottom-left (black band)", hint: "recommended ~1600×400" },
  { slot: "grey_large", label: "bottom-right large grey", hint: "recommended ~400×300" },
  { slot: "grey_small", label: "bottom-right small grey", hint: "recommended ~400×100" },
];

async function uploadBannerImage(file: File, slot: string): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `banners/${slot}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("product-media").upload(path, file, { upsert: true });
  if (error) { toast.error(error.message); return null; }
  const { data } = supabase.storage.from("product-media").getPublicUrl(path);
  return data.publicUrl;
}

function BannersTab() {
  const [rows, setRows] = useState<BannerRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("homepage_banners").select("slot, image_url, link_url, title, subtitle, cta_label");
    const map = new Map<string, BannerRow>((data ?? []).map((r: any) => [r.slot, r as BannerRow]));
    setRows(SLOT_META.map((m) => map.get(m.slot) ?? { slot: m.slot, image_url: null, link_url: null, title: null, subtitle: null, cta_label: null }));
  };
  useEffect(() => { load(); }, []);

  const save = async (slot: BannerSlot, patch: Partial<BannerRow>) => {
    const current = rows.find((r) => r.slot === slot) ?? { slot, image_url: null, link_url: null, title: null, subtitle: null, cta_label: null };
    const next = { ...current, ...patch, slot };
    const { error } = await supabase.from("homepage_banners").upsert(next as any, { onConflict: "slot" });
    if (error) return toast.error(error.message);
    toast.success("saved");
    load();
  };

  const patchRow = (slot: BannerSlot, patch: Partial<BannerRow>) =>
    setRows((prev) => prev.map((r) => r.slot === slot ? { ...r, ...patch } : r));

  const onUpload = async (slot: BannerSlot, file: File) => {
    setBusy(slot);
    const url = await uploadBannerImage(file, slot);
    setBusy(null);
    if (url) await save(slot, { image_url: url });
  };

  return (
    <div className="py-6 space-y-4">
      <p className="text-sm text-muted-foreground">
        upload promotional images and copy for each hero slot on the homepage. leave any field blank to fall back to the default.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SLOT_META.map((m) => {
          const row = rows.find((r) => r.slot === m.slot);
          return (
            <div key={m.slot} className="border border-border p-4 bg-card space-y-3">
              <div>
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.hint}</div>
              </div>
              <div className="aspect-[4/1] bg-muted border border-border overflow-hidden">
                {row?.image_url
                  ? <img src={row.image_url} alt={m.label} className="h-full w-full object-cover" />
                  : <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">no image</div>}
              </div>
              <div className="flex gap-2">
                <label className="inline-flex items-center gap-2 text-xs border border-input px-3 py-2 cursor-pointer hover:bg-muted">
                  <ImageIcon className="h-3 w-3" />
                  {busy === m.slot ? "uploading…" : "upload image"}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(m.slot, f); e.currentTarget.value = ""; }} />
                </label>
                {row?.image_url && (
                  <Button variant="outline" size="sm" onClick={() => save(m.slot, { image_url: null })}>
                    <X className="h-3 w-3 mr-1" /> remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">title (optional)</Label>
                  <Input value={row?.title ?? ""} placeholder="e.g. new arrivals"
                    onChange={(e) => patchRow(m.slot, { title: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">subtitle (optional)</Label>
                  <Input value={row?.subtitle ?? ""} placeholder="short line beneath the title"
                    onChange={(e) => patchRow(m.slot, { subtitle: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">cta label (optional)</Label>
                  <Input value={row?.cta_label ?? ""} placeholder="e.g. shop now"
                    onChange={(e) => patchRow(m.slot, { cta_label: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">link url (optional)</Label>
                  <Input value={row?.link_url ?? ""} placeholder="/innovation or https://…"
                    onChange={(e) => patchRow(m.slot, { link_url: e.target.value })} />
                </div>
                <Button size="sm" onClick={() => save(m.slot, {
                  title: row?.title || null,
                  subtitle: row?.subtitle || null,
                  cta_label: row?.cta_label || null,
                  link_url: row?.link_url || null,
                })}>save text</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   MY JOURNEY (videos, awards, shops, home videos)
   ============================================================ */
type JourneyKind = "video" | "award" | "shop" | "home_video";
type JourneyRow = {
  id?: string;
  kind: JourneyKind;
  title: string;
  subtitle: string | null;
  url: string | null;
  image_url: string | null;
  sort_order: number;
  active: boolean;
};

const JOURNEY_KINDS: { key: JourneyKind; label: string }[] = [
  { key: "video", label: "videos (my journey page)" },
  { key: "award", label: "awards & recognition" },
  { key: "shop", label: "stockists & shops" },
  { key: "home_video", label: "homepage fashion show videos" },
];

async function uploadJourneyImage(file: File, kind: string): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `journey/${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
  const { error } = await supabase.storage.from("product-media").upload(path, file, { upsert: false });
  if (error) { toast.error(error.message); return null; }
  const { data } = supabase.storage.from("product-media").getPublicUrl(path);
  return data.publicUrl;
}

function JourneyTab() {
  const [rows, setRows] = useState<JourneyRow[]>([]);
  const [kind, setKind] = useState<JourneyKind>("video");

  const load = async () => {
    const { data } = await supabase.from("journey_items").select("*").order("sort_order");
    setRows((data ?? []) as JourneyRow[]);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const { error } = await supabase.from("journey_items").insert({
      kind, title: "new item", subtitle: null, url: null, image_url: null, sort_order: rows.length, active: true,
    });
    if (error) return toast.error(error.message);
    load();
  };

  const update = async (id: string, patch: Partial<JourneyRow>) => {
    const { error } = await supabase.from("journey_items").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("delete this item?")) return;
    const { error } = await supabase.from("journey_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const filtered = rows.filter((r) => r.kind === kind);

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-wrap gap-2 items-center">
        {JOURNEY_KINDS.map((k) => (
          <button key={k.key} onClick={() => setKind(k.key)}
            className={`text-xs px-3 py-1.5 border ${kind === k.key ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>
            {k.label}
          </button>
        ))}
        <div className="ml-auto"><Button size="sm" onClick={add}><Plus className="h-3 w-3 mr-1" />add {kind}</Button></div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-xs text-muted-foreground">no items yet. click "add {kind}".</p>}
        {filtered.map((r) => (
          <div key={r.id} className="border border-border bg-card p-4 grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 items-start">
            <div className="space-y-2">
              <div className="aspect-video bg-muted overflow-hidden">
                {r.image_url ? <img src={r.image_url} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>}
              </div>
              <label className="text-[10px] block cursor-pointer hover:text-primary">
                upload image
                <input type="file" accept="image/*" className="hidden"
                  onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const u = await uploadJourneyImage(f, r.kind); if (u) update(r.id!, { image_url: u }); }} />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">title</Label>
                <Input defaultValue={r.title} onBlur={(e) => e.target.value !== r.title && update(r.id!, { title: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">subtitle</Label>
                <Input defaultValue={r.subtitle ?? ""} onBlur={(e) => update(r.id!, { subtitle: e.target.value || null })} />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs text-muted-foreground mb-1 block">url (youtube / external / product page)</Label>
                <Input defaultValue={r.url ?? ""} placeholder="https://…" onBlur={(e) => update(r.id!, { url: e.target.value || null })} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">sort order</Label>
                <Input type="number" defaultValue={r.sort_order} onBlur={(e) => update(r.id!, { sort_order: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">active</Label>
                <div className="flex items-center h-9"><Switch checked={r.active} onCheckedChange={(v) => update(r.id!, { active: v })} /></div>
              </div>
            </div>
            <button onClick={() => remove(r.id!)} className="link-red text-xs">delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ============================================================
   MY JOURNEY — BLOG / JOURNAL CMS
   ============================================================ */

async function uploadJournalImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `journal/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
  const { error } = await supabase.storage.from("product-media").upload(path, file, { upsert: false });
  if (error) { toast.error(error.message); return null; }
  const { data } = supabase.storage.from("product-media").getPublicUrl(path);
  return data.publicUrl;
}

type PostDraft = Omit<JourneyPost, "id"> & { id?: string };

const blankPost = (): PostDraft => ({
  title: "",
  slug: null,
  event_year: new Date().getFullYear(),
  event_date: null,
  event_label: null,
  kind: "journal",
  excerpt: null,
  content: null,
  cover_image_url: null,
  images: [],
  video_url: null,
  links: [],
  published: false,
  sort_order: 0,
});

function JourneyPostsTab() {
  const [posts, setPosts] = useState<JourneyPost[]>([]);
  const [editing, setEditing] = useState<PostDraft | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from("journey_posts")
      .select("*")
      .order("event_year", { ascending: false })
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("sort_order", { ascending: true });
    setLoading(false);
    if (error) return toast.error(error.message);
    setPosts(
      (data ?? []).map((r) => ({
        ...r,
        images: asArray<JourneyImage>(r.images),
        links: asArray<JourneyLink>(r.links),
      })) as JourneyPost[],
    );
  };
  useEffect(() => { load(); }, []);

  const save = async (draft: PostDraft) => {
    if (!draft.title.trim()) return toast.error("a title is required");
    if (!draft.event_year) return toast.error("an event year is required");
    const payload = {
      title: draft.title.trim(),
      slug: draft.slug?.trim() || slugify(`${draft.event_year}-${draft.title}`),
      event_year: Number(draft.event_year),
      event_date: draft.event_date || null,
      event_label: draft.event_label?.trim() || null,
      kind: draft.kind,
      excerpt: draft.excerpt?.trim() || null,
      content: draft.content || null,
      cover_image_url: draft.cover_image_url || null,
      images: draft.images as unknown as Json,
      video_url: draft.video_url?.trim() || null,
      links: draft.links as unknown as Json,
      published: draft.published,
      sort_order: Number(draft.sort_order) || 0,
    };
    const { error } = draft.id
      ? await supabase.from("journey_posts").update(payload).eq("id", draft.id)
      : await supabase.from("journey_posts").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(draft.id ? "post updated" : "post created");
    setEditing(null);
    load();
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`delete "${title}"? this cannot be undone.`)) return;
    const { error } = await supabase.from("journey_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("post deleted");
    load();
  };

  const togglePublished = async (post: JourneyPost) => {
    const { error } = await supabase
      .from("journey_posts")
      .update({ published: !post.published })
      .eq("id", post.id);
    if (error) return toast.error(error.message);
    load();
  };

  if (editing) {
    return <PostEditor draft={editing} onChange={setEditing} onSave={save} onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="py-6 space-y-6">
      <Section
        title="journey posts"
        subtitle="each entry appears on the my journey page, grouped under its event year — shows, events, press coverage, awards."
      >
        <div className="flex justify-end mb-4">
          <Button size="sm" onClick={() => setEditing(blankPost())}>
            <Plus className="h-3 w-3 mr-1" />new post
          </Button>
        </div>

        {loading && <p className="text-xs text-muted-foreground">loading posts…</p>}
        {!loading && posts.length === 0 && (
          <p className="text-xs text-muted-foreground">
            no posts yet. click "new post" to add your first journey entry.
          </p>
        )}

        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="border border-border bg-card p-3 flex flex-wrap items-center gap-4">
              <div className="h-14 w-20 shrink-0 bg-muted overflow-hidden">
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="num text-[11px] tracking-[0.2em] text-muted-foreground">
                    {eventDateLabel(p)}
                  </span>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-primary">
                    {kindLabel(p.kind)}
                  </span>
                </div>
                <p className="text-sm truncate mt-0.5">{p.title || "(untitled)"}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {p.images.length} image{p.images.length === 1 ? "" : "s"}
                  {p.video_url ? " · video" : ""}
                  {p.links.length > 0 ? ` · ${p.links.length} link${p.links.length === 1 ? "" : "s"}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={p.published ? "text-foreground/70" : "text-muted-foreground"}>
                  {p.published ? "published" : "draft"}
                </span>
                <Switch checked={p.published} onCheckedChange={() => togglePublished(p)} />
              </div>
              <div className="flex items-center gap-3 text-xs">
                <button className="link-red" onClick={() => setEditing({ ...p })}>edit</button>
                <button className="link-red" onClick={() => remove(p.id, p.title)}>delete</button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function PostEditor({ draft, onChange, onSave, onCancel }: {
  draft: PostDraft;
  onChange: (d: PostDraft) => void;
  onSave: (d: PostDraft) => void;
  onCancel: () => void;
}) {
  const set = (patch: Partial<PostDraft>) => onChange({ ...draft, ...patch });
  const [busy, setBusy] = useState(false);

  const addImages = async (files: FileList) => {
    setBusy(true);
    const uploaded: JourneyImage[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadJournalImage(file);
      if (url) uploaded.push({ url, caption: null });
    }
    setBusy(false);
    if (uploaded.length) set({ images: [...draft.images, ...uploaded] });
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="text-xs link-red">← back to posts</button>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{draft.published ? "published" : "draft"}</span>
            <Switch checked={draft.published} onCheckedChange={(v) => set({ published: v })} />
          </div>
          <Button size="sm" disabled={busy} onClick={() => onSave(draft)}>
            {busy ? "uploading…" : "save post"}
          </Button>
        </div>
      </div>

      <Section title={draft.id ? "edit post" : "new post"} subtitle="the event year decides where this entry sits on the page.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Field label="title">
              <Input
                value={draft.title}
                placeholder="e.g. fashion show — summer VI: one and all"
                onChange={(e) => set({ title: e.target.value })}
              />
            </Field>
          </div>

          <Field label="event year (required)">
            <Input
              type="number"
              value={draft.event_year}
              onChange={(e) => set({ event_year: Number(e.target.value) })}
            />
          </Field>

          <Field label="exact date (optional)">
            <Input
              type="date"
              value={draft.event_date ?? ""}
              onChange={(e) => set({ event_date: e.target.value || null })}
            />
          </Field>

          <Field label="date label (optional — overrides what's displayed)">
            <Input
              value={draft.event_label ?? ""}
              placeholder="e.g. spring 2021, november 2021"
              onChange={(e) => set({ event_label: e.target.value || null })}
            />
          </Field>

          <Field label="type">
            <select
              value={draft.kind}
              onChange={(e) => set({ kind: e.target.value })}
              className="h-9 w-full border border-input bg-background px-3 text-sm"
            >
              {JOURNEY_POST_KINDS.map((k) => (
                <option key={k.key} value={k.key}>{k.label}</option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2">
            <Field label="short intro (optional — shown in italics under the title)">
              <Input
                value={draft.excerpt ?? ""}
                onChange={(e) => set({ excerpt: e.target.value || null })}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="written content — leave a blank line between paragraphs">
              <Textarea
                rows={12}
                value={draft.content ?? ""}
                onChange={(e) => set({ content: e.target.value || null })}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="cover image (shown full-width at the top of the entry)">
              <div className="flex items-start gap-4">
                <div className="h-24 w-36 shrink-0 bg-muted overflow-hidden">
                  {draft.cover_image_url ? (
                    <img src={draft.cover_image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs block cursor-pointer link-red">
                    upload cover image
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const f = e.target.files?.[0]; if (!f) return;
                      setBusy(true);
                      const url = await uploadJournalImage(f);
                      setBusy(false);
                      if (url) set({ cover_image_url: url });
                    }} />
                  </label>
                  <Input
                    value={draft.cover_image_url ?? ""}
                    placeholder="…or paste an image url"
                    onChange={(e) => set({ cover_image_url: e.target.value || null })}
                  />
                  {draft.cover_image_url && (
                    <button className="text-xs link-red" onClick={() => set({ cover_image_url: null })}>
                      remove cover image
                    </button>
                  )}
                </div>
              </div>
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="gallery images (as many as you like)">
              <div className="space-y-3">
                <label className="text-xs inline-block cursor-pointer link-red">
                  upload images
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                    if (e.target.files?.length) addImages(e.target.files);
                  }} />
                </label>
                {draft.images.map((img, i) => (
                  <div key={i} className="flex items-start gap-3 border border-border p-2">
                    <img src={img.url} alt="" className="h-16 w-24 shrink-0 object-cover bg-muted" />
                    <Input
                      value={img.caption ?? ""}
                      placeholder="caption (optional)"
                      onChange={(e) => {
                        const next = [...draft.images];
                        next[i] = { ...img, caption: e.target.value || null };
                        set({ images: next });
                      }}
                    />
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        className="text-[10px] link-red disabled:opacity-40"
                        disabled={i === 0}
                        onClick={() => {
                          const next = [...draft.images];
                          [next[i - 1], next[i]] = [next[i], next[i - 1]];
                          set({ images: next });
                        }}
                      >move up</button>
                      <button
                        className="text-[10px] link-red"
                        onClick={() => set({ images: draft.images.filter((_, j) => j !== i) })}
                      >remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="video url (youtube or vimeo links are embedded automatically)">
              <Input
                value={draft.video_url ?? ""}
                placeholder="https://www.youtube.com/watch?v=…"
                onChange={(e) => set({ video_url: e.target.value || null })}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="related / external links (press articles, partner sites)">
              <div className="space-y-2">
                {draft.links.map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={l.label}
                      placeholder="link text"
                      onChange={(e) => {
                        const next = [...draft.links];
                        next[i] = { ...l, label: e.target.value };
                        set({ links: next });
                      }}
                    />
                    <Input
                      value={l.url}
                      placeholder="https://…"
                      onChange={(e) => {
                        const next = [...draft.links];
                        next[i] = { ...l, url: e.target.value };
                        set({ links: next });
                      }}
                    />
                    <button
                      className="text-xs link-red shrink-0"
                      onClick={() => set({ links: draft.links.filter((_, j) => j !== i) })}
                    >remove</button>
                  </div>
                ))}
                <button
                  className="text-xs link-red"
                  onClick={() => set({ links: [...draft.links, { label: "", url: "" }] })}
                >+ add a link</button>
              </div>
            </Field>
          </div>

          <Field label="order within the year (lower shows first)">
            <Input
              type="number"
              value={draft.sort_order}
              onChange={(e) => set({ sort_order: Number(e.target.value) })}
            />
          </Field>

          <Field label="url slug (optional — generated from the title if left blank)">
            <Input
              value={draft.slug ?? ""}
              onChange={(e) => set({ slug: e.target.value || null })}
            />
          </Field>
        </div>

        <div className="flex gap-3 mt-6">
          <Button disabled={busy} onClick={() => onSave(draft)}>{busy ? "uploading…" : "save post"}</Button>
          <Button variant="outline" onClick={onCancel}>cancel</Button>
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   PAGE CONTENT — editable prose sections (designer bio, etc.)
   ============================================================ */

type SectionDraft = Omit<PageSection, "id"> & { id?: string };

function PageSectionsTab({
  page = "my-journey",
  title = "design path — page content",
  subtitle = "the first section is the designer bio at the top of the page. add more sections (brand philosophy, anything else) and they appear below it, above the journal.",
  firstLabel = "designer bio (top of page)",
  restLabel = "additional section",
  firstImageLabel = "portrait image (leave blank to keep the current portrait)",
  emptyHint = 'no sections yet — the page is showing its built-in bio. click "add section" to take over the copy.',
}: {
  page?: string;
  title?: string;
  subtitle?: string;
  firstLabel?: string;
  restLabel?: string;
  firstImageLabel?: string;
  emptyHint?: string;
} = {}) {
  const [rows, setRows] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page", page)
      .order("sort_order");
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data ?? []).map((r) => ({ ...r, links: asArray<JourneyLink>(r.links) })) as PageSection[]);
  };
  useEffect(() => { load(); }, [page]);

  const add = async () => {
    const { error } = await supabase.from("page_sections").insert({
      page,
      eyebrow: null,
      heading: "new section",
      subheading: null,
      body: null,
      image_url: null,
      links: [] as unknown as Json,
      sort_order: rows.length,
      active: true,
    });
    if (error) return toast.error(error.message);
    load();
  };

  const save = async (row: SectionDraft) => {
    if (!row.id) return;
    const { error } = await supabase.from("page_sections").update({
      eyebrow: row.eyebrow?.trim() || null,
      heading: row.heading?.trim() || null,
      subheading: row.subheading?.trim() || null,
      body: row.body || null,
      image_url: normalizeUrl(row.image_url),
      links: row.links.map((l) => ({ ...l, url: normalizeUrl(l.url) ?? "" })) as unknown as Json,
      sort_order: Number(row.sort_order) || 0,
      active: row.active,
    }).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("section saved");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("delete this section?")) return;
    const { error } = await supabase.from("page_sections").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="py-6 space-y-6">
      <Section title={title} subtitle={subtitle}>
        <div className="flex justify-end mb-4">
          <Button size="sm" onClick={add}><Plus className="h-3 w-3 mr-1" />add section</Button>
        </div>

        {loading && <p className="text-xs text-muted-foreground">loading…</p>}
        {!loading && rows.length === 0 && (
          <p className="text-xs text-muted-foreground">{emptyHint}</p>
        )}

        <div className="space-y-4">
          {rows.map((row, idx) => (
            <SectionEditor
              key={row.id}
              row={row}
              isFirst={idx === 0}
              firstLabel={firstLabel}
              restLabel={restLabel}
              firstImageLabel={firstImageLabel}
              onSave={save}
              onDelete={() => remove(row.id)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

function SectionEditor({ row, isFirst, firstLabel, restLabel, firstImageLabel, onSave, onDelete }: {
  row: PageSection;
  isFirst: boolean;
  firstLabel: string;
  restLabel: string;
  firstImageLabel: string;
  onSave: (r: SectionDraft) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<PageSection>(row);
  useEffect(() => { setDraft(row); }, [row]);
  const set = (patch: Partial<PageSection>) => setDraft({ ...draft, ...patch });
  const previewUrl = useMediaUrl(draft.image_url);

  return (
    <div className="border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-[10px] tracking-[0.2em] uppercase text-primary">
          {isFirst ? firstLabel : restLabel}
        </span>
        <div className="ml-auto flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">{draft.active ? "visible" : "hidden"}</span>
          <Switch checked={draft.active} onCheckedChange={(v) => set({ active: v })} />
          <button className="link-red" onClick={onDelete}>delete</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="eyebrow (small label above the heading)">
          <Input value={draft.eyebrow ?? ""} onChange={(e) => set({ eyebrow: e.target.value })} />
        </Field>
        <Field label="heading">
          <Input value={draft.heading ?? ""} onChange={(e) => set({ heading: e.target.value })} />
        </Field>
        <Field label="subheading">
          <Input value={draft.subheading ?? ""} onChange={(e) => set({ subheading: e.target.value })} />
        </Field>
      </div>

      <Field label="body — leave a blank line between paragraphs">
        <Textarea rows={10} value={draft.body ?? ""} onChange={(e) => set({ body: e.target.value })} />
      </Field>

      <Field label={isFirst ? firstImageLabel : "image (optional — adds a side-by-side layout)"}>
        <div className="flex items-start gap-4">
          <div className="h-24 w-20 shrink-0 bg-muted overflow-hidden">
            {draft.image_url ? (
              <img src={draft.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="space-y-2 flex-1">
            <label className="text-xs block cursor-pointer link-red">
              upload image
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const f = e.target.files?.[0]; if (!f) return;
                const url = await uploadJournalImage(f);
                if (url) set({ image_url: url });
              }} />
            </label>
            <Input
              value={draft.image_url ?? ""}
              placeholder="…or paste an image url"
              onChange={(e) => set({ image_url: e.target.value || null })}
            />
          </div>
        </div>
      </Field>

      <Field label="links">
        <div className="space-y-2">
          {draft.links.map((l, i) => (
            <div key={i} className="flex gap-2">
              <Input value={l.label} placeholder="link text" onChange={(e) => {
                const next = [...draft.links]; next[i] = { ...l, label: e.target.value }; set({ links: next });
              }} />
              <Input value={l.url} placeholder="https://…" onChange={(e) => {
                const next = [...draft.links]; next[i] = { ...l, url: e.target.value }; set({ links: next });
              }} />
              <button className="text-xs link-red shrink-0"
                onClick={() => set({ links: draft.links.filter((_, j) => j !== i) })}>remove</button>
            </div>
          ))}
          <button className="text-xs link-red"
            onClick={() => set({ links: [...draft.links, { label: "", url: "" }] })}>+ add a link</button>
        </div>
      </Field>

      <div className="flex items-end gap-4">
        <div className="w-40">
          <Field label="sort order">
            <Input type="number" value={draft.sort_order}
              onChange={(e) => set({ sort_order: Number(e.target.value) })} />
          </Field>
        </div>
        <Button size="sm" onClick={() => onSave(draft)}>save section</Button>
      </div>
    </div>
  );
}
