import { Montserrat, Poppins } from "next/font/google";

const heading = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-fieldy-heading", display: "swap" });
const body = Montserrat({ subsets: ["latin"], variable: "--font-fieldy-body", display: "swap" });

export default function FieldyLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${heading.variable} ${body.variable}`}>{children}</div>;
}
