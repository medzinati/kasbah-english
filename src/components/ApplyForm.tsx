"use client";

import { FormEvent, useState } from "react";

const levels = ["مبتدئ", "أساسي", "متوسط", "فوق المتوسط", "متقدم"];
const goals = ["المحادثة", "الامتحانات (IELTS / أكاديمي)", "إنجليزية العمل", "تحسين عام"];

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/apply", {
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
      setMessage("شكرًا ليك! استلمنا طلبك وغادي نراسلك بالإيميل إلا تقبلتي في المجتمع.");
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
          الاسم الكامل
          <input name="name" type="text" required autoComplete="name" placeholder="اسمك الكامل" />
        </label>
        <label>
          البريد الإلكتروني
          <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
        </label>
        <label>
          المدينة / البلد
          <input name="location" type="text" required placeholder="الدار البيضاء، المغرب" />
        </label>
        <label>
          واتساب (اختياري)
          <input name="whatsapp" type="tel" autoComplete="tel" placeholder="+212…" dir="ltr" />
        </label>
        <label>
          المستوى الحالي
          <select name="level" required defaultValue="">
            <option value="" disabled>
              اختر المستوى
            </option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label>
          الهدف الرئيسي
          <select name="goal" required defaultValue="">
            <option value="" disabled>
              اختر الهدف
            </option>
            {goals.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        علاش بغيتي تنضم لكاسباه إنجليش؟
        <textarea
          name="motivation"
          required
          rows={5}
          placeholder="حكي لينا على أهدافك، وقتك، وشنو بغيتي تتمرّن عليه في المجتمع…"
        />
      </label>

      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "كيتصيفط…" : "إرسال الطلب"}
      </button>

      {message ? (
        <p className={`form-status ${status === "success" ? "is-success" : "is-error"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
