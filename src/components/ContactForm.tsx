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
        setMessage(json.error || "وقع خطأ. حاول مرة أخرى.");
        return;
      }

      setStatus("success");
      setMessage("تم إرسال الرسالة. غادي نرجعو ليك قريب إن شاء الله.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("مشكلة في الاتصال. تحقق من الإنترنت وحاول مرة أخرى.");
    }
  }

  return (
    <form className="site-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <label>
          الاسم
          <input name="name" type="text" required autoComplete="name" placeholder="اسمك" />
        </label>
        <label>
          البريد الإلكتروني
          <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" dir="ltr" />
        </label>
      </div>
      <label>
        الموضوع
        <input name="subject" type="text" required placeholder="كيف نقدر نساعدوك؟" />
      </label>
      <label>
        الرسالة
        <textarea name="message" required rows={6} placeholder="اكتب رسالتك…" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "كيتصيفط…" : "إرسال الرسالة"}
      </button>
      {message ? (
        <p className={`form-status ${status === "success" ? "is-success" : "is-error"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
