const state = {
  customers: [],
  selectedCustomerId: null,
};

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  elements.customerList = document.getElementById("customer-list");
  elements.form = document.getElementById("customer-management-form");
  elements.feedback = document.getElementById("form-feedback");

  elements.firstName = document.getElementById("first-name");
  elements.lastName = document.getElementById("last-name");
  elements.email = document.getElementById("email");
  elements.phone = document.getElementById("phone");
  elements.birthDate = document.getElementById("birthdate");

  elements.saveButton = document.getElementById("save-button");
  elements.clearButton = document.getElementById("clear-button");
  elements.deleteButton = document.getElementById("delete-button");
 

  elements.form.addEventListener("submit", handleFormSubmit);
  elements.clearButton.addEventListener("click", clearForm);
  elements.deleteButton.addEventListener("click", handleDeleteCustomer);


  loadCustomers();
});

function getCustomerId(customer) {
  return customer.id ?? customer.person_id ?? customer.customer_id ?? null;
}

function getBirthDateValue(customer) {
  const rawValue =
    customer.birth_date ??
    customer.birthdate ??
    customer.date_of_birth ??
    "";

  if (!rawValue) return "";

  return String(rawValue).split("T")[0];
}

function setFeedback(message, type = "info") {
  elements.feedback.textContent = message;
  elements.feedback.className = `form-feedback ${type}`;
}

function clearFeedback() {
  elements.feedback.textContent = "";
  elements.feedback.className = "form-feedback hidden";
}

function getFormData() {
  return {
    first_name: elements.firstName.value.trim(),
    last_name: elements.lastName.value.trim(),
    email: elements.email.value.trim(),
    phone: elements.phone.value.trim(),
    birth_date: elements.birthDate.value || null,
  };
}

function clearForm() {
  state.selectedCustomerId = null;
  elements.form.reset();
  elements.saveButton.textContent = "Add customer";
  elements.deleteButton.disabled = true;
  clearFeedback();
}

function populateForm(customer) {
  state.selectedCustomerId = getCustomerId(customer);

  elements.firstName.value = customer.first_name ?? "";
  elements.lastName.value = customer.last_name ?? "";
  elements.email.value = customer.email ?? "";
  elements.phone.value = customer.phone ?? "";
  elements.birthDate.value = getBirthDateValue(customer);

  elements.saveButton.textContent = "Update customer";
  elements.deleteButton.disabled = false;

  setFeedback("Customer loaded. You can now update or delete this record.", "success");
}

async function loadCustomers() {

  try {
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    state.customers = await res.json();

    // Clear placeholder
    elements.customerList.innerHTML = "";

    if (state.customers.length === 0) {
      elements.customerList.innerHTML = "<p>No customers found.</p>";
      return;
    }

    // Create simple list
    state.customers.forEach(person => {
      const div = document.createElement("div");
      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      div.addEventListener("click", () => {
        populateForm(person);
        console.log("Customer clicked:");
        console.log(person);
      });

      elements.customerList.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    elements.customerList.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const payload = getFormData();

  try {
    let response;

    if (state.selectedCustomerId === null) {
      response = await fetch("/api/persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      response = await fetch(`/api/persons/${state.selectedCustomerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      const message = await getErrorMessage(response);
      throw new Error(message);
    }

    const wasUpdate = state.selectedCustomerId !== null;

    await loadCustomers();
    clearForm();

    setFeedback(
      wasUpdate
        ? "Customer updated successfully."
        : "Customer added successfully.",
      "success"
    );
  } catch (error) {
    console.error(error);
    setFeedback(`Error: ${error.message}`, "error");
  }
}

async function handleDeleteCustomer() {
  if (state.selectedCustomerId === null) {
    setFeedback("Please select a customer first.", "error");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete the selected customer?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/persons/${state.selectedCustomerId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const message = await getErrorMessage(response);
      throw new Error(message);
    }

    await loadCustomers();
    clearForm();
    setFeedback("Customer deleted successfully.", "success");
  } catch (error) {
    console.error(error);
    setFeedback(`Error: ${error.message}`, "error");
  }
}

async function getErrorMessage(response) {
  try {
    const data = await response.json();
    return data.message || data.error || "Request failed";
  } catch {
    return "Request failed";
  }
}

