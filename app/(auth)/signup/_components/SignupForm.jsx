"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Field, SubmitButton, Notice, ErrorText } from "../../_components/formBits";

export default function SignupForm({ minPasswordLength }) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.status === "ok") {
        router.push("/");
        router.refresh();
        return;
      }

      // The address is already on file — most likely an account that came
      // across from the old store.
      if (data.status === "check_email") {
        setNotice(data.message);
        return;
      }

      setError(data.message ?? "Check the form and try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (notice) return <Notice>{notice}</Notice>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field id="firstName" label="First name" value={form.firstName} onChange={set("firstName")} autoComplete="given-name" />
        <Field id="lastName" label="Last name" value={form.lastName} onChange={set("lastName")} autoComplete="family-name" />
      </div>
      <Field
        id="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={set("email")}
        required
        autoComplete="email"
        placeholder="you@example.com"
      />
      <Field id="phone" label="Phone (optional)" type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
      <Field
        id="password"
        label="Password"
        type="password"
        value={form.password}
        onChange={set("password")}
        required
        autoComplete="new-password"
        hint={`At least ${minPasswordLength} characters.`}
      />

      <ErrorText>{error}</ErrorText>

      <SubmitButton loading={loading} loadingLabel="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
