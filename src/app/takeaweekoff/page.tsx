import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, CheckCheck, Clock3, FileCheck2, FileText, Headset, Layers3, LockKeyhole, Mail, Phone, Settings2, ShieldCheck, Workflow } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SITE } from "@/lib/site";
import { CampaignFooter, CampaignHeader } from "./campaign-chrome";
import { AuditLink, CampaignEnhancements } from "./campaign-interactions";
import styles from "./campaign.module.css";

export const metadata: Metadata = {
  title: { absolute: "Take a Week Off. We Dare You. | XoomAI" },
  description: "Your fully managed AI workforce. XoomAI helps Australian businesses hand over repeatable work while keeping control. Book a Free AI Workflow Audit.",
  alternates: { canonical: "/takeaweekoff" },
  openGraph: {
    title: "Take a Week Off. We Dare You. | XoomAI",
    description: "Your fully managed AI workforce. Find the first role for your business with a free AI Workflow Audit.",
    url: "/takeaweekoff",
    images: [{ url: "/images/take-a-week-off/campaign.webp", width: 1122, height: 1402, alt: "Take a week off. We dare you. Your fully managed AI workforce by XoomAI." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Take a Week Off. We Dare You. | XoomAI",
    description: "Your fully managed AI workforce. Book a Free AI Workflow Audit.",
    images: ["/images/take-a-week-off/campaign.webp"],
  },
};

const roles = [
  { icon: Headset, title: "The enquiries that can’t wait.", role: "Sales & Customer Service", description: "Answer enquiries, qualify leads and follow up while your team gets on with the day.", tasks: "Calls · Email · Lead follow-up" },
  { icon: FileText, title: "The admin that never ends.", role: "Administration & Accounts", description: "Prepare documents, process invoices and keep the everyday paperwork moving.", tasks: "Documents · Invoices · Records" },
  { icon: Workflow, title: "The handovers that slow you down.", role: "Operations & Coordination", description: "Update your CRM, connect workflows and move information between your systems.", tasks: "CRM · Scheduling · Workflows" },
];

const faqs = [
  ["What does a XoomAgent™ actually do?", "A XoomAgent™ takes on a defined role in your managed AI workforce. Depending on that role, it can handle enquiries, prepare documents, follow up missing information, update your CRM or coordinate a workflow. We scope the responsibilities and connect the systems it needs."],
  ["Will it work with the tools we already use?", "XoomAI works with platforms such as Microsoft 365, Google Workspace and CRMs. In the audit, we review your specific tools, available integrations and access requirements before recommending a role."],
  ["How do we stay in control?", "Your team sets the rules, access permissions and approval points. We configure your XoomAgent™ workforce around those boundaries, including when work needs to be handed to a person. Access is scoped to the role and actions are logged."],
  ["Do we have to replace staff or change everything at once?", "No. Start with one repeatable role or a workflow that is holding your team back. The aim is to give people capacity for customers, decisions and the work that needs their judgement. You can expand from there."],
  ["What does fully managed include, and what does it cost?", "XoomAI scopes, configures and connects your XoomAgent™ workforce, then monitors and improves it as part of the managed service. Pricing depends on the role, workflows and integrations. The free audit helps us recommend a suitable starting point and discuss the scope before quoting."],
];

export default function TakeAWeekOffPage() {
  return (
    <div className={styles.campaign}>
      <CampaignHeader />
      <section id="campaign-hero" className={styles.hero} aria-labelledby="campaign-title">
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.eyebrowLine} /> YOUR FULLY MANAGED AI WORKFORCE</p>
            <h1 id="campaign-title" className={styles.heroTitle}>TAKE A<br />WEEK OFF.<br /><span>WE DARE YOU.</span></h1>
            <p className={styles.heroLead}>Your business shouldn’t need you<br className={styles.desktopBreak} /> for <em>every little thing.</em></p>
            <p className={styles.heroDescription}>Hand repeatable work to your managed XoomAgent™ workforce. Your team sets the rules. You get room to breathe.</p>
            <AuditLink placement="hero" />
            <p className={styles.reassurance}><Clock3 size={15} aria-hidden="true" /> 45 minutes. Free. No obligation.</p>
            <p className={styles.qualification}>Best suited to established Australian businesses with 5+ staff and repeatable work across multiple systems.</p>
          </div>
          <div className={styles.heroVisual}>
            <Image src="/images/take-a-week-off/hero.webp" alt="A business owner leaving with his travel bag, held back by cables attached to office paperwork and everyday tasks." width={1122} height={1402} sizes="(max-width: 760px) 100vw, 55vw" preload className={styles.heroImage} />
            <div className={styles.heroAnnotation}><span>LESS TIED UP.</span><span>MORE TIME BACK.</span><ArrowUpRight size={20} aria-hidden="true" /></div>
          </div>
        </div>
        <div className={`${styles.container} ${styles.heroFoot}`}>
          <div><ShieldCheck size={18} aria-hidden="true" /> Australian owned & operated</div>
          <div><Settings2 size={18} aria-hidden="true" /> Set up and managed for you</div>
          <a href="#workforce">See what you can hand over <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <section id="workforce" className={`${styles.section} ${styles.workforce}`} aria-labelledby="workforce-title">
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <div><p className={styles.eyebrow}>01 / BREAK THE BOTTLENECK</p><h2 id="workforce-title">A business that runs.<br /><span>Without running you.</span></h2></div>
            <p>When every task routes back to you, growth hits a bottleneck. XoomAgent™ takes on repeatable roles across the tools your team already uses.</p>
          </div>
          <div className={styles.roleGrid}>
            {roles.map(({ icon: Icon, title, role, description, tasks }, index) => (
              <article className={styles.roleCard} key={role} data-campaign-reveal>
                <div className={styles.roleTop}><Icon size={27} strokeWidth={1.5} aria-hidden="true" /><span>0{index + 1}</span></div>
                <h3>{title}</h3><p>{description}</p>
                <div className={styles.roleBottom}><strong>{role}</strong><span>{tasks}</span></div>
              </article>
            ))}
          </div>
          <div className={styles.integrationStrip}><span>WORKS WHERE YOU WORK</span><p>Microsoft 365</p><p>Google Workspace</p><p>Your CRM</p><p>Xero / MYOB</p></div>
        </div>
      </section>

      <section id="results" className={`${styles.section} ${styles.results}`} aria-labelledby="results-title">
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <div><p className={styles.eyebrow}>02 / THE WORK. THE DIFFERENCE.</p><h2 id="results-title">Less on their plate.<br /><span>More in their week.</span></h2></div>
            <p>Real client outcomes from specific workflows. Here’s what handing over the right work can look like.</p>
          </div>
          <article className={`${styles.caseStudy} ${styles.financeCase}`} data-campaign-reveal>
            <div className={styles.caseCopy}>
              <p className={styles.caseLabel}>FINANCIAL ADVICE <span>CLIENT OUTCOME</span></p>
              <p className={styles.clientName}>Pure Private Wealth</p>
              <h3>A week of preparation.<br />Back in about an hour.</h3>
              <p>SOA preparation previously took more than a week. A XoomAgent™ in a paraplanner role brought the firm’s information and templates into the preparation workflow.</p>
              <div className={styles.roleTag}><FileCheck2 size={18} aria-hidden="true" /> Paraplanner XoomAgent™</div>
              <p className={styles.caseDetail}>Controlled access to systems, files, meeting transcripts and templates.</p>
            </div>
            <div className={styles.financeResult}>
              <div className={styles.beforeMetric}><span>BEFORE</span><strong>1+ week</strong></div>
              <ArrowDown className={styles.metricArrow} size={26} aria-hidden="true" />
              <div className={styles.afterMetric}><span>AFTER</span><strong>≈ 1 <small>hour</small></strong></div>
              <p>For SOA preparation</p>
              <div className={styles.metricCaption}><CheckCheck size={17} aria-hidden="true" /> A defined role. A measurable difference.</div>
            </div>
          </article>
          <article className={`${styles.caseStudy} ${styles.ndisCase}`} data-campaign-reveal>
            <div className={styles.caseCopy}>
              <p className={styles.caseLabel}>NDIS PROVIDER <span>CLIENT OUTCOME</span></p>
              <p className={styles.clientName}>Stirling Supports</p>
              <h3>Less chasing notes.<br />More time accounted for.</h3>
              <p>Missing or incomplete shift notes created a constant admin backlog. A XoomAgent™ Practice Administration Officer followed up missing notes, helped staff turn their notes into descriptions and verified shift-time entries.</p>
              <div className={styles.roleTag}><FileText size={18} aria-hidden="true" /> Practice Administration XoomAgent™</div>
            </div>
            <div className={styles.ndisResults}>
              <div><strong>25–30 <small>hrs</small></strong><p>Administrative time saved every week</p></div>
              <div className={styles.ndisSecondary}><strong>10%</strong><p>Uplift in billable time<br /><span>Across 20 support workers</span></p></div>
            </div>
          </article>
          <article className={styles.constructionCase} data-campaign-reveal>
            <div><p className={styles.caseLabel}>CONSTRUCTION <span>WORKFLOW EXAMPLE</span></p><p className={styles.clientName}>Elite Structures</p><h3>Two roles.<br />One connected workflow.</h3><p>A XoomAgent™ Project Administrator assisted with RFIs, variations, meeting minutes and client correspondence, collaborating with a XoomAgent™ Project Coordinator.</p></div>
            <div className={styles.collaborationDiagram} aria-label="XoomAgent Project Administrator collaborating with XoomAgent Project Coordinator on RFIs, variations, minutes and correspondence">
              <div className={styles.diagramRole}><FileText size={23} aria-hidden="true" /><span>Project<br /><strong>Administrator</strong></span></div>
              <div className={styles.diagramConnection}><span /><ArrowRight size={18} aria-hidden="true" /><span /></div>
              <div className={styles.diagramRole}><Layers3 size={23} aria-hidden="true" /><span>Project<br /><strong>Coordinator</strong></span></div>
              <p>RFIs <span>·</span> Variations <span>·</span> Minutes <span>·</span> Correspondence</p>
            </div>
          </article>
          <div className={styles.resultsFoot}><p>These results relate to the client workflows described. Outcomes vary with scope, systems and implementation.</p><AuditLink placement="case-studies" /></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.control}`} aria-labelledby="control-title">
        <div className={`${styles.container} ${styles.controlGrid}`}>
          <div className={styles.controlCopy}><p className={styles.eyebrow}>03 / YOUR BUSINESS. YOUR RULES.</p><h2 id="control-title">It does the work.<br />You keep <span>control.</span></h2><p>Your team sets the rules, permissions and approvals. XoomAI configures the workforce around them—and manages it with you.</p><div className={styles.managedNote}><ShieldCheck size={25} aria-hidden="true" /><span>Built and managed by an Australian team.<br /><strong>Backed by XoomCloud IT & security.</strong></span></div></div>
          <div className={styles.controlList}>
            <div><LockKeyhole aria-hidden="true" /><h3>Access with boundaries.</h3><p>Permissioned access to the systems and information each role needs.</p></div>
            <div><CheckCheck aria-hidden="true" /><h3>Approvals where they matter.</h3><p>Agreed checkpoints and handovers keep human judgement in the workflow.</p></div>
            <div><Settings2 aria-hidden="true" /><h3>Managed beyond launch.</h3><p>We set up, integrate, monitor and improve your XoomAgent™ workforce as part of the service.</p></div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.start}`} aria-labelledby="start-title">
        <div className={styles.container}>
          <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>04 / START WITH ONE ROLE</p><h2 id="start-title">Start where the<br />work gets <span>stuck.</span></h2></div><p>You don’t need to transform everything at once. Find one meaningful bottleneck, put your first XoomAgent™ to work, then expand.</p></div>
          <div className={styles.steps}>
            <div><span>01</span><h3>Find the friction.</h3><p>In your free audit, we look at where repeatable work is holding your team back.</p></div>
            <div><span>02</span><h3>Define the first role.</h3><p>Discuss what a XoomAgent™ could take on, the systems it needs and your approval points.</p></div>
            <div><span>03</span><h3>Build from there.</h3><p>Agree the scope before implementation. We configure, connect and manage the role with you.</p></div>
          </div>
          <div className={styles.auditNote}><Clock3 size={20} aria-hidden="true" /><p><strong>It starts with a conversation.</strong> 45 minutes with a XoomAI specialist. Free, with no obligation.</p></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faq}`} aria-labelledby="faq-title">
        <div className={`${styles.container} ${styles.faqGrid}`}>
          <div><p className={styles.eyebrow}>A FEW THINGS WORTH KNOWING</p><h2 id="faq-title">Good questions.<br /><span>Clear answers.</span></h2><p>Prefer a real conversation?</p><a href={SITE.phoneHref} className={styles.phoneLink}><Phone size={18} aria-hidden="true" />{SITE.phone}</a></div>
          <Accordion type="single" collapsible className={styles.accordion}>
            {faqs.map(([question, answer], index) => <AccordionItem value={`faq-${index}`} key={question} className={styles.faqItem}><AccordionTrigger className={styles.faqTrigger}>{question}</AccordionTrigger><AccordionContent className={styles.faqAnswer}>{answer}</AccordionContent></AccordionItem>)}
          </Accordion>
        </div>
      </section>

      <section id="audit" className={styles.closing} aria-labelledby="closing-title">
        <div className={`${styles.container} ${styles.closingGrid}`}>
          <div className={styles.closingVisual}><Image src="/images/take-a-week-off/time-back.webp" alt="A relaxed business owner in a deckchair beside an automated workforce handling documents and routine tasks." width={1122} height={1402} sizes="(max-width: 760px) 100vw, 45vw" /></div>
          <div className={styles.closingCopy}><p className={styles.eyebrow}>LESS TIED UP. MORE TIME BACK.</p><h2 id="closing-title">Ready to take<br /><span>the week?</span></h2><p>Find the first role for your managed AI workforce. Start with a Free AI Workflow Audit.</p><AuditLink placement="closing" /><p className={styles.reassurance}><Check size={16} aria-hidden="true" /> Free · 45 minutes · No obligation</p><a className={styles.emailLink} href={SITE.emailHref}><Mail size={16} aria-hidden="true" /> {SITE.email}</a></div>
        </div>
      </section>
      <CampaignFooter />
      <CampaignEnhancements />
    </div>
  );
}
