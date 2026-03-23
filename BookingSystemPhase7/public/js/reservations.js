
// ===============================
// 0) Authorization
// ===============================

import {
  initAuthUI,
  getUserRole,
  requireAuthOrBlockPage,
  logout,
} from "./auth-ui.js";

initAuthUI();

if (!requireAuthOrBlockPage()) {
  throw new Error("Authentication required");
}

window.logout = logout;


// Safe fallback while auth is commented out
if (typeof window.logout !== "function") {
  window.logout = () => {};
}

// ===============================
// 1) DOM references
// ===============================
const reservationForm = document.getElementById("reservationForm");
const reservationIdInput = document.getElementById("reservationId");

const actions = document.getElementById("reservationActions");
const resourceNameCnt = document.getElementById("resourceNameCnt");
const reservationStartTimeCnt = document.getElementById("reservationStartTimeCnt");
const reservationEndTimeCnt = document.getElementById("reservationEndTimeCnt");
const reservationNoteCnt = document.getElementById("reservationNoteCnt");
const reservationListEl = document.getElementById("reservationList");
const reservationActiveInput = document.getElementById("reservationActive");
const formMessage = document.getElementById("formMessage");

// Auth role fallback: if auth is disabled, default to manager for local testing
const role = typeof getUserRole === "function" ? getUserRole() : "manager";

let createButton = null;
let updateButton = null;
let deleteButton = null;
let primaryActionButton = null;
let clearButton = null;

let formMode = "create";
let resourcesCache = [];
let reservationCache = [];
let selectedReservationId = null;
let originalState = null;
let originalStateChanged = [false, false, false, false, false];

let resourceNameValid = false;
let reservationStartValid = false;
let reservationEndValid = false;
let reservationNoteValid = true;

// ===============================
// 2) Button creation helpers
// ===============================
const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";

const BUTTON_ENABLED_CLASSES =
  "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.name = "action";
  if (value) btn.value = value;

  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();

  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;

  btn.disabled = !enabled;
  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);

  if (btn.classList.contains("bg-brand-primary")) {
    btn.classList.toggle("hover:bg-brand-dark/80", enabled);
  }
}

function canCreateReservations(currentRole) {
  return (
    currentRole === "manager" ||
    currentRole === "reserver" ||
    currentRole === "user"
  );
}

function isManager(currentRole) {
  return currentRole === "manager";
}

function renderActionButtons(currentRole) {
  actions.innerHTML = "";

  createButton = null;
  updateButton = null;
  deleteButton = null;
  primaryActionButton = null;
  clearButton = null;

  if (formMode === "create" && canCreateReservations(currentRole)) {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });

    clearButton = addButton({
      label: "Clear",
      type: "button",
      classes: BUTTON_ENABLED_CLASSES,
    });

    primaryActionButton = createButton;
    setButtonEnabled(createButton, false);
    setButtonEnabled(clearButton, true);

    clearButton.addEventListener("click", () => {
      enterCreateMode();
      clearFormMessage();
    });
  }

  if (formMode === "edit" && isManager(currentRole)) {
    updateButton = addButton({
      label: "Update",
      type: "submit",
      value: "update",
      classes: BUTTON_ENABLED_CLASSES,
    });

    deleteButton = addButton({
      label: "Delete",
      type: "submit",
      value: "delete",
      classes: BUTTON_ENABLED_CLASSES,
    });

    clearButton = addButton({
      label: "Clear",
      type: "button",
      classes: BUTTON_ENABLED_CLASSES,
    });

    primaryActionButton = updateButton;
    setButtonEnabled(updateButton, false);
    setButtonEnabled(deleteButton, true);
    setButtonEnabled(clearButton, true);

    clearButton.addEventListener("click", () => {
      enterCreateMode();
      clearFormMessage();
    });
  }

  if (formMode === "edit" && !isManager(currentRole)) {
    clearButton = addButton({
      label: "Clear",
      type: "button",
      classes: BUTTON_ENABLED_CLASSES,
    });

    setButtonEnabled(clearButton, true);

    clearButton.addEventListener("click", () => {
      enterCreateMode();
      clearFormMessage();
    });
  }

  refreshPrimaryButtonState();
}

function setCurrentReservationId(id) {
  if (!reservationIdInput) return;
  reservationIdInput.value = id ? String(id) : "";
}

