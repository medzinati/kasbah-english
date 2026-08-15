export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string;
};

export const newsItems: NewsItem[] = [
  {
    slug: "community-platform-launch",
    title: "Kasbah English community is taking shape",
    date: "2026-08-15",
    summary:
      "We’re building a members-only space for discussions, group practice, and live meetings — applications are open.",
    body: "Soon, accepted members will access discussion groups, weekly announcements, and live Zoom-style meetings inside the Kasbah English platform. For now, explore free courses and apply to join the founding cohort.",
  },
  {
    slug: "free-starter-lessons",
    title: "Free starter lessons are live",
    date: "2026-08-10",
    summary: "Begin with short, practical lessons you can use today — no account required.",
    body: "Our free courses cover everyday conversation, clear pronunciation habits, and simple writing for work. They’re designed as a first step before joining the full community.",
  },
  {
    slug: "how-applications-work",
    title: "How applications work",
    date: "2026-08-05",
    summary: "Tell us your level and goals. We review each application and invite accepted learners inside.",
    body: "Kasbah English is not an open free-for-all. After you apply, our team reviews your form and contacts you. Only accepted members get access to community discussions and meetings.",
  },
];
