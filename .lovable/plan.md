# Homepage + branding fixes

Addressing the unresolved items from earlier feedback plus today's notes.

## 1. Homepage hero proportions
- Hero image: reduce to ~50% of current height (heading image was too tall).
- The right red panel should be the reference height — match hero to that.
- Below hero: 5 category tiles (innovation / contemporary / accessories / collaborations / personal care) shown **full width** on desktop and mobile, larger thumbnails, equal sizing. Each tile = image + "ALPS / category name" label + "view all" link.

## 2. Remove "brand film / ALPS fashion shows" video section
Per the red X in the reference — drop it entirely from the homepage.

## 3. Top navigation labels
Remove the "alps " prefix on every nav item since the ALPS logo is already top-left. Labels become: `innovation`, `contemporary`, `accessories`, `collaborations`, `personal care`, `my journey`, `press`, `contact`.

## 4. Personal care icon
Replace the dull dark-grey bottle icon with the new lighter-grey version (uploaded `image-13.png` / `fd28a122…`). Used in:
- homepage category tile for "vegan skin & personal care"
- anywhere else this icon appears

## 5. Page-loading dots
The route-transition / suspense loading dots should animate in the brand palette: **black, red, grey** (cycling), instead of the default neutral.

## 6. Fabric technology icon grid
Per the Drive folder + reference image:
- Add the 3 new icons: **wind resistant**, **wrinkle resistant**, plus the updated **vegan** icon (already shown). Total = 24 features.
- Re-upload / replace all 24 icons from the new Drive set so they are **uniformly sized** (current bluesign + OEKO-TEX render larger than the line-art ones).
- Tighten label-to-icon spacing so each title clearly belongs to the icon **below** it (not floating between rows).
- Keep section title red (`TEXTILE SCIENCE` / `Engineered fabric technology` heading style), body copy black. Ignore any blue in the source doc.

## 7. Typography
Switch site fonts back to the pair you specified on May 18 (the one I currently have is wrong). **I don't have that font name in context right now — please confirm the exact heading + body font names so I can wire them via `<link>` in the root head and `@theme` in `src/styles.css`.**

## 8. Features chip area on homepage
Remove the old inline "features" grid block on the homepage (red X in reference). The full interactive icon grid lives on the Innovation page; on the homepage, just keep the list of feature names in the footer column, and a place on each **product** page showing which features that product has (already wired via the chip popovers on product detail — no change needed there).

---

## Files I'll touch
- `src/components/alps/Header.tsx` — strip "alps " prefix from nav labels
- `src/routes/index.tsx` + homepage section components — hero sizing, 5-tile category row full-width, remove brand-film + features blocks
- `src/components/alps/FabricTechnology.tsx` + `src/lib/feature-icons.ts` + `src/lib/alps-data.ts` — add wind/wrinkle resistant, swap icon set, normalise sizing, tighten labels
- `src/assets/features/*` — replace 24 icon assets from your Drive folder
- New personal-care bottle icon asset → swap in homepage tile
- `src/routes/__root.tsx` — add font `<link>` tags (after you confirm font names)
- `src/styles.css` — register fonts in `@theme`, add brand-coloured loading-dot animation
- Loading indicator component (router pending UI) — black/red/grey dots

## One blocker
**Font names** — please drop the exact font family names (heading + body) from your May 18 message so I can load them correctly. I'll execute everything else as soon as you confirm, or I can proceed with the rest first and patch fonts in a follow-up if you prefer.
