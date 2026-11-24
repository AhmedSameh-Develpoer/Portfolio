import { useEffect, useMemo, useReducer, useRef, useState, type CSSProperties } from "react";
import { fetchDriveWork, mergeDriveWork, type DriveSyncResult } from "./drive-sync";
import {
  clientGroups,
  contact,
  driveSyncEndpoint,
  portfolioWork,
  services,
  showreelVideo,
  type PortfolioItem,
  type WorkCategory,
} from "./portfolio-data";

type Language = "en" | "ar";
type WorkFilter = WorkCategory | "All";

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

type AppState = {
  activeCategory: WorkFilter;
  isLanguageTransitioning: boolean;
  language: Language;
  workPage: number;
};

type AppAction =
  | { type: "begin-language-transition" }
  | { type: "finish-language-transition" }
  | { type: "set-language"; language: Language }
  | { type: "set-work-category"; category: WorkFilter }
  | { type: "set-work-page"; page: number };

function getInitialLanguage(): Language {
  return window.localStorage.getItem("portfolio-language") === "ar" ? "ar" : "en";
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "begin-language-transition":
      return { ...state, isLanguageTransitioning: true };
    case "finish-language-transition":
      return { ...state, isLanguageTransitioning: false };
    case "set-language":
      return { ...state, language: action.language };
    case "set-work-category":
      return { ...state, activeCategory: action.category, workPage: 0 };
    case "set-work-page":
      return { ...state, workPage: Math.max(0, action.page) };
    default:
      return state;
  }
}

function createInitialState(): AppState {
  return {
    activeCategory: "All",
    isLanguageTransitioning: false,
    language: getInitialLanguage(),
    workPage: 0,
  };
}

const categoryOrder: WorkCategory[] = [
  "Shorts",
  "AI Videos",
  "Commercials",
  "Real Estate",
  "Gaming",
  "Vlogs",
];
const initialWorkCount = 6;

const categoryLabels: Record<WorkFilter, { en: string; ar: string }> = {
  All: { en: "All", ar: "الكل" },
  Shorts: { en: "Shorts", ar: "شورتس" },
  "AI Videos": { en: "AI Videos", ar: "فيديوهات AI" },
  Commercials: { en: "Commercials", ar: "إعلانات" },
  "Real Estate": { en: "Real Estate", ar: "عقارات" },
  Gaming: { en: "Gaming", ar: "ألعاب" },
  Vlogs: { en: "Vlogs", ar: "فلوجات" },
};

