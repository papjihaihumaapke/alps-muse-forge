/**
 * Media stored in the private `product-media` bucket is saved as a
 * `/storage/v1/object/public/...` url, which 400s while the bucket stays
 * private. These helpers turn such a url into a short-lived signed url so
 * admin-uploaded images (milestones, journal, banners) actually render.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeUrl } from "@/lib/utils";

const MEDIA_BUCKETS = ["product-media", "site-images"] as const;

/** Returns the bucket and object path, or null when this is not a managed media URL. */
function storedObject(url: string): { bucket: string; path: string } | null {
  for (const bucket of MEDIA_BUCKETS) {
    for (const access of ["public", "sign", "authenticated"]) {
      const marker = `/storage/v1/object/${access}/${bucket}/`;
      const idx = url.indexOf(marker);
      if (idx === -1) continue;

      const rawPath = url.slice(idx + marker.length).split("?")[0];
      if (!rawPath) return null;
      return { bucket, path: decodeURIComponent(rawPath) };
    }
  }
  return null;
}

export async function resolveMediaUrl(url: string | null | undefined): Promise<string | null> {
  const normalized = normalizeUrl(url);
  if (!normalized) return null;
  const object = storedObject(normalized);
  if (!object) return normalized;
  const { data } = await supabase.storage.from(object.bucket).createSignedUrl(object.path, 60 * 60);
  return data?.signedUrl ?? normalized;
}

/** Hook flavour for components rendering a single stored image. */
export function useMediaUrl(url: string | null | undefined): string | null {
  const [resolved, setResolved] = useState<string | null>(() => {
    const n = normalizeUrl(url);
    return n && storedObject(n) ? null : n;
  });

  useEffect(() => {
    let alive = true;
    const normalized = normalizeUrl(url);
    setResolved(normalized && storedObject(normalized) ? null : normalized);
    resolveMediaUrl(url).then((v) => {
      if (alive) setResolved(v);
    });
    return () => {
      alive = false;
    };
  }, [url]);

  return resolved;
}
