import { Montserrat, Poppins } from "next/font/google";

const heading = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-omi-heading", display: "swap" });
const body = Montserrat({ subsets: ["latin"], variable: "--font-omi-body", display: "swap" });

export default function OmiLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${heading.variable} ${body.variable}`}>{children}</div>;
}
