This is a big list — I've grouped it into phases so we can ship the quick, high-impact fixes first and tackle the heavy data/import work in follow-ups. Each phase is a separate turn so you can review before we spend credits on the next one.

---

## Phase 1 — Immediate fixes (small, no re-import needed)

**Footer + contact (from your marked-up screenshots)**
- Remove mobile number `+1 (604) 505-2223` from footer entirely.
- Fix email: `cs@ALPSannieling.com` → correct spelling (`cs@ALPSannieling.com` is currently shown; you wrote `cs@annieling.com` in the reference — confirm which is correct).
- Social icons: split into **ALPS**: 2× Facebook, 2× Instagram, 1× Twitter, 1× YouTube, 1× TikTok, and **vegan skincare**: 1× Facebook + 2× Instagram. I'll need the actual URLs for the second FB and second IG (please paste).
- Re-balance footer columns to match your reference layout (Asia Miles | size info | features | awards | find us | pre-order/contact us).
- Make every footer line clickable:
  - Feature names → open popup with the icon artwork + description (same popover pattern already on product pages).
  - Size info (`kids` / `men` / `women` / `unisex`) → popup with a sizing chart per group.
  - Awards → popup with certificate image + collection photos (needs uploads — see Phase 3).
  - `Asia Miles`, social handles → external links.

**Designer bio (`/my-journey` + homepage `04 / designer`)**
- Replace AI-generated model photo with an image from your Drive (please point me at the correct file/folder).
- Replace bio copy — please paste the correct bio text.

**Homepage layout balance**
- Redo the bottom section grid using your reference screenshot as the target proportion.
- Wire feature-icon click → popover (currently non-interactive there).

---

## Phase 2 — Product page fixes (data-layer, one-shot SQL/admin)

- **Colour dots on innovation category tiles**: audit `color_swatches` for every product and swap to the correct branded swatches from the swatch library.
- **Feature icons on innovation cards**: ensure each product's `features` array matches its real fabric tech (currently mismatched).
- **Prices**: I need a source-of-truth price list (CSV or paste per SKU) — the current values were placeholder-imported.
- **Sizes offered**: same — one authoritative list per style.

I can do all of the above via SQL updates once you provide the reference sheet.

---

## Phase 3 — Full re-import from your Drive (the big one)

Current import pulled only 1 image per style and dumped everything into flat categories. To fix items 1, 2, 5, 6, and 8 (video) properly, I'll rewrite the sync to:

- Walk each **sub-category folder** (overcoat / jacket / top / skirt / shorts / pants / one-piece / etc.) and set `subcategory` on every product.
- For each style folder, upload **every** image (typically 6–9) into `gallery_urls`.
- Detect `.mp4`/`.mov` in the folder and store into a new `video_urls` column, then render on the product page.
- Read a `description.txt` / `README.md` per style if you include one, and populate: **a) style description, b) design features, c) technology benefits, d) care instructions, e) sizes, f) colours, g) technology icon keys**. If those aren't in the folder, I'll need a spreadsheet.

Before I run this: please confirm the Drive folder is fully organised the way you want (sub-category → style → images + video + description file). Re-running the import against a half-organised folder wastes credits.

---

## Phase 4 — Admin panel additions

- Sub-category dropdown (overcoat/jacket/top/skirt/etc.) on the product editor.
- Video upload field.
- Awards manager: upload certificate image + linked collection photos.
- Size-chart manager: 4 charts (kids / women / men / unisex), edited in admin, shown in footer popup.

---

## What I need from you to start Phase 1 right now
1. Correct email address (confirm spelling).
2. URLs for the second Facebook page and second Instagram account.
3. TikTok URL (you mentioned 2 "taboos" — I assume TikTok?).
4. Correct designer bio copy.
5. Which Drive image to use for Annie's portrait.

Reply with those and I'll ship Phase 1 in the next turn.