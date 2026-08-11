export type WorkCategory =
  | "Shorts"
  | "AI Videos"
  | "Commercials"
  | "Real Estate"
  | "Gaming"
  | "Vlogs";

export type PortfolioItem = {
  title: string;
  titleAr: string;
  category: WorkCategory;
  categories?: WorkCategory[];
  youtubeUrl: string;
  description: string;
  descriptionAr: string;
  role: string;
};

export const contact = {
  whatsapp: "https://wa.me/201010032851",
  phoneDisplay: "+20 101 003 2851",
  email: "ahmedsameh2465@gmail.com",
  linkedin: "https://www.linkedin.com/in/ahmed-sameh-97010a333",
  drivePortfolio:
    "https://drive.google.com/drive/folders/117JAPkARLRjf54Rlsgmg8LLVzD23j7w_?usp=drive_link",
};

export const featuredWork: PortfolioItem[] = [
  {
    title: "Short-form sample",
    titleAr: "\u0639\u064a\u0646\u0629 \u0634\u0648\u0631\u062a \u0641\u0648\u0631\u0645",
    category: "Shorts",
    youtubeUrl: "",
    description:
      "Add a YouTube link here to display a polished embedded video sample.",
    descriptionAr:
      "\u0636\u0639 \u0631\u0627\u0628\u0637 YouTube \u0647\u0646\u0627 \u0648\u0633\u064a\u0638\u0647\u0631 \u0627\u0644\u0641\u064a\u062f\u064a\u0648 \u062f\u0627\u062e\u0644 \u0627\u0644\u0635\u0641\u062d\u0629 \u062a\u0644\u0642\u0627\u0626\u064a\u0627.",
    role: "Editing, hooks, pacing, captions, sound",
  },
  {
    title: "AI video sample",
    titleAr: "\u0639\u064a\u0646\u0629 \u0641\u064a\u062f\u064a\u0648 AI",
    category: "AI Videos",
    youtubeUrl: "",
    description:
      "Use this slot for AI-assisted scenes, concepts, or commercial visuals.",
    descriptionAr:
      "\u0627\u0633\u062a\u062e\u062f\u0645 \u0647\u0630\u0627 \u0627\u0644\u0645\u0643\u0627\u0646 \u0644\u0623\u0639\u0645\u0627\u0644 AI \u0623\u0648 \u0645\u0634\u0627\u0647\u062f \u0625\u0639\u0644\u0627\u0646\u064a\u0629 \u0645\u0648\u0644\u062f\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a.",
    role: "Concept, script, AI video generation, edit",
  },
  {
    title: "Commercial sample",
    titleAr: "عينة إعلان تجاري",
    category: "Commercials",
    youtubeUrl: "",
    description:
      "Add a commercial, brand, product, or campaign edit to this slot.",
    descriptionAr:
      "أضف هنا إعلان تجاري أو فيديو براند أو منتج أو حملة تسويقية.",
    role: "Brand pacing, clean delivery, captions, sound",
  },
  {
    title: "Real estate sample",
    titleAr: "عينة عقارات",
    category: "Real Estate",
    youtubeUrl: "",
    description:
      "Use this slot for real estate walkthroughs, project Reels, or property campaigns.",
    descriptionAr:
      "استخدم هذا المكان لفيديوهات العقارات أو الريلز الخاصة بالمشاريع والحملات.",
    role: "Property flow, pacing, music, color, titles",
  },
  {
    title: "Gaming sample",
    titleAr: "\u0639\u064a\u0646\u0629 \u0623\u0644\u0639\u0627\u0628",
    category: "Gaming",
    youtubeUrl: "",
    description:
      "Add a gameplay highlight, review, or creator-focused gaming edit.",
    descriptionAr:
      "\u0623\u0636\u0641 \u0641\u064a\u062f\u064a\u0648 \u0623\u0644\u0639\u0627\u0628 \u0623\u0648 \u0647\u0627\u064a\u0644\u0627\u064a\u062a \u0623\u0648 \u0645\u0631\u0627\u062c\u0639\u0629 \u0644\u0635\u0627\u0646\u0639 \u0645\u062d\u062a\u0648\u0649.",
    role: "Highlights, retention pacing, memes, subtitles",
  },
  {
    title: "Vlog sample",
    titleAr: "عينة فلوج",
    category: "Vlogs",
    youtubeUrl: "",
    description:
      "Add a creator vlog, travel edit, or story-driven YouTube video here.",
    descriptionAr:
      "أضف هنا فلوج لصانع محتوى أو فيديو سفر أو فيديو يوتيوب مبني على قصة.",
    role: "Story structure, pacing, subtitles, music",
  },
];