const copy = {
  en: {
    nav: ["Home", "Work", "Services", "Experience", "Clients", "Tools", "Contact"],
    switchLabel: "العربية",
    focus: ["YouTubers", "Full-time roles", "Commercials", "Real Estate", "Gaming"],
    eyebrow: "Short-form, Commercials & AI-ready edits",
    heroTitle: "Video Editor",
    role: "Short-Form, Commercial & AI Motion Video Editor",
    heroText:
      "I shape raw footage into fast, polished edits that hook early, keep the pace tight, and feel ready for creators, brands, real estate, gaming, and AI-led campaigns.",
    primary: "Contact Me",
    cv: "Download CV",
    portfolio: "View Full Portfolio",
    featured: "Featured Work",
    selected: "A curated space for my strongest edits",
    filterLabel: "Choose category",
    showMore: "Show more work",
    showLess: "Show less",
    previousPage: "Previous",
    nextPage: "Next",
    pageLabel: "Page",
    loadVideo: "Load video",
    videoSlot: "Ready for a YouTube link",
    workflow: "Editing Method",
    workflowTitle: "From raw clips to a finished story",
    direction: "Creative Direction",
    directionTitle: "Edits shaped for the hook, the brand, and the viewer.",
    directionText:
      "This portfolio is built around what clients and hiring teams actually look for: clear rhythm, clean delivery, platform awareness, and a final cut that feels intentional.",
    timeline: "Experience Timeline",
    timelineTitle: "Professional editing background",
    ready: "Have footage that needs a stronger cut?",
    together: "Let’s build the version people finish watching",
    tools: "Tools & Skills",
    services: "Services",
    whatEdit: "Formats I edit",
    experience: "Experience",
    clients: "Clients",
    metrics: ["Years Experience", "Projects Completed", "Happy Clients"],
    experienceNote:
      "Editing for creators, brands, real estate, gaming and AI videos, now with code-driven motion graphics.",
    extraService: "Color correction & motion graphics",
    contactText:
      "Available for full-time video editing roles and selected collaborations with creators, brands, and commercial teams.",
    process: [
      {
        title: "Hook & structure",
        text: "I define the opening beat, remove dead space, and give the edit a clear direction before the detailed polish starts.",
      },
      {
        title: "Pacing & flow",
        text: "Cuts, zooms, subtitles, b-roll, and timing are shaped around retention, clarity, and the platform the video is made for.",
      },
      {
        title: "Sound & finishing",
        text: "Dialogue, music, impacts, transitions, color, and motion details are refined until the cut feels clean and deliberate.",
      },
      {
        title: "Platform-ready delivery",
        text: "Final exports are prepared around the platform, brand style, and feedback notes so the video is ready to publish.",
      },
    ],
    strengths: [
      ["Shorts / Reels", "Strong openings, captions, pacing, and watchable rhythm"],
      ["Commercials", "Clean brand edits with sound, product clarity, and polished delivery"],
      ["AI Video", "Generated scenes shaped into coherent, presentable videos"],
      ["Gaming", "Highlights, review pacing, humor beats, and creator energy"],
    ],
    // [label, title, text, dates] — kept in step with the CV (cv/ahmed-sameh-cv.html).
    timelineItems: [
      [
        "Real Estate Marketing",
        "EMG Group Developments",
        "Edited a recurring series of real estate Reels and the Sun West Mall campaign, mixing AI-generated scenes with project footage.",
        "Jan 2026 – Sep 2026",
      ],
      [
        "Real Estate Marketing",
        "Upwest Group",
        "Edited short-form property videos for the developer's social channels, cut for quick viewing and clear project messaging.",
        "Jan 2026 – Sep 2026",
      ],
      [
        "Social Media & Creators",
        "Ali Al5baz (Ali Q8) & creators",
        "53 edits for Ali Al5baz (vlogs, reviews, food) and 44 for Beef Q8, plus HeroQ8, Kassar Reviews and Xenon Team, and AI commercials for Van Tech AC, Alnur Air and Nur AC.",
        "2022 – Present",
      ],
      [
        "AI Motion Design",
        "Independent projects",
        "Code-driven motion graphics in Remotion and HyperFrames: Ibn Sina, The Dollar's Journey, a Joi Gaming intro, Mirror City and a Spider-Noir-style opener.",
        "Nov 2026 – Present",
      ],
    ],
  },
  ar: {
    nav: ["الرئيسية", "الأعمال", "الخدمات", "الخبرة", "العملاء", "الأدوات", "تواصل"],
    switchLabel: "English",
    focus: ["يوتيوبرز", "وظائف ثابتة", "إعلانات", "عقارات", "ألعاب"],
    eyebrow: "شورت فورم وإعلانات",
    heroTitle: "مونتير",
    role: "مونتير فيديوهات قصيرة وإعلانات",
    heroText:
      "أساعد صناع المحتوى والعلامات التجارية بفيديوهات سريعة وجذابة وجاهزة للنشر على المنصات.",
    primary: "تواصل معي",
    cv: "تحميل السيرة الذاتية",
    portfolio: "مشاهدة البورتفوليو",
    featured: "أعمال مختارة",
    selected: "أماكن جاهزة لعرض الفيديوهات",
    filterLabel: "اختار التصنيف",
    showMore: "عرض أعمال أكثر",
    showLess: "عرض أقل",
    previousPage: "السابق",
    nextPage: "التالي",
    pageLabel: "صفحة",
    loadVideo: "تشغيل الفيديو",
    videoSlot: "مكان رابط YouTube",
    workflow: "طريقة العمل",
    workflowTitle: "من الفيديو الخام إلى نسخة نهائية نظيفة",
    direction: "اتجاه المونتاج",
    directionTitle: "مبني لزيادة المشاهدة والوضوح وثقة البراند.",
    directionText:
      "الصفحة مجهزة للتقديم على وظائف أو عرض شغلك للعملاء، لذلك التركيز هنا على النتيجة: جذب الانتباه، وضوح الرسالة، سرعة التسليم، وثبات الجودة.",
    timeline: "خط زمني للخبرة",
    timelineTitle: "خلفية مهنية في المونتاج",
    ready: "جاهز نعمل حاجة قوية؟",
    together: "خلينا نشتغل مع بعض",
    tools: "الأدوات والمهارات",
    services: "الخدمات",
    whatEdit: "أنواع الشغل",
    experience: "الخبرة",
    clients: "العملاء",
    metrics: ["سنوات خبرة", "مشروع مكتمل", "عميل سعيد"],
    experienceNote:
      "مونتاج لصناع محتوى وبراندات وعقارات وألعاب وفيديوهات AI ومحتوى سوشيال تجاري.",
    extraService: "تصحيح ألوان وموشن جرافيك",
    contactText:
      "متاح للتقديم على وظائف مونتاج فيديو والعمل بشكل احترافي مع صناع المحتوى والعلامات التجارية.",
    process: [
      {
        title: "الهوك والبناء",
        text: "أرتب أول ثواني في الفيديو، أشيل الفراغات، وأبني ريتم واضح قبل الدخول في التفاصيل.",
      },
      {
        title: "الإيقاع والقصة",
        text: "القصات، الزووم، الترجمة، والـ b-roll بتتظبط حسب المنصة وهدف الفيديو.",
      },
      {
        title: "الصوت واللمسة النهائية",
        text: "تنظيف الحوار، الموسيقى، المؤثرات، الانتقالات، اللون، وتفاصيل الحركة لنسخة نهائية قوية.",
      },
      {
        title: "تسليم جاهز",
        text: "تصدير مناسب للمنصة والبراند وملاحظات العميل بدون تعطيل سير الشغل.",
      },
    ],
    strengths: [
      ["Shorts / Reels", "هوكات سريعة، ترجمة، إيقاع قوي، وبناء واضح"],
      ["Commercials", "مونتاج مناسب للبراند، صوت نظيف، ووضوح للمنتج"],
      ["AI Video", "أفكار ومشاهد مولدة وتجميع نهائي احترافي"],
      ["Gaming", "هايلايت، لقطات كوميدية، مراجعات، وريتم صناع محتوى"],
    ],
    timelineItems: [
      [
        "تسويق عقاري",
        "EMG Group Developments",
        "مونتاج Reels قصيرة لحملات عقارية مع تركيز على الإيقاع والصوت والوضوح والهوية.",
      ],
      [
        "محتوى سوشيال ميديا",
        "Upwest Group",
        "تجهيز فيديوهات مناسبة للمنصات القصيرة ومصممة لجذب المشاهد وتسليم نظيف.",
      ],
      [
        "تعاونات فريلانس",
        "صناع محتوى وصفحات مراجعات",
        "تنفيذ مونتاج لصناع محتوى، ترجمة، تعديلات عملاء، مراجعات، ألعاب، وفيديوهات تجارية.",
      ],
    ],
  },
} as const;

