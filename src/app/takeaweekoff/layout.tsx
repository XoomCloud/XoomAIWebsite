import { Montserrat, Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-campaign-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-campaign-body",
  subsets: ["latin"],
  display: "swap",
});

export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${poppins.variable} ${montserrat.variable}`}>{children}</div>;
}
