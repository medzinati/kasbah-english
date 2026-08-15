"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type VideoRow = {
  id: string;
  title: string;
  description: string;
  url: string;
  published: boolean;
};

export function AdminVideos({ initial }: { initial: VideoRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          published: data.published === "on",
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; video?: VideoRow };
      if (!res.ok || !json.ok || !json.video) {
        setStatus("error");
        setMessage(json.error || "تعذّر إضافة الفيديو.");
        return;
      }
      setRows((prev) => [json.video!, ...prev]);
      form.reset();
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("مشكلة في الشبكة.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("حذف هذا الفيديو؟")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/videos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setRows((prev) => prev.filter((row) => row.id !== id));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="admin-stack">
      <form className="site-form community-form" onSubmit={onCreate}>
        <h2>إضافة فيديو</h2>
        <label>
          العنوان
          <input name="title" required maxLength={120} />
        </label>
        <label>
          الوصف
          <textarea name="description" required rows={3} />
        </label>
        <label>
          رابط الفيديو (YouTube / Vimeo / مباشر)
          <input name="url" type="url" required dir="ltr" placeholder="https://" />
        </label>
        <label className="admin-check">
          <input name="published" type="checkbox" defaultChecked />
          منشور للأعضاء
        </label>
        <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "جاري الحفظ…" : "حفظ الفيديو"}
        </button>
        {message ? <p className="form-status is-error">{message}</p> : null}
      </form>

      <div className="admin-list">
        {rows.length === 0 ? <p className="members-empty">لا توجد فيديوهات بعد.</p> : null}
        {rows.map((row) => (
          <article className="admin-item" key={row.id}>
            <div className="admin-item-top">
              <div>
                <h2>{row.title}</h2>
                <p>
                  {row.published ? "منشور" : "مسودة"} ·{" "}
                  <a href={row.url} target="_blank" rel="noreferrer" dir="ltr">
                    فتح الرابط
                  </a>
                </p>
                <p>{row.description}</p>
              </div>
              <button
                type="button"
                className="btn btn-ghost dark"
                disabled={busyId === row.id}
                onClick={() => onDelete(row.id)}
              >
                حذف
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
