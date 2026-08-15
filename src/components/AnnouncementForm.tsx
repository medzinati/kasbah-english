"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AnnouncementForm() {
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
      const res = await fetch("/api/community/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error || "Could not post announcement.");
        return;
      }
      form.reset();
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error.");
    }
  }

  return (
    <form className="site-form community-form" onSubmit={onSubmit}>
      <h2>New announcement</h2>
      <label>
        Title
        <input name="title" required maxLength={120} placeholder="Weekly update…" />
      </label>
      <label>
        Message
        <textarea name="body" required rows={4} placeholder="What should members know?" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Posting…" : "Post announcement"}
      </button>
      {message ? <p className="form-status is-error">{message}</p> : null}
    </form>
  );
}