export const playlistWork: PortfolioItem[] = [
  {
    title: "Choosing the right mall for your project",
    titleAr: "اختيار المكان المناسب لمشروعك",
    category: "Real Estate",
    categories: ["Shorts", "Real Estate"],
    youtubeUrl: "https://www.youtube.com/watch?v=yqOLDiGcGcE&list=PLETshD1aXTPU",
    description:
      "Real estate reel built around location value, business fit, pacing, captions, and a clear investment message.",
    descriptionAr:
      "ريل عقاري عن اختيار المكان المناسب للمشروع، بإيقاع واضح ورسالة استثمارية مباشرة وترجمة مناسبة.",
    role: "Real estate reel, pacing, captions, sound",
  },
  {
    title: "Choosing the right developer",
    titleAr: "اختيار المطور العقاري",
    category: "Real Estate",
    categories: ["Shorts", "Real Estate"],
    youtubeUrl: "https://www.youtube.com/watch?v=jEpBam52q30&list=PLETshD1aXTPU",
    description:
      "Property investment short focused on trust, developer credibility, clean cuts, and polished social delivery.",
    descriptionAr:
      "شورت عقاري عن الثقة في المطور، بقصات نظيفة وإيقاع مناسب وتسليم جاهز للسوشيال.",
    role: "Real estate short, trust message, pacing, captions",
  },
  {
    title: "Your project idea is not the problem",
    titleAr: "مشكلتك مش في فكرة مشروعك",
    category: "Real Estate",
    categories: ["Shorts", "Real Estate"],
    youtubeUrl: "https://www.youtube.com/watch?v=cB9yA4Uhm0I&list=PLETshD1aXTPU",
    description:
      "Business and property reel shaped around a strong hook, concise message, subtitles, and retention pacing.",
    descriptionAr:
      "ريل عقاري/تجاري مبني على هوك واضح ورسالة مختصرة وترجمة وإيقاع يحافظ على المشاهدة.",
    role: "Hook, subtitles, pacing, real estate message",
  },
  {
    title: "Trust is action",
    titleAr: "الثقة أفعال مش كلام",
    category: "Real Estate",
    categories: ["Shorts", "Real Estate"],
    youtubeUrl: "https://www.youtube.com/watch?v=3NbTkjf1a-o&list=PLETshD1aXTPU",
    description:
      "Real estate credibility reel edited for confident pacing, clear subtitles, and a polished brand tone.",
    descriptionAr:
      "ريل عقاري عن الثقة والمصداقية، بإيقاع واثق وترجمة واضحة وإحساس مناسب للبراند.",
    role: "Brand tone, pacing, captions, sound",
  },
  {
    title: "See your investment yourself",
    titleAr: "اطمن على استثمارك بعينك",
    category: "Real Estate",
    categories: ["Shorts", "Real Estate"],
    youtubeUrl: "https://www.youtube.com/watch?v=6QKYAMKetXs&list=PLETshD1aXTPU",
    description:
      "Investment-focused real estate short with clean structure, visual clarity, and platform-ready pacing.",
    descriptionAr:
      "شورت عقاري عن الاطمئنان على الاستثمار، ببناء واضح وصورة مفهومة وإيقاع مناسب للمنصات.",
    role: "Real estate edit, visual clarity, captions, delivery",
  },
  {
    title: "Real success on the ground",
    titleAr: "النجاح الحقيقي على أرض الواقع",
    category: "Real Estate",
    categories: ["Shorts", "Real Estate"],
    youtubeUrl: "https://www.youtube.com/watch?v=koeq2vOsIkY&list=PLETshD1aXTPU",
    description:
      "Real estate social edit built around proof, grounded messaging, captions, and a clean final rhythm.",
    descriptionAr:
      "مونتاج عقاري للسوشيال مبني على إثبات واقعي ورسالة واضحة وترجمة وريتم نظيف.",
    role: "Real estate proof, pacing, subtitles, sound",
  },
  {
    title: "The real difference is the location",
    titleAr: "الفرق الحقيقي في المكان",
    category: "Real Estate",
    categories: ["Shorts", "Real Estate"],
    youtubeUrl: "https://www.youtube.com/watch?v=BtZTWALsFE4&list=PLETshD1aXTPU",
    description:
      "Location-focused property reel edited for a direct hook, clean message, and strong short-form delivery.",
    descriptionAr:
      "ريل عقاري عن أهمية المكان، بهوك مباشر ورسالة واضحة وتسليم شورت فورم قوي.",
    role: "Location message, hook, captions, pacing",
  },
  {
    title: "Carrots testing + subtitles",
    titleAr: "Carrots - مونتاج وترجمة",
    category: "Shorts",
    categories: ["Shorts"],
    youtubeUrl: "https://www.youtube.com/watch?v=NXy0U6Ia1lY&list=PLETshD1aXTPU",
    description:
      "Subtitle-led short-form edit focused on pacing, readable captions, and a clean viewing rhythm.",
    descriptionAr:
      "مونتاج شورت فورم مع تركيز على الإيقاع، وضوح الترجمة، وسلاسة المشاهدة من أول ثانية.",
    role: "Short-form edit, subtitles, pacing, sound",
  },
  {
    title: "City Crib",
    titleAr: "City Crib - إعلان مطعم",
    category: "Commercials",
    categories: ["Shorts", "Commercials"],
    youtubeUrl: "https://www.youtube.com/watch?v=klMF1An1gOg&list=PLETshD1aXTPU",
    description:
      "Restaurant promo edit shaped for quick appetite appeal, clear pacing, and social-friendly delivery.",
    descriptionAr:
      "إعلان مطعم قصير بإيقاع سريع، عرض واضح للأكل، وتسليم مناسب للسوشيال.",
    role: "Restaurant promo, pacing, captions, sound",
  },
  {
    title: "Van Tech AC - AI commercial",
    titleAr: "Van Tech للتكييفات - إعلان AI",
    category: "Commercials",
    categories: ["Shorts", "AI Videos", "Commercials"],
    youtubeUrl: "https://www.youtube.com/watch?v=--9Z5h71gHQ&list=PLETshD1aXTPU",
    description:
      "AI-assisted commercial concept for an air-conditioning brand, edited into a clear social video.",
    descriptionAr:
      "إعلان مدعوم بالذكاء الاصطناعي لبراند تكييفات، متجمع في فيديو واضح ومناسب للسوشيال.",
    role: "AI visuals, commercial pacing, assembly, edit",
  },
  {
    title: "EMG Sun West Mall - AI real estate",
    titleAr: "EMG Sun West Mall - محتوى عقاري AI",
    category: "Real Estate",
    categories: ["Shorts", "AI Videos", "Real Estate"],
    youtubeUrl: "https://www.youtube.com/watch?v=9DUZ5EjYuEs&list=PLETshD1aXTPU",
    description:
      "AI-led real estate edit for a development campaign, focused on presentation, pacing, and brand feel.",
    descriptionAr:
      "مونتاج عقاري باستخدام مشاهد AI لحملة مشروع، مع تركيز على العرض، الإيقاع، وإحساس البراند.",
    role: "Real estate campaign, AI scenes, pacing, polish",
  },
  {
    title: "Alnur Air - AI commercial",
    titleAr: "Alnur Air للتكييفات - إعلان AI",
    category: "Commercials",
    categories: ["Shorts", "AI Videos", "Commercials"],
    youtubeUrl: "https://www.youtube.com/watch?v=yUjRnk6cMpY&list=PLETshD1aXTPU",
    description:
      "Commercial-style social video for an air-conditioning brand, built with AI visuals and clean delivery.",
    descriptionAr:
      "فيديو تجاري لبراند تكييفات، معمول بمشاهد AI وتسليم نظيف مناسب للعرض على السوشيال.",
    role: "Commercial edit, AI visuals, sound, delivery",
  },
  {
    title: "Nur AC - AI commercial",
    titleAr: "Nur للتكييفات - إعلان AI",
    category: "Commercials",
    categories: ["Shorts", "AI Videos", "Commercials"],
    youtubeUrl: "https://www.youtube.com/watch?v=QFaw_aAV3DQ&list=PLETshD1aXTPU",
    description:
      "Short commercial edit for an air-conditioning brand, balancing generated visuals with direct messaging.",
    descriptionAr:
      "إعلان قصير لبراند تكييفات بيجمع بين المشاهد المولدة ورسالة مباشرة وواضحة للعميل.",
    role: "Brand pacing, AI scenes, captions, sound",
  },
];

