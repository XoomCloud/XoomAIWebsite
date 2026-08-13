(() => {
  const form = document.querySelector("#questionnaire");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    const pains = data.getAll("pain").join(", ") || "None selected";
    const fields = [
      ["Role", data.get("role")],
      ["Industry", data.get("industry")],
      ["Team size", data.get("teamSize")],
      ["Priority areas", pains],
      ["First repetitive task to remove", data.get("repetitive")],
      ["Estimated weekly time", data.get("hours")],
      ["Impact if delayed or missed", data.get("impact")],
      ["Current systems", data.get("systems")],
      ["Workflow starts in", data.get("source")],
      ["Result should end up in", data.get("destination")],
      ["Data and compliance considerations", data.get("data")],
      ["90-day success", data.get("success")],
      ["Preferred timing", data.get("timeline")],
      ["Decision-makers", data.get("decision")],
      ["Questions for the call", data.get("questions")],
    ];

    const message = `Pre-call questionnaire\n\n${fields.map(([label, value]) => `${label}: ${value || "—"}`).join("\n\n")}`;
    button.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending your answers…";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          phone: "",
          website: data.get("website"),
          message,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      status.className = "form-status success";
      status.textContent = "Received. We’ll use this to prepare for your call.";
    } catch {
      status.className = "form-status error";
      status.textContent = "We couldn’t send this. Please email ai@xoomcloud.com.au and we’ll help.";
    } finally {
      button.disabled = false;
    }
  });
})();
