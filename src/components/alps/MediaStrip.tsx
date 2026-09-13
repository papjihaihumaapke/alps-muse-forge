import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useMediaUrl } from "@/lib/storage-url";
import { toEmbedUrl, type JourneyImage } from "@/lib/journey";

/**
 * One-at-a-time carousel of a write-up's images and videos, with arrows,
 * dots and swipe. Renders nothing when empty.
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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const total = images.length + videos.length;

  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  if (!total) return null;
  const multiple = total > 1;

  return (
    <div className={className} role="group" aria-roledescription="carousel" aria-label={alt}>
      <div className="relative">
        <Carousel setApi={setApi} opts={{ loop: multiple }}>
          <CarouselContent className="ml-0">
            {images.map((img, i) => (
              <CarouselItem key={"i" + img.url + i} className="pl-0">
                <SlideImage image={img} alt={multiple ? `${alt} — image ${i + 1}` : alt} />
              </CarouselItem>
            ))}
            {videos.map((url, i) => (
              <CarouselItem key={"v" + url + i} className="pl-0">
                <SlideVideo url={url} title={`${alt} — video ${i + 1}`} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {multiple && (
          <>
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              aria-label="previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-background/80 hover:bg-background border border-border"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              aria-label="next"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-background/80 hover:bg-background border border-border"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {multiple && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`go to slide ${i + 1}`}
              aria-current={i === current}
              className={`h-1.5 transition-all ${i === current ? "w-6 bg-primary" : "w-1.5 bg-foreground/25"}`}
            />
          ))}
        </div>
      )}

      {images[current]?.caption && (
        <p className="mt-2 text-[11px] text-foreground/60 text-center">{images[current].caption}</p>
      )}
    </div>
  );
}

function SlideImage({ image, alt }: { image: JourneyImage; alt: string }) {
  const src = useMediaUrl(image.url);
  return (
    <img
      src={src ?? ""}
      alt={image.caption || alt}
      loading="lazy"
      className="w-full aspect-[4/3] object-contain bg-muted"
    />
  );
}

function SlideVideo({ url, title }: { url: string; title: string }) {
  const embed = toEmbedUrl(url);
  const fileUrl = useMediaUrl(embed ? null : url);
  return embed ? (
    <iframe
      src={embed}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      className="w-full aspect-[4/3] bg-black"
    />
  ) : (
    <video
      src={fileUrl ?? undefined}
      controls
      preload="metadata"
      playsInline
      className="w-full aspect-[4/3] bg-black object-contain"
    />
  );
}
