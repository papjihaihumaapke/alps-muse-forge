alter table public.milestones
  add column if not exists section text not null default 'recognitions'
    check (section in ('recognitions', 'design-path')),
  add column if not exists tags text[] not null default '{}';

drop index if exists public.milestones_occurred_on_idx;

create index if not exists milestones_section_order_idx
  on public.milestones (section, occurred_on desc, created_at desc);

grant select on public.milestones to anon, authenticated;
grant insert, update, delete on public.milestones to authenticated;
grant all on public.milestones to service_role;

create policy "Public read site images" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'site-images');

create policy "Admins upload site images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins update site images" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete site images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));