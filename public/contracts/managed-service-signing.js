const MANAGED_SERVICE_WEBHOOK_URL =
  "https://hook.us2.make.com/dhdgponwrpd11tqio01pjscm1sbf6pap";

let customerSignaturePad;
let customerSignatureMode = "draw";

const agreementConfig = () => {
  const signingSection = document.getElementById("signing-section");
  return {
    customer:
      signingSection?.dataset.customer || "{{CUSTOMER_NAME}}",
    emailSubject:
      signingSection?.dataset.emailSubject || "{{EMAIL_SUBJECT}}",
  };
};

const formatDateISO = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const displayDate = (value) => {
  if (!value) return new Date().toLocaleDateString("en-AU");
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
};

const normaliseTemplatePlaceholders = () => {
  const signingSection = document.getElementById("signing-section");
  if (!signingSection?.dataset.customer.includes("{{")) return;

  signingSection.dataset.customer = "Customer";
  signingSection.dataset.emailSubject = "Customer Managed Service Agreement";
  const customerTitle = signingSection.querySelector(
    ".sig-block:nth-child(2) .sig-block-title",
  );
  if (customerTitle) customerTitle.textContent = "Customer";
  signingSection.querySelectorAll("input").forEach((input) => {
    if (input.value.includes("{{")) input.value = "";
  });
};

function initialiseCustomerSignature() {
  const canvas = document.getElementById("client-sig-canvas");
  if (!canvas || typeof SignaturePad === "undefined") return;
  const wrap = canvas.parentElement;
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const saved =
    customerSignaturePad && !customerSignaturePad.isEmpty()
      ? customerSignaturePad.toData()
      : null;

  canvas.width = wrap.offsetWidth * ratio;
  canvas.height = wrap.offsetHeight * ratio;
  canvas.style.width = `${wrap.offsetWidth}px`;
  canvas.style.height = `${wrap.offsetHeight}px`;
  canvas.getContext("2d").scale(ratio, ratio);
  customerSignaturePad = new SignaturePad(canvas, {
    penColor: "#1a1a2e",
    minWidth: 1.2,
    maxWidth: 2.8,
  });
  if (saved) customerSignaturePad.fromData(saved);
}

function switchSignatureMode(mode, button) {
  customerSignatureMode = mode;
  document
    .querySelectorAll(".sig-tab")
    .forEach((tab) => tab.classList.remove("active"));
  button.classList.add("active");
  document.getElementById("client-canvas-wrap").style.display =
    mode === "draw" ? "block" : "none";
  document.getElementById("client-type-wrap").style.display =
    mode === "type" ? "block" : "none";
  if (mode === "draw") initialiseCustomerSignature();
}

function clearCustomerSignature() {
  if (customerSignaturePad) customerSignaturePad.clear();
  document.getElementById("client-type-input").value = "";
}

const customerSignatureDataUrl = () => {
  if (customerSignatureMode === "draw") {
    if (!customerSignaturePad || customerSignaturePad.isEmpty()) return null;
    return customerSignaturePad.toDataURL("image/png");
  }

  const typedName = document
    .getElementById("client-type-input")
    .value.trim();
  if (!typedName) return null;
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#1a1a2e";
  context.font = "700 64px 'Dancing Script'";
  context.textAlign = "center";
  context.fillText(typedName, canvas.width / 2, 105);
  return canvas.toDataURL("image/png");
};

const setSubmissionStatus = (type, message) => {
  const status = document.getElementById("status-box");
  status.className = `status-box ${type}`;
  status.textContent = message;
  status.style.display = "block";
  status.scrollIntoView({ behavior: "smooth", block: "center" });
};

const postManagedServiceSubmission = async (payload) => {
  const response = await fetch(MANAGED_SERVICE_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(payload),
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error(`Email workflow returned HTTP ${response.status}`);
  }
};

const addCanvasPagesToPdf = (pdf, canvas) => {
  const pdfWidth = 210;
  const pdfHeight = 297;
  const pageHeightPx = Math.round(pdfHeight * (canvas.width / pdfWidth));
  let offset = 0;
  let page = 0;

  while (offset < canvas.height) {
    const sliceHeight = Math.min(pageHeightPx, canvas.height - offset);
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = pageHeightPx;
    const context = pageCanvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    context.drawImage(
      canvas,
      0,
      offset,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    );
    if (page > 0) pdf.addPage("a4", "portrait");
    pdf.addImage(
      pageCanvas.toDataURL("image/jpeg", 0.78),
      "JPEG",
      0,
      0,
      pdfWidth,
      pdfHeight,
    );
    offset += sliceHeight;
    page += 1;
  }
};

