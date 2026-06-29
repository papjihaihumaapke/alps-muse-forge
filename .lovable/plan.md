## Goals

1. Pull all product info (images, prices, colors, descriptions, tech specs) from your Google Drive folder.
2. Move products from the static file (`src/lib/alps-data.ts`) into the Lovable Cloud database so the admin panel can truly edit them.
3. Replace the single "personal care" section with the 5 vegan sub-categories.
4. Fix missing fabric icons (recycle / vegan / wind-resistant / wrinkle-resistant) and the skincare icon.
5. Show every product image (7–9 per item) in the product gallery.
6. Fix the price display — use the color icons from Drive and the prices from the master price sheet.
7. Admin: list every product, add/edit/delete, and tag each with a season.

## Phase 1 — Database schema (this turn)

Create tables in Lovable Cloud:
- `products` (expand the existing one): add `subcategory`, `season` (`spring|summer|fall|winter|all-season`), `tech_info`, `description`, `gallery_urls[]`, `color_swatches` (jsonb: `[{name, hex, swatch_url}]`), `price_cad`, `price_hkd`, `display_order`, `active`.
- `product_categories` lookup: `slug`, `name`, `parent_slug`, `display_order`. Seeded with existing top-level categories plus the 5 new vegan sub-categories under `personal-care`:
  - `vegan-skincare`, `vegan-personal-care`, `vegan-makeup`, `vegan-supplement`, `vegan-tech`
- Storage bucket `product-media` (public) for images uploaded from Drive / admin.
- RLS: public read for `active=true`; admin-only write (uses existing `has_role(_, 'admin')`).

## Phase 2 — Drive sync (next turn, after schema approved)

A one-time admin-triggered server function `syncProductsFromDrive` that:
- Walks the 5 vegan sub-folders + 4 ALPS apparel/accessories folders.
- For each product folder: uploads all images to the `product-media` bucket, parses the price `.xls` + `Inventory` PDF, extracts color/swatch references, and upserts a `products` row.
- Parses the `Properties-features icons 2026` PDFs to confirm feature-key coverage.
- Idempotent: re-runs update rows in place.

## Phase 3 — Frontend

- Replace `PRODUCTS` static reads with `useQuery` against the DB via a public `listProducts` server fn (publishable client, anon SELECT on `active`).
- `Header` nav: keep apparel categories; under "personal care" add a dropdown for the 5 vegan sub-categories.
- New routes: `/personal-care/vegan-skincare`, `/vegan-personal-care`, `/vegan-makeup`, `/vegan-supplement`, `/vegan-tech` (reuse `CategoryView`).
- Product detail: render full `gallery_urls` instead of one image; render `color_swatches` from DB so each product shows its correct swatch.
- Add the 4 missing fabric icons (recycle, vegan, wind-resistant, wrinkle-resistant) as PNG assets; update skincare icon.
- Price color: render in `--brand-red` (`text-primary`) on cards + detail page, instead of the current muted grey.

## Phase 4 — Admin

Expand `/admin`:
- Table of every product (paginated, searchable by name/category/season).
- Row actions: edit, deactivate, delete.
- Create modal: name, category + subcategory, season, prices, colors (multi), sizes, features (multi), description, tech_info, gallery uploads (uses storage bucket).
- Bulk action: re-run Drive sync.
- Season filter chips so you can quickly see e.g. all "winter" items.

## Technical notes

- Admin writes go through `createServerFn` + `requireSupabaseAuth` + `has_role(_, 'admin')` check.
- Public reads use a server publishable client to avoid the `JWT got 1 part` admin-client issue on Data API reads.
- The Drive sync runs as an admin-only `createServerFn`; images are uploaded to Supabase Storage and the public URLs are persisted (so we are not dependent on Drive at runtime).

## Open questions before I start coding

I have enough to begin Phase 1 (schema). Two things I'll need from you between phases:

1. **Drive folder access for sync** — the connector is now linked, so this is good.
2. **Seasons** — confirm the set `spring | summer | fall | winter | all-season` (or you can specify e.g. `SS26 / FW26` instead).

If this matches what you want, approve and I'll start with the schema migration, then move category-by-category through the Drive sync.