export const driveWork: PortfolioItem[] = [
  {
    title: "Youssef Chahine subtitles edit",
    titleAr: "يوسف شاهين - مونتاج وترجمة",
    category: "Shorts",
    categories: ["Shorts", "Vlogs"],
    youtubeUrl: "https://drive.google.com/file/d/1k0WX30zCnf_JXsC1mg7ip3KAxXZc1yNl/view?usp=drivesdk",
    description:
      "Creator-style edit with subtitles, pacing, and a clean structure for a film-related short.",
    descriptionAr:
      "مونتاج لصانع محتوى مع ترجمة وإيقاع واضح لفيديو قصير متعلق بالأفلام.",
    role: "Creator edit, subtitles, pacing, sound",
  },
  {
    title: "HeroQ8 gaming explainer",
    titleAr: "HeroQ8 - شرح ألعاب وموشن",
    category: "Gaming",
    categories: ["Shorts", "Gaming"],
    youtubeUrl: "https://drive.google.com/file/d/1Dd9uHqgTuDRTzWNcJsmu5juGPNPR6EIf/view?usp=drivesdk",
    description:
      "Gaming explainer edit with motion graphics, subtitles, pacing, and clear structure for viewer retention.",
    descriptionAr:
      "شرح ألعاب لصانع محتوى مع موشن جرافيك، ترجمة، وإيقاع واضح يحافظ على المشاهدة.",
    role: "Gaming explainer, motion graphics, subtitles, pacing",
  },
  {
    title: "Ahmed challenge edit",
    titleAr: "Ahmed Challenge - مونتاج تحدي",
    category: "Shorts",
    categories: ["Shorts"],
    youtubeUrl: "https://drive.google.com/file/d/16Z1L5aHDiLlCoeyMR0WJJIvq8EZc7C_I/view?usp=drivesdk",
    description:
      "Challenge-style short edit focused on quick rhythm, reactions, and social media pacing.",
    descriptionAr:
      "مونتاج تحدي بإيقاع سريع، ردود فعل واضحة، وستايل مناسب للسوشيال.",
    role: "Short-form edit, pacing, reactions, sound",
  },
  {
    title: "Ali Q8 vlog / review edit",
    titleAr: "Ali Q8 - فلوج ومراجعة",
    category: "Vlogs",
    categories: ["Shorts", "Vlogs"],
    youtubeUrl: "https://drive.google.com/file/d/1_lz7RniDRrr68QPl0JkDjCEQu7jZbsb2/view?usp=drivesdk",
    description:
      "Vlog and review-style creator edit with natural pacing, clear cuts, and platform-ready delivery.",
    descriptionAr:
      "مونتاج فلوج ومراجعة لصانع المحتوى Ali Q8 بإيقاع طبيعي وقصات واضحة وتسليم جاهز للمنصات.",
    role: "Vlog edit, review pacing, subtitles, delivery",
  },
  {
    title: "Ali Q8 food / vlog subtitles",
    titleAr: "Ali Q8 - فلوج أكل وترجمة",
    category: "Vlogs",
    categories: ["Shorts", "Vlogs", "Commercials"],
    youtubeUrl: "https://drive.google.com/file/d/1VJNaa1LwxwXjIDUZEQoylFnzQYpJpYpM/view?usp=drivesdk",
    description:
      "Food-vlog and creator short sample using subtitles, clean timing, and social-friendly rhythm.",
    descriptionAr:
      "عينة فلوج أكل وشورت لصانع محتوى مع ترجمة وتوقيت نظيف وريتم مناسب للسوشيال.",
    role: "Food vlog, subtitles, pacing, short-form edit",
  },
  {
    title: "Ali Q8 review-style short",
    titleAr: "Ali Q8 - شورت مراجعة",
    category: "Vlogs",
    categories: ["Shorts", "Vlogs"],
    youtubeUrl: "https://drive.google.com/file/d/1IIOheYV7CQWICDzanHGfy7Tfj362KfTs/view?usp=drivesdk",
    description:
      "Review-style social edit with clear pacing, subtitles, and concise delivery for retention.",
    descriptionAr:
      "مونتاج شورت بأسلوب مراجعة، بإيقاع واضح وترجمة وتسليم مختصر يحافظ على المشاهدة.",
    role: "Review edit, captions, pacing, sound",
  },
  {
    title: "Beef Q8 gaming explainer",
    titleAr: "Beef Q8 - شرح ألعاب وموشن",
    category: "Gaming",
    categories: ["Shorts", "Gaming"],
    youtubeUrl: "https://drive.google.com/file/d/1XXQHEGFyaNbySftyo_Fz9_3rDNsPnvVT/view?usp=drivesdk",
    description:
      "Gaming explainer edit for Beef Q8 with motion graphics, subtitles, and a clean social media structure.",
    descriptionAr:
      "شرح ألعاب لصانع المحتوى Beef Q8 مع موشن جرافيك وترجمة وإيقاع مناسب للسوشيال.",
    role: "Gaming explainer, motion graphics, subtitles, sound",
  },
  {
    title: "Beef Q8 selected gaming cut",
    titleAr: "Beef Q8 - عينة ألعاب مختارة",
    category: "Gaming",
    categories: ["Shorts", "Gaming"],
    youtubeUrl: "https://drive.google.com/file/d/1wMSdLd1-LGAfvFyVx-NK0EFQdHj6mlOW/view?usp=drivesdk",
    description:
      "Selected Beef Q8 gaming edit with motion-led structure, clean pacing, and readable subtitles.",
    descriptionAr:
      "عينة ألعاب مختارة من شغل Beef Q8 بإيقاع نظيف وموشن وترجمة واضحة.",
    role: "Selected gaming edit, motion graphics, subtitles",
  },
  {
    title: "Beef Q8 gaming short series",
    titleAr: "Beef Q8 - سلسلة شورتس ألعاب",
    category: "Gaming",
    categories: ["Shorts", "Gaming"],
    youtubeUrl: "https://drive.google.com/file/d/1g7iZ-B-PaOITSZynx8qQbiXrozxE2mCn/view?usp=drivesdk",
    description:
      "Gaming short-series sample with motion graphics, fast pacing, subtitle readability, and quick engagement.",
    descriptionAr:
      "عينة من سلسلة شورتس ألعاب بإيقاع سريع وموشن وترجمة مقروءة وجذب سريع للمشاهد.",
    role: "Gaming shorts, motion graphics, captions, retention",
  },
  {
    title: "Beef League gaming edit",
    titleAr: "Beef League - مونتاج ألعاب",
    category: "Gaming",
    categories: ["Shorts", "Gaming"],
    youtubeUrl: "https://drive.google.com/file/d/1UfVQIAvLN1wsS0t8QaedVGbb_egYkfi3/view?usp=drivesdk",
    description:
      "Gaming-oriented creator edit with highlight pacing, motion details, reactions, and entertainment rhythm.",
    descriptionAr:
      "مونتاج ألعاب لصانع محتوى بإيقاع هايلايتس وردود فعل وريتم ممتع.",
    role: "Gaming edit, highlights, motion graphics, sound",
  },
  {
    title: "HeroQ8 selected gaming edit",
    titleAr: "HeroQ8 - عينة ألعاب مختارة",
    category: "Gaming",
    categories: ["Shorts", "Gaming"],
    youtubeUrl: "https://drive.google.com/file/d/10BYafOii1tssxVBCXCkuBZAHlMOjt7cT/view?usp=drivesdk",
    description:
      "Selected HeroQ8 gaming explainer sample with motion graphics, clarity, and social pacing.",
    descriptionAr:
      "عينة شرح ألعاب مختارة من HeroQ8، مبنية على موشن ووضوح وإيقاع مناسب للسوشيال.",
    role: "Gaming explainer, motion graphics, pacing, polish",
  },
  {
    title: "Ali Q8 selected vlog / ad edit",
    titleAr: "Ali Q8 - فلوج وإعلان مختار",
    category: "Vlogs",
    categories: ["Shorts", "Vlogs", "Commercials"],
    youtubeUrl: "https://drive.google.com/file/d/1CxFgP2oQf8kf609zHffhV2fEdDTZwpcI/view?usp=drivesdk",
    description:
      "Selected Ali Q8 vlog, review, and ad-style sample with clean cuts and ready-to-publish delivery.",
    descriptionAr:
      "عينة مختارة من شغل Ali Q8 بين الفلوج والمراجعة والإعلان، بقصات نظيفة وتسليم جاهز للنشر.",
    role: "Vlog, review, ad edit, captions, delivery",
  },
];

