
-- 1) Season enum
DO $$ BEGIN
  CREATE TYPE public.product_season AS ENUM ('spring','summer','fall','winter','all-season');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Extend products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS season public.product_season NOT NULL DEFAULT 'all-season',
  ADD COLUMN IF NOT EXISTS tech_info TEXT,
  ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS color_swatches JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

-- 3) Tighten products RLS: public read non-hidden, admin write
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='products' LOOP
    EXECUTE format('DROP POLICY %I ON public.products', r.policyname);
  END LOOP;
END $$;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

CREATE POLICY "public can read visible products"
  ON public.products FOR SELECT TO anon, authenticated
  USING (hidden = false);

CREATE POLICY "admins can read all products"
  ON public.products FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins can insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins can update products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4) Categories table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  parent_slug TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_categories TO anon, authenticated;
GRANT ALL ON public.product_categories TO service_role;

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read categories"
  ON public.product_categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins manage categories"
  ON public.product_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5) Seed categories (idempotent)
INSERT INTO public.product_categories (slug, name, parent_slug, display_order) VALUES
  ('innovation',         'innovation',         NULL, 10),
  ('contemporary',       'contemporary',       NULL, 20),
  ('accessories',        'accessories',        NULL, 30),
  ('collaborations',     'collaborations',     NULL, 40),
  ('personal-care',      'personal care',      NULL, 50),
  ('vegan-skincare',     'vegan skincare',          'personal-care', 51),
  ('vegan-personal-care','vegan personal care',     'personal-care', 52),
  ('vegan-makeup',       'vegan makeup',            'personal-care', 53),
  ('vegan-supplement',   'vegan supplement',        'personal-care', 54),
  ('vegan-tech',         'vegan skin & personal care technology', 'personal-care', 55)
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      parent_slug = EXCLUDED.parent_slug,
      display_order = EXCLUDED.display_order;

-- 6) updated_at trigger for product_categories
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_product_categories_touch ON public.product_categories;
CREATE TRIGGER trg_product_categories_touch
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_products_touch ON public.products;
CREATE TRIGGER trg_products_touch
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