const displayCategoryLabels: Record<WorkFilter, { en: string; ar: string }> = {
  All: { en: "All", ar: "الكل" },
  Shorts: { en: "Shorts", ar: "شورتس" },
  "AI Videos": { en: "AI Videos", ar: "فيديوهات AI" },
  Commercials: { en: "Commercials", ar: "إعلانات" },
  "Real Estate": { en: "Real Estate", ar: "عقارات" },
  Gaming: { en: "Gaming", ar: "ألعاب" },
  Vlogs: { en: "Vlogs", ar: "فلوجات" },
};

const portfolioCopy = {
  ...copy,
  ar: {
    ...copy.ar,
    nav: ["الرئيسية", "الأعمال", "الخدمات", "الخبرة", "العملاء", "الأدوات", "تواصل"],
    switchLabel: "English",
    focus: ["يوتيوبرز", "وظائف ثابتة", "إعلانات", "عقارات", "ألعاب"],
    eyebrow: "شورت فورم | إعلانات | محتوى AI",
    heroTitle: "مونتير",
    role: "مونتير فيديوهات قصيرة وإعلانات وموشن بالـ AI",
    heroText:
      "أحوّل اللقطات الخام إلى فيديوهات تشد الانتباه من أول ثانية: إيقاع سريع، قصة واضحة، كابشن مضبوط، وتسليم جاهز للنشر.",
    primary: "تواصل معي",
    cv: "تحميل السيرة الذاتية",
    portfolio: "مشاهدة الأعمال",
    featured: "أعمال مختارة",
    selected: "مساحة جاهزة لعرض أقوى أعمالي",
    filterLabel: "اختر نوع العمل",
    showMore: "عرض أعمال أكثر",
    showLess: "عرض أقل",
    loadVideo: "تشغيل الفيديو",
    videoSlot: "جاهز لإضافة رابط YouTube",
    workflow: "منهجية المونتاج",
    workflowTitle: "من لقطات خام إلى فيديو له إيقاع وهدف",
    direction: "الاتجاه الإبداعي",
    directionTitle: "مونتاج يخدم الهوك، ويحافظ على هوية البراند، ويشد المشاهد للنهاية.",
    directionText:
      "الصفحة مبنية على ما يهم العميل أو مسؤول التوظيف: إيقاع واضح، تسليم نظيف، فهم للمنصة، ونسخة نهائية تبدو مقصودة وليست مجرد قص وتجميع.",
    timeline: "خط الخبرة",
    timelineTitle: "خلفية عملية في أكثر من نوع محتوى",
    ready: "عندك لقطات محتاجة مونتاج أقوى؟",
    together: "خلّينا نطلع نسخة الناس تكملها للنهاية",
    tools: "الأدوات والمهارات",
    services: "الخدمات",
    whatEdit: "أنواع المحتوى اللي بشتغل عليها",
    experience: "الخبرة",
    clients: "العملاء",
    metrics: ["سنين خبرة", "مشروع مكتمل", "عميل"],
    experienceNote:
      "مونتاج لصنّاع محتوى وبراندات وعقارات وألعاب وفيديوهات AI، ودلوقتي كمان موشن جرافيك بالكود.",
    extraService: "تصحيح ألوان وموشن جرافيك",
    contactText:
      "متاح لوظائف مونتاج فيديو بدوام كامل، ولتعاونات مختارة مع صنّاع المحتوى والفرق التجارية.",
    process: [
      {
        title: "الهوك والبناء",
        text: "أحدد ضربة البداية، أحذف الفراغات، وأبني اتجاه واضح للفيديو قبل مرحلة الصقل والتفاصيل.",
      },
      {
        title: "الإيقاع والتدفق",
        text: "القصات، الزووم، الترجمة، والـ b-roll تتظبط حسب المنصة، مدة الفيديو، وطريقة استهلاك الجمهور للمحتوى.",
      },
      {
        title: "الصوت والتشطيب",
        text: "تنظيف الحوار، الموسيقى، المؤثرات، الانتقالات، اللون، وتفاصيل الحركة لنسخة نهائية نضيفة ومتماسكة.",
      },
      {
        title: "تسليم جاهز للنشر",
        text: "التصدير بيكون مناسب للمنصة، أسلوب البراند، وملاحظات العميل عشان الفيديو يبقى جاهز للاستخدام مباشرة.",
      },
    ],
    strengths: [
      ["Shorts / Reels", "افتتاحية قوية، ترجمة واضحة، إيقاع سريع، وبناء يحافظ على المشاهدة"],
      ["Commercials", "مونتاج نظيف للبراند مع صوت مضبوط، وضوح للمنتج، وتسليم احترافي"],
      ["AI Video", "تحويل المشاهد المولدة إلى فيديو مفهوم، مترابط، وقابل للعرض"],
      ["Gaming", "هايلايتس، مراجعات، لقطات كوميدية، وريتم مناسب لصنّاع محتوى الألعاب"],
    ],
    timelineItems: [
      [
        "تسويق عقاري",
        "EMG Group Developments",
        "سلسلة ريلز عقارية وحملة Sun West Mall، بدمج مشاهد مولّدة بالـ AI مع لقطات المشروع.",
        "يناير 2026 – سبتمبر 2026",
      ],
      [
        "تسويق عقاري",
        "Upwest Group",
        "مونتاج فيديوهات عقارية قصيرة لصفحات الشركة، بإيقاع سريع ورسالة واضحة عن كل مشروع.",
        "يناير 2026 – سبتمبر 2026",
      ],
      [
        "سوشيال ميديا وصنّاع محتوى",
        "Ali Al5baz (Ali Q8) وصنّاع محتوى",
        // Keep Arabic "و" attached to an Arabic word: next to Latin text or digits
        // it stands alone and reads like a "g".
        "53 فيديو لـ Ali Al5baz (فلوجات، مراجعات، أكل)، وكمان 44 فيديو لـ Beef Q8. ومعاهم HeroQ8، Kassar Reviews، Xenon Team، وإعلانات AI لـ Van Tech AC، Alnur Air، Nur AC.",
        "2022 – الآن",
      ],
      [
        "موشن بالـ AI",
        "مشاريع شخصية",
        "موشن جرافيك بالكود في Remotion وفي HyperFrames: ابن سينا، رحلة الدولار، انترو Joi Gaming، Mirror City، وافتتاحية بستايل Spider Noir.",
        "نوفمبر 2026 – الآن",
      ],
    ],
  },
} as const;

