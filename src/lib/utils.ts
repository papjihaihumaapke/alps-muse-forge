import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes a url typed or pasted into the admin panel. A bare host like
 * "example.com/page" is otherwise treated by the browser as a path relative to
 * our own domain, which is how admin-entered links ended up pointing at
 * alps.../example.com and pasted image urls rendered broken.
 * Root-relative paths, data/blob urls and already-absolute urls pass through.
 */
export function normalizeUrl(value: string | null | undefined): string | null {
  const v = (value ?? "").trim();
  if (!v) return null;
  if (/^(https?:|data:|blob:|mailto:|tel:)/i.test(v)) return v;
  if (v.startsWith("//")) return `https:${v}`;
  if (v.startsWith("/")) return v; // our own asset, keep as-is
  return `https://${v.replace(/^\/+/, "")}`;
}
