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
      setMessage("Invalid email or password. Access is only for accepted members.");
      return;
    }

    router.push("/members");
    router.refresh();
  }

  return (
    <form className="site-form" onSubmit={onSubmit}>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
      </label>
      <label>
        Password
        <input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Signing in…" : "Sign in"}
      </button>
      {message ? (
        <p className="form-status is-error" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
