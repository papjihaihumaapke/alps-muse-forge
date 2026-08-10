CREATE TABLE public.page_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page text NOT NULL DEFAULT 'my-journey',
  eyebrow text,
  heading text,
  subheading text,
  body text,
  image_url text,
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.page_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_sections TO authenticated;
GRANT ALL ON public.page_sections TO service_role;

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active page sections"
  ON public.page_sections FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admins manage page sections"
  ON public.page_sections FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX page_sections_page_sort_idx ON public.page_sections (page, sort_order);

CREATE TRIGGER trg_page_sections_touch
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();