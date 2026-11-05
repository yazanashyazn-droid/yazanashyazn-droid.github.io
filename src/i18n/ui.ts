// All site copy in both languages. Arabic text comes from the portfolio PDF.
export const languages = { ar: 'العربية', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'ar';

type Bilingual = Record<Lang, string>;

export const ui = {
  ar: {
    'meta.title': 'يزن أبوشعر | مصمم غرافيك ومهندس معماري',
    'meta.description':
      'بورتفوليو يزن أبوشعر — مهندس معماري ومصمم غرافيك من دمشق: هويات بصرية، شعارات، سوشل ميديا، مطبوعات وتصاميم ثلاثية الأبعاد.',
    'skip': 'انتقل إلى المحتوى',
    'loader.label': 'جارٍ التحميل',
    'nav.home': 'الرئيسية',
    'nav.work': 'الأعمال',
    'nav.about': 'عني',
    'nav.faq': 'أسئلة شائعة',
    'nav.contact': 'تواصل',
    'nav.menu': 'القائمة',
    'nav.close': 'إغلاق',
    'nav.cta': 'لنعمل معاً',
    'nav.main': 'القائمة الرئيسية',
    'lang.switch': 'EN',
    'lang.switchLabel': 'English version',
    'hero.kicker': 'Graphic',
    'hero.title1': 'Design',
    'hero.title2': 'Portfolio',
    'hero.year': '2026',
    'hero.role': 'مهندس معماري • مصمم غرافيك',
    'hero.scroll': 'مرّر للاكتشاف',
    'statement':
      'مهندس معماري ومصمم غرافيك من دمشق. أحوّل الأفكار إلى *هويات بصرية* و*شعارات* ومحتوى يترك أثراً — بدقة *المهندس* وخيال *المصمم.*',
    'statement.sub':
      'أجمع بين التصميم المعماري والإبداع البصري، من الشعار الأول حتى آخر منشور على السوشل ميديا، لأقدّم حلولاً متكاملة تجمع الجمال الوظيفي والهوية المميزة.',
    'work.kicker': 'أعمال مختارة',
    'work.title': 'أعمال تحكي|قصة كل علامة',
    'ig.posts': 'منشور',
    'ig.sections': 'أقسام',
    'ig.since': 'منذ',
    'ig.bio': 'مهندس معماري ومصمم غرافيك من دمشق. هويات، سوشل ميديا، 3D وموشن.',
    'ig.follow': 'متابعة',
    'ig.message': 'مراسلة',
    'ig.back': 'رجوع',
    'ig.feed': 'المنشورات',
    'ig.like': 'إعجاب',
    'ig.save': 'حفظ',
    'ig.home': 'المنشورات',
    'ig.profile': 'الملف الشخصي',
    'ig.prev': 'السابق',
    'ig.next': 'التالي',
    'ig.open': 'افتح المنشور',
    'ig.hint': 'جرّبه بنفسك: افتح أي منشور، اسحب الكاروسيل، واضغط مرتين للإعجاب.',
    'tools.group.design': 'التصميم',
    'tools.group.motion': 'الموشن والفيديو',
    'tools.group.arch': '3D والعمارة',
    'tools.group.render': 'الرندر',
    'tools.group.ai': 'الذكاء الاصطناعي',
    'work.view': 'عرض',
    'work.more': 'اكتشف المزيد',
    'work.close': 'إغلاق المعرض',
    'work.prev': 'المشروع السابق',
    'work.next': 'المشروع التالي',
    'work.palette': 'لوحة الألوان — اضغط للنسخ',
    'work.copied': 'تم النسخ',
    'work.items': 'عمل',
    'work.before': 'قبل',
    'work.after': 'بعد',
    'work.compare': 'اسحب للمقارنة بين قبل وبعد الرندر',
    'sticker': 'هويات بصرية ● شعارات ● سوشل ميديا ● مطبوعات ● تصاميم 3D ● تصميم معماري ●',
    'services.kicker': 'الخدمات',
    'services.title': 'شو بقدر|أعملك؟',
    'about.kicker': 'عني',
    'about.name': 'يزن أبوشعر',
    'about.location': 'دمشق، سوريا',
    'about.role': 'مهندس معماري • مصمم غرافيك • مونتير',
    'about.p1':
      'مهندس معماري متعدد المهارات، أمتلك خبرة متنوعة تجمع بين التصميم المعماري والإبداع البصري، حيث أعمل أيضاً كمصمم غرافيك ومونتير، بالإضافة إلى خبرتي في إدارة منصات التواصل الاجتماعي وصناعة المحتوى الرقمي.',
    'about.p2':
      'أتميز بشغفي الكبير في العمل الجماعي والتعاون ضمن فرق متعددة التخصصات، وأمتلك مهارات تواصل فعالة وقدرة على إدارة الوقت وتنظيم المهام، مما يساعدني على العمل تحت الضغط وتحقيق الأهداف ضمن المواعيد المحددة.',
    'experience.title': 'الخبرات',
    'education.title': 'التعليم',
    'tools.title': 'الأدوات',
    'present': 'الآن',
    'faq.kicker': 'أسئلة شائعة',
    'faq.title': 'عندك سؤال؟|هي الأجوبة',
    'footer.kicker': 'جاهز نبلّش؟',
    'footer.title1': 'خلينا',
    'footer.title2': 'نشتغل سوا',
    'footer.cta': 'راسلني على واتساب',
    'footer.email': 'البريد الإلكتروني',
    'footer.phone': 'الهاتف',
    'footer.instagram': 'إنستغرام',
    'footer.explore': 'استكشف',
    'footer.contact': 'تواصل',
    'footer.location': 'دمشق، سوريا — أعمل عن بُعد مع العملاء في كل مكان',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.top': 'العودة للأعلى',
    'hero.city': 'دمشق',
    'hero.date': 'متاح لمشاريع جديدة',
    'hero.info': 'مهندس معماري ومصمم غرافيك. هويات بصرية، شعارات، سوشل ميديا، مطبوعات وتصاميم 3D.',
    'hero.reel': 'أعمال مختارة',
    'hero.scrollMore': 'مرّر للمزيد',
    'hero.titleA': 'GRAPHIC',
    'hero.titleB': 'DESIGN',
    'hero.titleC': 'BY. YAZAN',
    'side.available': 'متاح للعمل',
    'statement2': '*مهندس معماري* {0} و*مصمم غرافيك* {1} من دمشق. بحوّل الأفكار {2} لهويات *بتحكي قصة.*',
    'facts.years': '05 سنين',
    'facts.yearsLabel': '[ تصميم غرافيك ]',
    'facts.yearsText': 'من 2021 وأنا عم صمم هويات وشعارات ومحتوى رقمي لشركات ومكاتب هندسية ومشاريع شخصية، بروح منفتحة وتفاصيل مدروسة.',
    'facts.brand': 'YZN.',
    'facts.brandLabel': '[ الاستوديو ]',
    'facts.brandText': 'YZN هو اسمي وتوقيعي. بجمع فيه دقة المهندس المعماري مع خيال المصمم، لأطلع بشغل بيعيش وبيترك أثر.',
    'manifesto': 'وسط (ضجيج الذكاء الاصطناعي) بآمن إنو التصميم مو بس مهنة. هو (أسلوب حياة). وكل مشروع (قصة) لازم تنحكى صح.',
    'manifesto.side': 'ما بصمم شكل وبس. بسمع لكل عميل، وبفهم قصته قبل ما ارسم أول خط.',
    'reel.play': 'شوف الشوريل',
    'reel.close': 'إغلاق الفيديو',
    'reel.dismiss': 'إخفاء الفيديو',
    'eyes.hint': '[ مرّر الماوس على العيون ]',
    'stack.kicker': 'من الورق للشاشة',
    'stack.title': 'أعمال بتنحس|قبل ما تنشاف',
    'stack.hint': 'اضغط على أي عمل لتشوف المشروع كامل',
    'rings.kicker': 'المسيرة',
    'rings.title': 'خمس سنين|من الشغل',
  },
  en: {
    'meta.title': 'Yazan Aboushaar | Graphic Designer & Architect',
    'meta.description':
      'Portfolio of Yazan Aboushaar — architect and graphic designer based in Damascus: visual identities, logos, social media, print and 3D design.',
    'skip': 'Skip to content',
    'loader.label': 'Loading',
    'nav.home': 'Home',
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.cta': "Let's work",
    'nav.main': 'Main menu',
    'lang.switch': 'ع',
    'lang.switchLabel': 'النسخة العربية',
    'hero.kicker': 'Graphic',
    'hero.title1': 'Design',
    'hero.title2': 'Portfolio',
    'hero.year': '2026',
    'hero.role': 'Architect • Graphic designer',
    'hero.scroll': 'Scroll to explore',
    'statement':
      'Architect and graphic designer from Damascus. I turn ideas into *identities,* *logos* and content that leave a mark — with an *engineer’s* precision and a *designer’s* imagination.',
    'statement.sub':
      'I bring architectural design and visual creativity together, from the first logo sketch to the last social post, delivering complete solutions that balance function, beauty and a distinctive identity.',
    'work.kicker': 'Selected work',
    'work.title': 'Work that tells|every brand’s story',
    'ig.posts': 'posts',
    'ig.sections': 'sections',
    'ig.since': 'since',
    'ig.bio': 'Architect and graphic designer from Damascus. Identity, social, motion and 3D.',
    'ig.follow': 'Follow',
    'ig.message': 'Message',
    'ig.back': 'Back',
    'ig.feed': 'Posts',
    'ig.like': 'Like',
    'ig.save': 'Save',
    'ig.home': 'Posts',
    'ig.profile': 'Profile',
    'ig.prev': 'Previous',
    'ig.next': 'Next',
    'ig.open': 'Open post',
    'ig.hint': 'Try it yourself: open any post, swipe the carousel, double-tap to like.',
    'tools.group.design': 'Design',
    'tools.group.motion': 'Motion & video',
    'tools.group.arch': 'Architecture & 3D',
    'tools.group.render': 'Rendering',
    'tools.group.ai': 'AI',
    'work.view': 'View',
    'work.more': 'Discover more',
    'work.close': 'Close gallery',
    'work.prev': 'Previous project',
    'work.next': 'Next project',
    'work.palette': 'Colour palette — click to copy',
    'work.copied': 'Copied',
    'work.items': 'pieces',
    'work.before': 'Before',
    'work.after': 'After',
    'work.compare': 'Drag to compare before and after render',
    'sticker': 'Visual identities ● Logos ● Social media ● Print ● 3D design ● Architecture ●',
    'services.kicker': 'Services',
    'services.title': 'What I can|do for you',
    'about.kicker': 'About',
    'about.name': 'Yazan Aboushaar',
    'about.location': 'Damascus, Syria',
    'about.role': 'Architect • Graphic designer • Video editor',
    'about.p1':
      'A multi-skilled architect with experience spanning architectural design and visual creativity. I also work as a graphic designer and video editor, and I manage social media platforms and create digital content.',
    'about.p2':
      'I love teamwork and collaborating in multidisciplinary teams. I communicate clearly, manage time and organise tasks well, which helps me work under pressure and hit deadlines.',
    'experience.title': 'Experience',
    'education.title': 'Education',
    'tools.title': 'Tools',
    'present': 'Now',
    'faq.kicker': 'FAQ',
    'faq.title': 'Questions?|Here are the answers',
    'footer.kicker': 'Ready to start?',
    'footer.title1': "Let's work",
    'footer.title2': 'together',
    'footer.cta': 'Message me on WhatsApp',
    'footer.email': 'Email',
    'footer.phone': 'Phone',
    'footer.instagram': 'Instagram',
    'footer.explore': 'Explore',
    'footer.contact': 'Contact',
    'footer.location': 'Damascus, Syria — working remotely with clients everywhere',
    'footer.rights': 'All rights reserved',
    'footer.top': 'Back to top',
    'hero.city': 'Damascus',
    'hero.date': 'Booking new projects',
    'hero.info': 'Architect and graphic designer. Visual identities, logos, social media, print and 3D.',
    'hero.reel': 'Selected work',
    'hero.scrollMore': 'Scroll more',
    'hero.titleA': 'GRAPHIC',
    'hero.titleB': 'DESIGN',
    'hero.titleC': 'BY. YAZAN',
    'side.available': 'Available for work',
    'statement2': 'An *architect* {0} and *graphic designer* {1} from Damascus. I turn ideas {2} into identities that *tell a story.*',
    'facts.years': '05 YEARS',
    'facts.yearsLabel': '[ GRAPHIC DESIGN ]',
    'facts.yearsText': 'Since 2021 I have designed identities, logos and digital content for companies, engineering offices and personal brands — openly, and with considered detail.',
    'facts.brand': 'YZN.',
    'facts.brandLabel': '[ THE STUDIO ]',
    'facts.brandText': 'YZN is my name and my signature: an architect’s precision with a designer’s imagination, to make work that lives and leaves a mark.',
    'manifesto': 'Amid the (noise of AI) I believe design is not merely a profession. It is a (way of life). And every project is a (story) worth telling right.',
    'manifesto.side': 'I don’t just design shapes. I listen to every client and understand their story before drawing the first line.',
    'reel.play': 'Watch the showreel',
    'reel.close': 'Close video',
    'reel.dismiss': 'Hide video',
    'eyes.hint': '[ HOVER THE EYES ]',
    'stack.kicker': 'From paper to screen',
    'stack.title': 'Work you feel|before you see',
    'stack.hint': 'Tap any piece to open the full project',
    'rings.kicker': 'The journey',
    'rings.title': 'Five years|of work',
  },
} as const;

export type UIKey = keyof (typeof ui)['ar'];

export function useT(lang: Lang) {
  return (key: UIKey) => ui[lang][key] ?? ui[defaultLang][key];
}

export function pick(value: Bilingual, lang: Lang) {
  return value[lang];
}

export const contact = {
  emailUser: 'yazan.ash.yazn',
  emailDomain: 'gmail.com',
  phone: '963962454244',
  phoneDisplay: '+963 962 454 244',
  instagram: 'yazanaboshaar',
};

export interface ExperienceItem {
  from: string;
  to: string | null; // null = present
  org: Bilingual;
  role: Bilingual;
}

export const experience: ExperienceItem[] = [
  {
    from: '2025',
    to: null,
    org: { ar: 'فيجيناري (مكتب هندسي)', en: 'Visionary (engineering office)' },
    role: { ar: 'مصمم – مهندس', en: 'Designer & engineer' },
  },
  {
    from: '2025',
    to: '2026',
    org: { ar: 'مكتب هندسي – السعودية', en: 'Engineering office – Saudi Arabia' },
    role: { ar: 'تصاميم هندسية متنوعة (2D – 3D)', en: 'Engineering design (2D – 3D)' },
  },
  {
    from: '2024',
    to: '2026',
    org: { ar: 'شركة مدار يارا', en: 'Madar Yara Co.' },
    role: { ar: 'تجهيز للمعرض – تصاميم مطبوعات', en: 'Exhibition setup – print design' },
  },
  {
    from: '2022',
    to: '2026',
    org: { ar: 'مجموعة تويني تو المعمارية', en: 'Twenty Two Architectural Group' },
    role: { ar: 'تطوع: غرافيك ديزاينر – مونتير', en: 'Volunteer: graphic designer – video editor' },
  },
  {
    from: '2021',
    to: null,
    org: { ar: 'أعمال حرة', en: 'Freelance' },
    role: { ar: 'غرافيك ديزاينر', en: 'Graphic designer' },
  },
];

export const education = {
  from: '2021',
  to: '2025',
  degree: { ar: 'بكالوريوس هندسة معمارية', en: 'B.Sc. in Architecture' },
  school: {
    ar: 'الجامعة الدولية الخاصة للعلوم والتكنولوجيا – IUST',
    en: 'International University for Science & Technology – IUST',
  },
};

// Grouped by discipline. Icons live in src/assets/tools/<icon>.webp
export const toolGroups = [
  {
    key: 'tools.group.design',
    items: [
      { label: 'Photoshop', icon: 'photoshop' },
      { label: 'Illustrator', icon: 'illustrator' },
      { label: 'InDesign', icon: 'indesign' },
    ],
  },
  {
    key: 'tools.group.motion',
    items: [
      { label: 'Premiere Pro', icon: 'premiere' },
      { label: 'After Effects', icon: 'aftereffects' },
    ],
  },
  {
    key: 'tools.group.render',
    items: [
      { label: 'D5 Render', icon: 'd5render' },
      { label: 'Lumion', icon: 'lumion' },
    ],
  },
  {
    key: 'tools.group.arch',
    items: [
      { label: 'AutoCAD', icon: 'autocad' },
      { label: 'Revit', icon: 'revit' },
      { label: 'SketchUp', icon: 'sketchup' },
      { label: '3ds Max', icon: '3dsmax' },
      { label: 'Blender', icon: 'blender' },
    ],
  },
  {
    key: 'tools.group.ai',
    items: [
      { label: 'ChatGPT', icon: 'chatgpt' },
      { label: 'Claude', icon: 'claude' },
      { label: 'Gemini', icon: 'gemini' },
      { label: 'Higgsfield', icon: 'higgsfield' },
    ],
  },
] as const;

// Draft answers — Yazan to review and adjust.
export const faq: { q: Bilingual; a: Bilingual }[] = [
  {
    q: { ar: 'كيف نبدأ العمل سوا؟', en: 'How do we start working together?' },
    a: {
      ar: 'بتتواصل معي على واتساب أو الإيميل، منحكي عن فكرتك وأهدافك، وبعدها ببعتلك عرض فيه المراحل والمدة والتكلفة.',
      en: 'Reach out on WhatsApp or email, we talk through your idea and goals, then I send you a proposal with phases, timeline and cost.',
    },
  },
  {
    q: { ar: 'قديش بياخد تصميم هوية بصرية؟', en: 'How long does a visual identity take?' },
    a: {
      ar: 'عادةً من أسبوعين لأربع أسابيع حسب حجم المشروع وعدد التطبيقات المطلوبة.',
      en: 'Usually two to four weeks, depending on the scope and the number of applications.',
    },
  },
  {
    q: { ar: 'شو لازم ابعتلك لنبلّش؟', en: 'What should I send you to get started?' },
    a: {
      ar: 'نبذة عن مشروعك، الجمهور المستهدف، أمثلة بتعجبك، وأي شعار أو مواد موجودة عندك.',
      en: 'A short brief about your project, your audience, examples you like, and any existing logo or material.',
    },
  },
  {
    q: { ar: 'كم مرة فيني اطلب تعديلات؟', en: 'How many revisions do I get?' },
    a: {
      ar: 'كل مشروع إلو جولات تعديل متفق عليها من البداية، لنوصل للنتيجة اللي بترضيك.',
      en: 'Every project includes revision rounds agreed upfront, so we reach a result you are happy with.',
    },
  },
  {
    q: { ar: 'بأي صيغ بستلم الملفات؟', en: 'Which file formats do I receive?' },
    a: {
      ar: 'ملفات المصدر (AI / PSD) وملفات جاهزة للطباعة والويب (PDF, PNG, SVG) مع دليل استخدام مختصر للهوية.',
      en: 'Source files (AI / PSD) plus print- and web-ready files (PDF, PNG, SVG) and a short brand usage guide.',
    },
  },
  {
    q: { ar: 'بتشتغل مع عملاء من برا سوريا؟', en: 'Do you work with clients outside Syria?' },
    a: {
      ar: 'أكيد، بشتغل عن بُعد مع عملاء داخل سوريا وخارجها مثل السعودية.',
      en: 'Yes — I work remotely with clients in Syria and abroad, including Saudi Arabia.',
    },
  },
];
