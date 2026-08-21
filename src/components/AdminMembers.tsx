"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { roleLabelAr } from "@/lib/roles";
import type { AppRole } from "@/lib/roles";

type MemberRow = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  createdAt: string;
};

export function AdminMembers({
  initial,
  currentUserId,
}: {
  initial: MemberRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setNotice("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        member?: MemberRow;
        tempPassword?: string;
      };
      if (!res.ok || !json.ok || !json.member) {
        setStatus("error");
        setNotice(json.error || "تعذّر إضافة العضو.");
        return;
      }
      setRows((prev) => [json.member!, ...prev]);
      setNotice(
        json.tempPassword
          ? `تمت الإضافة. كلمة المرور المؤقتة: ${json.tempPassword}`
          : "تمت إضافة العضو.",
      );
      form.reset();
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
      setNotice("مشكلة في الشبكة.");
    }
  }

  async function onDelete(id: string) {
    if (id === currentUserId) {
      setNotice("لا يمكنك حذف حسابك.");
      return;
    }
    if (!confirm("هل تريد حذف هذا الحساب نهائيًا؟")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/members?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setNotice(json.error || "تعذّر الحذف.");
        return;
      }
      setRows((prev) => prev.filter((row) => row.id !== id));
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="admin-stack">
      <form className="site-form community-form" onSubmit={onCreate}>
        <h2>إضافة عضو أو أستاذ</h2>
        <div className="form-grid">
          <label>
            الاسم
            <input name="name" required maxLength={80} />
          </label>
          <label>
            البريد الإلكتروني
            <input name="email" type="email" required dir="ltr" />
          </label>
          <label>
            الدور
            <select name="role" defaultValue="MEMBER">
              <option value="MEMBER">عضو</option>
              <option value="TEACHER">أستاذ</option>
            </select>
          </label>
        </div>
        <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "جاري الإضافة…" : "إضافة"}
        </button>
      </form>

      {notice ? <p className={`form-status ${status === "error" ? "is-error" : "is-success"}`}>{notice}</p> : null}

      <div className="admin-list">
        {rows.map((row) => (
          <article className="admin-item" key={row.id}>
            <div className="admin-item-top">
              <div>
                <h2>{row.name}</h2>
                <p>
                  {row.email} · {roleLabelAr(row.role)}
                </p>
              </div>
              {row.id !== currentUserId && row.role !== "ADMIN" ? (
                <button
                  type="button"
                  className="btn btn-ghost dark"
                  disabled={busyId === row.id}
                  onClick={() => onDelete(row.id)}
                >
                  حذف
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
