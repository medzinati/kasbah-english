"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setStatus("error");
      setMessage("الإيميل أو كلمة المرور غير صحيحة. الدخول خاص بالأعضاء المقبولين فقط.");
      return;
    }

    router.push("/members");
    router.refresh();
  }

  return (
    <form className="site-form" onSubmit={onSubmit}>
      <label>
        البريد الإلكتروني
        <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" dir="ltr" />
      </label>
      <label>
        كلمة المرور
        <input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" dir="ltr" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "كيتحل الدخول…" : "دخول"}
      </button>
      {message ? (
        <p className="form-status is-error" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
