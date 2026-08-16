import type { Localized } from "@/data/news";

export type FreeLessonModule = {
  title: Localized<string>;
  minutes: Localized<string>;
  body: Localized<string[]>;
  phrases: Localized<string[]>;
  practice: Localized<string>;
};

export type FreeCourse = {
  slug: string;
  image: string;
  imageAlt: Localized<string>;
  title: Localized<string>;
  level: Localized<string>;
  duration: Localized<string>;
  summary: Localized<string>;
  lessons: Localized<string[]>;
  modules: FreeLessonModule[];
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
    modules: [
      {
        title: { ar: "سلّم وقدّم نفسك", en: "Say hello and introduce yourself" },
        minutes: { ar: "٨ دقائق", en: "8 minutes" },
        body: {
          ar: [
            "ابدأ بتحية بسيطة ثم اسمك. لا تحتاج جمل طويلة.",
            "بعد الاسم، أضف جملة واحدة عن عملك أو دراستك.",
          ],
          en: [
            "Start with a simple greeting, then your name. You do not need long sentences.",
            "After your name, add one line about your work or studies.",
          ],
        },
        phrases: {
          ar: ["Hi, I’m Sara.", "Nice to meet you.", "I work in marketing.", "I’m a student in Riyadh."],
          en: ["Hi, I’m Sara.", "Nice to meet you.", "I work in marketing.", "I’m a student in Riyadh."],
        },
        practice: {
          ar: "سجّل صوتًا لمدة ٣٠ ثانية: اسمك + مدينتك + جملة عن عملك أو دراستك.",
          en: "Record yourself for 30 seconds: your name + city + one line about work or studies.",
        },
      },
      {
        title: { ar: "تحدّث عن يومك", en: "Talk about your day" },
        minutes: { ar: "١٠ دقائق", en: "10 minutes" },
        body: {
          ar: [
            "استخدم زمن المضارع البسيط للروتين: I wake up, I go to work, I finish at…",
            "اختر ٣ أنشطة فقط من يومك واذكرها بترتيب.",
          ],
          en: [
            "Use present simple for routines: I wake up, I go to work, I finish at…",
            "Choose only three activities from your day and say them in order.",
          ],
        },
        phrases: {
          ar: ["I usually wake up at 6.", "Then I check my messages.", "In the evening I relax with my family."],
          en: ["I usually wake up at 6.", "Then I check my messages.", "In the evening I relax with my family."],
        },
        practice: {
          ar: "اكتب ٥ جمل عن روتينك اليومي، ثم اقرأها بصوت عالٍ مرتين.",
          en: "Write 5 sentences about your daily routine, then read them aloud twice.",
        },
      },
      {
        title: { ar: "اطلب المساعدة بأدب", en: "Ask for help politely" },
        minutes: { ar: "٨ دقائق", en: "8 minutes" },
        body: {
          ar: [
            "الجمل المهذبة تبدأ غالبًا بـ Could you… أو Would you mind…",
            "اشكر الشخص دائمًا بعد الجواب، حتى لو كان الجواب لا.",
          ],
          en: [
            "Polite requests often start with Could you… or Would you mind…",
            "Always thank the person after the answer, even if the answer is no.",
          ],
        },
        phrases: {
          ar: ["Could you help me, please?", "Sorry, can you repeat that?", "Thanks a lot — that helps."],
          en: ["Could you help me, please?", "Sorry, can you repeat that?", "Thanks a lot — that helps."],
        },
        practice: {
          ar: "تخيّل أنك في مكتب أو متجر. اطلب المساعدة بجملتين مهذبتين.",
          en: "Imagine you are in an office or shop. Ask for help with two polite sentences.",
        },
      },
      {
        title: { ar: "رتّب موعدًا", en: "Make a simple plan" },
        minutes: { ar: "١٠ دقائق", en: "10 minutes" },
        body: {
          ar: [
            "للمواعيد تحتاج: الوقت + المكان + تأكيد بسيط.",
            "إذا لم يناسبك الوقت، اقترح بديلًا واحدًا واضحًا.",
          ],
          en: [
            "Plans need: time + place + a simple confirmation.",
            "If the time does not work, offer one clear alternative.",
          ],
        },
        phrases: {
          ar: ["Are you free on Thursday?", "Let’s meet at 7.", "Does that work for you?"],
          en: ["Are you free on Thursday?", "Let’s meet at 7.", "Does that work for you?"],
        },
        practice: {
          ar: "اقترح موعد قهوة مع صديق بالإنجليزية في ٤ جمل.",
          en: "Suggest a coffee plan with a friend in English in 4 sentences.",
        },
      },
      {
        title: { ar: "تحدّي الثقة", en: "Confidence challenge" },
        minutes: { ar: "٧ دقائق", en: "7 minutes" },
        body: {
          ar: [
            "اجمع ما تعلّمته: تعريف + روتين + طلب مهذب + موعد.",
            "الهدف ليس الكمال — الهدف الكلام المستمر ٦٠ ثانية.",
          ],
          en: [
            "Combine what you learned: intro + routine + polite ask + plan.",
            "The goal is not perfection — it is speaking for 60 seconds without stopping.",
          ],
        },
        phrases: {
          ar: ["Let me introduce myself…", "In a normal day I…", "Could you…?", "Shall we…?"],
          en: ["Let me introduce myself…", "In a normal day I…", "Could you…?", "Shall we…?"],
        },
        practice: {
          ar: "تكلّم دقيقة واحدة بدون توقف عن نفسك ويومك وموعد هذا الأسبوع.",
          en: "Speak for one minute without stopping about yourself, your day, and a plan this week.",
        },
      },
    ],
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
    modules: [
      {
        title: { ar: "أصوات تغيّر المعنى", en: "Sounds that change meaning" },
        minutes: { ar: "٩ دقائق", en: "9 minutes" },
        body: {
          ar: [
            "ركّز على أزواج مثل ship/sheep و live/leave. الفرق الصغير يغيّر المعنى.",
            "كرّر ببطء أولًا، ثم بسرعة طبيعية.",
          ],
          en: [
            "Focus on pairs like ship/sheep and live/leave. A small difference changes meaning.",
            "Repeat slowly first, then at a natural speed.",
          ],
        },
        phrases: {
          ar: ["I live here.", "Please leave now.", "This is a ship.", "I see a sheep."],
          en: ["I live here.", "Please leave now.", "This is a ship.", "I see a sheep."],
        },
        practice: {
          ar: "اقرأ كل زوج ٣ مرات وسجّل نفسك. هل تسمع الفرق؟",
          en: "Read each pair 3 times and record yourself. Can you hear the difference?",
        },
      },
      {
        title: { ar: "نبر الكلمة", en: "Word stress" },
        minutes: { ar: "٨ دقائق", en: "8 minutes" },
        body: {
          ar: [
            "في الإنجليزية جزء واحد من الكلمة أقوى: PHOtograph، comPUter، inforMAtion.",
            "إذا وضعت النبر في المكان الخطأ قد يبدو كلامك غير واضح.",
          ],
          en: [
            "In English one part of the word is stronger: PHOtograph, comPUter, inforMAtion.",
            "Wrong stress can make you harder to understand.",
          ],
        },
        phrases: {
          ar: ["computer", "important", "tomorrow", "development"],
          en: ["computer", "important", "tomorrow", "development"],
        },
        practice: {
          ar: "صفّق مع المقطع القوي وأنت تقول كل كلمة.",
          en: "Clap on the strong syllable while you say each word.",
        },
      },
      {
        title: { ar: "ربط الكلمات", en: "Linking words" },
        minutes: { ar: "١٠ دقائق", en: "10 minutes" },
        body: {
          ar: [
            "المتحدّثون الأصليون يربطون الكلمات: pick it up ≈ pi-ki-tup.",
            "لا تفصل كل كلمة بقوة — اجعل الجملة تسري.",
          ],
          en: [
            "Native speakers link words: pick it up ≈ pi-ki-tup.",
            "Don’t separate every word hard — let the phrase flow.",
          ],
        },
        phrases: {
          ar: ["Can I help you?", "What do you think?", "I’ll call you later."],
          en: ["Can I help you?", "What do you think?", "I’ll call you later."],
        },
        practice: {
          ar: "قل كل عبارة ٥ مرات بسرعة طبيعية كأنك تتكلم مع صديق.",
          en: "Say each phrase 5 times at a natural speed, like talking to a friend.",
        },
      },
      {
        title: { ar: "جمل حقيقية", en: "Real sentences" },
        minutes: { ar: "٨ دقائق", en: "8 minutes" },
        body: {
          ar: [
            "طبّق الأصوات والنبر والربط على جمل تستعملها في العمل أو الدراسة.",
            "جملة واحدة واضحة أفضل من عشر جمل سريعة وغير مفهومة.",
          ],
          en: [
            "Apply sound, stress, and linking to sentences you use at work or study.",
            "One clear sentence is better than ten fast unclear ones.",
          ],
        },
        phrases: {
          ar: ["Could we meet tomorrow?", "I need more time, please.", "That sounds good to me."],
          en: ["Could we meet tomorrow?", "I need more time, please.", "That sounds good to me."],
        },
        practice: {
          ar: "اختر جملتين مهمتين لحياتك وكرّرهما حتى تشعر بالراحة.",
          en: "Pick two sentences that matter in your life and repeat until they feel comfortable.",
        },
      },
    ],
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
    modules: [
      {
        title: { ar: "عنوان الموضوع", en: "Subject lines" },
        minutes: { ar: "٧ دقائق", en: "7 minutes" },
        body: {
          ar: [
            "العنوان الجيد قصير ومحدد: ماذا تريد + متى إن لزم.",
            "تجنّب عناوين عامة مثل Hello أو Important.",
          ],
          en: [
            "A good subject is short and specific: what you need + when if needed.",
            "Avoid vague subjects like Hello or Important.",
          ],
        },
        phrases: {
          ar: ["Meeting request — Thursday 3pm", "Quick update on the project", "Please review by Monday"],
          en: ["Meeting request — Thursday 3pm", "Quick update on the project", "Please review by Monday"],
        },
        practice: {
          ar: "اكتب ٣ عناوين لبريد حقيقي من عملك أو دراستك.",
          en: "Write 3 subject lines for a real email from your work or studies.",
        },
      },
      {
        title: { ar: "طلبات ومتابعات", en: "Requests and follow-ups" },
        minutes: { ar: "١٠ دقائق", en: "10 minutes" },
        body: {
          ar: [
            "ابدأ بلطف، اطلب بوضوح، واقترح موعدًا إن احتجت ردًا.",
            "المتابعة بعد يومين طبيعية ومهنية — ليست إزعاجًا إذا كانت قصيرة.",
          ],
          en: [
            "Start kindly, ask clearly, and suggest a deadline if you need a reply.",
            "A short follow-up after two days is professional — not rude.",
          ],
        },
        phrases: {
          ar: [
            "I hope you’re well.",
            "Could you please send the file by Wednesday?",
            "Just following up on my previous email.",
          ],
          en: [
            "I hope you’re well.",
            "Could you please send the file by Wednesday?",
            "Just following up on my previous email.",
          ],
        },
        practice: {
          ar: "اكتب بريد طلب قصير (٤–٦ جمل) ثم متابعة من جملتين.",
          en: "Write a short request email (4–6 lines), then a 2-line follow-up.",
        },
      },
      {
        title: { ar: "تحديثات الفريق", en: "Team updates" },
        minutes: { ar: "٨ دقائق", en: "8 minutes" },
        body: {
          ar: [
            "التحديث الجيد: ما تم + ما التالي + هل تحتاج مساعدة؟",
            "استخدم نقاطًا قصيرة بدل فقرات طويلة.",
          ],
          en: [
            "A good update: what is done + what is next + do you need help?",
            "Use short bullets instead of long paragraphs.",
          ],
        },
        phrases: {
          ar: ["Done: …", "Next: …", "Blocked by: …", "Need from you: …"],
          en: ["Done: …", "Next: …", "Blocked by: …", "Need from you: …"],
        },
        practice: {
          ar: "اكتب تحديث مشروع بأربع نقاط فقط.",
          en: "Write a project update in only four bullets.",
        },
      },
      {
        title: { ar: "مراجعة دقيقتين", en: "2-minute edit checklist" },
        minutes: { ar: "٦ دقائق", en: "6 minutes" },
        body: {
          ar: [
            "قبل الإرسال: هل الطلب واضح؟ هل الاسم صحيح؟ هل النبرة مهذبة؟",
            "احذف الكلمات الزائدة. جملة أقصر أسهل للفهم.",
          ],
          en: [
            "Before send: Is the ask clear? Is the name correct? Is the tone polite?",
            "Cut extra words. Shorter sentences are easier to understand.",
          ],
        },
        phrases: {
          ar: ["Please let me know if this works.", "Happy to adjust the time.", "Thanks in advance."],
          en: ["Please let me know if this works.", "Happy to adjust the time.", "Thanks in advance."],
        },
        practice: {
          ar: "خذ بريدًا قديمًا لك وقصّره بنسبة ٣٠٪ مع الحفاظ على المعنى.",
          en: "Take an old email of yours and cut it by 30% without losing meaning.",
        },
      },
    ],
  },
];

export function getFreeCourseBySlug(slug: string) {
  return freeCourses.find((course) => course.slug === slug) ?? null;
}
