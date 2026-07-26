"use client";

import { useState } from "react";

import { Field, SubmitButton, Notice, ErrorText } from "../../_components/formBits";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      // The endpoint answers identically whatever the address is, so there is
      // only ever one thing to show here.
      setNotice(data.message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (notice) {
    return (
      <div className="space-y-4">
        <Notice>{notice}</Notice>
        <p className="text-sm text-gray-600">
          The link is good for one hour and can only be used once.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
        autoFocus
        autoComplete="email"
        placeholder="you@example.com"
      />

      <ErrorText>{error}</ErrorText>

      <SubmitButton loading={loading} loadingLabel="Sending…">
        Send me a link
      </SubmitButton>
    </form>
  );
}
