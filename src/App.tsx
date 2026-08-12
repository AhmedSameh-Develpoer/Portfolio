import { useEffect, useReducer, useRef, useState } from "react";
import {
  clientGroups,
  contact,
  portfolioWork,
  services,
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
    role: "Short-Form & Commercial Video Editor",
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
      "Editing across creators, brands, real estate, gaming, AI videos, and commercial social content.",
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
    timelineItems: [
      [
        "Real Estate Marketing",
        "EMG Group Developments",
        "Edited short-form real estate campaigns with a focus on visual clarity, pacing, sound, and brand consistency.",
      ],
      [
        "Social Media Content",
        "Upwest Group",
        "Created social videos built for short-form viewing, clean delivery, and stronger audience engagement.",
      ],
      [
        "Freelance Collaborations",
        "Creators & review pages",
        "Delivered creator edits, subtitles, client revisions, review videos, gaming clips, and commercial-style social content.",
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
    role: "Short-Form & Commercial Video Editor",
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
    whatEdit: "أنواع المحتوى التي أحررها",
    experience: "الخبرة",
    clients: "العملاء",
    metrics: ["سنوات خبرة", "مشروع مكتمل", "عميل تعاملت معه"],
    experienceNote:
      "خبرة في مونتاج محتوى لصنّاع محتوى، براندات، عقارات، ألعاب، فيديوهات AI، ومحتوى سوشيال تجاري.",
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
        "مونتاج حملات عقارية قصيرة مع تركيز على وضوح الصورة، الإيقاع، الصوت، وثبات الهوية البصرية.",
      ],
      [
        "محتوى سوشيال",
        "Upwest Group",
        "تجهيز فيديوهات قصيرة مناسبة للمنصات، مصممة لجذب الانتباه وتسليمها بشكل نظيف وجاهز للنشر.",
      ],
      [
        "تعاونات فريلانس",
        "صنّاع محتوى وصفحات مراجعات",
        "تنفيذ مونتاج لصنّاع محتوى، ترجمة، تعديلات عملاء، مراجعات، ألعاب، وفيديوهات تجارية للسوشيال.",
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

function getWorkCategories(item: (typeof displayFeaturedWork)[number]) {
  return item.categories ?? [item.category];
}

const availableWorkFilters: WorkFilter[] = [
  "All",
  ...categoryOrder.filter((category) =>
    displayFeaturedWork.some((item) => getWorkCategories(item).includes(category)),
  ),
];

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
  const embedUrl = getVideoEmbedUrl(url);
  const thumbnailUrl = getVideoThumbnailUrl(url);

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
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt="" loading="lazy" decoding="async" />
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
  const [isWorkNavVisible, setIsWorkNavVisible] = useState(false);
  const languageTimers = useRef<number[]>([]);
  const workSectionRef = useRef<HTMLElement | null>(null);
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
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      window.removeEventListener("scroll", updateProgress);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const workSection = workSectionRef.current;
    if (!workSection) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsWorkNavVisible(entry.isIntersecting),
      { rootMargin: "-18% 0px -22% 0px", threshold: 0.01 },
    );

    observer.observe(workSection);

    return () => observer.disconnect();
  }, []);

  const orderedWork = displayFeaturedWork;
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
        <div className="hero-copy reveal-on-scroll">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className="name-ribbon">Ahmed Sameh</p>
          <p className="title-line">{t.role}</p>
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

        <div className="portrait-panel reveal-on-scroll" aria-label="Ahmed Sameh portrait">
          <picture>
            <source srcSet={assetPath("assets/ahmed-sameh-portrait.webp")} type="image/webp" />
            <img
              src={assetPath("assets/ahmed-sameh-portrait.png")}
              alt="Ahmed Sameh professional portrait"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <span className="purple-haze" aria-hidden="true" />
        </div>

      </section>

      <section
        className="section work-section reveal-on-scroll"
        id="work"
        ref={workSectionRef}
      >
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">{t.featured}</p>
            <h2>{t.selected}</h2>
          </div>
          <a className="text-link" href={contact.drivePortfolio}>
            {t.portfolio}
          </a>
        </div>

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

        {hasWorkPagination ? (
          <div className="work-page-status">
            {t.pageLabel} {currentWorkPage + 1} / {totalWorkPages}
          </div>
        ) : null}

        {hasWorkPagination ? (
          <div
            className={`work-side-pagination${isWorkNavVisible ? " is-visible" : ""}`}
            aria-label="Work pagination"
          >
            <button
              className="work-side-button is-prev"
              type="button"
              disabled={currentWorkPage === 0}
              onClick={() =>
                dispatch({ type: "set-work-page", page: currentWorkPage - 1 })
              }
            >
              <span>{t.previousPage}</span>
              <strong aria-hidden="true">&lt;</strong>
            </button>
            <button
              className="work-side-button is-next"
              type="button"
              disabled={currentWorkPage >= totalWorkPages - 1}
              onClick={() =>
                dispatch({ type: "set-work-page", page: currentWorkPage + 1 })
              }
            >
              <span>{t.nextPage}</span>
              <strong aria-hidden="true">&gt;</strong>
            </button>
          </div>
        ) : null}

        <div className="work-grid featured-row">
          {visibleWork.map((item) => {
            const itemCategories = getWorkCategories(item);
            const visibleCategory =
              activeCategory !== "All" && itemCategories.includes(activeCategory)
                ? activeCategory
                : item.category;
            const isShortFormat = itemCategories.includes("Shorts");

            return (
              <article
                className={`work-card${isShortFormat ? " is-short-card" : ""}`}
                key={item.title}
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
                  <p>{isArabic ? item.descriptionAr : item.description}</p>
                  <small>{item.role}</small>
                </div>
              </article>
            );
          })}
        </div>

      </section>

      <section className="dashboard-grid reveal-on-scroll" aria-label="Portfolio details">
        <article className="panel-card services-panel" id="services">
          <p className="eyebrow">{t.services}</p>
          <h2>{t.whatEdit}</h2>
          <ul>
            {displayServices.map((service) => (
              <li key={service.title}>{isArabic ? service.titleAr : service.title}</li>
            ))}
            <li>{t.extraService}</li>
          </ul>
        </article>

        <article className="panel-card experience-panel" id="experience">
          <p className="eyebrow">{t.experience}</p>
          <div className="metric-row">
            {["4+", "100+", "30+"].map((metric, index) => (
              <div key={metric}>
                <strong>{metric}</strong>
                <span>{t.metrics[index]}</span>
              </div>
            ))}
          </div>
          <p className="experience-note">{t.experienceNote}</p>
        </article>

        <article className="panel-card client-panel" id="clients">
          <p className="eyebrow">{t.clients}</p>
          <div className="client-groups">
            {displayClientGroups.map((group) => (
              <section className="client-group" key={group.title}>
                <h3>{isArabic ? group.titleAr : group.title}</h3>
                <div className="client-list">
                  {group.clients.map((client) => (
                    <span key={client}>{client}</span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </section>

      <section className="tools-band reveal-on-scroll" id="tools">
        <p className="eyebrow">{t.tools}</p>
        <div className="tool-groups">
          <div className="tool-group">
            <span>{isArabic ? "مونتاج" : "Editing"}</span>
            <div className="tool-list">
              <strong>Pr</strong>
              <em>CapCut</em>
            </div>
          </div>
          <div className="tool-group">
            <span>{isArabic ? "موشن وتصميم" : "Motion & Design"}</span>
            <div className="tool-list">
              <strong>Ae</strong>
              <strong>Ps</strong>
              <em>After Effects</em>
              <em>Canva</em>
            </div>
          </div>
          <div className="tool-group">
            <span>{isArabic ? "فيديوهات AI" : "AI Video"}</span>
            <div className="tool-list">
              <em>Google Flow</em>
              <em>Seedance 2.0</em>
              <em>Veo</em>
              <em>Magnific</em>
            </div>
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
          {t.timelineItems.map(([label, title, text]) => (
            <article key={title}>
              <span>{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section reveal-on-scroll" id="contact">
        <div>
          <p className="eyebrow">{t.ready}</p>
          <h2>{t.together}</h2>
          <p>{t.contactText}</p>
        </div>

        <div className="contact-actions">
          <a className="button primary" href={contact.whatsapp}>
            WhatsApp {contact.phoneDisplay}
          </a>
          <a className="button secondary" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <a className="button ghost" href={contact.linkedin}>
            LinkedIn
          </a>
        </div>
      </section>
    </main>
  );
}
