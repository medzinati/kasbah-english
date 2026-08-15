"use client";

import { FormEvent, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type PlanOption = {
  id: string;
  name: string;
  duration: string;
  price: string;
};

export function ApplyForm({
  dict,
  plans,
  currency,
  initialPlan = "",
}: {
  dict: Dictionary["apply"];
  plans: readonly PlanOption[];
  currency: string;
  initialPlan?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const validInitial = plans.some((plan) => plan.id === initialPlan) ? initialPlan : "";

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
        <label>
          {dict.location}
          <input name="location" type="text" required placeholder={dict.phLocation} />
        </label>
        <label>
          {dict.whatsapp}
          <input name="whatsapp" type="tel" autoComplete="tel" placeholder="+212…" dir="ltr" />
        </label>
        <label>
          {dict.level}
          <select name="level" required defaultValue="">
            <option value="" disabled>
              {dict.selectLevel}
            </option>
            {dict.levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label>
          {dict.goal}
          <select name="goal" required defaultValue="">
            <option value="" disabled>
              {dict.selectGoal}
            </option>
            {dict.goals.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </label>
        <label className="form-span-2">
          {dict.plan}
          <select name="plan" required defaultValue={validInitial}>
            <option value="" disabled>
              {dict.selectPlan}
            </option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} — {plan.price} {currency} ({plan.duration})
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        {dict.motivation}
        <textarea name="motivation" required rows={5} placeholder={dict.phMotivation} />
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
