/**
 * Media stored in the private `product-media` bucket is saved as a
 * `/storage/v1/object/public/...` url, which 400s while the bucket stays
 * private. These helpers turn such a url into a short-lived signed url so
 * admin-uploaded images (milestones, journal, banners) actually render.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeUrl } from "@/lib/utils";

const BUCKET = "product-media";

/** Returns the object path inside the bucket, or null when not a bucket url. */
function bucketPath(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

export async function resolveMediaUrl(url: string | null | undefined): Promise<string | null> {
  const normalized = normalizeUrl(url);
  if (!normalized) return null;
  const path = bucketPath(normalized);
  if (!path) return normalized;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? normalized;
}

/** Hook flavour for components rendering a single stored image. */
export function useMediaUrl(url: string | null | undefined): string | null {
  const [resolved, setResolved] = useState<string | null>(() => {
    const n = normalizeUrl(url);
    return n && bucketPath(n) ? null : n;
  });

  useEffect(() => {
    let alive = true;
    resolveMediaUrl(url).then((v) => {
      if (alive) setResolved(v);
    });
    return () => {
      alive = false;
    };
  }, [url]);

  return resolved;
}
