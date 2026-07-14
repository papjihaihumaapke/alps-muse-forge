
-- 1. homepage_banners text fields
ALTER TABLE public.homepage_banners
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS cta_label TEXT;

-- 2. journey_items
CREATE TABLE IF NOT EXISTS public.journey_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('video','award','shop','home_video')),
  title TEXT NOT NULL,
  subtitle TEXT,
  url TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.journey_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_items TO authenticated;
GRANT ALL ON public.journey_items TO service_role;
ALTER TABLE public.journey_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active journey items" ON public.journey_items FOR SELECT USING (true);
CREATE POLICY "admins manage journey items" ON public.journey_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_journey_items_touch
  BEFORE UPDATE ON public.journey_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. products: external + Canadian stock
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS is_external BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stock_ca INT NOT NULL DEFAULT 0;

-- 4. imported_customers
CREATE TABLE IF NOT EXISTS public.imported_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  source TEXT,
  notes TEXT,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.imported_customers TO authenticated;
GRANT ALL ON public.imported_customers TO service_role;
ALTER TABLE public.imported_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read imported customers" ON public.imported_customers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert imported customers" ON public.imported_customers FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update imported customers" ON public.imported_customers FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete imported customers" ON public.imported_customers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