const workPresentation: Record<
  WorkCategory,
  {
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    role: string;
  }
> = {
  Shorts: {
    title: "Short-form edits",
    titleAr: "مونتاج شورت فورم",
    description: "Fast, sharp edits built for hooks, retention, captions, and clean platform delivery.",
    descriptionAr: "فيديوهات قصيرة بإيقاع سريع، افتتاحية قوية، ترجمة واضحة، وتسليم جاهز للنشر.",
    role: "Hooks, pacing, captions, sound",
  },
  "AI Videos": {
    title: "AI-assisted videos",
    titleAr: "فيديوهات بالذكاء الاصطناعي",
    description: "Generated scenes shaped into polished edits with structure, rhythm, and a clear message.",
    descriptionAr: "تحويل المشاهد المولدة إلى فيديو مترابط بإيقاع واضح ورسالة مفهومة.",
    role: "Concept, AI visuals, assembly, edit",
  },
  Commercials: {
    title: "Commercial edits",
    titleAr: "مونتاج إعلانات",
    description: "Brand-focused edits for campaigns, products, offers, and social ads that need clarity.",
    descriptionAr: "مونتاج مناسب للبراندات، المنتجات، الحملات، والإعلانات القصيرة بوضوح وتسليم نظيف.",
    role: "Brand pacing, product clarity, sound",
  },
  "Real Estate": {
    title: "Real estate campaigns",
    titleAr: "حملات عقارية",
    description: "Property videos shaped around flow, music, visual clarity, and a premium first impression.",
    descriptionAr: "فيديوهات عقارية مبنية على وضوح المكان، الإيقاع، الموسيقى، والانطباع الأول.",
    role: "Property flow, pacing, color, titles",
  },
  Gaming: {
    title: "Gaming content",
    titleAr: "محتوى ألعاب",
    description: "Highlights, reviews, creator clips, and fast-paced edits with rhythm and entertainment value.",
    descriptionAr: "هايلايتس، مراجعات، ولقطات لصنّاع محتوى الألعاب بريتم سريع وطابع ممتع.",
    role: "Highlights, memes, subtitles, retention",
  },
  Vlogs: {
    title: "Vlogs & creator stories",
    titleAr: "فلوجات وقصص صناع المحتوى",
    description: "Creator videos shaped with story flow, clean pacing, music, subtitles, and natural rhythm.",
    descriptionAr: "فلوجات وفيديوهات يوتيوب مبنية على قصة، إيقاع طبيعي، موسيقى، وترجمة نظيفة.",
    role: "Story flow, pacing, subtitles, music",
  },
};

