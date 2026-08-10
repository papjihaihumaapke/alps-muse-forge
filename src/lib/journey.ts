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
  image_url: string | null;
  links: JourneyLink[];
  sort_order: number;
  active: boolean;
};

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
