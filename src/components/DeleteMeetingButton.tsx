"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteMeetingButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("هل تريد حذف هذا اللقاء؟")) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/community/meetings?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className="btn btn-ghost dark" disabled={busy} onClick={onDelete}>
      {busy ? "جاري الحذف…" : "حذف"}
    </button>
  );
}
