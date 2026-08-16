export type Localized<T> = { ar: T; en: T };

export type NewsItem = {
  slug: string;
  date: string;
  image: string;
  imageAlt: Localized<string>;
  title: Localized<string>;
  summary: Localized<string>;
  body: Localized<string>;
};

export const newsItems: NewsItem[] = [
  {
    slug: "welcome-founding-members",
    date: "2026-08-15",
    image: "/images/news/founding.png",
    imageAlt: {
      ar: "متعلمون يبدأون رحلتهم مع مجتمع قصبة إنجليش",
      en: "Learners starting their journey with the Kasbah English community",
    },
    title: {
      ar: "التسجيل مفتوح لأول الأعضاء",
      en: "Applications are open for our first members",
    },
    summary: {
      ar: "قصبة إنجليش انطلقت: دروس مجانية للجميع، ومجتمع منظم للأعضاء مع نقاشات وتدريب ولقاءات عبر زوم.",
      en: "Kasbah English is live: free lessons for everyone, and an organized members community with discussions, practice, and Zoom meetings.",
    },
    body: {
      ar: "نستقبل أول مجموعة من المتعلمين في الخليج. ابدأ بالدروس المجانية أو اختبار المستوى، ثم سجّل للانضمام إلى مساحة الأعضاء. بعد القبول تدخل إلى مجموعات النقاش واللقاءات المباشرة. إذا كنت تريد التحدّث أكثر بانتظام، فمرحبًا بك.",
      en: "We’re welcoming our first group of learners across the Gulf. Start with free lessons or the level test, then apply to join the members area. After acceptance you enter discussion groups and live sessions. If you want to speak more consistently, you’re welcome.",
    },
  },
  {
    slug: "free-courses-to-start",
    date: "2026-08-12",
    image: "/images/news/free-lessons.png",
    imageAlt: {
      ar: "مكتب دراسة مع أدوات للتدرّب على الإنجليزية",
      en: "A study desk with tools for practicing English",
    },
    title: {
      ar: "ثلاثة دروس مجانية للبدء اليوم",
      en: "Three free courses to start today",
    },
    summary: {
      ar: "بدون حساب. الإنجليزية اليومية، النطق الواضح، وكتابة جاهزة للعمل.",
      en: "No account needed. Everyday English, Clear Speech, and Work-Ready Writing.",
    },
    body: {
      ar: "إذا لم تعرف من أين تبدأ، اختر درسًا مجانيًا قصيرًا. كل درس عملي ومصمم للحياة والعمل. وعندما تكون مستعدًا للتدريب المباشر مع مجتمع، سجّل للانضمام.",
      en: "If you’re not sure where to begin, pick a short free course. Each one is practical and built for real life and work. When you’re ready for live practice with a community, apply to join.",
    },
  },
  {
    slug: "why-acceptance-matters",
    date: "2026-08-08",
    image: "/images/news/community.png",
    imageAlt: {
      ar: "مجموعة صغيرة تتدرّب على المحادثة باحترام",
      en: "A small group practicing conversation respectfully",
    },
    title: {
      ar: "لماذا نراجع كل طلب تسجيل",
      en: "Why we review every application",
    },
    summary: {
      ar: "مجتمع أصغر وواضح الهدف يعني محادثات أفضل ومساحة تدريب أكثر أمانًا.",
      en: "A smaller community with a clear goal means better conversations and a safer practice space.",
    },
    body: {
      ar: "قصبة إنجليش ليست دردشة مفتوحة بلا حدود. نراجع الطلبات حتى يشارك الأعضاء هدفًا واحدًا: تحسين الإنجليزية عبر تدريب محترم. هكذا تبقى النقاشات مفيدة، واللقاءات مركّزة، ويشعر الجميع بالأمان وهم يتحدّثون.",
      en: "Kasbah English is not an unlimited open chat. We review applications so members share one goal: improve English through respectful practice. That keeps discussions useful, meetings focused, and speaking safe for everyone.",
    },
  },
];
