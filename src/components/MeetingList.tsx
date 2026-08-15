import { DeleteMeetingButton } from "@/components/DeleteMeetingButton";
import { MeetingRsvpButton } from "@/components/MeetingRsvpButton";

export type MeetingCardData = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  durationMinutes: number;
  zoomUrl: string;
  createdByName: string;
  registered?: boolean;
  attendeeCount?: number;
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("ar", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function MeetingList({
  meetings,
  isAdmin = false,
  emptyText = "لا يوجد لقاء مجدول حاليًا.",
}: {
  meetings: MeetingCardData[];
  isAdmin?: boolean;
  emptyText?: string;
}) {
  if (!meetings.length) {
    return <p className="members-empty">{emptyText}</p>;
  }

  const now = Date.now();

  return (
    <div className="meeting-list">
      {meetings.map((meeting) => {
        const start = new Date(meeting.startsAt).getTime();
        const end = start + meeting.durationMinutes * 60_000;
        const isLive = now >= start && now <= end;
        const isPast = now > end;

        return (
          <article key={meeting.id} className={`meeting-item ${isPast ? "is-past" : ""}`}>
            <div className="meeting-when">
              <span className={`status-pill ${isLive ? "status-accepted" : isPast ? "status-rejected" : "status-pending"}`}>
                {isLive ? "الآن مباشر" : isPast ? "منتهي" : "قادم"}
              </span>
              <time dateTime={meeting.startsAt}>{formatWhen(meeting.startsAt)}</time>
              <p>{meeting.durationMinutes} دقيقة</p>
              {typeof meeting.attendeeCount === "number" ? <p>{meeting.attendeeCount} مسجّل</p> : null}
            </div>
            <div className="meeting-body">
              <h3>{meeting.title}</h3>
              <p>{meeting.description}</p>
              <p className="feed-meta">يستضيفه {meeting.createdByName}</p>
              <div className="meeting-actions">
                {!isPast ? (
                  <>
                    <a className="btn btn-primary" href={meeting.zoomUrl} target="_blank" rel="noreferrer">
                      الانضمام للقاء
                    </a>
                    <MeetingRsvpButton meetingId={meeting.id} alreadyRegistered={Boolean(meeting.registered)} />
                  </>
                ) : null}
                {isAdmin ? <DeleteMeetingButton id={meeting.id} /> : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
