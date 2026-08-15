"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteMeetingButton } from "@/components/DeleteMeetingButton";
import { MeetingForm } from "@/components/MeetingForm";

type Attendee = { id: string; name: string; email: string };
type MeetingRow = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  durationMinutes: number;
  zoomUrl: string;
  attendees: Attendee[];
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function AdminMeetingsPanel({ initial }: { initial: MeetingRow[] }) {
  const router = useRouter();
  const [rows] = useState(initial);

  return (
    <div className="admin-stack">
      <MeetingForm />

      <div className="admin-list">
        {rows.length === 0 ? <p className="members-empty">لا توجد لقاءات بعد.</p> : null}
        {rows.map((meeting) => (
          <article className="admin-item" key={meeting.id}>
            <div className="admin-item-top">
              <div>
                <h2>{meeting.title}</h2>
                <p>
                  {formatWhen(meeting.startsAt)} · {meeting.durationMinutes} دقيقة
                </p>
                <p>{meeting.description}</p>
                <p>
                  <a href={meeting.zoomUrl} target="_blank" rel="noreferrer" dir="ltr">
                    رابط اللقاء
                  </a>
                </p>
              </div>
              <DeleteMeetingButton id={meeting.id} />
            </div>
            <div className="admin-attendees">
              <h3>المسجّلون ({meeting.attendees.length})</h3>
              {meeting.attendees.length === 0 ? (
                <p className="members-empty">لم يسجّل أحد بعد.</p>
              ) : (
                <ul>
                  {meeting.attendees.map((person) => (
                    <li key={person.id}>
                      {person.name} — {person.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
      <button type="button" className="btn btn-ghost dark" onClick={() => router.refresh()}>
        تحديث القائمة
      </button>
    </div>
  );
}
