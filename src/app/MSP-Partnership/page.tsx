import type { Metadata } from "next";
import { PartnerPage } from "./partner-page";

export const metadata: Metadata = {
  title: "MSP Partner Program | Managed AI Workforce",
  description:
    "Give clients a fully managed AI Workforce selected from 60 ready-to-deploy AI Employee roles with XoomAI.",
  alternates: { canonical: "/MSP-Partnership" },
  openGraph: {
    type: "website",
    url: "/MSP-Partnership",
    title: "XoomAI MSP Partner Program",
    description: "Give every client an AI Workforce without building one yourself.",
    images: [
      {
        url: "/images/msp-partnership-og.png",
        width: 1734,
        height: 907,
        alt: "XoomAI MSP Partner Program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XoomAI MSP Partner Program",
    description: "Give every client an AI Workforce without building one yourself.",
    images: ["/images/msp-partnership-og.png"],
  },
};

export default function MSPPartnershipPage() {
  return <PartnerPage />;
}
