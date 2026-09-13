-- The design path bio used to be "whichever my-journey section sorts first",
-- which tied it to the write-ups' ordering. Give it its own page value so the
-- write-ups can always be newest first underneath it.
update public.page_sections
set page = 'my-journey-bio'
where id = (
  select id from public.page_sections
  where page = 'my-journey'
  order by sort_order, created_at
  limit 1
)
and not exists (select 1 from public.page_sections where page = 'my-journey-bio');
