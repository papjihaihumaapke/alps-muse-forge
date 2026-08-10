-- My Journey blog/journal CMS
-- 1. page_sections — admin-editable prose blocks (designer bio, brand philosophy, …)
-- 2. journey_posts — journal entries (fashion shows, events, press coverage)

-- ---------------------------------------------------------------------------
-- 1. page_sections
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL DEFAULT 'my-journey',
  heading TEXT,
  eyebrow TEXT,
  subheading TEXT,
  body TEXT,
  image_url TEXT,
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_sections_page ON public.page_sections (page, sort_order);

GRANT SELECT ON public.page_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_sections TO authenticated;
GRANT ALL ON public.page_sections TO service_role;

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read page sections" ON public.page_sections FOR SELECT USING (true);
CREATE POLICY "admins manage page sections" ON public.page_sections FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_page_sections_touch
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 2. journey_posts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.journey_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  -- event timing: year is required for grouping; date/label are optional refinements
  event_year INT NOT NULL,
  event_date DATE,
  event_label TEXT,
  kind TEXT NOT NULL DEFAULT 'journal',
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  -- [{ url, caption }]
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  video_url TEXT,
  -- [{ label, url }]
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journey_posts_timeline
  ON public.journey_posts (event_year DESC, event_date DESC NULLS LAST, sort_order);

GRANT SELECT ON public.journey_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_posts TO authenticated;
GRANT ALL ON public.journey_posts TO service_role;

ALTER TABLE public.journey_posts ENABLE ROW LEVEL SECURITY;

-- anon sees published posts only; admins see everything (for previewing drafts)
CREATE POLICY "public read published journey posts" ON public.journey_posts FOR SELECT
  USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage journey posts" ON public.journey_posts FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_journey_posts_touch
  BEFORE UPDATE ON public.journey_posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Seed the designer bio so the page keeps its current copy, now editable
-- ---------------------------------------------------------------------------
INSERT INTO public.page_sections (page, eyebrow, heading, subheading, body, sort_order, active, links)
SELECT
  'my-journey',
  'designer',
  'my journey',
  'timeless with a twist · made to make a difference',
  concat_ws(E'\n\n',
    'designer annie ling views fashion as an expression of identity, confidence, and modern living. after studying fashion design and technology in canada and completing an MBA at the university of leicester in the united kingdom, she founded ALPS Annie Ling in 2015 — a contemporary fashion label where timeless elegance meets innovation.',
    'with a design language rooted in simplicity, annie is drawn to clean silhouettes elevated by unexpected details, advanced textiles, and intelligent functionality. her collections are created for those who embrace individuality, lead active lifestyles, and appreciate refined design with purpose.',
    'in addition to her eponymous label, annie has worked extensively as a design consultant, partnering with global brands on apparel, lingerie, accessories, and technology-driven product development.',
    'named after annie ling''s initials and inspired by the enduring spirit of the alps, the brand reflects resilience, innovation, and exploration. ALPS Annie Ling seamlessly combines timeless aesthetics with sports-inspired functionality and textile innovation, creating versatile, enduring garments designed for contemporary life.'
  ),
  0,
  true,
  '[{"label":"design incubation programme (dip) alumni","url":"https://www.hkdesignincubation.org/?route=incubation_inner&category=11&company=2"},{"label":"fashion incubation programme (fip) alumni","url":"https://hkfip.org/en/brand/alps-annie-ling/"}]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.page_sections WHERE page = 'my-journey'
);
