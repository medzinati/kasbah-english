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
  initialLevel = "",
}: {
  dict: Dictionary["apply"];
  plans: readonly PlanOption[];
  currency: string;
  initialPlan?: string;
  initialLevel?: string;
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
        body: JSON.stringify({
          ...data,
          level: initialLevel || undefined,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        applicationId?: string;
        canPay?: boolean;
      };

      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error || dict.error);
        return;
      }

      if (json.canPay && json.applicationId) {
        const payRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId: json.applicationId }),
        });
        const payJson = (await payRes.json()) as { ok?: boolean; url?: string; error?: string };
        if (payRes.ok && payJson.ok && payJson.url) {
          window.location.href = payJson.url;
          return;
        }
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
      <p className="form-short-note">{dict.shortNote}</p>

      <div className="form-grid form-grid-simple">
        <label>
          {dict.name}
          <input name="name" type="text" required autoComplete="name" placeholder={dict.phName} />
        </label>
        <label>
          {dict.email}
          <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" dir="ltr" />
        </label>
        <label>
          {dict.whatsapp}
          <input name="whatsapp" type="tel" autoComplete="tel" placeholder="+966…" dir="ltr" />
        </label>
        <label>
          {dict.plan}
          <select name="plan" defaultValue={validInitial}>
            <option value="">{dict.selectPlanOptional}</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} — {plan.price} {currency} ({plan.duration})
              </option>
            ))}
          </select>
        </label>
      </div>

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
