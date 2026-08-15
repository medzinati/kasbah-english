"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
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
        setMessage(json.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Message sent. We’ll get back to you soon.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and try again.");
    }
  }

  return (
    <form className="site-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <label>
          Name
          <input name="name" type="text" required autoComplete="name" placeholder="Your name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
        </label>
      </div>
      <label>
        Subject
        <input name="subject" type="text" required placeholder="How can we help?" />
      </label>
      <label>
        Message
        <textarea name="message" required rows={6} placeholder="Write your message…" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
      {message ? (
        <p className={`form-status ${status === "success" ? "is-success" : "is-error"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
