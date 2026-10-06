-- Product videos (runway, styling, fabric demos): YouTube / Vimeo links or
-- uploaded video file URLs, in display order.
alter table public.products
  add column if not exists video_urls text[] not null default '{}';
