"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteMeetingButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this meeting?")) {
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
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