const addExecutionPage = (pdf, submission) => {
  pdf.addPage("a4", "portrait");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.text("EXECUTION", 105, 22, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(90);
  pdf.text(
    "The parties agree to be bound by this Managed Service Agreement.",
    105,
    30,
    { align: "center" },
  );
  pdf.setTextColor(0);

  pdf.setFillColor(247, 246, 251);
  pdf.roundedRect(10, 40, 88, 94, 3, 3, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("XOOMCLOUD PTY LTD (XOOMAI)", 15, 49);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("ABN 37 680 921 162", 15, 57);
  pdf.text("Authorised signatory: Vlad Nielsen", 15, 65);
  pdf.text("Position: Director", 15, 73);
  pdf.text(`Date: ${submission.xoomaiDate}`, 15, 81);
  pdf.setDrawColor(150);
  pdf.line(15, 112, 90, 112);
  pdf.setTextColor(120);
  pdf.setFontSize(7.5);
  pdf.text("To be signed by XoomAI upon receipt", 15, 118);
  pdf.setTextColor(0);

  pdf.setFillColor(247, 246, 251);
  pdf.roundedRect(112, 40, 88, 94, 3, 3, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("CUSTOMER", 117, 49);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(`Name: ${submission.clientName}`, 117, 57, { maxWidth: 78 });
  pdf.text(`Position: ${submission.clientTitle}`, 117, 65, { maxWidth: 78 });
  pdf.text(`Customer: ${submission.clientCompany}`, 117, 73, {
    maxWidth: 78,
  });
  pdf.text(`ABN: ${submission.clientAbn || "—"}`, 117, 81, {
    maxWidth: 78,
  });
  pdf.text(`Date: ${submission.clientDate}`, 117, 89);
  pdf.addImage(submission.customerSignature, "PNG", 117, 94, 70, 25);
  pdf.setTextColor(120);
  pdf.setFontSize(7.5);
  pdf.text("Signature", 117, 124);
  pdf.setTextColor(0);

  pdf.setTextColor(110);
  pdf.setFontSize(7.5);
  pdf.text(
    "XoomCloud Pty Ltd (ABN 37 680 921 162) trading as XoomAI · xoomai.com.au",
    105,
    286,
    { align: "center" },
  );
};

async function submitManagedServiceAgreement() {
  const clientName = document.getElementById("client-name").value.trim();
  const clientTitle = document.getElementById("client-title").value.trim();
  const clientCompany = document
    .getElementById("client-company")
    .value.trim();
  const clientAbn = document.getElementById("client-abn").value.trim();
  const clientDateRaw = document.getElementById("client-date").value;
  const clientEmail = document.getElementById("client-email").value.trim();
  const customerSignature = customerSignatureDataUrl();

  if (!clientName) return alert("Please enter your full name.");
  if (!clientTitle) return alert("Please enter your position.");
  if (!clientCompany) return alert("Please enter the customer name.");
  if (!clientDateRaw) return alert("Please enter the signing date.");
  if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    return alert("Please enter a valid email address.");
  }
  if (!customerSignature) {
    return alert("Please draw or type your signature.");
  }

  const submitButton = document.getElementById("submit-btn");
  const signingSection = document.getElementById("signing-section");
  const toolbar = document.querySelector(".contract-toolbar");
  const config = agreementConfig();
  submitButton.disabled = true;
  setSubmissionStatus("loading", "Generating the signed PDF…");

  let pdfDownloaded = false;
  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    signingSection.style.display = "none";
    if (toolbar) toolbar.style.display = "none";
    const agreementCanvas = await html2canvas(document.body, {
      scale: 1.35,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: document.body.scrollWidth,
      width: document.body.scrollWidth,
      height: document.body.scrollHeight,
    });
    signingSection.style.display = "";
    if (toolbar) toolbar.style.display = "";
    addCanvasPagesToPdf(pdf, agreementCanvas);

    const submission = {
      clientName,
      clientTitle,
      clientCompany,
      clientAbn,
      clientDate: displayDate(clientDateRaw),
      clientEmail,
      customerSignature,
      xoomaiDate: displayDate(
        document.getElementById("xoomai-date").value,
      ),
    };
    addExecutionPage(pdf, submission);

    const safeCustomer = (config.customer || clientCompany)
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const fileName = `${safeCustomer}-Managed-Service-Agreement.pdf`;
    const pdfBase64 = pdf.output("datauristring").split(",")[1];
    pdf.save(fileName);
    pdfDownloaded = true;

    setSubmissionStatus(
      "loading",
      "PDF ready. Submitting the signed agreement…",
    );
    await postManagedServiceSubmission({
      type: "managed_service_agreement_submission",
      documentType: "Managed Service Agreement",
      subject: config.emailSubject,
      email_subject: config.emailSubject,
      file_name: fileName,
      client_name: submission.clientName,
      client_title: submission.clientTitle,
      client_company: submission.clientCompany,
      client_abn: submission.clientAbn,
      client_date: submission.clientDate,
      client_email: submission.clientEmail,
      client_signature: submission.customerSignature,
      xoomai_signatory: "Vlad Nielsen",
      xoomai_date: submission.xoomaiDate,
      pdf_base64: pdfBase64,
      timestamp: new Date().toISOString(),
    });

    setSubmissionStatus(
      "success",
      "Agreement submitted. The signed PDF has been downloaded and sent to XoomAI, and a copy will be emailed to you.",
    );
    submitButton.style.display = "none";
  } catch (error) {
    console.error("Managed Service Agreement submission error:", error);
    signingSection.style.display = "";
    if (toolbar) toolbar.style.display = "";
    const fallback = pdfDownloaded
      ? `The signed PDF was downloaded, but automatic delivery failed: ${error.message}. Please email it to vlad.nielsen@xoomcloud.com.au.`
      : `The signed PDF could not be generated: ${error.message}. Please refresh and try again.`;
    setSubmissionStatus("error", fallback);
    submitButton.disabled = false;
  }
}

window.addEventListener("load", () => {
  normaliseTemplatePlaceholders();
  initialiseCustomerSignature();
  const today = formatDateISO();
  document.getElementById("xoomai-date").value = today;
  document.getElementById("client-date").value = today;
});

let signatureResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(signatureResizeTimer);
  signatureResizeTimer = setTimeout(initialiseCustomerSignature, 150);
});

window.switchSignatureMode = switchSignatureMode;
window.clearCustomerSignature = clearCustomerSignature;
window.submitManagedServiceAgreement = submitManagedServiceAgreement;
