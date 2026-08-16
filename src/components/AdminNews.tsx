"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/ImageUploadField";

type NewsRow = {
  id: string;
  slug: string;
  titleAr: string;
  published: boolean;
  imageUrl: string;
  date: string;
};

export function AdminNews({ initial }: { initial: NewsRow[] }) {
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
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          published: data.published === "on",
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; post?: NewsRow };
      if (!res.ok || !json.ok || !json.post) {
        setStatus("error");
        setMessage(json.error || "تعذّر حفظ الخبر.");
        return;
      }
      setRows((prev) => [json.post!, ...prev]);
      form.reset();
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("مشكلة في الشبكة.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("حذف هذا الخبر؟")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, { method: "DELETE" });
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
        <h2>إضافة خبر / مقال</h2>
        <p className="form-note">اكتب فقرات المقال مفصولة بسطر فارغ. الهدف مقال طويل (حوالي 700–1000 كلمة).</p>
        <div className="form-grid">
          <label>
            العنوان (عربي)
            <input name="titleAr" required />
          </label>
          <label>
            العنوان (English)
            <input name="titleEn" required dir="ltr" />
          </label>
        </div>
        <div className="form-grid">
          <label>
            الملخص القصير (عربي) — يظهر في القائمة ~3 أسطر
            <textarea name="summaryAr" required rows={3} />
          </label>
          <label>
            Short summary (EN)
            <textarea name="summaryEn" required rows={3} dir="ltr" />
          </label>
        </div>
        <ImageUploadField name="imageUrl" label="صورة المقال" />
        <div className="form-grid">
          <label>
            وصف الصورة عربي
            <input name="imageAltAr" required />
          </label>
          <label>
            Image alt (EN)
            <input name="imageAltEn" required dir="ltr" />
          </label>
          <label>
            التاريخ
            <input name="date" type="date" dir="ltr" />
          </label>
          <label>
            الرابط (slug) اختياري
            <input name="slug" placeholder="my-article" dir="ltr" />
          </label>
        </div>
        <label>
          نص المقال عربي (فقرات مفصولة بسطر فارغ)
          <textarea name="bodyAr" required rows={12} />
        </label>
        <label>
          Article body (EN)
          <textarea name="bodyEn" required rows={12} dir="ltr" />
        </label>
        <label className="admin-check">
          <input name="published" type="checkbox" defaultChecked />
          منشور للعامة
        </label>
        <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "جاري الحفظ…" : "نشر الخبر"}
        </button>
        {message ? <p className="form-status is-error">{message}</p> : null}
      </form>

      <div className="admin-list">
        {rows.length === 0 ? (
          <p className="members-empty">لا توجد أخبار في قاعدة البيانات بعد. الموقع يعرض المقالات الافتراضية حتى تضيف هنا.</p>
        ) : null}
        {rows.map((row) => (
          <article className="admin-item" key={row.id}>
            <div className="admin-item-top">
              <div>
                <h2>{row.titleAr}</h2>
                <p>
                  /news/{row.slug} · {row.published ? "منشور" : "مسودة"}
                </p>
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
