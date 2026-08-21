import Link from "next/link";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export type HubGroup = {
  id: string;
  slug: string;
  title: string;
  description: string;
  postCount: number;
};

export type HubMeeting = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  durationMinutes: number;
  zoomUrl: string;
  attendeeCount: number;
};

export type HubAnnouncement = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  createdAt: string;
};

export type HubFeedItem =
  | {
      kind: "announcement";
      id: string;
      title: string;
      body: string;
      authorName: string;
      createdAt: string;
    }
  | {
      kind: "post";
      id: string;
      title: string;
      body: string;
      authorName: string;
      createdAt: string;
      groupSlug: string;
      groupTitle: string;
      replyCount: number;
    };

type MembersHubProps = {
  locale: Locale;
  dict: Dictionary;
  firstName: string;
  isStaff: boolean;
  groups: HubGroup[];
  meetings: HubMeeting[];
  pinnedAnnouncements: HubAnnouncement[];
  feed: HubFeedItem[];
};

function formatDate(iso: string, locale: Locale, withTime = false) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" as const } : {}),
  }).format(new Date(iso));
}

function formatMeetingWhen(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function MembersHub({
  locale,
  dict,
  firstName,
  isStaff,
  groups,
  meetings,
  pinnedAnnouncements,
  feed,
}: MembersHubProps) {
  const m = dict.members;

  return (
    <div className="members-hub-wrap">
      <header className="members-hub-hero">
        <div>
          <p className="eyebrow">{m.hubWelcome}</p>
          <h1>
            {m.welcome} {firstName}
          </h1>
          <p className="members-lede">{m.hubLede}</p>
        </div>
        <div className="members-hub-hero-actions">
          <Link className="btn btn-primary" href="/members/groups">
            {m.hubStartDiscussion}
          </Link>
          <Link className="btn btn-ghost dark" href="/members/meetings">
            {m.hubAllMeetings}
          </Link>
        </div>
      </header>

      <div className="members-hub">
        <aside className="members-hub-panel members-hub-groups" aria-label={m.hubSpeakingGroups}>
          <div className="members-hub-panel-head">
            <h2>{m.hubSpeakingGroups}</h2>
            <p>{m.hubSpeakingLede}</p>
          </div>
          {groups.length === 0 ? (
            <p className="members-empty">{m.hubNoGroups}</p>
          ) : (
            <ul className="members-hub-group-list">
              {groups.map((group) => (
                <li key={group.id}>
                  <Link href={`/members/groups/${group.slug}`} className="members-hub-group">
                    <span className="members-hub-group-title">{group.title}</span>
                    <span className="members-hub-group-meta">
                      {group.postCount} {group.postCount === 1 ? m.post : m.posts}
                    </span>
                    <span className="members-hub-group-desc">{group.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link className="text-link members-hub-panel-link" href="/members/groups">
            {m.hubAllGroups} →
          </Link>
        </aside>

        <section className="members-hub-panel members-hub-feed" aria-label={m.hubFeed}>
          <div className="members-hub-panel-head">
            <h2>{m.hubFeed}</h2>
          </div>

          {isStaff ? <AnnouncementForm /> : null}

          {feed.length === 0 ? (
            <p className="members-empty">{m.hubFeedEmpty}</p>
          ) : (
            <div className="members-hub-feed-list">
              {feed.map((item) =>
                item.kind === "announcement" ? (
                  <article key={`a-${item.id}`} className="members-hub-card is-announce">
                    <div className="members-hub-card-top">
                      <span className="members-hub-badge">{m.hubBadgeAnnounce}</span>
                      <time dateTime={item.createdAt}>{formatDate(item.createdAt, locale, true)}</time>
                    </div>
                    <h3>{item.title}</h3>
                    <p className="feed-meta">{item.authorName}</p>
                    <p className="members-hub-card-body">{item.body}</p>
                  </article>
                ) : (
                  <article key={`p-${item.id}`} className="members-hub-card is-post">
                    <div className="members-hub-card-top">
                      <span className="members-hub-badge is-post">{m.hubBadgePost}</span>
                      <time dateTime={item.createdAt}>{formatDate(item.createdAt, locale, true)}</time>
                    </div>
                    <h3>
                      <Link href={`/members/groups/${item.groupSlug}/${item.id}`}>{item.title}</Link>
                    </h3>
                    <p className="feed-meta">
                      {item.authorName} · {m.hubInGroup}{" "}
                      <Link href={`/members/groups/${item.groupSlug}`}>{item.groupTitle}</Link>
                      {item.replyCount > 0
                        ? ` · ${item.replyCount} ${m.hubReplies}`
                        : null}
                    </p>
                    <p className="members-hub-card-body">{item.body}</p>
                    <Link
                      className="text-link"
                      href={`/members/groups/${item.groupSlug}/${item.id}`}
                    >
                      {m.viewAll} →
                    </Link>
                  </article>
                ),
              )}
            </div>
          )}
        </section>

        <aside className="members-hub-panel members-hub-rail" aria-label={m.hubMeetingsRail}>
          <div className="members-hub-rail-block">
            <div className="members-hub-panel-head">
              <h2>{m.hubMeetingsRail}</h2>
              <p>{m.hubMeetingsLede}</p>
            </div>
            {meetings.length === 0 ? (
              <p className="members-empty">{m.hubNoMeetings}</p>
            ) : (
              <ul className="members-hub-meeting-list">
                {meetings.map((meeting) => {
                  const start = new Date(meeting.startsAt).getTime();
                  const end = start + meeting.durationMinutes * 60_000;
                  const now = Date.now();
                  const isLive = now >= start && now <= end;

                  return (
                    <li key={meeting.id} className="members-hub-meeting">
                      <div className="members-hub-meeting-when">
                        <span className={`status-pill ${isLive ? "status-accepted" : "status-pending"}`}>
                          {isLive ? (locale === "ar" ? "مباشر" : "Live") : m.upcoming}
                        </span>
                        <time dateTime={meeting.startsAt}>
                          {formatMeetingWhen(meeting.startsAt, locale)}
                        </time>
                      </div>
                      <h3>{meeting.title}</h3>
                      <p>{meeting.description}</p>
                      <p className="feed-meta">
                        {meeting.durationMinutes} {m.hubMinutes}
                        {meeting.attendeeCount > 0 ? ` · ${meeting.attendeeCount}` : null}
                      </p>
                      <a
                        className="btn btn-primary members-hub-meeting-cta"
                        href={meeting.zoomUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {m.hubJoinMeeting}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link className="text-link members-hub-panel-link" href="/members/meetings">
              {m.hubAllMeetings} →
            </Link>
          </div>

          <div className="members-hub-rail-block">
            <div className="members-hub-panel-head">
              <h2>{m.hubAnnouncementsRail}</h2>
            </div>
            {pinnedAnnouncements.length === 0 ? (
              <p className="members-empty">{m.noAnnouncements}</p>
            ) : (
              <ul className="members-hub-pin-list">
                {pinnedAnnouncements.map((item) => (
                  <li key={item.id}>
                    <h3>{item.title}</h3>
                    <p className="feed-meta">
                      {item.authorName} · {formatDate(item.createdAt, locale)}
                    </p>
                    <p>{item.body}</p>
                  </li>
                ))}
              </ul>
            )}
            <Link className="text-link members-hub-panel-link" href="/members/community">
              {m.viewAll} →
            </Link>
          </div>

          <div className="members-hub-rail-block members-hub-quick">
            <Link href="/members/videos">{m.videos}</Link>
            <Link href="/members/community">{m.announcements}</Link>
            <Link href="/members/groups">{m.groups}</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
