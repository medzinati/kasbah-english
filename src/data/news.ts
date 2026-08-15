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
      ar: "كنستقبل أول مجموعة من المتعلمين. استكشف الدروس المجانية، وبعدها سجّل باش تدخل مساحة الأعضاء. الأعضاء المقبولون كيحصلو على مجموعات نقاش، إعلانات المجتمع، وحصص تدريب مباشرة. إلا كنت متحمّس وبغيتي تتكلّم أكثر، مرحبا بيك.",
      en: "We’re welcoming our first cohort of learners. Explore the free courses, then apply to join the members area. Accepted members get access to discussion groups, community announcements, and live practice sessions. If you’re motivated and ready to speak more, we’d love to meet you.",
    },
  },
  {
    slug: "free-courses-to-start",
    date: "2026-08-12",
    title: {
      ar: "ثلاثة دروس مجانية تقدر تبدأ بيها اليوم",
      en: "Three free courses to start today",
    },
    summary: {
      ar: "بلا حساب. ابنِ ثقتك مع الإنجليزية اليومية، النطق الواضح، والكتابة للعمل.",
      en: "No account needed. Build confidence with Everyday English, Clear Speech, and Work-Ready Writing.",
    },
    body: {
      ar: "ما عارفش منين تبدا؟ ابدأ بدرس مجاني قصير. كل درس عملي، ودود، ومصمم للحياة الحقيقية — ومن بعد سجّل لما تكون مستعد لتجربة المجتمع الكاملة مع المجموعات واللقاءات المباشرة.",
      en: "Not sure where to begin? Start with a short free course. Each one is practical, friendly, and designed for real life — then apply when you’re ready for the full community experience with groups and live meetings.",
    },
  },
  {
    slug: "why-acceptance-matters",
    date: "2026-08-08",
    title: {
      ar: "علاش كنراجعو كل طلب تسجيل",
      en: "Why we review every application",
    },
    summary: {
      ar: "مجتمع أصغر ومقصود كيعني محادثات أفضل ومساحات تدريب ألطف.",
      en: "A smaller, intentional community means better conversations and kinder practice spaces.",
    },
    body: {
      ar: "قصبة إنجليش ماشي دردشة مفتوحة كبيرة. كنراجعو الطلبات باش الأعضاء يشاركو هدف واضح: تحسين الإنجليزية عبر تدريب محترم. هكذا النقاشات تبقى مفيدة، واللقاءات مركّزة، وكل واحد يحس بالأمان وهو كيتحاور — حتى وهو باقي كيتعلّم.",
      en: "Kasbah English is not a giant open chat. We review applications so members share a clear goal: improve English through respectful practice. That helps discussions stay useful, meetings stay focused, and everyone feel safe to speak — even when they’re still learning.",
    },
  },
];
