import type { ServiceContent } from "./types";

export const services: ServiceContent[] = [
  {
    slug: "ai-strategy",
    nav: "AI Strategy",
    eyebrow: "AI Strategy & Readiness",
    metaTitle: "AI Strategy & Readiness Assessment for Australian Business | XoomAI",
    metaDescription:
      "Know exactly where AI can save you time and money. XoomAI's AI strategy and readiness assessment maps high-impact automation opportunities and a practical roadmap for Australian SMBs.",
    keyword: "AI strategy Australia",
    h1: "Know Exactly Where AI Can Take Your Business",
    heroSubtitle:
      "Our AI Readiness Assessment gives you a clear picture of where you stand, the highest-impact opportunities to automate, and a practical roadmap to deploy your first AI employee — without the hype.",
    outcome: "A prioritised AI roadmap with quick wins you can act on in 30–60 days.",
    heroStats: [
      { value: "30–60d", label: "To first quick win" },
      { value: "12–18mo", label: "Phased roadmap" },
      { value: "5", label: "Readiness dimensions scored" },
      { value: "Free", label: "Initial workflow audit" },
    ],
    painTitle: "Most AI projects stall before they start",
    painIntro:
      "Not because the technology isn't ready — but because there's no clear plan for where to apply it, how to measure ROI, or how to keep data secure.",
    pains: [
      "You know AI could help but don't know where to start or what's realistic.",
      "Vendors push tools, not outcomes — and nobody owns the result.",
      "No clear ROI case, so the project never gets budget or buy-in.",
      "Concerns about security, privacy and data sovereignty stop you proceeding.",
    ],
    deliverTitle: "What you walk away with",
    deliverIntro:
      "Tangible deliverables you own — not a slide deck that gathers dust.",
    deliverables: [
      { icon: "FileSearch", title: "AI Opportunity Report", description: "Your highest-value automation opportunities ranked by impact and feasibility, with ROI projections and risk notes." },
      { icon: "Target", title: "Implementation Roadmap", description: "A phased 12–18 month plan with clear milestones, owners, resourcing and success metrics." },
      { icon: "Rocket", title: "Quick-Wins Plan", description: "Low-complexity, high-impact automations you can deploy in the first 30–60 days." },
      { icon: "Gauge", title: "AI Readiness Scorecard", description: "Your score across data, process documentation, use-case clarity, team readiness and integration capability." },
      { icon: "ShieldCheck", title: "Security & Governance Notes", description: "How to keep client data safe, meet Privacy Act expectations and maintain audit trails from day one." },
      { icon: "Workflow", title: "Recommended XoomAgent Modules", description: "Exactly which agent capabilities to deploy first, mapped to your workflows and systems." },
    ],
    useCasesTitle: "Where the audit usually finds value first",
    useCases: [
      "Inbox and enquiry triage that eats hours every day",
      "Repetitive document handling — quotes, forms, invoices, contracts",
      "Slow lead follow-up that's costing you conversions",
      "Manual CRM updates and data entry between systems",
      "After-hours enquiries going unanswered",
      "Reporting and admin that pulls senior staff off billable work",
    ],
    whyPoints: [
      { icon: "ShieldCheck", title: "Backed by an MSP", description: "Strategy from a managed IT and security provider — security and integration are designed in, not an afterthought." },
      { icon: "MapPin", title: "Built for Australian SMBs", description: "Practical, ROI-first recommendations sized for Australian small and medium business, not enterprise theory." },
      { icon: "Workflow", title: "Tied to a delivery path", description: "Every recommendation maps to something we can actually build and manage for you with XoomAgent™." },
    ],
    pricingNote: "Start with a free AI Workflow Audit. Full strategy engagements are scoped to your business — ask for a fixed-price quote.",
    faqs: [
      { q: "How long does the AI readiness assessment take?", a: "The initial AI Workflow Audit is a focused 30-minute conversation. A full readiness assessment and roadmap typically takes 1–2 weeks depending on the number of teams and systems involved." },
      { q: "Do we need clean data or technical staff to start?", a: "No. Part of the assessment is identifying exactly what's needed. Many quick wins don't require perfect data — we prioritise opportunities you can act on now and flag what to improve later." },
      { q: "Is the audit really free?", a: "Yes. The initial AI Workflow Audit is free and obligation-free. You'll leave with a clear view of where AI can help, whether or not you work with us." },
      { q: "Will you recommend tools we don't need?", a: "No. We're outcome-led. If a workflow is better left manual, we'll tell you. Recommendations are ranked by ROI and feasibility for your specific business." },
    ],
    related: ["ai-automation", "ai-chatbot-development", "ai-analytics"],
  },

  {
    slug: "ai-automation",
    nav: "AI Automation",
    eyebrow: "AI Workflow Automation",
    metaTitle: "AI Automation for Small Business Australia | Workflow Automation | XoomAI",
    metaDescription:
      "Eliminate manual work with AI business automation. XoomAI builds intelligent workflows that process documents, triage inboxes, update your CRM and run operations 24/7 for Australian SMBs.",
    keyword: "AI automation for small business",
    h1: "Eliminate Manual Work. Reclaim Your Team's Time.",
    heroSubtitle:
      "We build intelligent automation that handles repetitive tasks — document processing, inbox triage, data entry, CRM updates and workflow orchestration — so your people focus on work that actually grows the business.",
    outcome: "Hours of repetitive admin removed from your team's week, every week.",
    heroStats: [
      { value: "24/7", label: "Always-on processing" },
      { value: "Inbox→CRM", label: "End-to-end workflows" },
      { value: "Mins", label: "Not days, to respond" },
      { value: "Audited", label: "Every action logged" },
    ],
    painTitle: "Manual work is quietly capping your growth",
    painIntro:
      "Every hour spent rekeying data, chasing approvals or sorting an inbox is an hour not spent on customers, billable work or growth.",
    pains: [
      "Staff spend hours each day on copy-paste, data entry and email triage.",
      "Information is trapped across inboxes, PDFs, spreadsheets and your CRM.",
      "Work stalls when one person is away — there's no system, just people.",
      "You can't grow without hiring, because the admin scales with the revenue.",
    ],
    deliverTitle: "What we automate",
    deliverIntro:
      "We design, build, integrate and manage the automation end-to-end — you just see the time come back.",
    deliverables: [
      { icon: "FileText", title: "Document Processing", description: "Extract, classify and route data from invoices, contracts, forms and PDFs — with human review where it matters." },
      { icon: "Inbox", title: "Inbox & Email Triage", description: "Read, categorise, draft and route incoming email so the right message reaches the right person in minutes." },
      { icon: "Workflow", title: "Workflow Orchestration", description: "Connect your systems so a trigger in one tool automatically updates the others — no manual hand-offs." },
      { icon: "Database", title: "CRM & Data Updates", description: "Keep your CRM and records accurate automatically — contacts, deals, notes and statuses updated as work happens." },
      { icon: "MessageSquare", title: "Customer Communications", description: "Automated, on-brand replies, follow-ups and notifications across email, SMS and chat." },
      { icon: "RefreshCw", title: "Approvals & Routing", description: "Route requests, quotes and approvals to the right people with reminders and a full audit trail." },
    ],
    useCasesTitle: "Common automations we deploy",
    useCases: [
      "Invoice and PO data extraction into your accounting system",
      "New-enquiry triage and instant first response",
      "Lead routing and CRM enrichment from web forms",
      "Quote and proposal drafting from a short brief",
      "Onboarding checklists and document collection",
      "Scheduled reporting compiled and sent automatically",
      "Data sync between Microsoft 365, your CRM and line-of-business apps",
      "After-hours enquiry capture and qualification",
    ],
    integrations: [
      "Microsoft 365", "Google Workspace", "HubSpot", "Salesforce", "SharePoint", "Xero / MYOB", "Make.com", "Zapier", "Outlook & Gmail", "REST APIs", "Webhooks", "SQL databases",
    ],
    whyPoints: [
      { icon: "ShieldCheck", title: "Secure by design", description: "Built and run by a managed security provider — permissioned access, isolated environments and full audit trails." },
      { icon: "Server", title: "Fully managed", description: "We don't hand you a fragile script. XoomAI builds, monitors and optimises the automation as part of XoomAgent™." },
      { icon: "Gauge", title: "ROI-first scoping", description: "We automate the workflows with the biggest time-saving payoff first, so you see value fast." },
    ],
    pricingNote: "Many automations are delivered as part of a managed XoomAgent™ subscription from $2,399/month. Standalone builds are quoted per project.",
    faqs: [
      { q: "Will automation replace my staff?", a: "No — it removes the repetitive work they dislike. Your team is freed to focus on customers, judgement calls and revenue-generating work. Most clients redeploy time rather than headcount." },
      { q: "What if a process needs a human to check it?", a: "We design human-in-the-loop steps wherever accuracy or judgement matters. The agent handles the heavy lifting and routes edge cases to a person for approval." },
      { q: "Do you work with the tools we already use?", a: "Yes. We integrate with Microsoft 365, Google Workspace, major CRMs, accounting platforms and almost anything with an API. We meet your stack where it is." },
      { q: "How quickly can we see results?", a: "Quick-win automations are often live within a few weeks. We sequence work so the highest-impact, lowest-risk automations are delivered first." },
    ],
    related: ["ai-chatbot-development", "ai-strategy", "ai-analytics"],
  },

  {
    slug: "ai-analytics",
    nav: "AI Analytics",
    eyebrow: "AI Analytics & Insights",
    metaTitle: "AI Analytics & Business Intelligence Australia | XoomAI",
    metaDescription:
      "Turn your data into decisions. XoomAI delivers AI-powered analytics — predictive forecasting, anomaly detection and natural-language reporting — in clear dashboards for Australian businesses.",
    keyword: "AI analytics Australia",
    h1: "Turn Your Data Into a Competitive Advantage",
    heroSubtitle:
      "AI-powered analytics that reveal patterns, predict what's next and deliver plain-English insights — in dashboards built for decision-makers, not data scientists.",
    outcome: "Faster, clearer decisions backed by your own data — without a BI team.",
    heroStats: [
      { value: "Weeks→Mins", label: "Time to insight" },
      { value: "Predictive", label: "Forecasts & trends" },
      { value: "Plain English", label: "Ask your data" },
      { value: "Real-time", label: "Anomaly alerts" },
    ],
    painTitle: "Your data is full of answers you can't reach",
    painIntro:
      "The numbers exist — in your CRM, accounting system and spreadsheets — but pulling them into a clear, timely picture takes hours nobody has.",
    pains: [
      "Reporting is manual, slow and out of date by the time it's read.",
      "You react to problems after they've happened, not before.",
      "Insights live in one person's head or one fragile spreadsheet.",
      "You can't easily ask your data a simple business question.",
    ],
    deliverTitle: "What our analytics deliver",
    deliverIntro:
      "From raw data to decisions — built on your systems and surfaced where your team already works.",
    deliverables: [
      { icon: "TrendingUp", title: "Predictive Analytics", description: "Revenue and demand forecasting, churn prediction and trend analysis with clear confidence levels." },
      { icon: "Search", title: "Anomaly Detection", description: "Automatic flags for unusual transactions, quality issues or operational outliers — before they cost you." },
      { icon: "MessageSquare", title: "Natural-Language Reporting", description: "Ask questions in plain English and get answers, summaries and auto-generated reports on demand." },
      { icon: "BarChart3", title: "Executive Dashboards", description: "Clean, decision-ready dashboards that pull live data from your CRM, finance and operations tools." },
      { icon: "LineChart", title: "Automated Reporting", description: "Scheduled reports compiled and delivered to inboxes or chat — no more manual spreadsheet wrangling." },
      { icon: "Boxes", title: "Operational Optimisation", description: "Inventory, capacity and demand-planning insights that reduce waste and improve margins." },
    ],
    useCasesTitle: "Questions we help you answer",
    useCases: [
      "Which leads and customers are most likely to convert or churn?",
      "What will demand look like next month, and can we meet it?",
      "Where are we losing margin we can't currently see?",
      "Which transactions or jobs look unusual and need review?",
      "How is the business tracking against target, right now?",
      "What does this month's board report say — automatically?",
    ],
    integrations: ["Microsoft 365", "Power BI", "Google Workspace", "HubSpot", "Salesforce", "Xero / MYOB", "SQL databases", "Data warehouses", "Spreadsheets", "REST APIs"],
    whyPoints: [
      { icon: "ShieldCheck", title: "Your data stays yours", description: "Analytics run in a secure, isolated environment with no model training on your data." },
      { icon: "Brain", title: "Insight, not noise", description: "We focus on the handful of metrics that change decisions — not vanity dashboards." },
      { icon: "Plug", title: "Works with your stack", description: "We connect to the systems you already run, so insight flows to where work happens." },
    ],
    pricingNote: "Analytics can be delivered standalone or as a managed XoomAgent™ capability. Book an audit for a scoped recommendation.",
    faqs: [
      { q: "Do we need a data warehouse first?", a: "Not necessarily. We can start with the systems and spreadsheets you already use, and recommend a warehouse only if the volume and complexity justify it." },
      { q: "How accurate are the predictions?", a: "Forecasts come with confidence ranges, not false certainty. Accuracy improves as more of your historical data is connected, and we're transparent about limitations." },
      { q: "Can non-technical staff use it?", a: "Yes — that's the point. Natural-language querying and clean dashboards mean anyone can ask a question and get a clear answer." },
      { q: "Is our data used to train AI models?", a: "Never. Your data is processed in an isolated environment and is never used to train any AI model." },
    ],
    related: ["ai-automation", "ai-strategy", "claude-integration"],
  },

  {
    slug: "ai-training",
    nav: "AI Training",
    eyebrow: "AI Training & Enablement",
    metaTitle: "AI Training for Teams Australia | Practical AI Upskilling | XoomAI",
    metaDescription:
      "Empower your team with practical AI skills. XoomAI delivers role-based AI training for Australian businesses — prompt engineering, workflow automation, safe and effective AI use.",
    keyword: "AI training for business Australia",
    h1: "Empower Your Team With Practical AI Skills",
    heroSubtitle:
      "Hands-on, role-based training that helps your people use AI safely and effectively in their day-to-day work — from prompt fundamentals to building AI-powered workflows.",
    outcome: "A confident, capable team that gets more done with AI — safely.",
    heroStats: [
      { value: "Role-based", label: "Tailored by team" },
      { value: "Hands-on", label: "Real workflows" },
      { value: "30 days", label: "Post-training support" },
      { value: "On-site/virtual", label: "Flexible delivery" },
    ],
    painTitle: "Your team is using AI — with or without guidance",
    painIntro:
      "Without training, staff either avoid AI entirely or use consumer tools in ways that risk data, accuracy and consistency. Both cost you.",
    pains: [
      "Staff don't know how to get reliable results from AI tools.",
      "People paste sensitive data into consumer apps without realising the risk.",
      "AI use is inconsistent — quality and tone vary across the team.",
      "Leaders can't measure or scale the value AI is creating.",
    ],
    deliverTitle: "Training built for every role",
    deliverIntro:
      "A structured learning path from foundations to mastery, customised to your industry and tools.",
    deliverables: [
      { icon: "BookOpen", title: "Prompt Engineering Fundamentals", description: "Context setting, output formatting and iterative refinement to get reliable results every time." },
      { icon: "Workflow", title: "AI for Workflow Automation", description: "Use AI with tools like Make and Zapier for document processing, email automation and integration." },
      { icon: "FileText", title: "AI for Content & Comms", description: "Draft, edit and repurpose content while keeping brand voice and accuracy under control." },
      { icon: "BarChart3", title: "Data Analysis with AI", description: "Analyse spreadsheets, visualise results and generate reports faster with AI assistance." },
      { icon: "ShieldCheck", title: "AI Ethics, Privacy & Security", description: "Data privacy, bias awareness, Privacy Act considerations and safe-use best practices." },
      { icon: "Users", title: "Building AI-Powered Teams", description: "For leaders: change management, tool selection, ROI measurement and scaling AI across the org." },
    ],
    useCasesTitle: "Who it's for",
    useCases: [
      "Leaders & managers — strategy, enablement and measuring ROI",
      "Knowledge workers — prompting, research and document automation",
      "Operations & admin — workflow automation and time-saving habits",
      "Client-facing teams — safe, on-brand AI for comms and proposals",
      "Technical teams — integration, custom automation and architecture",
      "Whole-of-business — a shared, safe AI operating standard",
    ],
    whyPoints: [
      { icon: "GraduationCap", title: "Practical, not theoretical", description: "Every session uses real workflows from your business, so skills stick and apply immediately." },
      { icon: "ShieldCheck", title: "Security-aware", description: "Delivered by a security-led provider, so your team learns to use AI without putting data at risk." },
      { icon: "RefreshCw", title: "Ongoing support", description: "30 days of post-training email support, plus optional refreshers as your tools evolve." },
    ],
    pricingNote: "Training is delivered on-site, virtual-live or blended. Group sessions are typically 8–15 people. Ask for a tailored quote.",
    faqs: [
      { q: "Do our staff need any technical background?", a: "No. Sessions are tailored to each audience — from complete beginners through to technical teams — with no prerequisites for the foundational courses." },
      { q: "Can training be customised to our industry?", a: "Yes. We build examples and exercises around your real workflows, tools and sector so the learning is immediately relevant." },
      { q: "How is training delivered?", a: "On-site, virtual-live or a self-paced blend. We recommend groups of 8–15 for hands-on sessions, and include 30 days of follow-up support." },
      { q: "Will this help us use XoomAgent better?", a: "Absolutely. Training helps your team brief, supervise and get the most out of your managed AI workforce, and spot new automation opportunities." },
    ],
    related: ["ai-strategy", "ai-automation", "claude-integration"],
  },

  {
    slug: "claude-integration",
    nav: "Claude Integration",
    eyebrow: "Claude AI Integration",
    metaTitle: "Claude AI Consultant & Integration Australia | XoomAI",
    metaDescription:
      "Enterprise Claude AI integration built for Australian business. XoomAI delivers production-grade Claude builds — secure, compliant and connected to your systems, with no training on your data.",
    keyword: "Claude AI consultant Australia",
    h1: "Enterprise Claude AI Integration, Built for Australian Business",
    heroSubtitle:
      "We deliver production-grade Claude integrations — connected to your knowledge, documents and systems, with enterprise security, Australian compliance and ongoing support.",
    outcome: "Claude working inside your business on real tasks — securely and reliably.",
    heroStats: [
      { value: "200K+", label: "Token context" },
      { value: "Vision + docs", label: "Multimodal" },
      { value: "Tool use", label: "Acts on systems" },
      { value: "No training", label: "On your data" },
    ],
    painTitle: "Off-the-shelf AI rarely survives contact with your business",
    painIntro:
      "Generic chat tools don't know your processes, can't access your systems and raise hard questions about data security and compliance.",
    pains: [
      "Consumer AI tools don't understand your business or your data.",
      "You need AI that can actually act — read documents, update systems, follow rules.",
      "Security, privacy and compliance concerns block production rollout.",
      "Proof-of-concepts never make it to a reliable, supported deployment.",
    ],
    deliverTitle: "Production-grade Claude builds",
    deliverIntro:
      "We design the architecture, integrate your systems and run it in production — securely.",
    deliverables: [
      { icon: "Headphones", title: "Intelligent Customer Support", description: "Natural conversation with knowledge-base and CRM access, sentiment awareness and automatic escalation." },
      { icon: "FileSearch", title: "Document Intelligence", description: "Classify, extract and summarise across contracts, reports and forms — including vision and document understanding." },
      { icon: "Workflow", title: "Operations Automation", description: "Routing, compliance checks, report generation and tool use that lets Claude act on your systems safely." },
      { icon: "Brain", title: "Knowledge & Analysis", description: "Synthesise research, analyse multiple documents and surface insights across your knowledge base." },
      { icon: "Network", title: "Integration Architecture", description: "API gateway, authentication, rate limiting, vector store and conversation history — engineered to last." },
      { icon: "Lock", title: "Security & Compliance", description: "End-to-end encryption, complete audit logging, permissioned access and no model training on your data." },
    ],
    useCasesTitle: "What we build with Claude",
    useCases: [
      "Internal knowledge assistants grounded in your documents",
      "Document classification and data extraction pipelines",
      "Compliance and contract review assistance",
      "Customer support copilots with CRM and knowledge access",
      "Research synthesis and report generation",
      "Tool-using agents that update systems and trigger workflows",
    ],
    integrations: ["Anthropic Claude API", "Microsoft 365", "SharePoint", "HubSpot", "Salesforce", "Vector databases", "Knowledge bases", "REST APIs", "Webhooks"],
    whyPoints: [
      { icon: "ShieldCheck", title: "Security-led delivery", description: "Built by an MSP — encryption, audit logging and least-privilege access are standard, not optional." },
      { icon: "Server", title: "Dedicated infrastructure", description: "Run on dedicated, isolated infrastructure with Australian data sovereignty in mind." },
      { icon: "Settings", title: "Production, not POC", description: "We take builds beyond the demo to monitored, supported, reliable production systems." },
    ],
    pricingNote: "Claude integrations are scoped per project, and can be delivered as part of a managed XoomAgent™ deployment.",
    faqs: [
      { q: "Why Claude rather than another model?", a: "Claude offers strong reasoning, a large context window, excellent document and vision understanding, and a safety-first design — a great fit for business-critical, compliance-sensitive work. We're model-pragmatic and will recommend the best fit for your use case." },
      { q: "Is our data used to train the model?", a: "No. Your data is never used to train AI models. We architect builds for data isolation, encryption and full audit logging." },
      { q: "Can Claude access our existing systems?", a: "Yes. Using tool use and secure integrations, Claude can read from and act on your systems with permissioned, least-privilege access." },
      { q: "Do you support the build after launch?", a: "Yes. We monitor, maintain and optimise integrations as part of an ongoing managed engagement — this is production software, not a one-off script." },
    ],
    related: ["ai-chatbot-development", "ai-automation", "ai-analytics"],
  },

  {
    slug: "ai-chatbot-development",
    nav: "AI Chatbot Development",
    eyebrow: "AI Chatbot Development",
    metaTitle: "AI Chatbot Development Australia | Custom AI Assistants | XoomAI",
    metaDescription:
      "Custom AI chatbots built for Australian business. XoomAI develops intelligent, Claude-powered chatbots that qualify leads, support customers 24/7 and integrate with your CRM — Privacy Act focused.",
    keyword: "AI chatbot development Australia",
    h1: "Custom AI Chatbots Built for Australian Business",
    heroSubtitle:
      "Intelligent, context-aware chatbots powered by Claude that handle enquiries, qualify leads and support customers 24/7 — integrated with your systems, not the generic bots that frustrate people.",
    outcome: "Every enquiry answered instantly, qualified and routed — day or night.",
    heroStats: [
      { value: "24/7", label: "Always answering" },
      { value: "4–8 wks", label: "Typical build time" },
      { value: "CRM-connected", label: "Real integrations" },
      { value: "From $8k", label: "Single use-case build" },
    ],
    painTitle: "Generic chatbots frustrate customers and lose leads",
    painIntro:
      "Rigid, scripted bots can't answer real questions, don't connect to your systems and send people in circles — damaging the experience you've worked to build.",
    pains: [
      "Enquiries arrive after hours and go unanswered until the next day.",
      "Leads aren't qualified or followed up fast enough to convert.",
      "Support teams answer the same repetitive questions all day.",
      "Old-style bots can't access your knowledge, bookings or CRM.",
    ],
    deliverTitle: "Chatbots that actually work",
    deliverIntro:
      "Built on Claude, trained on your knowledge and connected to your systems.",
    deliverables: [
      { icon: "Headphones", title: "Customer Support Bots", description: "24/7 answers to FAQs and troubleshooting across web, email and SMS — with human handoff when needed." },
      { icon: "UserCheck", title: "Lead Qualification Bots", description: "Engage visitors, ask the right questions and push qualified leads straight into your CRM." },
      { icon: "CalendarClock", title: "Intake & Booking Bots", description: "Capture intake details and book appointments automatically, around the clock." },
      { icon: "BookOpen", title: "Knowledge Base Bots", description: "Trained on your documents, SOPs and policies to give accurate, on-brand answers." },
      { icon: "Database", title: "CRM & System Integration", description: "Connect to HubSpot, Salesforce, Microsoft 365 and more so the bot acts, not just chats." },
      { icon: "BarChart3", title: "Analytics & Reporting", description: "Dashboards showing what customers ask, where leads come from and how the bot performs." },
    ],
    useCasesTitle: "Industries we build for",
    useCases: [
      "Healthcare — appointment booking and patient intake",
      "Legal — client intake and enquiry triage",
      "Construction — quote requests and supplier coordination",
      "Retail & e-commerce — product questions and order support",
      "Financial services — secure enquiry handling and document collection",
      "Real estate — listing enquiries and instant lead follow-up",
    ],
    integrations: ["Anthropic Claude", "HubSpot", "Salesforce", "Microsoft 365", "Websites & web forms", "SMS gateways", "Calendars", "Live-chat handoff", "REST APIs"],
    whyPoints: [
      { icon: "ShieldCheck", title: "Australian compliance focus", description: "Privacy Act–aware design, secure data handling and no model training on your customer data." },
      { icon: "Brain", title: "Powered by Claude", description: "Natural, accurate conversations that understand context — not rigid decision trees." },
      { icon: "Settings", title: "Fully integrated & supported", description: "Connected to your systems and supported post-launch — including ongoing tuning and monitoring." },
    ],
    pricingNote: "Chatbot development starts from $8,000 for a focused single-use-case build, up to $25,000+ for enterprise multi-channel solutions. Managed monthly options available.",
    faqs: [
      { q: "How long does a chatbot take to build?", a: "A focused single-use-case bot is typically live in 4–8 weeks, depending on the depth of knowledge and the integrations required." },
      { q: "Can the bot hand over to a human?", a: "Yes. We design seamless human handoff so complex or sensitive conversations are routed to your team with full context." },
      { q: "Do we need technical staff to run it?", a: "No. XoomAI builds, hosts and maintains the chatbot. You get the results without needing in-house developers." },
      { q: "Is customer data kept secure?", a: "Yes. Data is handled securely with a Privacy Act–first approach, encryption and no use of your data to train AI models." },
    ],
    related: ["claude-integration", "ai-automation", "ai-strategy"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
