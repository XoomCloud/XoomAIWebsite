import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function FieldyTeaser() {
  return <section className="container-xa pb-16 md:pb-24" aria-labelledby="fieldy-teaser-title">
    <Link href="/fieldy" className="group grid overflow-hidden rounded-3xl border border-border bg-[#eeedf4] transition-shadow hover:shadow-xl md:grid-cols-2">
      <div className="self-center p-8 md:p-12">
        <p className="text-[10px] font-semibold tracking-[.16em] text-[#7041ce]">FIELDY + XOOMAGENT™ · AVAILABLE NOW</p>
        <h2 id="fieldy-teaser-title" className="mt-5 text-3xl font-medium leading-tight tracking-tight md:text-4xl">Your day, remembered.<br />Your work, handled.</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">Your AI wearable, connected to your managed AI workforce. Fieldy captures the conversation. XoomAgent™ handles the follow-through.</p>
        <span className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[#7041ce]">Explore Fieldy + XoomAI <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none" aria-hidden="true" /></span>
      </div>
      <Image src="/images/fieldy/fieldy-hero.webp" width={4202} height={2800} sizes="(max-width: 768px) 100vw, 50vw" alt="Fieldy 3 AI pendant worn on a black cord" className="h-full min-h-64 w-full object-cover object-[60%_center]" />
    </Link>
  </section>;
}
