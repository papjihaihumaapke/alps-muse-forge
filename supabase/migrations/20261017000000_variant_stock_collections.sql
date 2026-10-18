-- Oct 13 review with Annie:
--  * stock per colour + size (SKU level), keyed "<colour>|<size>" -> { hk, ca }
--  * collection: the drop within a season (e.g. "summer 1", "summer 2"), so the
--    admin list can be filtered the same way the Google Drive folders are
--  * seasons are sold as spring-summer / fall-winter / all-season
alter table public.products
  add column if not exists variant_stock jsonb not null default '{}'::jsonb,
  add column if not exists collection text;

alter type public.product_season add value if not exists 'spring-summer';
alter type public.product_season add value if not exists 'fall-winter';

