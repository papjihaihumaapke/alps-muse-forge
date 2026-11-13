-- The "personal-care" category is left over from the first import. No storefront page
-- lists it, but those rows kept showing in the admin, so prices typed there never
-- reached the site: the live copies (vegan-skincare / vegan-makeup) stayed at 0.
-- Copy each legacy price onto its live copy (only where that is still unpriced),
-- then hide the legacy rows.

with pairs(legacy_slug, live_slug) as (
  values
    ('pc-a-06a-boo-se-boo',               'pc-boo-se-boo'),
    ('pc-c-snow-enzyme-water-based-clea', 'pc-snow-enzyme-water-based-cleanser-ex'),
    ('pc-b-balance-gel-cleanser',         'pc-balance-gel-cleanser'),
    ('pc-a-dermatology-cream',            'pc-dermatology-cream'),
    ('pc-b-radiansome100-toner',          'pc-radiansome100-toner'),
    ('pc-b-radiansome100-essence',        'pc-radiansome100-essence'),
    ('pc-b-radiansome100-cream',          'pc-radiansome100-cream'),
    ('pc-a-cleansing-powder',             'pc-cleansing-powder'),
    ('pc-vegan-make-up-butter-semi-matt', 'pc-vegan-make-up-butter-semi-matte-lip-color'),
    ('pc-vegan-make-up-velvet-matte-lip', 'pc-vegan-make-up-velvet-matte-lip-color')
)
update public.products live
set price_cad = legacy.price_cad,
    price_hkd = legacy.price_hkd
from pairs
join public.products legacy on legacy.slug = pairs.legacy_slug
where live.slug = pairs.live_slug
  and coalesce(live.price_cad, 0) = 0
  and coalesce(live.price_hkd, 0) = 0;

update public.products set hidden = true where category = 'personal-care';
