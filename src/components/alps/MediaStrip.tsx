import { useMediaUrl } from "@/lib/storage-url";
import { toEmbedUrl, type JourneyImage } from "@/lib/journey";

/**
 * Horizontally scrolling gallery of a write-up's images and videos — same
 * scroll behaviour as the product gallery. A single item renders full width.
 */
export function MediaStrip({
  images,
  videos = [],
  alt,
  className = "",
}: {
  images: JourneyImage[];
  videos?: string[];
  alt: string;
  className?: string;
}) {
  const total = images.length + videos.length;
  if (!total) return null;

  const single = total === 1;
  const size = single ? "w-full aspect-[4/3]" : "w-[80%] sm:w-[22rem] aspect-[4/3]";

  return (
    <div
      className={`flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory ${className}`}
      role="group"
      aria-label={`${alt} — ${total} item${single ? "" : "s"}`}
    >
      {images.map((img, i) => (
        <StripImage key={"i" + img.url + i} image={img} alt={single ? alt : `${alt} — image ${i + 1}`} size={size} />
      ))}
      {videos.map((url, i) => (
        <StripVideo key={"v" + url + i} url={url} title={`${alt} — video ${i + 1}`} size={size} />
      ))}
    </div>
  );
}

function StripImage({ image, alt, size }: { image: JourneyImage; alt: string; size: string }) {
  const src = useMediaUrl(image.url);
  return (
    <figure className={`snap-start shrink-0 ${size.replace(/aspect-\S+/, "")}`}>
      <img src={src ?? ""} alt={image.caption || alt} loading="lazy" className={`w-full object-contain bg-muted ${size.match(/aspect-\S+/)?.[0] ?? ""}`} />
      {image.caption && <figcaption className="mt-2 text-[11px] text-foreground/60">{image.caption}</figcaption>}
    </figure>
  );
}

function StripVideo({ url, title, size }: { url: string; title: string; size: string }) {
  const embed = toEmbedUrl(url);
  const fileUrl = useMediaUrl(embed ? null : url);
  if (embed) {
    return (
      <iframe
        src={embed}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className={`snap-start shrink-0 bg-black ${size}`}
      />
    );
  }
  return (
    <video
      src={fileUrl ?? undefined}
      controls
      preload="metadata"
      playsInline
      className={`snap-start shrink-0 bg-black object-contain ${size}`}
    />
  );
}
