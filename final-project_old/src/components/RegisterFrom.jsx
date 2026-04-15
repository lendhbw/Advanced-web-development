import { Link } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(50, "First name must be less than 50 characters long"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .max(50, "Last name must be less than 50 characters long"),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password must be less than 50 characters long"),
    confirmPassword: z.string(),
    role: z.enum(["reserver", "manager"], "Please select a valid role"),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "reserver",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));

    clearFieldError(name);
    setSuccessMessage("");
    setMessageType("");
  }

  function handleFocus(event) {
    clearFieldError(event.target.name);
  }

  function clearFieldError(fieldName) {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });

      setErrors(fieldErrors);
      setSuccessMessage(
        "Invalid form data! Please correct the errors and try again.",
      );
      setMessageType("error");
      return;
    }
    setErrors({});
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      setApiResponse(data);
      setSuccessMessage("Form submitted and sent to server successfully! 🎉");
      setMessageType("success");
    } catch (error) {
      console.error(error);
      setSuccessMessage("Something went wrong while sending data ❌");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Register</h2>
          <p className="mt-1 text-sm text-black/60">
            Fill in your details to create a new account.
          </p>
        </div>
        <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
          New user
        </span>
      </div>

      {successMessage && (
        <div
          className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
            messageType === "success"
              ? "border-green-300 bg-green-50 text-green-700"
              : "border-red-300 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          <p>{successMessage}</p>
        </div>
      )}

      {loading && (
        <div className="mt-6 rounded-2xl border px-4 py-3 text-sm font-medium border-black-300 bg-black/10 text-black-700">
          {" "}
          Sending data... ⏳
        </div>
      )}

      {apiResponse && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Server Response (Echo)</h2>

          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
            {JSON.stringify(apiResponse.json, null, 2)}
          </pre>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autocomplete="given-name"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              onFocus={handleFocus}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 ease-out focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autocomplete="family-name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              onFocus={handleFocus}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 ease-out focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            onFocus={handleFocus}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 ease-out focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 ease-out focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Repeat the password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={handleFocus}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 ease-out focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold">Role</span>
          <div className="mt-3 flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="reserver"
                checked={formData.role === "reserver"}
                onChange={handleChange}
                onFocus={handleFocus}
              />
              <span className="text-sm">Reserver</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="manager"
                checked={formData.role === "manager"}
                onChange={handleChange}
                onFocus={handleFocus}
              />
              <span className="text-sm">Manager</span>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
          <label className="inline-flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              onFocus={handleFocus}
              className="mt-1 h-4 w-4 rounded border-black/20 text-brand-primary focus:ring-brand-primary/40"
            />
            <span className="text-sm text-black/70">
              I accept the{" "}
              <Link
                to="/terms"
                className="font-semibold text-brand-blue hover:underline cursor-not-allowed pointer-events-none"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacypolicy"
                className="font-semibold text-brand-blue hover:underline cursor-not-allowed pointer-events-none"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
        )}

        <div className="grid gap-4 w-full grid-cols-1 sm:grid-cols-2">
          <button
            id="registerButton"
            type="submit"
            className="w-full rounded-2xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-dark/80 transition-all duration-200 ease-out"
          >
            Register
          </button>
          <Link
            to="/login"
            className="w-full rounded-2xl border border-brand-dark px-6 py-3 text-sm font-semibold text-center hover:bg-brand-dark/80 hover:text-white transition-all duration-200 ease-out cursor-not-allowed pointer-events-none"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
