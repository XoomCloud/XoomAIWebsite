import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { services } from "@/content/services";
import { industries } from "@/content/industries";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url;

  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/xoomagent", priority: 0.95, freq: "weekly" },
    { path: "/industries", priority: 0.8, freq: "monthly" },
    { path: "/ai-readiness", priority: 0.8, freq: "monthly" },
    { path: "/guides", priority: 0.6, freq: "monthly" },
    { path: "/contact", priority: 0.7, freq: "monthly" },
  ];

  const serviceRoutes = services.map((s) => ({ path: `/${s.slug}`, priority: 0.8, freq: "monthly" as const }));
  const industryRoutes = industries.map((i) => ({ path: `/industries/${i.slug}`, priority: 0.8, freq: "monthly" as const }));

  return [...staticRoutes, ...serviceRoutes, ...industryRoutes].map((r) => ({
    url: `${base}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
