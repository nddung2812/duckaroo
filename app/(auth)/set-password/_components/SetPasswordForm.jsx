"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Field, SubmitButton, ErrorText } from "../../_components/formBits";

export default function SetPasswordForm({ token, minPasswordLength, submitLabel }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Checked here as well as on the server so a mismatch does not burn the
    // single-use token.
    if (password !== confirm) {
      setError("Those passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (data.status === "ok") {
        router.push("/");
        router.refresh();
        return;
      }

      setError(data.message ?? "That did not work. Request a new link and try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        id="password"
        label="New password"
        type="password"
        value={password}
        onChange={setPassword}
        required
        autoFocus
        autoComplete="new-password"
        hint={`At least ${minPasswordLength} characters.`}
      />
      <Field
        id="confirm"
        label="Confirm new password"
        type="password"
        value={confirm}
        onChange={setConfirm}
        required
        autoComplete="new-password"
      />

      <ErrorText>{error}</ErrorText>

      <SubmitButton loading={loading} loadingLabel="Saving…">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
