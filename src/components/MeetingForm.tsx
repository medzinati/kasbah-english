"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function defaultLocalDateTime() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 2);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function MeetingForm() {
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
      const res = await fetch("/api/community/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          durationMinutes: Number(data.durationMinutes || 60),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error || "Could not create meeting.");
        return;
      }
      form.reset();
      const starts = form.elements.namedItem("startsAt") as HTMLInputElement | null;
      if (starts) {
        starts.value = defaultLocalDateTime();
      }
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error.");
    }
  }

  return (
    <form className="site-form community-form" onSubmit={onSubmit}>
      <h2>Schedule a meeting</h2>
      <label>
        Title
        <input name="title" required maxLength={120} placeholder="Conversation Lab — live session" />
      </label>
      <label>
        Description
        <textarea name="description" required rows={3} placeholder="What will members practice?" />
      </label>
      <div className="form-grid">
        <label>
          Starts at
          <input name="startsAt" type="datetime-local" required defaultValue={defaultLocalDateTime()} />
        </label>
        <label>
          Duration (minutes)
          <input name="durationMinutes" type="number" min={15} max={240} step={15} defaultValue={60} required />
        </label>
      </div>
      <label>
        Zoom / Meet link
        <input name="zoomUrl" type="url" required placeholder="https://zoom.us/j/…" />
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Add meeting"}
      </button>
      {message ? <p className="form-status is-error">{message}</p> : null}
    </form>
  );
}
