import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { ChromeGate } from "@/components/layout/chrome-gate";
import { Analytics } from "@/components/analytics";
import { MetaPixel } from "@/components/meta-pixel";
import { JsonLd, organizationSchema, professionalServiceSchema } from "@/components/seo/json-ld";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "XoomAI | Your Managed AI Workforce for Australian Business",
    template: "%s | XoomAI",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  keywords: [
    "AI automation Australia",
    "AI automation for small business",
    "AI agents Australia",
    "AI employee for business",
    "AI workforce",
    "AI chatbot development Australia",
    "Claude AI consultant Australia",
    "AI workflow automation",
    "XoomAgent",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: "XoomAI | Your Managed AI Workforce for Australian Business",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "XoomAI | Your Managed AI Workforce for Australian Business",
    description: SITE.description,
  },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } as Metadata["robots"],
  category: "technology",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${spaceGrotesk.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <ChromeGate>{children}</ChromeGate>
        <JsonLd data={[organizationSchema(), professionalServiceSchema()]} />
        <Analytics />
        <MetaPixel />
      </body>
    </html>
  );
}
