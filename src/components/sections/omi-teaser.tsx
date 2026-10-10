import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function OmiTeaser() {
  return <section className="container-xa pb-16 md:pb-24" aria-labelledby="omi-teaser-title">
    <Link href="/omi" className="group grid overflow-hidden rounded-3xl border border-border bg-[#eeedf4] transition-shadow hover:shadow-xl md:grid-cols-2">
      <div className="self-center p-8 md:p-12">
        <p className="text-[10px] font-semibold tracking-[.16em] text-[#7041ce]">INTRODUCING OMI + XOOMAGENT™ · IN DEVELOPMENT</p>
        <h2 id="omi-teaser-title" className="mt-5 text-3xl font-medium leading-tight tracking-tight md:text-4xl">Your day, remembered.<br />Your work, handled.</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">We’re connecting an AI wearable to your managed AI workforce. Bring conversations, context and the next step together.</p>
        <span className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[#7041ce]">Explore Omi + XoomAI <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none" aria-hidden="true" /></span>
      </div>
      <Image src="/images/omi/omi-hero.webp" width={2048} height={1152} sizes="(max-width: 768px) 100vw, 50vw" alt="Omi AI wearable pendant" className="h-full min-h-64 w-full object-cover mix-blend-multiply" />
    </Link>
  </section>;
}
