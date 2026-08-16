"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ApplicationRow = {
  id: string;
  name: string;
  email: string;
  location: string;
  whatsapp: string | null;
  level: string;
  goal: string;
  plan: string | null;
  motivation: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  paymentStatus: string;
  createdAt: string;
};

const statusLabel = {
  PENDING: "قيد المراجعة",
  ACCEPTED: "مقبول",
  REJECTED: "مرفوض",
} as const;

export function AdminApplications({ initial }: { initial: ApplicationRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>("");

  async function act(applicationId: string, action: "accept" | "reject") {
    setBusyId(applicationId);
    setNotice("");

    try {
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, action }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        email?: string;
        tempPassword?: string;
        emailSent?: boolean;
        message?: string;
      };

      if (!res.ok || !json.ok) {
        setNotice(json.error || "العملية فشلت.");
        return;
      }

      if (action === "accept") {
        if (json.emailSent) {
          setNotice(json.message || `تم القبول وإرسال بيانات الدخول إلى ${json.email}.`);
        } else if (json.tempPassword) {
          setNotice(
            `تم قبول ${json.email}. الإيميل لم يُرسل بعد — كلمة المرور المؤقتة: ${json.tempPassword} (أدخل إعدادات الإيميل أو أرسلها يدويًا). الدخول من /members/login`,
          );
        } else {
          setNotice(json.message || "تم التحديث.");
        }
      } else {
        setNotice(json.message || "تم التحديث.");
      }

      setRows((prev) =>
        prev.map((row) =>
          row.id === applicationId
            ? { ...row, status: action === "accept" ? "ACCEPTED" : "REJECTED" }
            : row,
        ),
      );
      router.refresh();
    } catch {
      setNotice("مشكلة في الشبكة.");
    } finally {
      setBusyId(null);
    }
  }

  if (!rows.length) {
    return <p className="members-empty">لا توجد طلبات حاليًا.</p>;
  }

  return (
    <div className="admin-list">
      {notice ? (
        <p className="form-status is-success" role="status">
          {notice}
        </p>
      ) : null}

      {rows.map((row) => (
        <article className="admin-item" key={row.id}>
          <div className="admin-item-top">
            <div>
              <h2>{row.name}</h2>
              <p>
                {row.email} · {row.location}
              </p>
            </div>
            <span className={`status-pill status-${row.status.toLowerCase()}`}>{statusLabel[row.status]}</span>
          </div>
          <p>
            <strong>المستوى:</strong> {row.level} · <strong>الهدف:</strong> {row.goal}
            {row.plan ? (
              <>
                {" "}
                · <strong>الباقة:</strong> {row.plan}
              </>
            ) : null}
            {" "}
            · <strong>الدفع:</strong>{" "}
            {row.paymentStatus === "PAID" ? "مدفوع" : row.paymentStatus === "WAIVED" ? "معفى" : "غير مدفوع"}
          </p>
          {row.whatsapp ? (
            <p>
              <strong>واتساب:</strong> {row.whatsapp}
            </p>
          ) : null}
          <p className="admin-motivation">{row.motivation}</p>
          {row.status === "PENDING" ? (
            <div className="admin-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={busyId === row.id}
                onClick={() => act(row.id, "accept")}
              >
                قبول وإنشاء حساب
              </button>
              <button
                type="button"
                className="btn btn-ghost dark"
                disabled={busyId === row.id}
                onClick={() => act(row.id, "reject")}
              >
                رفض
              </button>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
