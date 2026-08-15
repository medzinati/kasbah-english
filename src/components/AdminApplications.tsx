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
  motivation: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
};

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
        message?: string;
      };

      if (!res.ok || !json.ok) {
        setNotice(json.error || "Action failed.");
        return;
      }

      if (action === "accept" && json.tempPassword) {
        setNotice(
          `Accepted ${json.email}. Temporary password: ${json.tempPassword} — share it privately, then ask them to sign in at /members/login.`,
        );
      } else {
        setNotice(json.message || "Updated.");
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
      setNotice("Network error.");
    } finally {
      setBusyId(null);
    }
  }

  if (!rows.length) {
    return <p className="members-empty">No applications yet.</p>;
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
            <span className={`status-pill status-${row.status.toLowerCase()}`}>{row.status}</span>
          </div>
          <p>
            <strong>Level:</strong> {row.level} · <strong>Goal:</strong> {row.goal}
          </p>
          {row.whatsapp ? (
            <p>
              <strong>WhatsApp:</strong> {row.whatsapp}
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
                Accept & create login
              </button>
              <button
                type="button"
                className="btn btn-ghost dark"
                disabled={busyId === row.id}
                onClick={() => act(row.id, "reject")}
              >
                Reject
              </button>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
