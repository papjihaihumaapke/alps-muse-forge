import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  sortSections,
  toPageSection,
  toParagraphs,
  type JourneyImage,
  type PageSection,
} from "@/lib/journey";
import { useMediaUrl } from "@/lib/storage-url";
import { localizeAssetUrl } from "@/lib/local-asset-images";
import { normalizeUrl } from "@/lib/utils";
import { MediaStrip } from "@/components/alps/MediaStrip";

/** page_sections.page value for "the science behind" write-ups (one row per technology). */
export const SCIENCE_PAGE = "science-behind";

/** The science behind write-ups, newest first. Empty until the first one is added in the admin panel. */
export function useScienceSections() {
  return useQuery({
    queryKey: ["page-sections", SCIENCE_PAGE],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page", SCIENCE_PAGE)
        .eq("active", true);
      if (error) throw error;
      return sortSections(
        (data ?? []).map((r) => toPageSection(r)),
        "newest",
      );
    },
    staleTime: 60_000,
  });
}

const anchor = (s: PageSection) => `tech-${s.id.slice(0, 8)}`;

/**
 * One block per technology (ASK LAB, …). Each picture sits on the left with its own
 * words beside it on the right, so a write-up can explain picture by picture.
 */
export function ScienceBehindSections({ sections }: { sections: PageSection[] }) {
  return (
    <section className="px-6 lg:px-10 pb-20">
      {sections.length > 1 && (
        <nav
          aria-label="technologies"
          className="flex flex-wrap gap-x-6 gap-y-2 mb-12 text-base tracking-wide"
        >
          {sections.map((s) => (
            <a key={s.id} href={`#${anchor(s)}`} className="link-red">
              {s.heading || "untitled"}
            </a>
          ))}
        </nav>
      )}
      <div className="space-y-24">
        {sections.map((s) => (
          <TechBlock key={s.id} section={s} />
        ))}
      </div>
    </section>
  );
}

function TechBlock({ section }: { section: PageSection }) {
  const paragraphs = toParagraphs(section.body);
  return (
    <article id={anchor(section)} className="scroll-mt-28 border-t border-border pt-10">
      {section.eyebrow && (
        <span className="num text-sm tracking-[0.3em] text-primary uppercase">
          {section.eyebrow}
        </span>
      )}
      {section.heading && (
        <h2 className="text-3xl md:text-4xl mt-2 leading-tight">{section.heading}</h2>
      )}
      {section.subheading && (
        <p className="mt-3 text-sm tracking-[0.25em] uppercase text-foreground/60">
          {section.subheading}
        </p>
      )}
      {paragraphs.length > 0 && (
        <div className="mt-6 max-w-4xl space-y-4 text-lg text-foreground/85 leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      )}

      {section.images.length > 0 && (
        <div className="mt-10 space-y-12">
          {section.images.map((img, i) => (
            <PictureWithWords
              key={img.url + i}
              image={img}
              alt={section.heading ?? "the science behind"}
            />
          ))}
        </div>
      )}

      {section.video_urls.length > 0 && (
        <MediaStrip
          images={[]}
          videos={section.video_urls}
          alt={section.heading ?? "video"}
          className="mt-12 max-w-3xl"
        />
      )}

      {section.links.length > 0 && (
        <ul className="mt-8 space-y-2">
          {section.links.map((l, i) => (
            <li key={i}>
              <a
                href={normalizeUrl(l.url) ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="link-red text-base"
              >
                {l.label || "read more"} →
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function PictureWithWords({ image, alt }: { image: JourneyImage; alt: string }) {
  const src = useMediaUrl(localizeAssetUrl(image.url));
  const words = toParagraphs(image.caption ?? null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 md:gap-12 items-center">
      <div className="bg-muted">
        {src && (
          <img
            src={src}
            alt={words[0] ?? alt}
            loading="lazy"
            className="w-full max-h-[80vh] object-contain"
          />
        )}
      </div>
      {words.length > 0 && (
        <div className="space-y-4 text-lg text-foreground/85 leading-relaxed">
          {words.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
