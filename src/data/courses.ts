import type { Localized } from "@/data/news";

export type FreeCourse = {
  slug: string;
  title: Localized<string>;
  level: Localized<string>;
  duration: Localized<string>;
  summary: Localized<string>;
  lessons: Localized<string[]>;
};

export const freeCourses: FreeCourse[] = [
  {
    slug: "everyday-english",
    title: { ar: "الإنجليزية اليومية للمبتدئين", en: "Everyday English Starter" },
    level: { ar: "مبتدئ", en: "Beginner" },
    duration: { ar: "٥ دروس قصيرة", en: "5 short lessons" },
    summary: {
      ar: "إنجليزية دافئة وعملية للحياة اليومية — تحيات، روتين، ومحادثات مهذبة تقدر تستعملها هاد الأسبوع.",
      en: "Warm, practical English for real life — greetings, daily routines, and polite conversations you can use this week.",
    },
    lessons: {
      ar: [
        "سلّم وقدّم راسك بسهولة",
        "حكي على نهارك بجمل بسيطة وطبيعية",
        "طلب المساعدة بأدب (وفهم الجواب)",
        "نظّم مواعيد: الأكل، الوقت، ولقا الأصدقاء",
        "تحدي كلام قصير باش تزيد الثقة",
      ],
      en: [
        "Say hello and introduce yourself with ease",
        "Talk about your day in simple, natural sentences",
        "Ask for help politely (and understand the answer)",
        "Make plans: food, time, and meeting friends",
        "A short speaking challenge to build confidence",
      ],
    },
  },
  {
    slug: "clear-speech",
    title: { ar: "أساسيات النطق الواضح", en: "Clear Speech Basics" },
    level: { ar: "مبتدئ–متوسط", en: "Beginner–Intermediate" },
    duration: { ar: "٤ دروس قصيرة", en: "4 short lessons" },
    summary: {
      ar: "عادات نطق صغيرة كتخلي الناس يفهموك من أول مرة — بلا ما تبان آلي.",
      en: "Small pronunciation habits that help people understand you the first time — without sounding robotic.",
    },
    lessons: {
      ar: [
        "الأصوات اللي كتبدّل المعنى أكثر",
        "نبر الكلمات باش تبان طبيعي",
        "ربط الكلمات بسلاسة في العبارات اليومية",
        "تمرين بجمل غادي تقولها فعلًا",
      ],
      en: [
        "The sounds that change meaning most",
        "Word stress that makes you sound natural",
        "Link words smoothly in everyday phrases",
        "Practice with sentences you’ll actually say",
      ],
    },
  },
  {
    slug: "work-ready-writing",
    title: { ar: "كتابة جاهزة للعمل", en: "Work-Ready Writing" },
    level: { ar: "متوسط", en: "Intermediate" },
    duration: { ar: "٤ دروس قصيرة", en: "4 short lessons" },
    summary: {
      ar: "اكتب إيميلات ورسائل مهنية، لطيفة، وواضحة — مثالية للعمل والدراسة.",
      en: "Write emails and messages that sound professional, kind, and clear — perfect for work and study.",
    },
    lessons: {
      ar: [
        "عناوين موضوع الناس كتفتحها",
        "طلبات مهذبة ومتابعات ودّية",
        "تحديثات قصيرة يفهمها الفريق بسرعة",
        "قائمة مراجعة في دقيقتين للوضوح",
      ],
      en: [
        "Subject lines people actually open",
        "Polite requests and friendly follow-ups",
        "Short updates your team can understand fast",
        "A 2-minute edit checklist for clarity",
      ],
    },
  },
];
