import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  async redirects() {
    return [
      // Legacy industry .html → new /industries/* routes
      { source: "/legal-industry.html", destination: "/industries/legal", permanent: true },
      { source: "/financial-industry.html", destination: "/industries/financial", permanent: true },
      { source: "/logistics-industry.html", destination: "/industries/logistics", permanent: true },
      { source: "/healthcare-industry.html", destination: "/industries/healthcare", permanent: true },
      { source: "/real-estate-industry.html", destination: "/industries/real-estate", permanent: true },
      { source: "/construction-industry.html", destination: "/industries/construction", permanent: true },
      { source: "/hospitality-industry.html", destination: "/industries/hospitality", permanent: true },
      { source: "/retail-industry.html", destination: "/industries/retail", permanent: true },
      { source: "/professional-services-industry.html", destination: "/industries/professional-services", permanent: true },
      { source: "/industries.html", destination: "/industries", permanent: true },
      // Consolidate Claude service URLs
      { source: "/claude-ai-integration", destination: "/claude-integration", permanent: true },
      { source: "/claude-ai-consulting", destination: "/claude-integration", permanent: true },
      // Readiness page consolidation
      { source: "/ai-readiness.html", destination: "/ai-readiness", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
