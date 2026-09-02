-- 1. Ordered gallery images for products (additive; does not touch gallery_urls).
alter table public.products
  add column if not exists image_urls text[] not null default '{}';

-- 2. Recognitions (milestones) shown on /my-journey, newest first.
create table if not exists public.milestones (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  occurred_on date not null default current_date,
  link_url    text,
  image_urls  text[] not null default '{}',
  hidden      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists milestones_occurred_on_idx
  on public.milestones (occurred_on desc, created_at desc);

-- Grants (required for PostgREST/Data API access on public schema).
grant select on public.milestones to anon;
grant select, insert, update, delete on public.milestones to authenticated;
grant all on public.milestones to service_role;

alter table public.milestones enable row level security;

drop policy if exists "Public view visible milestones" on public.milestones;
create policy "Public view visible milestones" on public.milestones
  for select to anon, authenticated
  using (hidden = false or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage milestones" on public.milestones;
create policy "Admins manage milestones" on public.milestones
  for all to authenticated
  using  (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger for milestones.
drop trigger if exists milestones_touch_updated_at on public.milestones;
create trigger milestones_touch_updated_at
  before update on public.milestones
  for each row execute function public.touch_updated_at();