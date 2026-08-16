import type { Localized } from "@/data/news";

export type FreeCourse = {
  slug: string;
  image: string;
  imageAlt: Localized<string>;
  title: Localized<string>;
  level: Localized<string>;
  duration: Localized<string>;
  summary: Localized<string>;
  lessons: Localized<string[]>;
};

export const freeCourses: FreeCourse[] = [
  {
    slug: "everyday-english",
    image: "/images/courses/everyday.png",
    imageAlt: {
      ar: "متعلم يتدرّب على الإنجليزية اليومية",
      en: "A learner practicing everyday English",
    },
    title: { ar: "الإنجليزية اليومية للمبتدئين", en: "Everyday English Starter" },
    level: { ar: "مبتدئ", en: "Beginner" },
    duration: { ar: "٥ دروس قصيرة", en: "5 short lessons" },
    summary: {
      ar: "إنجليزية عملية للحياة اليومية: تحيات، روتين يومي، ومحادثات مهذبة تستعملها هذا الأسبوع.",
      en: "Practical English for daily life: greetings, routines, and polite conversations you can use this week.",
    },
    lessons: {
      ar: [
        "سلّم وقدّم نفسك بسهولة",
        "تحدّث عن يومك بجمل بسيطة وطبيعية",
        "اطلب المساعدة بأدب وافهم الجواب",
        "رتّب مواعيد: الطعام والوقت ولقاء الأصدقاء",
        "تحدٍّ قصير في الكلام لزيادة الثقة",
      ],
      en: [
        "Say hello and introduce yourself with ease",
        "Talk about your day in simple, natural sentences",
        "Ask for help politely and understand the answer",
        "Make plans: food, time, and meeting friends",
        "A short speaking challenge to build confidence",
      ],
    },
  },
  {
    slug: "clear-speech",
    image: "/images/courses/speech.png",
    imageAlt: {
      ar: "تدريب على النطق الواضح عبر الإنترنت",
      en: "Online practice for clear pronunciation",
    },
    title: { ar: "أساسيات النطق الواضح", en: "Clear Speech Basics" },
    level: { ar: "مبتدئ–متوسط", en: "Beginner–Intermediate" },
    duration: { ar: "٤ دروس قصيرة", en: "4 short lessons" },
    summary: {
      ar: "عادات نطق صغيرة تساعد الناس على فهمك من المرة الأولى، بصوت طبيعي غير آلي.",
      en: "Small pronunciation habits that help people understand you the first time, with a natural voice.",
    },
    lessons: {
      ar: [
        "الأصوات التي تغيّر المعنى أكثر من غيرها",
        "نبر الكلمات لتصبح طبيعيًا",
        "ربط الكلمات بسلاسة في العبارات اليومية",
        "تمرين بجمل ستقولها فعلًا",
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
    image: "/images/courses/writing.png",
    imageAlt: {
      ar: "كتابة رسائل مهنية واضحة للعمل",
      en: "Writing clear professional messages for work",
    },
    title: { ar: "كتابة جاهزة للعمل", en: "Work-Ready Writing" },
    level: { ar: "متوسط", en: "Intermediate" },
    duration: { ar: "٤ دروس قصيرة", en: "4 short lessons" },
    summary: {
      ar: "اكتب رسائل بريد ورسائل مهنية لطيفة وواضحة، مناسبة للعمل والدراسة في الخليج.",
      en: "Write emails and professional messages that sound kind and clear — useful for work and study in the Gulf.",
    },
    lessons: {
      ar: [
        "عناوين موضوع يفتحها الناس فعلًا",
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
