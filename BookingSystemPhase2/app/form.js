
// ===============================
// Form handling for resources page
// ===============================

// -------------- Helpers --------------
function $(id) {
  const element = document.getElementById(id);
  return element;
}

function logSection(title, data) {
  console.group(title);
  console.log(data);
  console.groupEnd();
}

// -------------- Form wiring --------------
document.addEventListener("DOMContentLoaded", () => {
  const form = $("resourceForm");
  if (!form) {
    console.warn("resourceForm not found. Ensure the form has id=\"resourceForm\".");
    return;
  }

  form.addEventListener("submit", onSubmit);
});

async function onSubmit(event) {
  event.preventDefault();

  if (!isNameOk || !isDescOk) {
    console.warn("Form submission blocked: validation failed.");
    return;
  }
  const submitter = event.submitter;
  const actionValue = submitter && submitter.value ? submitter.value : "create";
  const payload = {
    action: actionValue,
    resourceName: $("resourceName")?.value.trim() ?? "",
    resourceDescription: $("resourceDescription")?.value.trim() ?? "",
    resourceAvailable: $("resourceAvailable")?.value ?? false,
    resourcePrice: $("resourcePrice")?.value ?? "",
    resourcePriceUnit: $("resourcePriceUnit")?.value ?? ""
  };

  logSection("Sending payload to httpbin.org/post", payload);

  try {
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      $("submissionWarning")?.classList.remove("hidden");
      const text = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} ${response.statusText}\n${text}`);
    }

    const data = await response.json();

    console.group("Response from httpbin.org");
    console.log("Status:", response.status);
    console.log("URL:", data.url);
    console.log("You sent (echo):", data.json);
    console.log("Headers (echoed):", data.headers);
    console.groupEnd();

  } catch (err) {
    $("submissionWarning")?.classList.remove("hidden");
    console.error("POST error:", err);
  }
}