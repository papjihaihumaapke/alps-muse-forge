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

// Signed urls are reused until close to expiry. Each signing gives a new token, so
// re-signing on every refetch would make the browser download every photo again.
const SIGN_SECONDS = 60 * 60 * 24;
const REUSE_MS = (SIGN_SECONDS - 60 * 60) * 1000;
const signedCache = new Map<string, { url: string; at: number }>();

function cachedSigned(key: string): string | null {
  const hit = signedCache.get(key);
  return hit && Date.now() - hit.at < REUSE_MS ? hit.url : null;
}

/**
 * Signs many stored-media urls in one request per bucket. Returns a map from each
 * original url to its signed url; urls that aren't managed media (or fail) are left out.
 */
export async function signMediaUrls(urls: Iterable<string | null | undefined>): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const todo = new Map<string, Map<string, string[]>>(); // bucket -> path -> original urls
  for (const raw of urls) {
    if (!raw || out.has(raw)) continue;
    const object = storedObject(normalizeUrl(raw) ?? raw);
    if (!object) continue;
    const key = `${object.bucket}/${object.path}`;
    const hit = cachedSigned(key);
    if (hit) {
      out.set(raw, hit);
      continue;
    }
    const paths = todo.get(object.bucket) ?? new Map<string, string[]>();
    paths.set(object.path, [...(paths.get(object.path) ?? []), raw]);
    todo.set(object.bucket, paths);
  }
  await Promise.all(
    [...todo].map(async ([bucket, paths]) => {
      const { data } = await supabase.storage.from(bucket).createSignedUrls([...paths.keys()], SIGN_SECONDS);
      for (const row of data ?? []) {
        if (!row.path || !row.signedUrl || row.error) continue;
        signedCache.set(`${bucket}/${row.path}`, { url: row.signedUrl, at: Date.now() });
        for (const original of paths.get(row.path) ?? []) out.set(original, row.signedUrl);
      }
    }),
  );
  return out;
}

export async function resolveMediaUrl(url: string | null | undefined): Promise<string | null> {
  const normalized = normalizeUrl(url);
  if (!normalized) return null;
  if (!storedObject(normalized)) return normalized;
  const signed = await signMediaUrls([normalized]);
  return signed.get(normalized) ?? normalized;
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
