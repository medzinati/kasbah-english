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
    summary: "Greetings, introductions, and phrases you’ll use in real Moroccan and international life.",
    lessons: [
      "Meet & greet with confidence",
      "Talk about your day",
      "Ask for help politely",
      "Order food & make plans",
      "Mini speaking challenge",
    ],
  },
  {
    slug: "clear-speech",
    title: "Clear Speech Basics",
    level: "Beginner–Intermediate",
    duration: "4 short lessons",
    summary: "Simple pronunciation habits so people understand you the first time.",
    lessons: [
      "Sounds that matter most",
      "Word stress that sounds natural",
      "Linking words smoothly",
      "Practice with real sentences",
    ],
  },
  {
    slug: "work-ready-writing",
    title: "Work-Ready Writing",
    level: "Intermediate",
    duration: "4 short lessons",
    summary: "Emails and messages that sound professional without sounding stiff.",
    lessons: [
      "Subject lines that get opened",
      "Polite requests & follow-ups",
      "Short updates for teams",
      "Edit for clarity in 2 minutes",
    ],
  },
];
