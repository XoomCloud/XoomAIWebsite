import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CTAButton } from "@/components/cta-button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden />
      <div className="container-xa relative flex min-h-[70vh] flex-col items-center justify-center pt-28 text-center">
        <p className="font-display text-7xl font-bold text-gradient">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">This page has been automated away</h1>
        <p className="mt-3 max-w-md text-muted">
          The page you&apos;re after doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Back to home</Link>
          </Button>
          <CTAButton href="/xoomagent" variant="outline" size="lg" eventLabel="404_xoomagent">
            Explore XoomAgent™
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
