"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MeetingRsvpButton({
  meetingId,
  alreadyRegistered,
}: {
  meetingId: string;
  alreadyRegistered: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(alreadyRegistered);

  async function onRegister() {
    if (done) return;
    setBusy(true);
    try {
      const res = await fetch("/api/community/meetings/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId }),
      });
      if (res.ok) {
        setDone(true);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className="btn btn-ghost dark" disabled={busy || done} onClick={onRegister}>
      {done ? "مسجّل للحضور" : busy ? "جاري التسجيل…" : "سجّل حضوري"}
    </button>
  );
}
