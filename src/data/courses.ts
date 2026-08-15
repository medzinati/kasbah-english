export type FreeCourse = {
  slug: string;
  title: string;
  level: string;
  duration: string;
  summary: string;
  lessons: string[];
};

export const freeCourses: FreeCourse[] = [
  {
    slug: "everyday-english",
    title: "Everyday English Starter",
    level: "Beginner",
    duration: "5 short lessons",
    summary:
      "Warm, practical English for real life — greetings, daily routines, and polite conversations you can use this week.",
    lessons: [
      "Say hello and introduce yourself with ease",
      "Talk about your day in simple, natural sentences",
      "Ask for help politely (and understand the answer)",
      "Make plans: food, time, and meeting friends",
      "A short speaking challenge to build confidence",
    ],
  },
  {
    slug: "clear-speech",
    title: "Clear Speech Basics",
    level: "Beginner–Intermediate",
    duration: "4 short lessons",
    summary: "Small pronunciation habits that help people understand you the first time — without sounding robotic.",
    lessons: [
      "The sounds that change meaning most",
      "Word stress that makes you sound natural",
      "Link words smoothly in everyday phrases",
      "Practice with sentences you’ll actually say",
    ],
  },
  {
    slug: "work-ready-writing",
    title: "Work-Ready Writing",
    level: "Intermediate",
    duration: "4 short lessons",
    summary: "Write emails and messages that sound professional, kind, and clear — perfect for work and study.",
    lessons: [
      "Subject lines people actually open",
      "Polite requests and friendly follow-ups",
      "Short updates your team can understand fast",
      "A 2-minute edit checklist for clarity",
    ],
  },
];
