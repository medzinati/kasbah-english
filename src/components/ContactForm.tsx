"use client";

import { FormEvent, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

export function ContactForm({ dict }: { dict: Dictionary["contact"] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error || dict.error);
        return;
      }

      setStatus("success");
      setMessage(dict.success);
      form.reset();
    } catch {
      setStatus("error");
      setMessage(dict.network);
    }
  }

  return (
    <form className="site-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <label>
          {dict.name}
          <input name="name" type="text" required autoComplete="name" placeholder={dict.phName} />
        </label>
        <label>
          {dict.email}
          <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" dir="ltr" />
        </label>
      </div>
      <label>
        {dict.subject}
        <input name="subject" type="text" required placeholder={dict.phSubject} />
      </label>
      <label>
        {dict.message}
        <textarea name="message" required rows={6} placeholder={dict.phMessage} />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? dict.sending : dict.submit}
      </button>
      {message ? (
        <p className={`form-status ${status === "success" ? "is-success" : "is-error"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
