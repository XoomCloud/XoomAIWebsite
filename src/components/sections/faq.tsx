import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { SectionHeading } from "./section";
import { JsonLd, faqSchema } from "@/components/seo/json-ld";

export type FaqItem = { q: string; a: string };

export function FAQ({
  items,
  eyebrow = "FAQ",
  title = "Frequently asked questions",
  withSchema = true,
}: {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  withSchema?: boolean;
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="container-xa">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      {withSchema && <JsonLd data={faqSchema(items)} />}
    </section>
  );
}
