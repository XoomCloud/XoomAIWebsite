import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SITE } from "@/lib/site";

const UPDATED = "28 October 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Xoom Cloud Pty Ltd (XoomAI) collects, uses, discloses and protects personal information under the Australian Privacy Principles.",
  alternates: { canonical: "/privacy" },
};

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Who we are",
    body: (
      <>
        <p>
          This policy applies to {SITE.legalName} (ABN {SITE.abn}), which operates XoomAI and the website
          xoomai.com.au (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). We are bound by the <em>Privacy Act 1988</em> (Cth)
          and handle personal information in line with the Australian Privacy Principles (APPs).
        </p>
      </>
    ),
  },
  {
    title: "2. What personal information we collect",
    body: (
      <>
        <p>We only collect the information we need. Depending on how you deal with us, this may include:</p>
        <ul>
          <li>
            <strong>Enquiry and booking forms:</strong> your first and last name, business email, phone number, company
            name, number of employees and any details you choose to share about your business, such as the biggest
            challenge you want AI to solve.
          </li>
          <li>
            <strong>Meeting bookings:</strong> your name, email address, the time you choose and any notes you add when
            you book a strategy session through our online calendar.
          </li>
          <li>
            <strong>Quiz and contact forms:</strong> the answers and contact details you submit.
          </li>
          <li>
            <strong>Campaign and website information:</strong> the advertising campaign, ad set or ad that brought you to
            our site (for example UTM parameters and a Meta click identifier), pages you visit, your device and browser
            type, approximate location derived from your IP address, and cookie or similar identifiers.
          </li>
          <li>
            <strong>Communications:</strong> records of emails, calls and meetings with you, including meeting notes.
          </li>
        </ul>
        <p>
          We do not ask for sensitive information through our website. Please do not include sensitive or confidential
          information in free text fields.
        </p>
      </>
    ),
  },
  {
    title: "3. How we collect it",
    body: (
      <p>
        We collect personal information directly from you when you fill in a form, book a meeting, email or call us.
        We also collect information automatically through cookies and similar technologies when you use our website,
        and we may receive information from advertising platforms such as Meta when you respond to one of our ads.
      </p>
    ),
  },
  {
    title: "4. Why we collect and use it",
    body: (
      <>
        <p>We use personal information to:</p>
        <ul>
          <li>respond to your enquiry and arrange and run your free strategy session;</li>
          <li>provide, manage and improve our services, including XoomAgent™;</li>
          <li>follow up with information about our services that you have asked for or would reasonably expect;</li>
          <li>measure which advertising and website content works, and improve our website and campaigns;</li>
          <li>keep our website and systems secure; and</li>
          <li>meet our legal and regulatory obligations.</li>
        </ul>
        <p>
          You can opt out of marketing emails at any time using the unsubscribe link in the email or by contacting us.
        </p>
      </>
    ),
  },
  {
    title: "5. Cookies, analytics and advertising",
    body: (
      <>
        <p>Our website uses cookies and similar technologies, including:</p>
        <ul>
          <li>
            <strong>HubSpot:</strong> our forms, scheduling and customer relationship management (CRM) platform. HubSpot
            stores the details you submit and may set cookies to recognise returning visitors and link your visits to
            your enquiry.
          </li>
          <li>
            <strong>Meta Pixel and Meta Conversions API:</strong> help us measure the results of our Facebook and
            Instagram ads and show relevant ads. When you submit a form or book a meeting, we tell Meta that a
            conversion happened. Meta may match this event to your Meta account using browser identifiers and, where
            used, hashed (scrambled) contact details. We do not send the content of your form answers.
          </li>
          <li>
            <strong>Google Analytics 4:</strong> helps us understand how visitors use our website, using cookies and
            aggregated reports.
          </li>
          <li>
            <strong>Embedded content:</strong> our video player (HeyGen) and booking calendar load content from those
            providers, who may collect technical information when you use them. The video player only loads when you
            press play.
          </li>
        </ul>
        <p>
          You can block or delete cookies in your browser settings, opt out of Google Analytics with the Google
          Analytics opt-out browser add-on, and manage ad preferences in your Facebook or Instagram settings. Some site
          features, such as forms and booking, may not work properly without cookies.
        </p>
      </>
    ),
  },
  {
    title: "6. Who we share it with",
    body: (
      <>
        <p>
          We do not sell personal information. We share it only with service providers who help us run our business,
          and only for the purposes in this policy. These include HubSpot (CRM, forms and meetings), Microsoft (email,
          calendar and documents), Meta and Google (advertising measurement and analytics), Vercel (website hosting),
          our email delivery provider, and our professional advisers. We may also disclose information where the law
          requires or allows it.
        </p>
      </>
    ),
  },
  {
    title: "7. Overseas disclosure",
    body: (
      <p>
        Some of our service providers store or process information outside Australia, mainly in the United States and
        other countries where they or their data centres operate. We take reasonable steps, including through our
        agreements with these providers, to make sure they handle your information consistently with the APPs.
      </p>
    ),
  },
  {
    title: "8. How we protect and keep it",
    body: (
      <p>
        We take reasonable steps to protect personal information from misuse, interference, loss and unauthorised
        access, modification or disclosure. Measures include access controls, multi-factor authentication and secure,
        reputable providers. We keep personal information only for as long as we need it for the purposes above or as
        the law requires, then delete or de-identify it.
      </p>
    ),
  },
  {
    title: "9. Accessing and correcting your information",
    body: (
      <p>
        You can ask to access the personal information we hold about you, or ask us to correct it, by contacting us
        using the details below. We will respond within a reasonable time, usually within 30 days. If we refuse a
        request, we will tell you why in writing, unless that would be unreasonable.
      </p>
    ),
  },
  {
    title: "10. Complaints",
    body: (
      <p>
        If you think we have breached the APPs, please contact us first so we can try to resolve the matter. We will
        acknowledge your complaint and aim to respond within 30 days. If you are not satisfied with our response, you
        can contact the Office of the Australian Information Commissioner at{" "}
        <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">oaic.gov.au</a> or on 1300 363 992.
      </p>
    ),
  },
  {
    title: "11. Contact us",
    body: (
      <p>
        Privacy Officer, {SITE.legalName}
        <br />
        Email: <a href={SITE.emailHref}>{SITE.email}</a>
        <br />
        Phone: <a href={SITE.phoneHref}>{SITE.phone}</a>
      </p>
    ),
  },
  {
    title: "12. Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. The current version is always available on this page, with the
        date it was last updated.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Privacy Policy", href: "/privacy" }]} />
      <section className="py-14 md:py-20">
        <div className="container-xa">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-2">Last updated: {UPDATED}</p>
            <div className="mt-10 space-y-10 text-base leading-relaxed text-muted [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline [&_li]:mt-2 [&_p+p]:mt-4 [&_p+ul]:mt-3 [&_strong]:text-foreground [&_ul+p]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
              {sections.map((s) => (
                <div key={s.title}>
                  <h2 className="font-display text-xl font-semibold text-foreground md:text-2xl">{s.title}</h2>
                  <div className="mt-3">{s.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
