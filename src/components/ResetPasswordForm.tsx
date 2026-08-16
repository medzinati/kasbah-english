"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries";

export function ResetPasswordForm({
  dict,
  token,
}: {
  dict: Dictionary["members"];
  token: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");

    if (password !== confirm) {
      setStatus("error");
      setMessage(dict.resetMismatch);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(dict.resetError);
        return;
      }
      setStatus("success");
      setMessage(dict.resetSuccess);
      setTimeout(() => router.push("/members/login"), 1200);
    } catch {
      setStatus("error");
      setMessage(dict.resetError);
    }
  }

  if (!token) {
    return (
      <div className="site-form">
        <p className="form-status is-error">{dict.resetError}</p>
        <Link className="text-link" href="/members/forgot-password">
          {dict.forgotPassword}
        </Link>
      </div>
    );
  }

  return (
    <form className="site-form" onSubmit={onSubmit}>
      <label>
        {dict.resetPassword}
        <input name="password" type="password" required minLength={8} autoComplete="new-password" dir="ltr" />
      </label>
      <label>
        {dict.resetConfirm}
        <input name="confirm" type="password" required minLength={8} autoComplete="new-password" dir="ltr" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {dict.resetSubmit}
      </button>
      <p className="form-note">
        <Link className="text-link" href="/members/login">
          {dict.backToLogin}
        </Link>
      </p>
      {message ? (
        <p className={`form-status ${status === "success" ? "is-success" : "is-error"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
