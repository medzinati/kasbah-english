"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function GroupCreateForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/community/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; slug?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error || "Could not create group.");
        return;
      }
      form.reset();
      setStatus("idle");
      router.refresh();
      if (json.slug) {
        router.push(`/members/groups/${json.slug}`);
      }
    } catch {
      setStatus("error");
      setMessage("Network error.");
    }
  }

  return (
    <form className="site-form community-form" onSubmit={onSubmit}>
      <h2>Create discussion group</h2>
      <label>
        Title
        <input name="title" required maxLength={80} placeholder="Pronunciation practice" />
      </label>
      <label>
        Description
        <textarea name="description" required rows={3} placeholder="What is this group for?" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Creating…" : "Create group"}
      </button>
      {message ? <p className="form-status is-error">{message}</p> : null}
    </form>
  );
}
