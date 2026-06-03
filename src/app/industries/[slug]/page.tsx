import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryPage } from "@/components/templates/industry-page";
import { industries, getIndustry } from "@/content/industries";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return {
    title: { absolute: ind.metaTitle },
    description: ind.metaDescription,
    keywords: [ind.keyword],
    alternates: { canonical: `/industries/${ind.slug}` },
    openGraph: { title: ind.metaTitle, description: ind.metaDescription, url: `/industries/${ind.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getIndustry(slug)) notFound();
  return <IndustryPage slug={slug} />;
}
