"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Field, SubmitButton, Notice, ErrorText } from "../../_components/formBits";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.status === "ok") {
        router.push("/");
        router.refresh();
        return;
      }

      // "We've upgraded our store — check your email…" — the migration path.
      if (data.status === "check_email") {
        setNotice(data.message);
        setPassword("");
        return;
      }

      setError(data.message ?? "That email or password is not right.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Once we have told them to check their email, showing the password field
  // again just invites them to keep guessing a password that does not exist.
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
      <Field
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        required
        autoComplete="current-password"
      />

      <ErrorText>{error}</ErrorText>

      <SubmitButton loading={loading} loadingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
