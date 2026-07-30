#!/usr/bin/env node

const endpoint = process.argv[2] || "http://127.0.0.1:9225";
const targets = await fetch(`${endpoint}/json`).then((response) =>
  response.json(),
);
const target = targets.find(
  (item) =>
    item.type === "page" &&
    item.url.includes("managed-service-agreement"),
);

if (!target) {
  throw new Error("Could not find the Managed Service Agreement browser tab.");
}

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 1;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

const command = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = nextId;
    nextId += 1;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });

await command("Runtime.enable");
const result = await command("Runtime.evaluate", {
  awaitPromise: true,
  returnByValue: true,
  expression: `(async () => {
    if (document.readyState !== "complete") {
      await new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    const customerRow = [...document.querySelectorAll("td")]
      .find((cell) => cell.textContent.trim() === "Customer")
      ?.parentElement;
    const firstOrdinaryQuote = [...document.querySelectorAll("body > blockquote")]
      .slice(1)
      .find((quote) => !quote.closest("table"));
    const table = [...document.querySelectorAll("table")]
      .find((candidate) => candidate.textContent.includes("Urgency Definitions"))
      || document.querySelector("table");
    const rows = table ? [...table.querySelectorAll("tbody tr")] : [];
    return {
      readyState: document.readyState,
      libraries: {
        signaturePad: typeof SignaturePad,
        html2canvas: typeof html2canvas,
        jspdf: typeof jspdf
      },
      customer: document.getElementById("client-company")?.value,
      signatory: document.getElementById("client-name")?.value,
      customerContactField: customerRow?.querySelector("td:last-child")?.textContent.trim(),
      emailSubject: document.getElementById("signing-section")?.dataset.emailSubject,
      datesInitialised: Boolean(
        document.getElementById("client-date")?.value
        && document.getElementById("xoomai-date")?.value
      ),
      viewportWidth: window.innerWidth,
      signatureCanvas: {
        width: document.getElementById("client-sig-canvas")?.width,
        height: document.getElementById("client-sig-canvas")?.height
      },
      signingColumns: getComputedStyle(document.querySelector(".sig-grid")).gridTemplateColumns,
      tableHeaderBackground: getComputedStyle(document.querySelector("th")).backgroundColor,
      alternatingRowBackgrounds: rows.slice(0, 3).map(
        (row) => getComputedStyle(row.querySelector("td")).backgroundColor
      ),
      ordinaryQuote: firstOrdinaryQuote ? {
        background: getComputedStyle(firstOrdinaryQuote).backgroundColor,
        borderLeftWidth: getComputedStyle(firstOrdinaryQuote).borderLeftWidth
      } : null
    };
  })()`,
});

socket.close();
const value = result.result.value;
console.log(JSON.stringify(value, null, 2));

const checks = [
  value.readyState === "complete",
  Object.values(value.libraries).every((type) => type !== "undefined"),
  value.customer === "Pure Private Wealth",
  value.signatory === "Stefano Duro",
  value.customerContactField === "Pure Private Wealth",
  value.emailSubject ===
    "Stefano Duro — Pure Private Wealth Managed Service Agreement",
  value.datesInitialised,
  value.signatureCanvas.width > 0,
  value.signatureCanvas.height > 0,
  value.signingColumns.length > 0,
  value.tableHeaderBackground === "rgb(242, 239, 250)",
  new Set(value.alternatingRowBackgrounds).size <= 1,
  value.ordinaryQuote?.borderLeftWidth === "0px",
];

if (checks.some((check) => !check)) {
  process.exitCode = 1;
}
