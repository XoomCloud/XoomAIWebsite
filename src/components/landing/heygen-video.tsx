"use client";

import * as React from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * HeyGen embedded video behind a lightweight poster. The HeyGen player (and its
 * ~9 MB video download) only loads after the visitor taps play, keeping it off
 * the critical path for mobile page load.
 */
export function HeyGenVideo({ src, poster, title = "XoomAI video" }: { src: string; poster: string; title?: string }) {
  const [playing, setPlaying] = React.useState(false);

  return (
    <div className="ring-gradient rounded-2xl">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
        {playing ? (
          <iframe
            src={src}
            title={title}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; encrypted-media; fullscreen;"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Play video: ${title}`}
          >
            <Image src={poster} alt="" fill sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
            <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" aria-hidden />
            <span className="absolute left-1/2 top-1/2 grid size-18 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-r from-[#6d3bf5] to-[#0891b2] text-white shadow-[0_12px_34px_-10px_rgba(34,211,238,0.7)] ring-4 ring-white/20 transition-transform group-hover:scale-105">
              <Play className="ml-1 size-8" fill="currentColor" aria-hidden />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
