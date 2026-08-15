export type Localized<T> = { ar: T; en: T };

export type NewsItem = {
  slug: string;
  date: string;
  title: Localized<string>;
  summary: Localized<string>;
  body: Localized<string>;
};

export const newsItems: NewsItem[] = [
  {
    slug: "welcome-founding-members",
    date: "2026-08-15",
    title: {
      ar: "التسجيل مفتوح للأعضاء المؤسسين",
      en: "Applications are open for founding members",
    },
    summary: {
      ar: "قصبة إنجليش انطلقت — بدروس مجانية للجميع، ومجتمع للأعضاء فيه نقاشات وتدريب ولقاءات عبر زوم.",
      en: "Kasbah English is live — with free public lessons outside, and a members community for practice, discussions, and Zoom meetings.",
    },
    body: {
      ar: "نستقبل أول مجموعة من المتعلمين. استكشف الدروس المجانية، ثم سجّل للدخول إلى مساحة الأعضاء. يحصل الأعضاء المقبولون على مجموعات نقاش وإعلانات المجتمع وحصص تدريب مباشرة. إذا كنت متحمسًا وترغب في التحدّث أكثر، فمرحبًا بك.",
      en: "We’re welcoming our first cohort of learners. Explore the free courses, then apply to join the members area. Accepted members get access to discussion groups, community announcements, and live practice sessions. If you’re motivated and ready to speak more, we’d love to meet you.",
    },
  },
  {
    slug: "free-courses-to-start",
    date: "2026-08-12",
    title: {
      ar: "ثلاثة دروس مجانية يمكنك البدء بها اليوم",
      en: "Three free courses to start today",
    },
    summary: {
      ar: "لا حاجة إلى حساب. ابنِ ثقتك مع الإنجليزية اليومية والنطق الواضح والكتابة للعمل.",
      en: "No account needed. Build confidence with Everyday English, Clear Speech, and Work-Ready Writing.",
    },
    body: {
      ar: "لا تعرف من أين تبدأ؟ ابدأ بدرس مجاني قصير. كل درس عملي وودود ومصمم للحياة الواقعية — ثم سجّل عندما تكون مستعدًا لتجربة المجتمع الكاملة مع المجموعات واللقاءات المباشرة.",
      en: "Not sure where to begin? Start with a short free course. Each one is practical, friendly, and designed for real life — then apply when you’re ready for the full community experience with groups and live meetings.",
    },
  },
  {
    slug: "why-acceptance-matters",
    date: "2026-08-08",
    title: {
      ar: "لماذا نراجع كل طلب تسجيل",
      en: "Why we review every application",
    },
    summary: {
      ar: "مجتمع أصغر ومقصود يعني محادثات أفضل ومساحات تدريب ألطف.",
      en: "A smaller, intentional community means better conversations and kinder practice spaces.",
    },
    body: {
      ar: "قصبة إنجليش ليست دردشة مفتوحة كبيرة. نراجع الطلبات ليشارك الأعضاء هدفًا واضحًا: تحسين الإنجليزية عبر تدريب محترم. هكذا تبقى النقاشات مفيدة، واللقاءات مركّزة، ويشعر الجميع بالأمان وهم يتحاورون — حتى وهم ما زالوا يتعلمون.",
      en: "Kasbah English is not a giant open chat. We review applications so members share a clear goal: improve English through respectful practice. That helps discussions stay useful, meetings stay focused, and everyone feel safe to speak — even when they’re still learning.",
    },
  },
];
