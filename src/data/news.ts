export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string;
};

export const newsItems: NewsItem[] = [
  {
    slug: "welcome-founding-members",
    title: "Applications are open for founding members",
    date: "2026-08-15",
    summary:
      "Kasbah English is live — with free public lessons outside, and a members community for practice, discussions, and Zoom meetings.",
    body: "We’re welcoming our first cohort of learners. Explore the free courses, then apply to join the members area. Accepted members get access to discussion groups, community announcements, and live practice sessions. If you’re motivated and ready to speak more, we’d love to meet you.",
  },
  {
    slug: "free-courses-to-start",
    title: "Three free courses to start today",
    date: "2026-08-12",
    summary: "No account needed. Build confidence with Everyday English, Clear Speech, and Work-Ready Writing.",
    body: "Not sure where to begin? Start with a short free course. Each one is practical, friendly, and designed for real life — then apply when you’re ready for the full community experience with groups and live meetings.",
  },
  {
    slug: "why-acceptance-matters",
    title: "Why we review every application",
    date: "2026-08-08",
    summary: "A smaller, intentional community means better conversations and kinder practice spaces.",
    body: "Kasbah English is not a giant open chat. We review applications so members share a clear goal: improve English through respectful practice. That helps discussions stay useful, meetings stay focused, and everyone feel safe to speak — even when they’re still learning.",
  },
];
