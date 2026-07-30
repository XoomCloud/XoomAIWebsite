#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";
import process from "node:process";

const EDITABLE_START = "<!-- MANAGED_SERVICE_PROPOSED_SOLUTION_START -->";
const EDITABLE_END = "<!-- MANAGED_SERVICE_PROPOSED_SOLUTION_END -->";

const scriptDir = dirname(new URL(import.meta.url).pathname);
const projectRoot = resolve(scriptDir, "..");
const defaultTemplate = resolve(
  projectRoot,
  "public/contracts/managed-service-template.html",
);
const defaultCatalog = resolve(
  projectRoot,
  "src/content/managed-service-catalog.json",
);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isPresent = (value) =>
  value !== undefined && value !== null && value !== "";

const asMoney = (value, currency = "AUD") =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(value));

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }
    const key = arg.slice(2);
    const value = args[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    options[key] = value;
    i += 1;
  }
  return options;
};

const normaliseService = (selection, catalog) => {
  const requested =
    typeof selection === "string" ? { id: selection } : { ...selection };
  const catalogService = requested.id ? catalog[requested.id] : undefined;

  if (requested.id && !catalogService && !requested.title) {
    throw new Error(
      `Unknown service id "${requested.id}". Use a catalogue id or provide a custom title.`,
    );
  }

  const service = { ...(catalogService ?? {}), ...requested };
  if (!service.title) {
    throw new Error("Every selected service must have a title.");
  }

  const quantity = isPresent(service.quantity)
    ? Number(service.quantity)
    : undefined;
  const unitPrice = isPresent(service.unitPrice)
    ? Number(service.unitPrice)
    : undefined;

  if (isPresent(quantity) && (!Number.isFinite(quantity) || quantity < 0)) {
    throw new Error(`Invalid quantity for "${service.title}".`);
  }
  if (isPresent(unitPrice) && (!Number.isFinite(unitPrice) || unitPrice < 0)) {
    throw new Error(`Invalid unit price for "${service.title}".`);
  }

  const lineTotal = isPresent(service.lineTotal)
    ? Number(service.lineTotal)
    : isPresent(unitPrice) && isPresent(quantity)
      ? unitPrice * quantity
      : undefined;

  return {
    ...service,
    category: service.category || "Managed Services",
    quantity,
    unitPrice,
    lineTotal,
  };
};

const renderDescription = (service) => {
  const description = service.description
    ? `<div class="service-description">${escapeHtml(service.description)}</div>`
    : "";
  const inclusions = Array.isArray(service.inclusions)
    ? `<ul>${service.inclusions
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul>`
    : "";
  const notes = service.notes
    ? `<div class="service-note">${escapeHtml(service.notes)}</div>`
    : "";
  return `<strong>${escapeHtml(service.title)}</strong>${description}${inclusions}${notes}`;
};

const renderGroup = (category, services, currency) => {
  const showRate = services.some((service) => isPresent(service.unitPrice));
  const showQuantity = services.some((service) => isPresent(service.quantity));
  const showBilling = services.some((service) => isPresent(service.billing));
  const showTerm = services.some((service) => isPresent(service.term));
  const showTotal = services.some((service) => isPresent(service.lineTotal));

  const headings = [
    "<th>Service</th>",
    showRate ? "<th>Rate (ex GST)</th>" : "",
    showQuantity ? "<th>Qty</th>" : "",
    showBilling ? "<th>Billing</th>" : "",
    showTerm ? "<th>Term</th>" : "",
    showTotal ? "<th>Total (ex GST)</th>" : "",
  ].join("");

  const rows = services
    .map((service) => {
      const cells = [
        `<td>${renderDescription(service)}</td>`,
        showRate
          ? `<td>${isPresent(service.unitPrice) ? asMoney(service.unitPrice, currency) : "—"}</td>`
          : "",
        showQuantity
          ? `<td>${isPresent(service.quantity) ? escapeHtml(service.quantity) : "—"}</td>`
          : "",
        showBilling
          ? `<td>${isPresent(service.billing) ? escapeHtml(service.billing) : "—"}</td>`
          : "",
        showTerm
          ? `<td>${isPresent(service.term) ? escapeHtml(service.term) : "—"}</td>`
          : "",
        showTotal
          ? `<td>${isPresent(service.lineTotal) ? asMoney(service.lineTotal, currency) : "—"}</td>`
          : "",
      ].join("");
      return `<tr>${cells}</tr>`;
    })
    .join("\n");

  return `<section class="solution-group">
  <h3>${escapeHtml(category)}</h3>
  <div class="table-scroll">
    <table class="solution-table">
      <thead><tr>${headings}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</section>`;
};

