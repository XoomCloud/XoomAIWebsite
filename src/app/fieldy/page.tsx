import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Brain, Check, Fingerprint, GitBranch, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { SITE } from "@/lib/site";
import { DayExplorer, FieldyBookingLink, ProductFilm } from "./fieldy-interactions";
import styles from "./fieldy.module.css";

const title = "Fieldy + XoomAgent™ | Your day, connected to your AI workforce";
const description = "Fieldy + XoomAgent™ connects your AI wearable to your managed AI workforce. Turn conversations into context, reminders and tasks for the right AI employee. Available now from XoomAI.";

export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: "/fieldy" },
  openGraph: { title, description, url: "/fieldy", type: "website", images: [{ url: "/images/fieldy/fieldy-hero.webp", width: 4202, height: 2800, alt: "Fieldy 3 worn as an AI pendant" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/images/fieldy/fieldy-hero.webp"] },
};

const faqs = [
  ["What is the XoomAI Fieldy integration?", "Fieldy + XoomAgent™ connects Fieldy’s conversation capture with your managed AI workforce. It carries context from your day into reminders, tasks and work assigned to the appropriate AI employee. The integration is available now from XoomAI, with setup and ongoing management tailored to your business."],
  ["How does Fieldy capture my conversations?", "Fieldy 3 is a wearable AI note taker you can wear as a pendant or on your wrist. It works with the Fieldy app to create transcripts, summaries, tasks and reminders. It connects to your phone over Bluetooth, and AI processing needs your phone’s internet connection. Choose appropriate conversations to capture and obtain the permissions needed before recording."],
  ["What does XoomAgent™ do with that information?", "XoomAgent™ identifies commitments, retains relevant context, creates reminders and routes work to configured AI employees. For example, a client conversation becomes a proposal task for your Sales Representative and a reminder for your Executive Assistant. Your connected systems and approval rules determine which actions run automatically and which need your review."],
  ["Do I need to replace my current business systems?", "XoomAgent™ connects to the tools your team already uses. We assess your CRM, email, calendars and project systems during onboarding, confirm the connections for your business, and configure your workflows around them."],
  ["Who controls recordings and business actions?", "Recording choices sit with you. During onboarding, we map what information is captured, where it is processed, who can access it and how long it is retained. Fieldy’s own terms and data settings apply to its service. XoomAgent™ works within your agreed permissions, review steps and escalation rules."],
  ["How do I get started, and what does it cost?", "Fieldy + XoomAgent™ is available now. Book a call with XoomAI to discuss your workflows and arrange setup. We provide a quote covering the hardware, applicable Fieldy plan and managed AI roles your business needs, with the scope and costs agreed before deployment."],
];

export default function FieldyPage() {
  return <div className={styles.page}>
    <header className={styles.header}><div className={styles.headerInner}>
      <Link href="/" aria-label="XoomAI home"><Image src="/images/XoomAI_Horizontal.png" width={5705} height={1380} alt="XoomAI" priority className={styles.logo} /></Link>
      <nav aria-label="Fieldy page navigation"><a href="#how-it-works">How it works</a><a href="#your-day">Your day, connected</a><Link href="/xoomagent">Meet XoomAgent™</Link></nav>
      <a href="#start" className={styles.headerCta}>Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div></header>

    <section className={`${styles.wrap} ${styles.hero}`} aria-labelledby="fieldy-title">
      <div className={styles.heroCopy}>
        <div className={styles.eyebrow}><span className={styles.dot} /> AVAILABLE NOW · FIELDY + XOOMAI</div>
        <h1 id="fieldy-title">Your day,<br />remembered.<br /><span>Your work,<br />handled.</span></h1>
        <p className={styles.lede}>The AI you wear. The AI workforce that follows through.</p>
        <p className={styles.heroBody}>Fieldy captures the conversation. XoomAgent™ turns it into context, reminders and tasks for the right AI employee — with you in control.</p>
        <div className={styles.actions}><FieldyBookingLink placement="hero">Get Fieldy for your business</FieldyBookingLink><a className={styles.textLink} href="#your-day">See a day in action <ArrowDown size={17} aria-hidden="true" /></a></div>
        <p className={styles.heroNote}>Available now. Fully managed by XoomAI. Built around you.</p>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.visualLabel}><span>Fieldy <b>+</b> XoomAgent™</span><span>FROM CONVERSATION TO ACTION</span></div>
        <Image src="/images/fieldy/fieldy-hero.webp" width={4202} height={2800} preload sizes="(max-width: 800px) 100vw, 55vw" className={styles.heroProduct} alt="A person wearing the white Fieldy 3 AI pendant on a black cord" />
        <div className={styles.capturePill}><AudioLines size={20} aria-hidden="true" /><div><strong>Stay present.</strong><span>Keep the context.</span></div></div>
        <div className={styles.heroTask}><div><span className={styles.sparkIcon}><Sparkles size={16} aria-hidden="true" /></span><span>XoomAgent™<small>Workflow example</small></span><span className={styles.taskDot} /></div><p>“Follow up with Alex on Friday.”</p><footer><Check size={14} aria-hidden="true" /> Routed to your Executive Assistant</footer></div>
        <ProductFilm />
        <span className={styles.visualIndex}>01 / THE WEARABLE MEETS THE WORKFORCE</span>
      </div>
    </section>

    <div className={styles.promiseStrip}><div className={styles.wrap}><span><Mic size={17} aria-hidden="true" /> Capture the conversation</span><ArrowRight size={16} className={styles.stripArrow} aria-hidden="true" /><span><Brain size={18} aria-hidden="true" /> Connect the context</span><ArrowRight size={16} className={styles.stripArrow} aria-hidden="true" /><span><GitBranch size={18} aria-hidden="true" /> Delegate the work</span></div></div>

    <section id="how-it-works" className={`${styles.wrap} ${styles.section}`} aria-labelledby="beyond-notes">
      <div className={styles.sectionHead}><div><p className={styles.eyebrow}>ONE CONNECTED WORKFORCE</p><h2 id="beyond-notes">A memory for your day.<br /><span>A workforce for what’s next.</span></h2></div><p>A great conversation can create a dozen things to do. Fieldy + XoomAgent™ brings an AI wearable and advanced AI employees together, so the next step doesn’t depend on you remembering it.</p></div>
      <div className={styles.steps}>
        <article><span className={styles.stepNum}>01 / CAPTURE</span><Mic size={30} strokeWidth={1.4} aria-hidden="true" /><h3>Be part of the conversation.</h3><p>Wear Fieldy through your working day and capture the conversations you choose. Less stopping to type. More attention on the person in front of you.</p><span className={styles.stepTag}>Fieldy wearable + app</span></article>
        <article><span className={styles.stepNum}>02 / UNDERSTAND</span><Brain size={30} strokeWidth={1.4} aria-hidden="true" /><h3>Keep the meaning, too.</h3><p>XoomAgent™ keeps the relevant context: what was decided, who it concerns, what was promised and when it matters.</p><span className={styles.stepTag}>Your business context</span></article>
        <article><span className={styles.stepNum}>03 / FOLLOW THROUGH</span><GitBranch size={30} strokeWidth={1.4} aria-hidden="true" /><h3>Give the work a next step.</h3><p>Route a follow-up, draft, reminder or system update to the right AI employee. Agreed rules decide what runs and what comes back to you for approval.</p><span className={styles.stepTag}>Your managed AI workforce</span></article>
      </div>
    </section>

    <section id="your-day" className={styles.daySection} aria-labelledby="day-title"><div className={styles.wrap}>
      <div className={styles.sectionHead}><div><p className={styles.eyebrow}>LESS TO HOLD IN YOUR HEAD</p><h2 id="day-title">A full day.<br /><span>Fewer loose ends.</span></h2></div><p>Meetings. Site visits. Ideas on the move. See how Fieldy + XoomAgent™ turns the small moments in your day into useful work.</p></div>
      <DayExplorer />
    </div></section>

    <section className={`${styles.wrap} ${styles.section} ${styles.productSection}`} aria-labelledby="product-title">
      <div className={styles.productPhoto}><Image src="/images/fieldy/fieldy-detail.webp" width={1864} height={1744} sizes="(max-width: 800px) 100vw, 50vw" alt="Black Fieldy 3 pendant and cord resting on a wooden table" /><div><span>SMALL DEVICE. BIG POSSIBILITIES.</span><a href="https://www.fieldy.ai/" target="_blank" rel="noopener noreferrer">Meet Fieldy <ArrowUpRight size={18} aria-hidden="true" /></a></div></div>
      <div className={styles.productCopy}><p className={styles.eyebrow}>AWAY FROM YOUR DESK. STILL CONNECTED.</p><h2 id="product-title">Wear your memory.<br /><span>Bring your team.</span></h2><p>Wear Fieldy 3 as a pendant or on your wrist. Its app turns spoken conversations into transcripts, summaries and searchable context. XoomAgent™ connects that context to the people, projects and AI roles that make your business run.</p>
        <ul><li><AudioLines aria-hidden="true" /><div><h3>Conversations you can come back to</h3><p>Review Fieldy’s transcripts and summaries, or search for a detail you need.</p></div></li><li><Brain aria-hidden="true" /><div><h3>Reminders with a reason behind them</h3><p>Keep the commitment connected to the client, project and conversation.</p></div></li><li><GitBranch aria-hidden="true" /><div><h3>Specialist roles, working together</h3><p>Your Sales Representative, Executive Assistant and Operations Coordinator each take their part.</p></div></li></ul>
        <Link className={styles.textLink} href="/xoomagent">Explore the XoomAgent™ workforce <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </section>

    <section className={styles.controlSection} aria-labelledby="control-title"><div className={`${styles.wrap} ${styles.controlInner}`}>
      <div><div className={styles.controlIcon}><Fingerprint size={36} strokeWidth={1.3} aria-hidden="true" /></div><p className={styles.eyebrow}>YOUR DAY. YOUR BOUNDARIES.</p><h2 id="control-title">More support.<br />Still your call.</h2><p>A wearable belongs in your life on your terms. You control capture, access and approvals. XoomAI manages the setup around your business.</p></div>
      <div className={styles.controls}><article><span>01</span><div><h3>Choose what you capture</h3><p>Start with appropriate conversations, let others know, and get the permissions needed before recording.</p></div></article><article><span>02</span><div><h3>Set the boundaries</h3><p>Agree which systems and information each AI employee can access. Review Fieldy’s data settings alongside your business requirements.</p></div></article><article><span>03</span><div><h3>Keep decisions with your team</h3><p>Define approval points for messages, documents and changes. Escalate anything that needs human judgement.</p></div></article></div>
    </div></section>

    <section className={`${styles.wrap} ${styles.section} ${styles.faq}`} aria-labelledby="faq-title"><div><p className={styles.eyebrow}>THE DETAILS</p><h2 id="faq-title">Good questions.<br /><span>Clear answers.</span></h2><a href={SITE.emailHref} className={styles.textLink}>Talk to our team <ArrowUpRight size={17} aria-hidden="true" /></a></div><div>{faqs.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>

    <section id="start" className={`${styles.wrap} ${styles.closing}`} aria-labelledby="start-title"><div className={styles.closingOrb} aria-hidden="true"><span>Fieldy</span><span>+</span><span>XoomAgent™</span></div><p className={styles.eyebrow}>PUT YOUR DAY TO WORK</p><h2 id="start-title">Your next conversation.<br /><span>Your next task, handled.</span></h2><p>Keep the context. Delegate the follow-through.<br />Get Fieldy + XoomAgent™ working for your business.</p><div className={styles.actions}><FieldyBookingLink placement="closing" /><a className={styles.textLink} href="mailto:support@xoomai.com.au?subject=Get%20started%20with%20Fieldy%20%2B%20XoomAgent">Talk to our team <ArrowUpRight size={17} aria-hidden="true" /></a></div><span className={styles.closingNote}><ShieldCheck size={15} aria-hidden="true" /> Australian team · Managed by XoomAI · Available now</span></section>

    <footer className={styles.footer}><div className={styles.wrap}><div className={styles.footerTop}><Link href="/" aria-label="XoomAI home"><Image src="/images/XoomAI_Horizontal.png" width={5705} height={1380} alt="XoomAI" className={styles.logo} /></Link><p>Your managed AI workforce.<br />Connected to your day, beyond the screen.</p><a href={SITE.emailHref}>{SITE.email}</a><a href={SITE.phoneHref}>{SITE.phone}</a></div><div className={styles.footerBottom}><p>© {new Date().getFullYear()} {SITE.legalName} · ABN {SITE.abn}</p><p>Fieldy product imagery and film: <a href="https://www.fieldy.ai/" target="_blank" rel="noopener noreferrer">fieldy.ai</a>. Fieldy is a product of Field Labs Inc.</p></div></div></footer>
  </div>;
}
