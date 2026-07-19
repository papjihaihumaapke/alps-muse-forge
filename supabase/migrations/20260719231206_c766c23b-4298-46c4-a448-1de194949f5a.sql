
-- Allow public read on product-media bucket (bucket stays private-flagged; access via RLS policy)
DROP POLICY IF EXISTS "Public read product-media" ON storage.objects;
CREATE POLICY "Public read product-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-media');

DROP POLICY IF EXISTS "Authenticated write product-media" ON storage.objects;
CREATE POLICY "Authenticated write product-media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-media');

DROP POLICY IF EXISTS "Service role manage product-media" ON storage.objects;
CREATE POLICY "Service role manage product-media" ON storage.objects
  FOR ALL TO service_role USING (bucket_id = 'product-media') WITH CHECK (bucket_id = 'product-media');
