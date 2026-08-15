"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function NewPostForm({ groupSlug }: { groupSlug: string }) {
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
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, groupSlug }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; postId?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error || "Could not create post.");
        return;
      }
      form.reset();
      setStatus("idle");
      if (json.postId) {
        router.push(`/members/groups/${groupSlug}/${json.postId}`);
        router.refresh();
      }
    } catch {
      setStatus("error");
      setMessage("Network error.");
    }
  }

  return (
    <form className="site-form community-form" onSubmit={onSubmit}>
      <h2>Start a discussion</h2>
      <label>
        Title
        <input name="title" required maxLength={120} placeholder="Question or topic…" />
      </label>
      <label>
        Message
        <textarea name="body" required rows={5} placeholder="Share your thoughts or question…" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Posting…" : "Post to group"}
      </button>
      {message ? <p className="form-status is-error">{message}</p> : null}
    </form>
  );
}
