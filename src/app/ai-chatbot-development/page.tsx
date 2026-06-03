import { ServicePage, serviceMetadata } from "@/components/templates/service-page";

const SLUG = "ai-chatbot-development";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
