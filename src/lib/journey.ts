/** Shared types + helpers for the My Journey blog/journal CMS. */

export type JourneyImage = { url: string; caption?: string | null };
export type JourneyLink = { label: string; url: string };

export type JourneyPost = {
  id: string;
  title: string;
  slug: string | null;
  event_year: number;
  event_date: string | null;
  event_label: string | null;
  kind: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  images: JourneyImage[];
  video_url: string | null;
  links: JourneyLink[];
  published: boolean;
  sort_order: number;
};

export type PageSection = {
  id: string;
  page: string;
  eyebrow: string | null;
  heading: string | null;
  subheading: string | null;
  body: string | null;
  /** Legacy single image; new sections use `images`. */
  image_url: string | null;
  images: JourneyImage[];
  video_urls: string[];
  entry_date: string | null;
  created_at?: string;
  links: JourneyLink[];
  sort_order: number;
  active: boolean;
};

/** Coerce a raw page_sections row (jsonb + legacy image_url) into a PageSection. */
export function toPageSection(r: Record<string, unknown>): PageSection {
  const images = asArray<JourneyImage>(r.images).filter((i) => i?.url);
  const legacy = typeof r.image_url === "string" && r.image_url ? r.image_url : null;
  return {
    ...(r as unknown as PageSection),
    links: asArray<JourneyLink>(r.links),
    images: images.length ? images : legacy ? [{ url: legacy }] : [],
    video_urls: Array.isArray(r.video_urls) ? (r.video_urls as string[]).filter(Boolean) : [],
  };
}

export type SortOrder = "newest" | "oldest";

/**
 * Newest write-up first, by when it was added. Ordering on the entry date used
 * to push a freshly published write-up below older ones whenever its date was
 * earlier, so insertion order is the rule: a new write-up is always on top.
 */
export function newestFirst(a: PageSection, b: PageSection): number {
  const ka = a.created_at ?? a.entry_date ?? "";
  const kb = b.created_at ?? b.entry_date ?? "";
  return kb.localeCompare(ka);
}

/** Write-ups in the reader's chosen order; `newest` is the default everywhere. */
export function sortSections(list: PageSection[], order: SortOrder): PageSection[] {
  const sorted = [...list].sort(newestFirst);
  return order === "newest" ? sorted : sorted.reverse();
}

export const JOURNEY_POST_KINDS = [
  { key: "journal", label: "journal entry" },
  { key: "fashion_show", label: "fashion show" },
  { key: "event", label: "event" },
  { key: "press", label: "press coverage" },
  { key: "award", label: "award" },
  { key: "collaboration", label: "collaboration" },
] as const;

export function kindLabel(kind: string): string {
  return JOURNEY_POST_KINDS.find((k) => k.key === kind)?.label ?? kind.replace(/_/g, " ");
}

/** jsonb columns arrive as unknown — coerce defensively so a bad row can't blank the page. */
export function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/** "2021 — spring" style label for an entry's date line. */
export function eventDateLabel(post: Pick<JourneyPost, "event_year" | "event_date" | "event_label">): string {
  if (post.event_label) return post.event_label;
  if (post.event_date) {
    const d = new Date(`${post.event_date}T00:00:00`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }).toLowerCase();
    }
  }
  return String(post.event_year);
}

/** Split written content into paragraphs on blank lines. */
export function toParagraphs(content: string | null): string[] {
  if (!content) return [];
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Turn a YouTube/Vimeo watch URL into an embeddable one. Returns null if not embeddable. */
export function toEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const youtube =
    trimmed.match(/youtube\.com\/watch\?v=([\w-]+)/) ??
    trimmed.match(/youtu\.be\/([\w-]+)/) ??
    trimmed.match(/youtube\.com\/embed\/([\w-]+)/) ??
    trimmed.match(/youtube\.com\/shorts\/([\w-]+)/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = trimmed.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