// ===============================
// 3) Input creation helpers
// ===============================
function createResourceNameSelect(container) {
  if (!container) {
    throw new Error("resourceNameCnt container not found.");
  }

  container.innerHTML = "";

  const select = document.createElement("select");
  select.id = "resourceId";
  select.name = "resourceId";
  select.required = true;

  select.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white
    px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
    transition-all duration-200 ease-out
  `;

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose a resource";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  container.appendChild(select);
  return select;
}

function createDateTimeInput(container, { id, name }) {
  if (!container) {
    throw new Error(`${id} container not found.`);
  }

  container.innerHTML = "";

  const input = document.createElement("input");
  input.type = "datetime-local";
  input.id = id;
  input.name = name;
  input.step = 60;

  input.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white
    px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
    transition-all duration-200 ease-out
  `;

  container.appendChild(input);
  return input;
}

function createReservationNoteArea(container) {
  if (!container) {
    throw new Error("reservationNoteCnt container not found.");
  }

  container.innerHTML = "";

  const textarea = document.createElement("textarea");
  textarea.id = "note";
  textarea.name = "note";
  textarea.rows = 5;
  textarea.placeholder = "Add a note here...";

  textarea.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all duration-200 ease-out
  `;

  container.appendChild(textarea);
  return textarea;
}

const resourceNameInput = createResourceNameSelect(resourceNameCnt);
const reservationStartTimeInput = createDateTimeInput(reservationStartTimeCnt, {
  id: "startTime",
  name: "startTime",
});
const reservationEndTimeInput = createDateTimeInput(reservationEndTimeCnt, {
  id: "endTime",
  name: "endTime",
});
const reservationNoteArea = createReservationNoteArea(reservationNoteCnt);

// ===============================
// 4) Formatting + normalization
// ===============================
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateTimeForInput(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function normalizeDateTimeValue(value) {
  return value ? String(value).trim().slice(0, 16) : "";
}

function formatDateTimeForDisplay(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

function normalizeResource(resource) {
  return {
    id: resource?.id ?? resource?.resourceId ?? "",
    name: resource?.name ?? resource?.resourceName ?? "Unnamed resource",
    available: Boolean(
      resource?.available ?? resource?.is_available ?? resource?.enabled ?? true
    ),
  };
}

function resolveResourceIdFromReservation(reservation) {
  const directId =
    reservation?.resource_id ??
    reservation?.resourceId ??
    reservation?.resource?.id ??
    "";

  if (directId !== "" && directId !== null && directId !== undefined) {
    return String(directId);
  }

  const resourceName =
    reservation?.resource_name ??
    reservation?.resourceName ??
    reservation?.resource?.name ??
    "";

  if (!resourceName) return "";

  const found = resourcesCache.find(
    (r) => String(r.name).trim() === String(resourceName).trim()
  );

  return found ? String(found.id) : "";
}

function normalizeReservation(reservation) {
  const resourceId = resolveResourceIdFromReservation(reservation);
  const resolvedResource =
    resourcesCache.find((r) => String(r.id) === String(resourceId)) || null;

  const resourceName =
    reservation?.resource_name ??
    reservation?.resourceName ??
    reservation?.resource?.name ??
    resolvedResource?.name ??
    "Unknown resource";

  return {
    id: reservation?.id ?? reservation?.reservationId ?? "",
    resourceId,
    resourceName,
    startTime:
      reservation?.start_time ??
      reservation?.startTime ??
      reservation?.start ??
      reservation?.from ??
      "",
    endTime:
      reservation?.end_time ??
      reservation?.endTime ??
      reservation?.end ??
      reservation?.to ??
      "",
    note: reservation?.note ?? reservation?.reservationNote ?? "",
status: reservation?.status ?? "active",
active: (reservation?.status ?? "active") === "active"
    ,
  };
}

function getCurrentFormState() {
  return {
    resourceId: resourceNameInput?.value ?? "",
    startTime: normalizeDateTimeValue(reservationStartTimeInput?.value),
    endTime: normalizeDateTimeValue(reservationEndTimeInput?.value),
    note: reservationNoteArea?.value.trim() ?? "",
    status: reservationActiveInput?.checked ? "active" : "cancelled",
  };
}

// ===============================
// 5) Validation + visual states
// ===============================
function setInputVisualState(input, state) {
  if (!input) return;

  input.classList.remove(
    "border-green-500",
    "bg-green-100",
    "focus:ring-green-500/30",
    "border-red-500",
    "bg-red-100",
    "focus:ring-red-500/30",
    "focus:border-brand-blue",
    "focus:ring-brand-blue/30"
  );

  input.classList.add("focus:ring-2");

  if (state === "valid") {
    input.classList.add(
      "border-green-500",
      "bg-green-100",
      "focus:ring-green-500/30"
    );
  } else if (state === "invalid") {
    input.classList.add(
      "border-red-500",
      "bg-red-100",
      "focus:ring-red-500/30"
    );
  } else {
    input.classList.add("focus:border-brand-blue", "focus:ring-brand-blue/30");
  }
}

function isReservationNoteValid(value) {
  const trimmed = String(value ?? "").trim();

  // Optional field
  if (trimmed === "") return true;

  // Keep it practical but permissive
  return trimmed.length >= 3 && trimmed.length <= 300;
}

function updateResourceNameValidation() {
  const value = resourceNameInput.value;

  if (!value) {
    resourceNameValid = false;
    setInputVisualState(resourceNameInput, "neutral");
    return;
  }

  resourceNameValid = true;
  setInputVisualState(resourceNameInput, "valid");
}

function updateReservationTimeValidation() {
  const startValue = reservationStartTimeInput.value;
  const endValue = reservationEndTimeInput.value;

  const startHasValue = startValue.trim() !== "";
  const endHasValue = endValue.trim() !== "";

  const startDate = startHasValue ? new Date(startValue) : null;
  const endDate = endHasValue ? new Date(endValue) : null;

  const startParsed = startDate && !Number.isNaN(startDate.getTime());
  const endParsed = endDate && !Number.isNaN(endDate.getTime());

  if (!startHasValue) {
    reservationStartValid = false;
    setInputVisualState(reservationStartTimeInput, "neutral");
  } else if (!startParsed) {
    reservationStartValid = false;
    setInputVisualState(reservationStartTimeInput, "invalid");
  } else {
    reservationStartValid = true;
    setInputVisualState(reservationStartTimeInput, "valid");
  }

  if (!endHasValue) {
    reservationEndValid = false;
    setInputVisualState(reservationEndTimeInput, "neutral");
  } else if (!endParsed) {
    reservationEndValid = false;
    setInputVisualState(reservationEndTimeInput, "invalid");
  } else {
    reservationEndValid = true;
    setInputVisualState(reservationEndTimeInput, "valid");
  }

  if (startParsed && endParsed && endDate <= startDate) {
    reservationStartValid = false;
    reservationEndValid = false;
    setInputVisualState(reservationStartTimeInput, "invalid");
    setInputVisualState(reservationEndTimeInput, "invalid");
  }
}

function updateReservationNoteValidation() {
  const raw = reservationNoteArea.value;

  if (raw.trim() === "") {
    reservationNoteValid = true;
    setInputVisualState(reservationNoteArea, "neutral");
    return;
  }

  reservationNoteValid = isReservationNoteValid(raw);
  setInputVisualState(
    reservationNoteArea,
    reservationNoteValid ? "valid" : "invalid"
  );
}

function updateAllChangeStates() {
  if (!originalState) {
    originalStateChanged.fill(false);
    return;
  }

  const currentState = getCurrentFormState();

  originalStateChanged[0] =
    String(currentState.resourceId) !== String(originalState.resourceId);
  originalStateChanged[1] =
    String(currentState.startTime) !== String(originalState.startTime);
  originalStateChanged[2] =
    String(currentState.endTime) !== String(originalState.endTime);
  originalStateChanged[3] =
    String(currentState.note) !== String(originalState.note);
  originalStateChanged[4] =
  String(currentState.status) !== String(originalState.status);
}

function refreshPrimaryButtonState() {
  const valid =
    resourceNameValid &&
    reservationStartValid &&
    reservationEndValid &&
    reservationNoteValid;

  if (!primaryActionButton) return;

  if (formMode === "create") {
    setButtonEnabled(primaryActionButton, valid);
  } else {
    setButtonEnabled(
      primaryActionButton,
      valid && originalStateChanged.includes(true)
    );
  }
}

function runAllValidationAndRefresh() {
  updateResourceNameValidation();
  updateReservationTimeValidation();
  updateReservationNoteValidation();
  updateAllChangeStates();
  refreshPrimaryButtonState();
}

function attachFieldListeners() {
  resourceNameInput.addEventListener("change", () => {
    runAllValidationAndRefresh();
  });

  reservationStartTimeInput.addEventListener("input", () => {
    runAllValidationAndRefresh();
  });
  reservationStartTimeInput.addEventListener("change", () => {
    runAllValidationAndRefresh();
  });

  reservationEndTimeInput.addEventListener("input", () => {
    runAllValidationAndRefresh();
  });
  reservationEndTimeInput.addEventListener("change", () => {
    runAllValidationAndRefresh();
  });

  reservationNoteArea.addEventListener("input", () => {
    runAllValidationAndRefresh();
  });

  if (reservationActiveInput) {
    reservationActiveInput.addEventListener("change", () => {
      runAllValidationAndRefresh();
    });
  }
}

// ===============================
// 6) Form state helpers
// ===============================
function clearFormMessage() {
  if (!formMessage) return;

  formMessage.textContent = "";
  formMessage.classList.add("hidden");
}

function setFormReadOnly(isReadOnly) {
  if (resourceNameInput) {
    resourceNameInput.disabled = isReadOnly;
  }

  if (reservationStartTimeInput) {
    reservationStartTimeInput.disabled = isReadOnly;
  }

  if (reservationEndTimeInput) {
    reservationEndTimeInput.disabled = isReadOnly;
  }

  if (reservationNoteArea) {
    reservationNoteArea.readOnly = isReadOnly;
  }

  if (reservationActiveInput) {
    reservationActiveInput.disabled = isReadOnly;
  }
}

function ensureResourceOption(resourceId, resourceName) {
  if (!resourceNameInput || !resourceId) return;

  const exists = Array.from(resourceNameInput.options).some(
    (opt) => String(opt.value) === String(resourceId)
  );

  if (exists) return;

  const option = document.createElement("option");
  option.value = String(resourceId);
  option.textContent = resourceName || `Resource ${resourceId}`;
  resourceNameInput.appendChild(option);
}

function highlightSelectedReservation(id) {
  if (!reservationListEl) return;

  const items = reservationListEl.querySelectorAll("[data-reservation-id]");
  items.forEach((el) => {
    const thisId = String(el.dataset.reservationId);
    const isSelected = id && thisId === String(id);

    el.classList.toggle("ring-2", isSelected);
    el.classList.toggle("ring-brand-blue/40", isSelected);
    el.classList.toggle("bg-brand-blue/5", isSelected);
  });
}

function enterCreateMode() {
  formMode = "create";
  selectedReservationId = null;
  originalState = null;
  originalStateChanged.fill(false);

  setCurrentReservationId(null);

  if (resourceNameInput) {
    resourceNameInput.value = "";
  }

  if (reservationStartTimeInput) {
    reservationStartTimeInput.value = "";
  }

  if (reservationEndTimeInput) {
    reservationEndTimeInput.value = "";
  }

  if (reservationNoteArea) {
    reservationNoteArea.value = "";
  }

  if (reservationActiveInput) {
    reservationActiveInput.checked = true;
     reservationActiveInput.disabled = true;
  }

  renderActionButtons(role);
  highlightSelectedReservation(null);
  setFormReadOnly(!canCreateReservations(role));
   reservationActiveInput.disabled = !isManager(role);
  runAllValidationAndRefresh();
}

function selectReservation(reservation) {
  const normalized = normalizeReservation(reservation);

  selectedReservationId = normalized.id;
  setCurrentReservationId(normalized.id);

  ensureResourceOption(normalized.resourceId, normalized.resourceName);

  if (resourceNameInput) {
    resourceNameInput.value = String(normalized.resourceId ?? "");
  }

  if (reservationStartTimeInput) {
    reservationStartTimeInput.value = formatDateTimeForInput(
      normalized.startTime
    );
  }

  if (reservationEndTimeInput) {
    reservationEndTimeInput.value = formatDateTimeForInput(normalized.endTime);
  }

  if (reservationNoteArea) {
    reservationNoteArea.value = normalized.note ?? "";
  }

  if (reservationActiveInput) {
  reservationActiveInput.checked = normalized.status === "active";
   reservationActiveInput.disabled = !isManager(role);
}

  formMode = "edit";

  originalState = {
    resourceId: String(resourceNameInput?.value ?? ""),
    startTime: normalizeDateTimeValue(reservationStartTimeInput?.value),
    endTime: normalizeDateTimeValue(reservationEndTimeInput?.value),
    note: reservationNoteArea?.value.trim() ?? "",
    status: normalized.status,
  };

  originalStateChanged.fill(false);

  renderActionButtons(role);
  setFormReadOnly(!isManager(role));
  highlightSelectedReservation(normalized.id);
  runAllValidationAndRefresh();
}

// ===============================
// 7) Resource select population
// ===============================
function populateResourceOptions(resources) {
  if (!resourceNameInput) return;

  const currentValue = resourceNameInput.value;

  resourceNameInput.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent =
    resources.length > 0 ? "Choose a resource" : "No resources available";
  placeholder.disabled = true;
  placeholder.selected = true;
  resourceNameInput.appendChild(placeholder);

  resources
    .map(normalizeResource)
    .sort((a, b) => String(a.name).localeCompare(String(b.name)))
    .forEach((resource) => {
      const option = document.createElement("option");
      option.value = String(resource.id);
      option.textContent = resource.name;
      resourceNameInput.appendChild(option);
    });

  if (currentValue) {
    const hasValue = Array.from(resourceNameInput.options).some(
      (opt) => String(opt.value) === String(currentValue)
    );
    resourceNameInput.value = hasValue ? String(currentValue) : "";
  }

  if (selectedReservationId && formMode === "edit") {
    const selected = reservationCache.find(
      (r) => String(normalizeReservation(r).id) === String(selectedReservationId)
    );
    if (selected) {
      const normalized = normalizeReservation(selected);
      ensureResourceOption(normalized.resourceId, normalized.resourceName);
      resourceNameInput.value = String(normalized.resourceId ?? "");
    }
  }
}

// ===============================
// 8) Reservation list rendering
// ===============================
function renderReservationList(reservations) {
  if (!reservationListEl) return;

  if (!reservations.length) {
    reservationListEl.innerHTML = `
      <div class="rounded-2xl border border-dashed border-black/10 px-4 py-4 text-sm text-black/50">
        No reservations yet.
      </div>
    `;
    return;
  }

  reservationListEl.innerHTML = reservations
    .map((item) => {
      const r = normalizeReservation(item);

      const activeLabel = r.active ? "Active" : "Inactive";

      return `
        <button
          type="button"
          data-reservation-id="${escapeHtml(r.id)}"
          class="w-full text-left rounded-2xl border border-black/10 bg-white px-4 py-3 transition hover:bg-black/5"
          title="Select reservation"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="font-semibold truncate">${escapeHtml(r.resourceName)}</div>
              <div class="mt-1 text-xs text-black/60">
                ${escapeHtml(formatDateTimeForDisplay(r.startTime))}
              </div>
              <div class="text-xs text-black/60">
                ${escapeHtml(formatDateTimeForDisplay(r.endTime))}
              </div>
            </div>
            <span class="shrink-0 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
              ${escapeHtml(activeLabel)}
            </span>
          </div>
        </button>
      `;
    })
    .join("");

  reservationListEl.querySelectorAll("[data-reservation-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      clearFormMessage();

      const id = String(btn.dataset.reservationId);
      const reservation = reservationCache.find(
        (x) => String(normalizeReservation(x).id) === id
      );

      if (!reservation) return;
      selectReservation(reservation);
    });
  });

  if (selectedReservationId) {
    highlightSelectedReservation(selectedReservationId);
  }
}

// ===============================
// 9) API loading
// ===============================
function extractArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

async function loadResources() {
  try {
    const res = await fetch("/api/resources");
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Failed to load resources:", res.status, body);
      resourcesCache = [];
      populateResourceOptions(resourcesCache);
      runAllValidationAndRefresh();
      return;
    }

    resourcesCache = extractArray(body).map(normalizeResource);
    populateResourceOptions(resourcesCache);
    runAllValidationAndRefresh();
  } catch (err) {
    console.error("Failed to load resources:", err);
    resourcesCache = [];
    populateResourceOptions(resourcesCache);
    runAllValidationAndRefresh();
  }
}

async function loadReservations() {
  try {
    const res = await fetch("/api/reservations");
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Failed to load reservations:", res.status, body);
      reservationCache = [];
      renderReservationList(reservationCache);
      return;
    }

    reservationCache = extractArray(body);
    renderReservationList(reservationCache);

    if (selectedReservationId && formMode === "edit") {
      const found = reservationCache.find(
        (x) =>
          String(normalizeReservation(x).id) === String(selectedReservationId)
      );

      if (found) {
        selectReservation(found);
      }
    }
  } catch (err) {
    console.error("Failed to load reservations:", err);
    reservationCache = [];
    renderReservationList(reservationCache);
  }
}

// ===============================
// 10) Bootstrapping
// ===============================
attachFieldListeners();
renderActionButtons(role);
enterCreateMode();

// From form.js
window.onReservationActionSuccess = async ({ action } = {}) => {
  if (action === "delete" || action === "create" || action === "update") {
    enterCreateMode();
    clearFormMessage();
  }

  await loadResources();
  await loadReservations();
};

(async function initReservationsPage() {
  await loadResources();
  await loadReservations();
  enterCreateMode();
})();