/**
 * HeyGen embedded video (public embed iframe). Responsive 16:9, brand-framed.
 * The HeyGen player has its own controls / play button (no autoplay).
 */
export function HeyGenVideo({ src, title = "XoomAI video" }: { src: string; title?: string }) {
  return (
    <div className="ring-gradient rounded-2xl">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="encrypted-media; fullscreen;"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
