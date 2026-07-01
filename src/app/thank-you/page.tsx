import type { Metadata } from "next";
import { ThankYouContent } from "@/components/landing/thank-you-content";

export const metadata: Metadata = {
  title: { absolute: "Thank You | Book Your AI Strategy Session | XoomAI" },
  description: "Thanks for your enquiry. Book your free AI Strategy Session with XoomAI.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return <ThankYouContent />;
}
