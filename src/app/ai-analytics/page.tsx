import { ServicePage, serviceMetadata } from "@/components/templates/service-page";

const SLUG = "ai-analytics";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
