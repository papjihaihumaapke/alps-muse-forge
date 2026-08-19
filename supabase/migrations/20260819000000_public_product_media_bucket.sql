-- Admin-uploaded images (journal, milestones, banners, products) are served via
-- getPublicUrl -> /storage/v1/object/public/product-media/...  That route checks
-- the bucket's `public` flag, not the RLS SELECT policy, so a private bucket
-- answers "Bucket not found" and every image renders broken for visitors.
UPDATE storage.buckets SET public = true WHERE id = 'product-media';
