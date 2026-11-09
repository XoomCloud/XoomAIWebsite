"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import css from "./page.module.css";

const toCssName = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const styles = new Proxy(css as Record<string, string>, {
  get(target, property: string) {
    return target[toCssName(property)];
  },
});

const PACKAGES = {
  foundation: { name: "AI Foundation", employees: 4, monthly: 1399, onboarding: 5000, partnerUpfront: 1000 },
  workforce: { name: "AI Workforce", employees: 8, monthly: 2399, onboarding: 5000, partnerUpfront: 1000 },
};

const roles = [
  ["Sales Representative", "Qualifies leads, prepares follow-up and keeps CRM activity moving."],
  ["Customer Service Rep", "Answers approved enquiries and escalates anything that needs a human."],
  ["Executive Assistant", "Supports inboxes, calendars and the daily admin that slows teams down."],
  ["Accounts Officer", "Assists with invoices, reconciliations and payment follow-up for review."],
  ["Operations Coordinator", "Runs defined multi-step workflows across connected systems."],
  ["Marketing Coordinator", "Drafts on-brand content, schedules campaigns and reports on activity."],
  ["HR & Recruitment", "Supports candidate screening, onboarding and routine people questions."],
  ["Knowledge Assistant", "Finds approved answers across documents, SOPs and policies."],
];

const protections = [
  ["Registered opportunities", "Introduced accounts are recorded and associated with the referring MSP."],
  ["Clear account ownership", "XoomAI manages the referred XoomAgent client; the partner supports the relationship as agreed in writing."],
  ["No channel conflict", "Communication, delivery and expansion rules are agreed before client engagement."],
  ["Visible reporting", "Commercial outcomes and partner payments follow a defined reporting cadence."],
];

const money = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

function cx(...names: string[]) {
  return names.map((name) => css[toCssName(name)]).filter(Boolean).join(" ");
}

function Logo() {
  return (
    <Image
      className={styles.logo}
      src="/images/XoomAI_Horizontal.png"
      alt="XoomAI"
      width={5705}
      height={1380}
      priority
    />
  );
}

function PartnerForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/partner-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "We could not process your request.");
      setStatus("success");
      window.setTimeout(() => {
        const link = document.createElement("a");
        link.href = "/downloads/XoomAI-MSP-Partner-Pack.pdf";
        link.download = "XoomAI-MSP-Partner-Pack.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, 350);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.formSuccess} role="status">
        <span className={styles.successOrbit} aria-hidden="true">✓</span>
        <p className={styles.miniLabel}>Partner pack unlocked</p>
        <h2>Your download is ready.</h2>
        <p>The PDF should begin downloading automatically. Keep this link in case your browser blocks it.</p>
        <a className={cx("button", "buttonGradient")} href="/downloads/XoomAI-MSP-Partner-Pack.pdf" download>
          Download partner pack <span aria-hidden="true">↓</span>
        </a>
      </div>
    );
  }

  return (
    <form className={styles.partnerForm} onSubmit={submit}>
      <div className={cx("fieldGrid", "two")}>
        <label>First name<input name="firstName" autoComplete="given-name" required /></label>
        <label>Last name<input name="lastName" autoComplete="family-name" required /></label>
      </div>
      <label>Company<input name="company" autoComplete="organization" required /></label>
      <label>Work email<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label>
      <div className={cx("fieldGrid", "two")}>
        <label>Managed clients
          <select name="managedClients" defaultValue="20-49" required>
            <option value="1-19">1-19</option><option value="20-49">20-49</option>
            <option value="50-99">50-99</option><option value="100+">100+</option>
          </select>
        </label>
        <label>AI capability today
          <select name="aiCapability" defaultValue="referral" required>
            <option value="none">None yet</option><option value="ad-hoc">Ad-hoc projects</option>
            <option value="referral">Referral partners</option><option value="in-house">Some in-house</option>
          </select>
        </label>
      </div>
      <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {status === "error" && <p className={styles.formError} role="alert">{message}</p>}
      <button className={cx("button", "buttonGradient", "formSubmit")} type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Preparing your pack…" : "Unlock & download the partner pack"}
        <span aria-hidden="true">→</span>
      </button>
      <p className={styles.formNote}>By requesting the pack, you agree that XoomAI may contact you about the MSP Partner Program.</p>
    </form>
  );
}