export const portfolioWork: PortfolioItem[] = [...playlistWork, ...driveWork];

export const clientGroups = [
  {
    title: "Real Estate & Brands",
    titleAr: "عقارات وبراندات",
    clients: [
      "EMG Group Developments",
      "Upwest",
      "B Divya",
      "Alnur Air",
      "Nur",
      "Summit Air",
      "المحلاوي",
    ],
  },
  {
    title: "Creators & Commercial Pages",
    titleAr: "صناع محتوى وصفحات تجارية",
    clients: ["Ali Q8", "HeroQ8", "Beef Q8", "Kassar Reviews"],
  },
  {
    title: "Gaming Creators",
    titleAr: "صناع محتوى ألعاب",
    clients: ["Xenon Team", "Khaled Q8", "Thorned", "Violetism"],
  },
];

export const services = [
  {
    title: "Short-form editing",
    titleAr:
      "\u0645\u0648\u0646\u062a\u0627\u062c \u0627\u0644\u0641\u064a\u062f\u064a\u0648\u0647\u0627\u062a \u0627\u0644\u0642\u0635\u064a\u0631\u0629",
    text: "Reels, Shorts, TikToks, captions, hooks, pacing, and platform-ready exports.",
  },
  {
    title: "Commercial content",
    titleAr:
      "\u0645\u062d\u062a\u0648\u0649 \u062a\u062c\u0627\u0631\u064a \u0648\u0625\u0639\u0644\u0627\u0646\u064a",
    text: "Clean edits for brands, real estate campaigns, product content, and social ads.",
  },
  {
    title: "Gaming and creator videos",
    titleAr:
      "\u0623\u0644\u0639\u0627\u0628 \u0648\u0635\u0646\u0627\u0639\u0629 \u0645\u062d\u062a\u0648\u0649",
    text: "Fast-paced edits, highlights, reviews, humor beats, subtitles, and audience retention.",
  },
  {
    title: "AI video development",
    titleAr:
      "\u062a\u0637\u0648\u064a\u0631 \u0641\u064a\u062f\u064a\u0648\u0647\u0627\u062a \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
    text: "AI-assisted concepts and scenes using Google Flow, Seedance 2.0, and editing workflows.",
  },
];
