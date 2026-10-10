import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Brain, Check, Fingerprint, GitBranch, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { SITE } from "@/lib/site";
import { DayExplorer, OmiBookingLink, ProductFilm } from "./omi-interactions";
import styles from "./omi.module.css";

const title = "Omi + XoomAgent™ | Your day, connected to your AI workforce";
const description = "Meet XoomAI’s upcoming Omi integration: an AI wearable connected to a managed AI workforce. Bring conversations, context, reminders and delegated work together.";

export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: "/omi" },
  openGraph: { title, description, url: "/omi", type: "website", images: [{ url: "/images/omi/omi-hero.webp", width: 2048, height: 1152, alt: "Omi AI wearable pendant" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/images/omi/omi-hero.webp"] },
};

const faqs = [
  ["What is the XoomAI Omi integration?", "XoomAI is developing an integration that connects Omi’s conversation capture with your managed XoomAgent™ workforce. The planned experience carries context from your day into reminders, tasks and work assigned to the appropriate AI employee. This page previews that experience; it does not announce a generally available integration."],
  ["Can Omi capture conversations throughout my day?", "Omi is a wearable audio device that works with its app to capture and organise conversations. You choose when to record and should let the people involved know and obtain any required permission. Capture depends on your device, battery, app and settings; it is not a guarantee that every moment will be recorded."],
  ["What would XoomAgent™ do with that information?", "The integration is being designed to identify commitments, retain relevant context, create reminders and route work to configured AI employees. For example, a client conversation could become a proposal task for your Sales Representative and a reminder for your Executive Assistant. Your connected systems and approval rules determine what can happen next."],
  ["Do I need to replace my current business systems?", "The aim is to connect the tools your team already uses. We’ll assess your CRM, email, calendars and project systems, confirm which connections are practical, and scope the first workflow before making a commitment."],
  ["Who controls recordings and business actions?", "Recording choices sit with you. During scoping, we’ll map what information is captured, where it is processed, who can access it and how long it is retained. Omi’s own terms and data settings apply to its service. XoomAgent™ actions will be configured around agreed permissions, review steps and escalation rules."],
  ["When can I get it, and what will it cost?", "The XoomAI integration is in development. Speak with us about your use case, current availability and a potential pilot. Hardware, any Omi plan and XoomAI’s managed service will be scoped separately; no launch date or package price has been announced here."],
];

export default function OmiPage() {
  return <div className={styles.page}>
    <header className={styles.header}><div className={styles.headerInner}>
      <Link href="/" aria-label="XoomAI home"><Image src="/images/XoomAI_Horizontal.png" width={5705} height={1380} alt="XoomAI" priority className={styles.logo} /></Link>
      <nav aria-label="Omi page navigation"><a href="#how-it-works">How it works</a><a href="#your-day">Your day, connected</a><Link href="/xoomagent">Meet XoomAgent™</Link></nav>
      <a href="#start" className={styles.headerCta}>Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div></header>

    <section className={`${styles.wrap} ${styles.hero}`} aria-labelledby="omi-title">
      <div className={styles.heroCopy}>
        <div className={styles.eyebrow}><span className={styles.dot} /> IN DEVELOPMENT · OMI + XOOMAI</div>
        <h1 id="omi-title">Your day,<br />remembered.<br /><span>Your work,<br />handled.</span></h1>
        <p className={styles.lede}>The AI you wear. The AI workforce that follows through.</p>
        <p className={styles.heroBody}>We’re connecting Omi to XoomAgent™. Conversations from your day become context, reminders and tasks for the right AI employee — with you in control.</p>
        <div className={styles.actions}><OmiBookingLink placement="hero">Explore it for your business</OmiBookingLink><a className={styles.textLink} href="#your-day">See a day in action <ArrowDown size={17} aria-hidden="true" /></a></div>
        <p className={styles.heroNote}>An upcoming integration. Built around the way you work.</p>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.visualLabel}><span>omi <b>+</b> XoomAgent™</span><span>FROM CONVERSATION TO ACTION</span></div>
        <Image src="/images/omi/omi-hero.webp" width={2048} height={1152} priority sizes="(max-width: 800px) 100vw, 55vw" className={styles.heroProduct} alt="Omi’s translucent AI pendant suspended from its black cord" />
        <div className={styles.capturePill}><AudioLines size={20} aria-hidden="true" /><div><strong>Stay present.</strong><span>Keep the context.</span></div></div>
        <div className={styles.heroTask}><div><span className={styles.sparkIcon}><Sparkles size={16} aria-hidden="true" /></span><span>XoomAgent™<small>Workflow preview</small></span><span className={styles.taskDot} /></div><p>“Follow up with Alex on Friday.”</p><footer><Check size={14} aria-hidden="true" /> Routed to your Executive Assistant</footer></div>
        <ProductFilm />
        <span className={styles.visualIndex}>01 / THE WEARABLE MEETS THE WORKFORCE</span>
      </div>
    </section>

    <div className={styles.promiseStrip}><div className={styles.wrap}><span><Mic size={17} aria-hidden="true" /> Capture the conversation</span><ArrowRight size={16} className={styles.stripArrow} aria-hidden="true" /><span><Brain size={18} aria-hidden="true" /> Connect the context</span><ArrowRight size={16} className={styles.stripArrow} aria-hidden="true" /><span><GitBranch size={18} aria-hidden="true" /> Delegate the work</span></div></div>

    <section id="how-it-works" className={`${styles.wrap} ${styles.section}`} aria-labelledby="beyond-notes">
      <div className={styles.sectionHead}><div><p className={styles.eyebrow}>A NEW CONNECTION</p><h2 id="beyond-notes">A memory for your day.<br /><span>A workforce for what’s next.</span></h2></div><p>A great conversation can create a dozen things to do. We’re bringing an AI wearable and advanced AI employees together, so the next step doesn’t depend on you remembering it.</p></div>
      <div className={styles.steps}>
        <article><span className={styles.stepNum}>01 / CAPTURE</span><Mic size={30} strokeWidth={1.4} aria-hidden="true" /><h3>Be part of the conversation.</h3><p>Wear Omi through your working day and capture the conversations you choose. Less stopping to type. More attention on the person in front of you.</p><span className={styles.stepTag}>Omi wearable + app</span></article>
        <article><span className={styles.stepNum}>02 / UNDERSTAND</span><Brain size={30} strokeWidth={1.4} aria-hidden="true" /><h3>Keep the meaning, too.</h3><p>The planned connection brings relevant context to XoomAgent™: what was decided, who it concerns, what was promised and when it matters.</p><span className={styles.stepTag}>Your business context</span></article>
        <article><span className={styles.stepNum}>03 / FOLLOW THROUGH</span><GitBranch size={30} strokeWidth={1.4} aria-hidden="true" /><h3>Give the work a next step.</h3><p>Route a follow-up, draft, reminder or system update to the right AI employee. Agreed rules decide what runs and what comes back to you for approval.</p><span className={styles.stepTag}>Your managed AI workforce</span></article>
      </div>
    </section>

    <section id="your-day" className={styles.daySection} aria-labelledby="day-title"><div className={styles.wrap}>
      <div className={styles.sectionHead}><div><p className={styles.eyebrow}>LESS TO HOLD IN YOUR HEAD</p><h2 id="day-title">A full day.<br /><span>Fewer loose ends.</span></h2></div><p>Meetings. Site visits. Ideas on the move. Explore how the planned integration could turn the small moments in your day into useful work.</p></div>
      <DayExplorer />
    </div></section>

    <section className={`${styles.wrap} ${styles.section} ${styles.productSection}`} aria-labelledby="product-title">
      <div className={styles.productPhoto}><Image src="/images/omi/omi-detail.jpg" width={1200} height={1200} sizes="(max-width: 800px) 100vw, 50vw" alt="Close-up of the Omi wearable pendant" /><div><span>SMALL DEVICE. BIG POSSIBILITIES.</span><a href="https://www.omi.me/" target="_blank" rel="noopener noreferrer">Meet Omi <ArrowUpRight size={18} aria-hidden="true" /></a></div></div>
      <div className={styles.productCopy}><p className={styles.eyebrow}>AWAY FROM YOUR DESK. STILL CONNECTED.</p><h2 id="product-title">Wear your memory.<br /><span>Bring your team.</span></h2><p>Omi captures spoken conversations and organises them in its app. XoomAI’s next step is to connect that memory to the people, projects and AI roles that make your business run.</p>
        <ul><li><AudioLines aria-hidden="true" /><div><h3>Conversations you can come back to</h3><p>Review Omi’s transcripts and summaries, or search for a detail you need.</p></div></li><li><Brain aria-hidden="true" /><div><h3>Reminders with a reason behind them</h3><p>Keep the commitment connected to the client, project and conversation.</p></div></li><li><GitBranch aria-hidden="true" /><div><h3>Specialist roles, working together</h3><p>Your Sales Representative, Executive Assistant and Operations Coordinator each take their part.</p></div></li></ul>
        <Link className={styles.textLink} href="/xoomagent">Explore the XoomAgent™ workforce <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </section>

    <section className={styles.controlSection} aria-labelledby="control-title"><div className={`${styles.wrap} ${styles.controlInner}`}>
      <div><div className={styles.controlIcon}><Fingerprint size={36} strokeWidth={1.3} aria-hidden="true" /></div><p className={styles.eyebrow}>YOUR DAY. YOUR BOUNDARIES.</p><h2 id="control-title">More support.<br />Still your call.</h2><p>A wearable belongs in your life on your terms. We’ll scope capture, access and approvals before connecting it to your business.</p></div>
      <div className={styles.controls}><article><span>01</span><div><h3>Choose what you capture</h3><p>Start with appropriate conversations, let others know, and get the permissions needed before recording.</p></div></article><article><span>02</span><div><h3>Set the boundaries</h3><p>Agree which systems and information each AI employee can access. Review Omi’s data settings alongside your business requirements.</p></div></article><article><span>03</span><div><h3>Keep decisions with your team</h3><p>Define approval points for messages, documents and changes. Escalate anything that needs human judgement.</p></div></article></div>
    </div></section>

    <section className={`${styles.wrap} ${styles.section} ${styles.faq}`} aria-labelledby="faq-title"><div><p className={styles.eyebrow}>THE DETAILS</p><h2 id="faq-title">Good questions.<br /><span>Clear answers.</span></h2><a href={SITE.emailHref} className={styles.textLink}>Talk to our team <ArrowUpRight size={17} aria-hidden="true" /></a></div><div>{faqs.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>

    <section id="start" className={`${styles.wrap} ${styles.closing}`} aria-labelledby="start-title"><div className={styles.closingOrb} aria-hidden="true"><span>omi</span><span>+</span><span>XoomAgent™</span></div><p className={styles.eyebrow}>HELP SHAPE WHAT COMES NEXT</p><h2 id="start-title">What if your next conversation<br /><span>came with a next step?</span></h2><p>Tell us where details get lost and follow-ups stall.<br />Let’s explore Omi + XoomAgent™ for your business.</p><div className={styles.actions}><OmiBookingLink placement="closing" /><a className={styles.textLink} href="mailto:support@xoomai.com.au?subject=Omi%20%2B%20XoomAgent%20integration%20interest">Email your interest <ArrowUpRight size={17} aria-hidden="true" /></a></div><span className={styles.closingNote}><ShieldCheck size={15} aria-hidden="true" /> Australian team · Managed by XoomAI · Integration in development</span></section>

    <footer className={styles.footer}><div className={styles.wrap}><div className={styles.footerTop}><Link href="/" aria-label="XoomAI home"><Image src="/images/XoomAI_Horizontal.png" width={5705} height={1380} alt="XoomAI" className={styles.logo} /></Link><p>Your managed AI workforce.<br />Now exploring a world beyond the screen.</p><a href={SITE.emailHref}>{SITE.email}</a><a href={SITE.phoneHref}>{SITE.phone}</a></div><div className={styles.footerBottom}><p>© {new Date().getFullYear()} {SITE.legalName} · ABN {SITE.abn}</p><p>Omi product imagery and film: <a href="https://www.omi.me/" target="_blank" rel="noopener noreferrer">omi.me</a>. Omi is a product of Based Hardware Inc.</p></div></div></footer>
  </div>;
}
