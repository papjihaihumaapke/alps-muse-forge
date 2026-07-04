CREATE TABLE public.homepage_banners (
  slot TEXT PRIMARY KEY,
  image_url TEXT,
  link_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.homepage_banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_banners TO authenticated;
GRANT ALL ON public.homepage_banners TO service_role;
ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners readable by all" ON public.homepage_banners FOR SELECT USING (true);
CREATE POLICY "admins manage banners" ON public.homepage_banners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.homepage_banners (slot) VALUES ('hero'), ('red'), ('black'), ('grey_large'), ('grey_small')
  ON CONFLICT DO NOTHING;