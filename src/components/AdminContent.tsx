"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/ImageUploadField";

type LessonRow = {
  id: string;
  title: string;
  summary: string;
  level: string;
  duration: string;
  lessons: string;
  imageUrl: string | null;
  published: boolean;
  sortOrder: number;
};

export function AdminContent({ initial }: { initial: LessonRow[] }) {
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
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          published: data.published === "on",
          sortOrder: Number(data.sortOrder || 0),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; lesson?: LessonRow };
      if (!res.ok || !json.ok || !json.lesson) {
        setStatus("error");
        setMessage(json.error || "تعذّر حفظ المحتوى.");
        return;
      }
      setRows((prev) => [...prev, json.lesson!].sort((a, b) => a.sortOrder - b.sortOrder));
      form.reset();
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("مشكلة في الشبكة.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("حذف هذا المحتوى؟")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/content?id=${encodeURIComponent(id)}`, { method: "DELETE" });
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
        <h2>إضافة درس مجاني</h2>
        <label>
          العنوان
          <input name="title" required maxLength={120} />
        </label>
        <label>
          الملخص
          <textarea name="summary" required rows={3} />
        </label>
        <div className="form-grid">
          <label>
            المستوى
            <input name="level" required placeholder="مبتدئ" />
          </label>
          <label>
            المدة
            <input name="duration" required placeholder="٥ دروس قصيرة" />
          </label>
          <label>
            ترتيب العرض
            <input name="sortOrder" type="number" defaultValue={0} dir="ltr" />
          </label>
        </div>
        <label>
          نقاط الدرس (سطر لكل نقطة)
          <textarea name="lessons" required rows={5} placeholder={"النقطة الأولى\nالنقطة الثانية"} />
        </label>
        <ImageUploadField name="imageUrl" label="صورة الدرس" />
        <label className="admin-check">
          <input name="published" type="checkbox" defaultChecked />
          منشور في صفحة الدروس المجانية
        </label>
        <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "جاري الحفظ…" : "حفظ المحتوى"}
        </button>
        {message ? <p className="form-status is-error">{message}</p> : null}
      </form>

      <div className="admin-list">
        {rows.length === 0 ? (
          <p className="members-empty">لا يوجد محتوى بعد. ستظهر الدروس الافتراضية للعامة حتى تضيف محتوى هنا.</p>
        ) : null}
        {rows.map((row) => (
          <article className="admin-item" key={row.id}>
            <div className="admin-item-top">
              <div>
                <h2>{row.title}</h2>
                <p>
                  {row.level} · {row.duration} · {row.published ? "منشور" : "مسودة"}
                </p>
                {row.imageUrl ? <p dir="ltr">{row.imageUrl}</p> : null}
                <p>{row.summary}</p>
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
