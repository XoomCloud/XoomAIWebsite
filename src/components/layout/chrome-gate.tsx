"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

/** Routes that render distraction-free (no site nav/footer) — e.g. paid landing pages. */
const BARE_ROUTES = ["/youraiemployee", "/thank-you"];

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const bare = BARE_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  return (
    <>
      {!bare && <Header />}
      <main id="main" className="flex-1">
        {children}
      </main>
      {!bare && <Footer />}
    </>
  );
}
