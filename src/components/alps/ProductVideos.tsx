/**
 * YouTube / Vimeo page links become embeddable player URLs; anything else is
 * treated as a direct video file (e.g. an mp4 uploaded in the admin panel).
 */
function videoEmbed(url: string): { type: "iframe" | "file"; src: string } {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return { type: "iframe", src: `https://www.youtube.com/embed/${u.pathname.slice(1)}` };
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const id = u.searchParams.get("v") ?? u.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
      if (id) return { type: "iframe", src: `https://www.youtube.com/embed/${id}` };
    }
    if (host === "vimeo.com") {
      const id = u.pathname.match(/\/(\d+)/)?.[1];
      if (id) return { type: "iframe", src: `https://player.vimeo.com/video/${id}` };
    }
    if (host === "player.vimeo.com") return { type: "iframe", src: url };
  } catch {
    /* not a URL — fall through */
  }
  return { type: "file", src: url };
}

/** Product videos (runway, styling, fabric demos). Renders nothing when empty. */
export function ProductVideos({ urls, title }: { urls: string[]; title: string }) {
  if (!urls.length) return null;
  return (
    <div className="mt-6 space-y-3">
      {urls.map((url, i) => {
        const v = videoEmbed(url);
        return v.type === "iframe" ? (
          <iframe
            key={url + i}
            src={v.src}
            title={`${title} — video ${i + 1}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full aspect-video bg-black"
          />
        ) : (
          <video
            key={url + i}
            src={v.src}
            controls
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full aspect-video bg-black object-contain"
          />
        );
      })}
    </div>
  );
}