const displayFeaturedWork = portfolioWork.map((item) => ({
  ...(item.youtubeUrl ? item : { ...item, ...workPresentation[item.category] }),
}));

function getWorkCategories(item: PortfolioItem) {
  return item.categories ?? [item.category];
}

function getAvailableWorkFilters(items: PortfolioItem[]): WorkFilter[] {
  return [
    "All",
    ...categoryOrder.filter((category) =>
      items.some((item) => getWorkCategories(item).includes(category)),
    ),
  ];
}

// ?admin (or ?admin=<REFRESH_TOKEN>) shows the Drive refresh button.
const adminToken = new URLSearchParams(window.location.search).get("admin");

const displayServices = services.map((service) => {
  const presentation = {
    "Short-form editing": {
      title: "Short-form editing",
      titleAr: "مونتاج فيديوهات قصيرة",
    },
    "Commercial content": {
      title: "Commercial & brand content",
      titleAr: "محتوى تجاري وإعلاني",
    },
    "Gaming and creator videos": {
      title: "Gaming & creator videos",
      titleAr: "ألعاب وصنّاع محتوى",
    },
    "AI video development": {
      title: "AI video development",
      titleAr: "تطوير فيديوهات بالذكاء الاصطناعي",
    },
  }[service.title];

  return {
    ...service,
    ...(presentation ?? {}),
  };
});

const displayClientGroups = clientGroups.map((group) => {
  const titleArByGroup: Record<string, string> = {
    "Real Estate & Brands": "عقارات وبراندات",
    "Creators & Commercial Pages": "صنّاع محتوى وصفحات تجارية",
    "Gaming Creators": "صنّاع محتوى ألعاب",
  };

  return {
    ...group,
    titleAr: titleArByGroup[group.title] ?? group.titleAr,
  };
});

function getYouTubeVideoId(url: string) {
  if (!url.trim()) {
    return "";
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtu.be") {
      return parsed.pathname.slice(1);
    }

    if (host.endsWith("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return videoId;
      }

      const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) {
        return shortsMatch[1];
      }

      const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch?.[1]) {
        return embedMatch[1];
      }
    }
  } catch {
    return "";
  }

  return "";
}

function getYouTubeEmbedUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
}

function getYouTubeThumbnailUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
}

function getDriveFileId(url: string) {
  if (!url.trim()) {
    return "";
  }

  try {
    const parsed = new URL(url);

    if (!parsed.hostname.includes("drive.google.com")) {
      return "";
    }

    const filePathMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    if (filePathMatch?.[1]) {
      return filePathMatch[1];
    }

    return parsed.searchParams.get("id") ?? "";
  } catch {
    return "";
  }
}

function getVideoEmbedUrl(url: string) {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(url);
  if (youtubeEmbedUrl) {
    return youtubeEmbedUrl;
  }

  const driveFileId = getDriveFileId(url);
  return driveFileId ? `https://drive.google.com/file/d/${driveFileId}/preview` : "";
}

function getVideoThumbnailUrl(url: string) {
  const youtubeThumbnailUrl = getYouTubeThumbnailUrl(url);
  if (youtubeThumbnailUrl) {
    return youtubeThumbnailUrl;
  }

  const driveFileId = getDriveFileId(url);
  return driveFileId ? `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1200` : "";
}

// YouTube thumbnails only: Drive thumbnails break when a file is not public.
const reelThumbnails = displayFeaturedWork
  .map((item) => getYouTubeThumbnailUrl(item.youtubeUrl))
  .filter(Boolean);

