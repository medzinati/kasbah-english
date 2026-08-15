"use client";

import { FormEvent, useState } from "react";

const levels = ["Beginner", "Elementary", "Intermediate", "Upper-Intermediate", "Advanced"];
const goals = ["Conversation", "Exams (IELTS / academic)", "Career English", "General improvement"];

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
        setMessage(json.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Thank you! We received your application and will email you if you’re accepted into the community.");
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
          Full name
          <input name="name" type="text" required autoComplete="name" placeholder="Your full name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
        </label>
        <label>
          City / country
          <input name="location" type="text" required placeholder="Casablanca, Morocco" />
        </label>
        <label>
          WhatsApp (optional)
          <input name="whatsapp" type="tel" autoComplete="tel" placeholder="+212…" />
        </label>
        <label>
          Current level
          <select name="level" required defaultValue="">
            <option value="" disabled>
              Select level
            </option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label>
          Main goal
          <select name="goal" required defaultValue="">
            <option value="" disabled>
              Select goal
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
        Why do you want to join Kasbah English?
        <textarea
          name="motivation"
          required
          rows={5}
          placeholder="Tell us about your goals, schedule, and what you hope to practice in the community…"
        />
      </label>

      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Submit application"}
      </button>

      {message ? (
        <p className={`form-status ${status === "success" ? "is-success" : "is-error"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
