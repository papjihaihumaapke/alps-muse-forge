-- Design Path / Milestones write-ups (page_sections): several images and
-- videos per section, and a date that orders them newest first.
alter table public.page_sections
  -- [{ "url": "https://…", "caption": "…" }, …] in display order.
  add column if not exists images jsonb not null default '[]'::jsonb,
  -- YouTube / Vimeo links or uploaded video file URLs, in display order.
  add column if not exists video_urls text[] not null default '{}',
  -- The date the write-up is about. Newest first; undated sections fall back
  -- to when they were added.
  add column if not exists entry_date date;

-- Keep existing single images by moving them into the gallery list.
update public.page_sections
set images = jsonb_build_array(jsonb_build_object('url', image_url))
where image_url is not null and images = '[]'::jsonb;