function LazyVideo({
  title,
  url,
  placeholderLabel,
  loadLabel,
  slotLabel,
}: {
  title: string;
  url: string;
  placeholderLabel: string;
  loadLabel: string;
  slotLabel: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  // Drive thumbnails fail when the file is not shared publicly.
  const [hasThumbnailError, setHasThumbnailError] = useState(false);
  const embedUrl = getVideoEmbedUrl(url);
  const thumbnailUrl = getVideoThumbnailUrl(url);
  // YouTube thumbnails of vertical videos are 4:3 with black bars on the sides.
  const isLetterboxed = Boolean(getYouTubeVideoId(url));

  if (!embedUrl) {
    return (
      <div className="video-placeholder">
        <span>{slotLabel}</span>
        <strong>{placeholderLabel}</strong>
      </div>
    );
  }

  if (isLoaded) {
    return (
      <iframe
        src={
          embedUrl.includes("youtube")
            ? `${embedUrl}?autoplay=1&rel=0&modestbranding=1`
            : embedUrl
        }
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  return (
    <button
      className="video-trigger"
      type="button"
      onClick={() => setIsLoaded(true)}
      aria-label={`${loadLabel}: ${title}`}
    >
      {thumbnailUrl && !hasThumbnailError ? (
        <img
          className={isLetterboxed ? "is-letterboxed" : undefined}
          src={thumbnailUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setHasThumbnailError(true)}
        />
      ) : (
        <span className="thumbnail-fallback" aria-hidden="true" />
      )}
      <span className="play-button" aria-hidden="true" />
      <small>{loadLabel}</small>
    </button>
  );
}

export default function App() {
  const [appState, dispatch] = useReducer(appReducer, undefined, createInitialState);
  const languageTimers = useRef<number[]>([]);
  const { activeCategory, isLanguageTransitioning, language, workPage } = appState;
  const isArabic = language === "ar";
  const t = portfolioCopy[language];
  const navTargets = ["home", "work", "services", "experience", "clients", "tools", "contact"];

  const handleLanguageToggle = () => {
    if (isLanguageTransitioning) {
      return;
    }

    const nextLanguage: Language = isArabic ? "en" : "ar";
    dispatch({ type: "begin-language-transition" });

    languageTimers.current.forEach((timer) => window.clearTimeout(timer));
    languageTimers.current = [
      window.setTimeout(() => dispatch({ type: "set-language", language: nextLanguage }), 130),
      window.setTimeout(() => dispatch({ type: "finish-language-transition" }), 320),
    ];
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    window.localStorage.setItem("portfolio-language", language);
  }, [isArabic, language]);

  useEffect(
    () => () => {
      languageTimers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const root = document.documentElement;

    const updateProgress = () => {
      const scrollable = root.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      root.style.setProperty("--scroll-progress", `${progress}`);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    const revealTargets = document.querySelectorAll(".reveal-on-scroll");

    if (reduceMotion) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return () => window.removeEventListener("scroll", updateProgress);
    }

    revealTargets.forEach((target, index) => {
      target.classList.add("scroll-reveal");
      (target as HTMLElement).style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 4, 3) * 80}ms`,
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      // threshold 0: tall sections (the work grid on phones) never reach a
      // larger visible ratio on short screens and would stay hidden.
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      window.removeEventListener("scroll", updateProgress);
      observer.disconnect();
    };
  }, []);

  // The last Drive feed is cached per browser so returning visitors see synced
  // videos immediately; Apps Script can take several seconds to answer.
  const [driveSync, setDriveSync] = useState<DriveSyncResult | null>(() => {
    try {
      const cached = window.localStorage.getItem("drive-sync-cache");
      return cached ? (JSON.parse(cached) as DriveSyncResult) : null;
    } catch {
      return null;
    }
  });
  const [driveSyncState, setDriveSyncState] = useState<"idle" | "loading" | "error">("idle");

  const loadDriveWork = (refresh: boolean) => {
    if (!driveSyncEndpoint) {
      return;
    }
    setDriveSyncState("loading");
    fetchDriveWork(driveSyncEndpoint, { refresh, token: adminToken || undefined })
      .then((result) => {
        setDriveSync(result);
        setDriveSyncState(result.error ? "error" : "idle");
        try {
          window.localStorage.setItem("drive-sync-cache", JSON.stringify(result));
        } catch {
          // Storage can be full or blocked; the live result is still shown.
        }
      })
      .catch(() => setDriveSyncState("error"));
  };

  useEffect(() => loadDriveWork(false), []);

  const orderedWork = useMemo(
    () =>
      mergeDriveWork(displayFeaturedWork, driveSync, getDriveFileId).map((item) =>
        item.description
          ? item
          : {
              ...item,
              description: workPresentation[item.category].description,
              descriptionAr: workPresentation[item.category].descriptionAr,
              role: item.role || workPresentation[item.category].role,
            },
      ),
    [driveSync],
  );
  const availableWorkFilters = useMemo(() => getAvailableWorkFilters(orderedWork), [orderedWork]);
  const filteredWork =
    activeCategory === "All"
      ? orderedWork
      : orderedWork.filter((item) => getWorkCategories(item).includes(activeCategory));
  const totalWorkPages = Math.max(1, Math.ceil(filteredWork.length / initialWorkCount));
  const currentWorkPage = Math.min(workPage, totalWorkPages - 1);
  const visibleWork = filteredWork.slice(
    currentWorkPage * initialWorkCount,
    currentWorkPage * initialWorkCount + initialWorkCount,
  );
  const hasWorkPagination = filteredWork.length > initialWorkCount;

  return (
    <main
      className={`site-shell${isLanguageTransitioning ? " is-language-switching" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className="topbar" aria-label="Primary navigation">
        <a className="brand-mark" href="#home" aria-label="Ahmed Sameh home">
          AS
        </a>
        <nav>
          {t.nav.map((label, index) => (
            <a href={`#${navTargets[index]}`} key={label}>
              {label}
            </a>
          ))}
        </nav>
        <button
          className="language-link"
          type="button"
          onClick={handleLanguageToggle}
        >
          {t.switchLabel}
        </button>
      </header>

      <section className="hero" id="home">
        <div className="hero-stage">
          <img
            className="hero-photo"
            src={assetPath("assets/hero-photo.webp")}
            alt="Ahmed Sameh professional portrait"
            decoding="async"
            fetchPriority="high"
          />
          <h1 className="hero-name">Ahmed Sameh</h1>
        </div>

        <div className="hero-copy reveal-on-scroll">
          <div className="hero-intro">
            <p className="eyebrow">{t.eyebrow}</p>
            <p className="title-line">{t.role}</p>
          </div>
          <p className="hero-text">{t.heroText}</p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button primary" href={contact.whatsapp}>
              {t.primary}
            </a>
            <a className="button secondary" href={assetPath("assets/ahmed-sameh-cv.pdf")}>
              {t.cv}
            </a>
            <a className="button ghost" href={contact.drivePortfolio}>
              {t.portfolio}
            </a>
          </div>
        </div>
      </section>

      <div className="reel-strip" aria-hidden="true">
        {showreelVideo ? (
          <video src={assetPath(showreelVideo)} autoPlay muted loop playsInline />
        ) : (
          <div className="reel-row">
            {[...reelThumbnails, ...reelThumbnails].map((src, index) => (
              <img src={src} alt="" key={index} loading="lazy" decoding="async" />
            ))}
          </div>
        )}
      </div>

      <section className="section work-section reveal-on-scroll" id="work">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">{t.featured}</p>
            <h2>{t.selected}</h2>
          </div>
          <a className="text-link" href={contact.drivePortfolio}>
            {t.portfolio}
          </a>
        </div>

        {adminToken !== null ? (
          <div className="drive-sync-bar" role="status">
            <button
              className="pager-button"
              type="button"
              disabled={!driveSyncEndpoint || driveSyncState === "loading"}
              onClick={() => loadDriveWork(true)}
            >
              {driveSyncState === "loading"
                ? isArabic
                  ? "جاري الفحص..."
                  : "Checking Drive..."
                : isArabic
                  ? "تحديث من Drive"
                  : "Refresh from Drive"}
            </button>
            <span>
              {!driveSyncEndpoint
                ? isArabic
                  ? "ضيف رابط الـ Apps Script في driveSyncEndpoint"
                  : "Set driveSyncEndpoint to the Apps Script URL"
                : driveSyncState === "error"
                  ? isArabic
                    ? `حصل خطأ${driveSync?.error ? `: ${driveSync.error}` : ""}`
                    : `Sync failed${driveSync?.error ? `: ${driveSync.error}` : ""}`
                  : driveSync
                    ? isArabic
                      ? `${driveSync.items.length} فيديو من Drive · اتوصف ${driveSync.processed} جديد · آخر فحص ${driveSync.updatedAt ? new Date(driveSync.updatedAt).toLocaleString("ar-EG") : "—"}`
                      : `${driveSync.items.length} Drive videos · ${driveSync.processed} newly described · last check ${driveSync.updatedAt ? new Date(driveSync.updatedAt).toLocaleString("en-GB") : "—"}`
                    : ""}
              {driveSync?.failed.length
                ? isArabic
                  ? ` · ${driveSync.failed.length} فشل: ${driveSync.failed.map((item) => item.name).join("، ")}`
                  : ` · ${driveSync.failed.length} failed: ${driveSync.failed.map((item) => item.name).join(", ")}`
                : ""}
            </span>
          </div>
        ) : null}

        <div className="category-filter" aria-label={t.filterLabel}>
          {availableWorkFilters.map((category) => (
            <button
              className={category === activeCategory ? "is-active" : ""}
              type="button"
              key={category}
              onClick={() => dispatch({ type: "set-work-category", category })}
            >
              {displayCategoryLabels[category][language]}
            </button>
          ))}
        </div>

        <div className="work-grid">
          {visibleWork.map((item, index) => {
            const itemCategories = getWorkCategories(item);
            const visibleCategory =
              activeCategory !== "All" && itemCategories.includes(activeCategory)
                ? activeCategory
                : item.category;
            const isFeatured = index === 0;

            return (
              <article
                className={`work-card${isFeatured ? " is-featured" : ""}`}
                key={item.youtubeUrl || item.title}
              >
                <div className="video-frame">
                  <LazyVideo
                    title={isArabic ? item.titleAr : item.title}
                    url={item.youtubeUrl}
                    placeholderLabel={displayCategoryLabels[visibleCategory][language]}
                    loadLabel={t.loadVideo}
                    slotLabel={t.videoSlot}
                  />
                </div>
                <div className="work-copy">
                  <span>{displayCategoryLabels[visibleCategory][language]}</span>
                  <h4>{isArabic ? item.titleAr : item.title}</h4>
                  {isFeatured ? (
                    <p>{isArabic ? item.descriptionAr : item.description}</p>
                  ) : null}
                  <small>{item.role}</small>
                </div>
              </article>
            );
          })}
        </div>

        {hasWorkPagination ? (
          <div className="work-pager" aria-label="Work pagination">
            <button
              className="pager-button"
              type="button"
              disabled={currentWorkPage === 0}
              onClick={() =>
                dispatch({ type: "set-work-page", page: currentWorkPage - 1 })
              }
            >
              {t.previousPage}
            </button>
            <span>
              {t.pageLabel} {currentWorkPage + 1} / {totalWorkPages}
            </span>
            <button
              className="pager-button"
              type="button"
              disabled={currentWorkPage >= totalWorkPages - 1}
              onClick={() =>
                dispatch({ type: "set-work-page", page: currentWorkPage + 1 })
              }
            >
              {t.nextPage}
            </button>
          </div>
        ) : null}
      </section>

      <section className="stats-band reveal-on-scroll" id="experience" aria-label={t.experience}>
        {["4+", "100+", "30+"].map((metric, index) => (
          <div className="stat" key={metric}>
            <strong>{metric}</strong>
            <span>{t.metrics[index]}</span>
          </div>
        ))}
        <p className="stats-note">{t.experienceNote}</p>
      </section>

      <section className="section services-section reveal-on-scroll" id="services">
        <div className="section-heading">
          <p className="eyebrow">{t.services}</p>
          <h2>{t.whatEdit}</h2>
        </div>
        <ol className="services-list">
          {[
            ...displayServices.map((service) => (isArabic ? service.titleAr : service.title)),
            t.extraService,
          ].map((title, index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {title}
            </li>
          ))}
        </ol>
      </section>

      <section className="clients-section reveal-on-scroll" id="clients">
        <p className="eyebrow">{t.clients}</p>
        <div className="clients-marquee">
          <div className="clients-row">
            {[0, 1].map((copyIndex) =>
              displayClientGroups.flatMap((group) => group.clients).map((client) => (
                <span
                  className={/[؀-ۿ]/.test(client) ? "is-arabic" : undefined}
                  key={`${copyIndex}-${client}`}
                  aria-hidden={copyIndex === 1}
                >
                  {client}
                </span>
              )),
            )}
          </div>
        </div>
      </section>

      <section className="tools-band reveal-on-scroll" id="tools">
        <p className="eyebrow">{t.tools}</p>
        <div className="tool-groups">
          <div className="tool-group">
            <span>{isArabic ? "مونتاج" : "Editing"}</span>
            <em>Premiere Pro</em>
            <em>CapCut</em>
          </div>
          <div className="tool-group">
            <span>{isArabic ? "موشن وتصميم" : "Motion & Design"}</span>
            <em>After Effects</em>
            <em>Photoshop</em>
            <em>Canva</em>
          </div>
          <div className="tool-group">
            <span>{isArabic ? "فيديوهات AI" : "AI Video"}</span>
            <em>Google Flow</em>
            <em>Seedance 2.0</em>
            <em>Veo</em>
            <em>Nano Banana</em>
            <em>Magnific</em>
          </div>
          <div className="tool-group">
            <span>{isArabic ? "موشن بالكود والأتمتة" : "Motion code & automation"}</span>
            <em>Remotion</em>
            <em>HyperFrames</em>
            <em>Claude Code</em>
            <em>ElevenLabs</em>
            <em>Whisper</em>
          </div>
        </div>
      </section>

      <section className="timeline-section reveal-on-scroll" aria-label="Experience timeline">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">{t.timeline}</p>
            <h2>{t.timelineTitle}</h2>
          </div>
        </div>
        <div className="career-timeline">
          {t.timelineItems.map(([label, title, text, dates]) => (
            <article key={title}>
              <span>{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <small className="timeline-dates">{dates}</small>
            </article>
          ))}
        </div>
      </section>

      <section
        className="contact-section reveal-on-scroll"
        id="contact"
        style={
          {
            "--contact-backdrop": `url(${assetPath("assets/contact-backdrop.webp")})`,
          } as CSSProperties
        }
      >
        <div className="contact-intro">
          <p className="eyebrow">{t.ready}</p>
          <h2>{t.together}</h2>
          <p>{t.contactText}</p>
        </div>

        <div className="contact-links">
          <a className="contact-link is-primary" href={contact.whatsapp}>
            <small>WhatsApp</small>
            <strong dir="ltr">{contact.phoneDisplay}</strong>
          </a>
          <a className="contact-link" href={contact.phoneAltHref}>
            <small>{isArabic ? "رقم تاني" : "Phone"}</small>
            <strong dir="ltr">{contact.phoneAlt}</strong>
          </a>
          <a className="contact-link" href={`mailto:${contact.email}`}>
            <small>{isArabic ? "الإيميل" : "Email"}</small>
            <strong dir="ltr">{contact.email}</strong>
          </a>
          <a className="contact-link" href={contact.linkedin}>
            <small>LinkedIn</small>
            <strong dir="ltr">Ahmed Sameh</strong>
          </a>
        </div>
      </section>
    </main>
  );
}
