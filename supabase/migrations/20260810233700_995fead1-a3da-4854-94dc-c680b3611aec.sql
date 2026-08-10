CREATE TABLE public.journey_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL DEFAULT 'post',
  title text NOT NULL,
  slug text UNIQUE,
  excerpt text,
  content text,
  event_year integer NOT NULL,
  event_date date,
  event_label text,
  cover_image_url text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  video_url text,
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.journey_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_posts TO authenticated;
GRANT ALL ON public.journey_posts TO service_role;

ALTER TABLE public.journey_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published journey posts"
  ON public.journey_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "admins manage journey posts"
  ON public.journey_posts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX journey_posts_year_sort_idx ON public.journey_posts (event_year DESC, sort_order);

CREATE TRIGGER trg_journey_posts_touch
  BEFORE UPDATE ON public.journey_posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();