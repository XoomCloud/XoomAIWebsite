#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const SOURCE_START = '<h2 id="proposed-solutions">Proposed Solutions</h2>';
const SOURCE_END = '<h2 id="acceptance">Acceptance</h2>';
const EDITABLE_START = "<!-- MANAGED_SERVICE_PROPOSED_SOLUTION_START -->";
const EDITABLE_END = "<!-- MANAGED_SERVICE_PROPOSED_SOLUTION_END -->";

const [sourceArg, outputArg] = process.argv.slice(2);

if (!sourceArg || !outputArg) {
  console.error(
    "Usage: node scripts/create-managed-service-template.mjs <source.docx> <output.html>",
  );
  process.exit(1);
}

const source = resolve(sourceArg);
const output = resolve(outputArg);
const pandoc = spawnSync(
  "pandoc",
  [
    source,
    "--from=docx",
    "--to=html5",
    "--standalone",
    "--embed-resources",
  ],
  { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
);

if (pandoc.error) {
  throw pandoc.error;
}

if (pandoc.status !== 0) {
  console.error(pandoc.stderr);
  process.exit(pandoc.status ?? 1);
}

let html = pandoc.stdout;
const proposedStart = html.indexOf(SOURCE_START);
const acceptanceStart = html.indexOf(SOURCE_END);

if (proposedStart < 0 || acceptanceStart < 0 || acceptanceStart <= proposedStart) {
  throw new Error(
    "Could not identify the Proposed Solutions and Acceptance boundaries in the DOCX conversion.",
  );
}

const proposedSolutionTemplate = `${EDITABLE_START}
${SOURCE_START}
<section class="proposed-solution" aria-label="Proposed solution">
  <div class="solution-placeholder">
    <p class="eyebrow">Customer-specific section</p>
    <h3>Selected services appear here</h3>
    <p>Generate a client contract with the managed-service contract workflow. Only this Proposed Solutions section is replaced; the remainder of the agreement stays unchanged.</p>
  </div>
</section>
${EDITABLE_END}
`;

html =
  html.slice(0, proposedStart) +
  proposedSolutionTemplate +
  html.slice(acceptanceStart);

html = html
  .replace(
    /<title>.*?<\/title>/s,
    "<title>Xoom Cloud Managed Service Agreement Template</title>",
  )
  .replace(
    "</head>",
    `<meta name="robots" content="noindex,nofollow,noarchive" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&amp;family=Poppins:wght@600;700;800&amp;display=swap" rel="stylesheet" />
<style>
  :root {
    --navy: #1a1a2e;
    --midnight: #0d0b2a;
    --purple: #6b46c1;
    --violet: #7c3aed;
    --blue: #3b82f6;
    --cyan: #06b6d4;
    --ink: #1a1a2e;
    --muted: rgba(26, 26, 46, 0.70);
    --line: rgba(26, 26, 46, 0.12);
    --paper: #ffffff;
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; background: #ececf4; }
  body {
    max-width: 980px;
    margin: 0 auto;
    padding: 112px 64px 72px;
    background: var(--paper);
    color: var(--ink);
    font-family: "Montserrat", sans-serif;
    font-size: 15px;
    line-height: 1.66;
    box-shadow: 0 24px 80px rgba(13, 11, 42, 0.14);
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--navy);
    font-family: "Poppins", sans-serif;
    line-height: 1.18;
  }

  h1 { font-size: 2.1rem; }
  h2 {
    margin-top: 3.25rem;
    padding-bottom: 0.65rem;
    border-bottom: 2px solid var(--purple);
    font-size: 1.65rem;
  }
  h3 { font-size: 1.2rem; }
  p { margin: 0.8rem 0; }
  a { color: var(--purple); }
  blockquote {
    margin: 1rem 0;
    padding: 1rem 1.2rem;
    border-left: 3px solid var(--purple);
    background: rgba(107, 70, 193, 0.05);
    color: var(--ink);
  }
  ul, ol { padding-left: 1.5rem; }
  li { margin: 0.34rem 0; }
  img { display: block; height: auto !important; margin: 0 auto 1.5rem; }
  table {
    display: table;
    width: 100%;
    margin: 1.35rem 0 2rem;
    border-collapse: collapse;
    font-size: 0.86rem;
  }
  thead, tbody { border: 0; }
  th {
    padding: 0.7rem 0.75rem;
    border: 1px solid var(--line);
    background: var(--navy);
    color: #ffffff;
    font-family: "Poppins", sans-serif;
    text-align: left;
  }
  td {
    padding: 0.65rem 0.75rem;
    border: 1px solid var(--line);
    vertical-align: top;
  }
  tr:nth-child(even) td { background: rgba(107, 70, 193, 0.035); }

  .contract-toolbar {
    position: fixed;
    inset: 0 0 auto;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 14px 24px;
    background: linear-gradient(135deg, var(--midnight), var(--navy));
    color: #ffffff;
    box-shadow: 0 8px 24px rgba(13, 11, 42, 0.24);
  }
  .contract-toolbar strong {
    font-family: "Poppins", sans-serif;
    font-size: 0.95rem;
  }
  .contract-toolbar span {
    color: rgba(255, 255, 255, 0.70);
    font-size: 0.78rem;
  }
  .contract-toolbar button {
    flex: 0 0 auto;
    padding: 10px 18px;
    border: 0;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--violet), #6d28d9);
    box-shadow: 0 8px 25px rgba(107, 70, 193, 0.45);
    color: #ffffff;
    cursor: pointer;
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
  }

  .proposed-solution {
    margin: 1.5rem 0 2.5rem;
  }
  .solution-placeholder {
    padding: 2rem;
    border: 1px dashed rgba(107, 70, 193, 0.55);
    border-radius: 12px;
    background: rgba(107, 70, 193, 0.05);
  }
  .eyebrow {
    margin: 0 0 0.45rem;
    color: var(--purple);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .solution-placeholder h3 { margin: 0; }
  .solution-intro { margin-bottom: 1.5rem; }
  .solution-customer { font-size: 1.05rem; }
  .solution-group {
    margin: 1.5rem 0 2rem;
    padding: 1.1rem;
    border: 1px solid rgba(26, 26, 46, 0.10);
    border-radius: 12px;
    background: rgba(107, 70, 193, 0.035);
  }
  .solution-group h3 { margin: 0 0 0.8rem; }
  .solution-table { margin: 0; background: #ffffff; }
  .solution-table td:not(:first-child),
  .solution-table th:not(:first-child) { white-space: nowrap; }
  .service-description {
    margin-top: 0.3rem;
    color: rgba(26, 26, 46, 0.70);
    font-size: 0.8rem;
  }
  .service-note {
    margin-top: 0.45rem;
    color: var(--purple);
    font-size: 0.76rem;
    font-weight: 600;
  }
  .solution-table ul {
    margin: 0.45rem 0 0;
    padding-left: 1.1rem;
    color: rgba(26, 26, 46, 0.75);
    font-size: 0.8rem;
  }
  .solution-summary { margin: 2rem 0 1rem; }
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 0.85rem;
  }
  .summary-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1rem;
    border: 1px solid rgba(107, 70, 193, 0.18);
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(107, 70, 193, 0.08), rgba(59, 130, 246, 0.05));
  }
  .summary-card span {
    color: rgba(26, 26, 46, 0.70);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .summary-card strong {
    color: var(--navy);
    font-family: "Poppins", sans-serif;
  }
  .summary-card small { color: rgba(26, 26, 46, 0.65); }
  .tax-note { color: rgba(26, 26, 46, 0.65); font-size: 0.78rem; }

  @media (max-width: 760px) {
    body { padding: 96px 20px 48px; }
    .contract-toolbar { align-items: flex-start; }
    .contract-toolbar span { display: none; }
    table { display: block; overflow-x: auto; }
    .table-scroll { overflow-x: auto; }
    .solution-table { min-width: 620px; }
  }

  @media print {
    @page { size: A4; margin: 14mm; }
    html, body { background: #ffffff; }
    body {
      max-width: none;
      padding: 0;
      box-shadow: none;
      font-size: 9.5pt;
    }
    .contract-toolbar { display: none; }
    h2 { break-after: avoid; }
    p, li { orphans: 3; widows: 3; }
    table { break-inside: auto; }
    tr { break-inside: avoid; break-after: auto; }
    a { color: inherit; text-decoration: none; }
  }
</style>
</head>`,
  )
  .replace(
    "<body>",
    `<body>
<div class="contract-toolbar">
  <div>
    <strong>Managed Service Agreement</strong>
    <span> · Xoom Cloud Pty Ltd</span>
  </div>
  <button type="button" onclick="window.print()">Print / save as PDF</button>
</div>`,
  );

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, html, "utf8");

const verification = readFileSync(output, "utf8");
if (
  !verification.includes(EDITABLE_START) ||
  !verification.includes(EDITABLE_END) ||
  verification.includes("Xoom Cloud - Essential (Per User)")
) {
  throw new Error("Generated template failed its editable-section validation.");
}

console.log(`Created ${output}`);
