/**
 * VSL video — click-to-play with sound (native controls). No autoplay.
 * aspect-video container prevents layout shift; object-contain avoids cropping
 * regardless of the source aspect ratio.
 */
export function VslVideo({ src }: { src: string }) {
  return (
    <div className="ring-gradient rounded-2xl">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
        <video
          className="h-full w-full object-contain"
          src={src}
          controls
          playsInline
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