const renderSummary = (services, gstRate, currency) => {
  const buckets = new Map();
  for (const service of services) {
    if (!isPresent(service.lineTotal)) continue;
    const billing = String(service.billing || "once-off").toLowerCase();
    const key = billing.includes("month")
      ? "Monthly recurring"
      : billing.includes("annual") || billing.includes("year")
        ? "Annual recurring"
        : "Once-off";
    buckets.set(key, (buckets.get(key) || 0) + Number(service.lineTotal));
  }

  if (buckets.size === 0) return "";

  const cards = [...buckets.entries()]
    .map(([label, exGst]) => {
      const gst = exGst * gstRate;
      return `<div class="summary-card">
  <span>${escapeHtml(label)}</span>
  <strong>${asMoney(exGst, currency)} ex GST</strong>
  <small>${asMoney(exGst + gst, currency)} inc GST</small>
</div>`;
    })
    .join("\n");

  return `<section class="solution-summary">
  <h3>Investment summary</h3>
  <div class="summary-grid">${cards}</div>
</section>`;
};

const renderProposedSolution = (config, services) => {
  const currency = config.currency || "AUD";
  const gstRate = isPresent(config.gstRate) ? Number(config.gstRate) : 0.1;
  const grouped = new Map();
  for (const service of services) {
    if (!grouped.has(service.category)) grouped.set(service.category, []);
    grouped.get(service.category).push(service);
  }

  const groups = [...grouped.entries()]
    .map(([category, groupServices]) =>
      renderGroup(category, groupServices, currency),
    )
    .join("\n");

  const customer = config.customerName
    ? `<p class="solution-customer">Prepared for <strong>${escapeHtml(config.customerName)}</strong></p>`
    : "";
  const intro = config.introduction
    ? `<p>${escapeHtml(config.introduction)}</p>`
    : "<p>The following services form the customer-specific Proposed Solution under this Managed Service Agreement.</p>";

  return `${EDITABLE_START}
<h2 id="proposed-solutions">Proposed Solutions</h2>
<section class="proposed-solution" aria-label="Proposed solution">
  <div class="solution-intro">
    <p class="eyebrow">Selected managed services</p>
    ${customer}
    ${intro}
  </div>
  ${groups}
  ${renderSummary(services, gstRate, currency)}
  <p class="tax-note">All prices are in Australian dollars and exclude GST unless stated otherwise.</p>
</section>
${EDITABLE_END}`;
};

const main = () => {
  const options = parseArgs();
  if (!options.config) {
    throw new Error(
      "Usage: node scripts/generate-managed-service-contract.mjs --config <config.json> [--template <template.html>] [--output <output.html>]",
    );
  }

  const configPath = resolve(options.config);
  const templatePath = resolve(options.template || defaultTemplate);
  const catalogPath = resolve(options.catalog || defaultCatalog);
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

  if (!Array.isArray(config.services) || config.services.length === 0) {
    throw new Error("The configuration must select at least one service.");
  }

  const services = config.services.map((selection) =>
    normaliseService(selection, catalog),
  );
  const template = readFileSync(templatePath, "utf8");
  const start = template.indexOf(EDITABLE_START);
  const end = template.indexOf(EDITABLE_END);

  if (start < 0 || end < 0 || end <= start) {
    throw new Error(
      "The template must contain exactly one Proposed Solution marker pair.",
    );
  }
  if (
    template.indexOf(EDITABLE_START, start + EDITABLE_START.length) >= 0 ||
    template.indexOf(EDITABLE_END, end + EDITABLE_END.length) >= 0
  ) {
    throw new Error("The template contains duplicate editable markers.");
  }

  const proposedSolution = renderProposedSolution(config, services);
  const outputHtml =
    template.slice(0, start) +
    proposedSolution +
    template.slice(end + EDITABLE_END.length);

  const fallbackSlug = config.customerName
    ? `${slugify(config.customerName)}-managed-service-agreement`
    : "managed-service-agreement";
  const documentSlug = slugify(config.documentSlug || fallbackSlug);
  if (!documentSlug) throw new Error("Could not create a valid document slug.");

  const outputPath = resolve(
    options.output ||
      resolve(projectRoot, `public/contracts/${documentSlug}.html`),
  );
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, outputHtml, "utf8");

  const generated = readFileSync(outputPath, "utf8");
  const frozenPrefix = template.slice(0, start);
  const frozenSuffix = template.slice(end + EDITABLE_END.length);
  if (!generated.startsWith(frozenPrefix) || !generated.endsWith(frozenSuffix)) {
    throw new Error(
      "Frozen agreement validation failed: content outside Proposed Solutions changed.",
    );
  }

  console.log(
    JSON.stringify(
      {
        output: outputPath,
        filename: basename(outputPath),
        selectedServices: services.length,
        editableSection: "Proposed Solutions",
      },
      null,
      2,
    ),
  );
};

main();