export function PartnerPage() {
  const [packageKey, setPackageKey] = useState<keyof typeof PACKAGES>("workforce");
  const [clients, setClients] = useState(5);
  const [monthlyDirectCosts, setMonthlyDirectCosts] = useState(1000);
  const model = useMemo(() => {
    const pkg = PACKAGES[packageKey];
    const annualClientRevenue = pkg.monthly * 12 * clients;
    const clientOnboarding = pkg.onboarding * clients;
    const partnerUpfront = pkg.partnerUpfront * clients;
    const profitShare = Math.max(0, pkg.monthly - monthlyDirectCosts) * 12 * clients * 0.3;
    return { pkg, annualClientRevenue, clientOnboarding, partnerUpfront, profitShare, total: partnerUpfront + profitShare };
  }, [packageKey, clients, monthlyDirectCosts]);

  return (
    <div className={styles.partnerPage}>
      <header className={styles.siteHeader}>
        <a href="#top" aria-label="XoomAI MSP Partner Program home"><Logo /></a>
        <nav aria-label="Primary navigation">
          <a href="#why">Why partner</a><a href="#packages">Packages</a><a href="#economics">Economics</a><a href="#process">How it works</a>
        </nav>
        <a className={styles.headerCta} href="#partner-pack">Get the partner pack</a>
      </header>

      <section className={styles.hero} id="top">
        <div className={cx("heroGlow", "one")} /><div className={cx("heroGlow", "two")} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span /> 60 ready-to-deploy AI Employee roles · MSP channel program</p>
            <h1>Give every client an <span className={styles.gradientText}>AI Workforce</span>, without building one yourself.</h1>
            <p className={styles.heroLede}>Introduce XoomAI when a client needs AI Employees to answer calls, reply to email, qualify leads, process invoices or run workflows. We scope, build, secure and manage the workforce. You introduce the client and remain involved as agreed.</p>
            <div className={styles.heroActions}>
              <a className={cx("button", "buttonGradient")} href="#partner-pack">Get the partner pack <span aria-hidden="true">→</span></a>
              <a className={cx("button", "buttonGhost")} href="#economics">See the commercial model</a>
            </div>
            <div className={styles.heroProof}>
              <div><strong>$1,000</strong><span>after cleared setup payment</span></div>
              <div><strong>30%</strong><span>net profit share</span></div>
              <div><strong>60</strong><span>AI Employee roles ready to go</span></div>
            </div>
          </div>

          <aside className={styles.downloadCard} id="partner-pack" aria-labelledby="pack-heading">
            <div className={styles.packPreview}>
              <div className={styles.previewTop}><Logo /><span>MSP INFORMATION PACK</span></div>
              <p>Protect the relationship.<br /><b>Own the AI conversation.</b></p>
              <div className={styles.previewOrbit} /><div className={styles.previewMetric}><strong>30%</strong><span>net profit share</span></div>
            </div>
            <div className={styles.downloadContent}>
              <p className={styles.miniLabel}>Complimentary 31-page information pack</p>
              <h2 id="pack-heading">See what you can bring to your clients.</h2>
              <p className={styles.downloadIntro}>Capability statement, AI Workforce product, 60-role catalogue, delivery and security model, packages, partner economics, Fieldy, XoomTalent and sales playbook.</p>
              <PartnerForm />
            </div>
          </aside>
        </div>
        <div className={styles.heroTicker} aria-label="Program benefits">
          <span>Protected opportunities</span><span>XoomAgent by XoomAI</span><span>No AI hires required</span><span>Australian managed team</span><span>Recurring partner revenue</span>
        </div>
      </section>

      <section className={cx("section", "introductionBand")} aria-labelledby="introducing-heading">
        <div className={cx("sectionHeading", "splitHeading")}>
          <div><p className={styles.sectionKicker}>What you are introducing</p><h2 id="introducing-heading">A fully managed AI Workforce for your client.</h2></div>
          <p>XoomAI turns business requirements into role-specific AI Employees that work inside the client’s existing tools. The MSP opens the conversation; XoomAI handles the specialist AI lifecycle.</p>
        </div>
        <div className={styles.offerGrid}>
          <article><span>01</span><p className={styles.miniLabel}>Find the work</p><h3>AI Workflow Audit</h3><p>We identify repetitive work, response gaps and knowledge bottlenecks worth solving.</p></article>
          <article><span>02</span><p className={styles.miniLabel}>Deploy the workforce</p><h3>Choose from 60 AI Employee roles</h3><p>Sales, service, accounts, operations, marketing, HR, administration and more.</p></article>
          <article><span>03</span><p className={styles.miniLabel}>Manage the outcome</p><h3>Build, integrate and optimise</h3><p>XoomAI configures the agents, connects approved systems and improves performance over time.</p></article>
        </div>
      </section>

      <section className={cx("section", "light")} id="why">
        <div className={cx("sectionHeading", "splitHeading")}>
          <div><p className={styles.sectionKicker}>The account-control issue</p><h2>Your next competitor may enter through an AI project.</h2></div>
          <p>When clients look elsewhere for AI expertise, they do not just introduce an AI provider. They introduce another technology partner into an account you have spent years building.</p>
        </div>
        <div className={styles.pathGrid}>
          <article className={cx("pathCard", "risk")}><p className={styles.miniLabel}>Without an AI partner</p><h3>The capability gap stays open.</h3>
            {["Client asks about AI", "MSP cannot confidently deliver", "Client searches externally", "Another provider enters the account"].map((item, i) => <div className={styles.pathStep} key={item}><span>0{i + 1}</span><p>{item}</p></div>)}
          </article>
          <article className={cx("pathCard", "protected")}><p className={styles.miniLabel}>With XoomAI</p><h3>The conversation stays with you.</h3>
            {["MSP keeps the client conversation", "XoomAI adds specialist capability", "Opportunity is jointly progressed", "Relationship and revenue expand"].map((item, i) => <div className={styles.pathStep} key={item}><span>0{i + 1}</span><p>{item}</p></div>)}
          </article>
        </div>
        <div className={styles.pullQuote}><span>“</span><p>Keep your existing MSP services. Introduce XoomAI for the agreed XoomAgent scope, with client and service boundaries recorded in writing.</p></div>
      </section>

      <section className={cx("section", "darkSection")} id="packages">
        <div className={cx("sectionHeading", "centered")}><p className={styles.sectionKicker}>60 AI Employee roles ready to go</p><h2>Build the workforce each client actually needs.</h2><p>Start with four or eight role-specific AI Employees, selected from a catalogue of 60 roles and configured around real workflows, approved systems and measurable outcomes.</p></div>
        <div className={styles.packageGrid}>
          <article className={styles.packageCard}><div><p className={styles.miniLabel}>Entry package</p><h3>AI Foundation</h3><p className={styles.employeeCount}>4 AI Employees</p></div><div className={styles.price}><strong>$1,399</strong><span>+ GST / month</span></div><ul><li>$5,000 + GST setup reference, unless agreed otherwise</li><li>$1,000 after setup payment clears</li><li>Four role-specific AI agents</li><li>Configured around priority tasks</li><li>Ongoing optimisation</li></ul></article>
          <article className={cx("packageCard", "featured")}><div className={styles.popular}>Typical client package</div><div><p className={styles.miniLabel}>Broader deployment</p><h3>AI Workforce</h3><p className={styles.employeeCount}>8 AI Employees</p></div><div className={styles.price}><strong>$2,399</strong><span>+ GST / month</span></div><ul><li>$5,000 + GST setup reference, unless agreed otherwise</li><li>$1,000 after setup payment clears</li><li>Eight role-specific AI agents</li><li>Cross-workflow deployment</li><li>Ongoing optimisation</li></ul></article>
        </div>
        <div className={styles.roleGrid}>{roles.map(([title, body], i) => <article key={title}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
        <p className={styles.roleDisclaimer}>Eight examples from a catalogue of 60 AI Employee roles. Final workforce composition, integrations and delivery scope are confirmed with each client.</p>
      </section>

      <section className={cx("section", "economics")} id="economics">
        <div className={cx("sectionHeading", "splitHeading")}><div><p className={styles.sectionKicker}>Commercial model</p><h2>Agree the scope. Share in the value.</h2></div><p>A qualifying referral earns $1,000 after setup payment clears, plus 30% of net profit. Enter illustrative direct delivery costs below. Actual payments use received revenue and attributable costs under the agreement.</p></div>
        <div className={styles.calculatorShell}>
          <div className={styles.calculatorControls}>
            <label>Typical client package<select value={packageKey} onChange={(event) => setPackageKey(event.target.value as keyof typeof PACKAGES)}><option value="foundation">AI Foundation · 4 Employees</option><option value="workforce">AI Workforce · 8 Employees</option></select></label>
            <label>Illustrative monthly direct costs per client (AUD)<input type="number" min="0" step="1" value={monthlyDirectCosts} onChange={(event) => setMonthlyDirectCosts(Math.max(0, Number(event.target.value) || 0))} /></label>
            <label>Clients referred <output>{clients}</output><input type="range" min="1" max="20" value={clients} onChange={(event) => setClients(Number(event.target.value))} /></label>
            <div className={styles.packageCommercials}>
              <div><span>Setup fee reference, unless agreed otherwise</span><strong>{money.format(model.pkg.onboarding)} + GST</strong></div>
              <div><span>Partner commission after cleared setup payment</span><strong>{money.format(model.pkg.partnerUpfront)} per client</strong></div>
            </div>
            <div className={styles.fixedAssumption}><span>Illustrative costs</span><strong>{money.format(monthlyDirectCosts)} per client / month</strong><p>Net profit is received revenue less direct delivery costs. No assumed margin or guaranteed return. This estimate shows no trailing payment when illustrative profit is zero or negative.</p></div>
            <p className={styles.calculatorNote}>Actual payments use cleared receipts, attributable software, infrastructure, API, contractor, support and implementation costs, and the reporting schedule in the executed agreement. Exclude GST, taxes, refunds, chargebacks, unpaid or disputed amounts, pass-through expenses and third-party costs not retained by XoomAI. Upfront and trailing payments are subject to referral eligibility.</p>
          </div>
          <div className={styles.calculatorResults}>
            <p className={styles.miniLabel}>Illustrative first-year partner value</p><strong className={styles.totalValue}>{money.format(model.total)}</strong>
            <div className={styles.resultRow}><span>Upfront MSP payments ({money.format(model.pkg.partnerUpfront)} × {clients})</span><b>{money.format(model.partnerUpfront)}</b></div>
            <div className={styles.resultRow}><span>30% share of illustrative recurring net profit</span><b>{money.format(model.profitShare)}</b></div>
            <div className={cx("resultRow", "muted")}><span>Client onboarding fees ({money.format(model.pkg.onboarding)} × {clients})</span><b>{money.format(model.clientOnboarding)}</b></div>
            <div className={cx("resultRow", "muted")}><span>Annual client revenue under management</span><b>{money.format(model.annualClientRevenue)}</b></div>
            <p>{clients} × {model.pkg.name} client{clients > 1 ? "s" : ""} at {money.format(model.pkg.monthly)} per month, plus a {money.format(model.pkg.onboarding)} setup fee reference per client unless XoomAI agrees otherwise. The estimate assumes all clients pay for 12 months and the stated costs apply; it excludes setup profit and uplift from the trailing calculation. All figures exclude GST.</p>
          </div>
        </div>
      </section>

      <section className={cx("section", "light")} aria-labelledby="partner-terms">
        <div className={styles.sectionHeading}><p className={styles.sectionKicker}>Written terms before commitments</p><h2 id="partner-terms">Referral, uplift and delivery boundaries.</h2></div>
        <p>Approved uplift above XoomAI’s agreed base price is split 70% to Partner and 30% to XoomAI after applicable exclusions. Calculate it separately from the 30% trailing commission; do not double count unless agreed in writing. Any uplift must be disclosed to and accepted by the client and cannot create unapproved delivery obligations.</p>
        <p>A qualifying referral is introduced by the partner, is not already an active XoomAI opportunity, existing client or known prospect at referral, signs with XoomAI and pays cleared funds. The selected agreement is a commercial draft for legal review before signing. The applicable executed agreement governs payments, exclusions, confidentiality and mutual client protections.</p>
        <p><a href="/fieldy">Fieldy + XoomAgent</a> connects wearable conversation context to approved AI work. <a href="/xoomtalent">XoomTalent</a> supplies fractional human AI specialists. Product-specific referral fees, attribution and payment triggers must be agreed separately in writing; XoomAgent commission does not automatically apply to Fieldy hardware, third-party plans or XoomTalent specialist labour.</p>
      </section>

      <section className={cx("section", "processSection")} id="process">
        <div className={cx("sectionHeading", "centered")}><p className={styles.sectionKicker}>Simple for the MSP. Complete for the client.</p><h2>From client signal to deployed AI workforce.</h2></div>
        <div className={styles.processGrid}>{[
          ["01", "Spot", "Identify a client asking about AI, automation, efficiency or knowledge access."],
          ["02", "Register", "Register the opportunity so ownership is clear before client engagement."],
          ["03", "Discover", "XoomAI leads structured discovery with your team involved as preferred."],
          ["04", "Propose", "Scope, outcomes, commercials and responsibilities are documented."],
          ["05", "Onboard", "The AI workforce is configured, tested and introduced into agreed workflows."],
          ["06", "Optimise", "Performance is reviewed and the workforce improves over time."],
        ].map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className={cx("section", "protectionSection")}>
        <div className={styles.protectionCopy}><p className={styles.sectionKicker}>Built for channel trust</p><h2>Clear boundaries for both parties.</h2><p>Because the client relationship is the value at risk, partner protections cannot be vague. We establish the working rules before approaching the account.</p><a className={cx("button", "buttonGradient")} href="#partner-pack">Review the full partner pack <span>→</span></a></div>
        <div className={styles.protectionList}>{protections.map(([title, body], i) => <article key={title}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
      </section>

      <section className={cx("section", "faqSection")}>
        <div className={styles.sectionHeading}><p className={styles.sectionKicker}>Partner FAQ</p><h2>The questions we expect you to ask.</h2></div>
        <div className={styles.faqList}>
          <details><summary>Does XoomAI replace the MSP in the client relationship?<span>+</span></summary><p>Referred XoomAgent clients are clients of XoomAI unless otherwise agreed in writing. XoomAI controls base pricing, contracts, delivery, support, billing and ongoing XoomAI account management. The partner may assist with introductions and relationship support as agreed. Existing MSP services and out-of-scope opportunities follow the agreement’s mutual client protections.</p></details>
          <details><summary>How is an opportunity protected?<span>+</span></summary><p>The lead is registered before engagement. Account ownership, communication and delivery rules are then confirmed under the partner agreement.</p></details>
          <details><summary>Can XoomAgent be white-labelled or rebranded?<span>+</span></summary><p>No. Present the service as XoomAgent by XoomAI. The agreement grants no white-label or rebranding rights, and the partner cannot sell it as its own product or bind XoomAI without written approval.</p></details>
          <details><summary>How are partner payments calculated?<span>+</span></summary><p>A qualifying referral earns $1,000 once the client signs and setup payment clears, plus 30% of net profit from the relevant XoomAgent service. Payments are monthly in arrears after cleared client payment, with a revenue, direct-cost and commission summary. There is no minimum client term for eligibility. Trailing share continues while the qualifying client remains active and paying, including after partner termination, subject to the agreement’s exclusions.</p></details>
          <details><summary>What does the MSP need to deliver?<span>+</span></summary><p>The MSP introduces the client and provides account context. XoomAI can lead discovery, design, configuration, onboarding and ongoing optimisation.</p></details>
        </div>
      </section>

      <section className={styles.finalCta}><div className={styles.ctaOrbit} /><p className={styles.sectionKicker}>Start with the accounts you already know</p><h2>Find the first three AI opportunities hiding in your client base.</h2><p>Download the information pack, review the commercial model and decide whether XoomAI belongs in your account-protection strategy.</p><a className={cx("button", "buttonGradient")} href="#partner-pack">Unlock the partner pack <span>↑</span></a></section>

      <footer><div><Logo /><p>Your managed AI workforce for Australian business. XoomAI is a brand of XoomCloud Pty Ltd.</p></div><div><a href="tel:1300040225">1300 040 225</a><a href="mailto:ai@xoomai.com.au">ai@xoomai.com.au</a></div><p>Australian owned · ABN 37 680 921 162</p></footer>
    </div>
  );
}
