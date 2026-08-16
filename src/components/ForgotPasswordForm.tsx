"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

export function ForgotPasswordForm({ dict }: { dict: Dictionary["members"] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const email = String(new FormData(e.currentTarget).get("email") || "");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setStatus("error");
        setMessage(dict.forgotError);
        return;
      }
      setStatus("success");
      setMessage(dict.forgotSuccess);
    } catch {
      setStatus("error");
      setMessage(dict.forgotError);
    }
  }

  return (
    <form className="site-form" onSubmit={onSubmit}>
      <label>
        {dict.email}
        <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" dir="ltr" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? dict.forgotSending : dict.forgotSubmit}
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
