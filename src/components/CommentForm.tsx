"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CommentForm({ postId }: { postId: string }) {
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
      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, postId }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error || "تعذّر إضافة الرد.");
        return;
      }
      form.reset();
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("مشكلة في الشبكة.");
    }
  }

  return (
    <form className="site-form community-form" onSubmit={onSubmit}>
      <label>
        أضف ردًا
        <textarea name="body" required rows={3} placeholder="اكتب ردك…" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "جاري الإرسال…" : "رد"}
      </button>
      {message ? <p className="form-status is-error">{message}</p> : null}
    </form>
  );
}
