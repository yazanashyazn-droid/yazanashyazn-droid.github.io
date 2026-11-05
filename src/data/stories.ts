import type { Lang } from '../i18n/ui';

type Bilingual = Record<Lang, string>;

export interface StoryStep {
  title: Bilingual;
  text: Bilingual;
  /** Optional image in src/assets/sketches/. The step simply shows text until the file exists. */
  sketch?: string;
}

export interface Story {
  brief: Bilingual;
  idea: Bilingual;
  result: Bilingual;
  steps: StoryStep[];
}

/*
 * CASE STUDIES, keyed by project id.
 * Drafted from the portfolio's own text and visuals: no invented numbers or client quotes.
 * To add a sketch, save it as src/assets/sketches/<project>-<step>.webp
 */
export const stories: Record<string, Story> = {
  smash: {
    brief: {
      ar: 'برغر سريع يحتاج شخصية جريئة تميّزه بين مطاعم تتشابه في كل شيء، وهوية تعمل بنفس القوة على الغلاف والموبايل والإعلان.',
      en: 'A fast-food burger brand that needed a bold personality in a crowded category, and an identity as strong on packaging as on mobile and in ads.',
    },
    idea: {
      ar: 'بدأت الفكرة من اسم العلامة: قبضة تضرب البرغر. فعل الـ Smash نفسه صار الرمز، وصارت الجملة "No Rules. Just Smash!" نبرة الكلام كلها.',
      en: 'The idea came from the name itself: a fist smashing a burger. The action became the symbol, and “No Rules. Just Smash!” set the tone of voice.',
    },
    result: {
      ar: 'نظام بصري متكامل: شعار دائري، لوحة ألوان دافئة وجريئة، نمط للتغليف، وحملات بالعربي والإنجليزي بنفس الروح.',
      en: 'A complete visual system: a round badge logo, a warm and bold palette, a packaging pattern, and campaigns in Arabic and English with one spirit.',
    },
    steps: [
      {
        title: { ar: 'الرمز', en: 'The symbol' },
        text: { ar: 'تجارب على القبضة والبرغر حتى صار الشكل يُقرأ بنظرة واحدة، حتى بحجم صغير.', en: 'Studies of the fist and burger until the mark read at a glance, even at a small size.' },
        sketch: 'sketches/smash-1.webp',
      },
      {
        title: { ar: 'التغليف', en: 'Packaging' },
        text: { ar: 'تحويل عناصر البرغر إلى نمط يتكرر على الورق والعلب، فيبقى البراند واضحًا من بعيد.', en: 'Burger elements became a repeating pattern for wraps and boxes, so the brand reads from a distance.' },
        sketch: 'sketches/smash-2.webp',
      },
      {
        title: { ar: 'الحملة', en: 'The campaign' },
        text: { ar: 'نقل نبرة البراند إلى عناوين كبيرة بالعربي، مثل "الجبنة بتحوب معك"، بخفة ظل قريبة من الناس.', en: 'The brand voice moved into big Arabic headlines with a playful, local sense of humour.' },
        sketch: 'sketches/smash-3.webp',
      },
    ],
  },
  nawaf: {
    brief: {
      ar: 'هوية شخصية لاسم يحمل حضورًا اجتماعيًا، تحتاج إلى الهيبة والوقار دون أن تبدو قديمة.',
      en: 'A personal identity for a name with social standing: it needed dignity and presence without looking dated.',
    },
    idea: {
      ar: 'الخط العربي الحر هو أقرب طريقة لتوقيع شخصي: حروف الاسم نفسها تصنع الشكل، فلا يحتاج الشعار إلى رمز منفصل.',
      en: 'Free Arabic calligraphy is the closest thing to a personal signature: the letters of the name form the mark, with no separate symbol.',
    },
    result: {
      ar: 'شعار خطي بلمسة عصرية، مع لوحة ألوان من الأحمر العميق والذهبي، وتطبيقات على القرطاسية.',
      en: 'A calligraphic logo with a contemporary touch, a palette of deep red and gold, and a stationery set.',
    },
    steps: [
      {
        title: { ar: 'الحروف', en: 'The letters' },
        text: { ar: 'البحث عن حركة تربط "نواف" و"المطيري" في كتلة واحدة متوازنة.', en: 'Finding a movement that ties both words into one balanced shape.' },
        sketch: 'sketches/nawaf-1.webp',
      },
      {
        title: { ar: 'الضبط', en: 'Refining' },
        text: { ar: 'تنظيف الخط وضبط السماكات، حتى يبقى الشعار واضحًا على بطاقة صغيرة وعلى لوحة كبيرة.', en: 'Cleaning the lines and weights so the logo holds on a small card and a large board.' },
        sketch: 'sketches/nawaf-2.webp',
      },
      {
        title: { ar: 'التطبيق', en: 'In use' },
        text: { ar: 'نقل الشعار إلى الدفتر والبطاقات والأوراق الرسمية، مع استخدامه كخلفية هادئة.', en: 'Applying the mark to notebooks, cards and letterheads, also as a quiet background.' },
        sketch: 'sketches/nawaf-3.webp',
      },
    ],
  },
  afia: {
    brief: {
      ar: 'مجمع طبي خيري يحتاج هوية تجمع الطمأنينة الإنسانية مع الجدية المهنية، ويفهمها كل الناس.',
      en: 'A charitable medical complex that needed an identity combining human warmth with professional seriousness, understood by everyone.',
    },
    idea: {
      ar: 'قلب ويد يتداخلان في شكل واحد: القلب للرحمة واليد للعطاء، والتداخل بينهما يقول إن الرعاية هنا عمل واحد.',
      en: 'A heart and a hand interlock in one shape: the heart for compassion, the hand for giving, joined as a single act of care.',
    },
    result: {
      ar: 'شعار واضح بالأحمر والأزرق، ونظام ألوان وخطوط جاهز للاستخدام في اللوحات والمطبوعات والسوشل ميديا.',
      en: 'A clear red and blue logo, with a colour and type system ready for signage, print and social media.',
    },
    steps: [
      {
        title: { ar: 'الرمز', en: 'The symbol' },
        text: { ar: 'دمج القلب واليد بخط متصل، دون تفاصيل طبية مكررة مثل الصليب أو السماعة.', en: 'Merging heart and hand in one flowing line, avoiding the usual medical clichés.' },
        sketch: 'sketches/afia-1.webp',
      },
      {
        title: { ar: 'الألوان', en: 'Colour' },
        text: { ar: 'الأزرق للثقة الطبية والأحمر للدفء الإنساني، ومستويات منهما تكفي لكل الاستخدامات.', en: 'Blue for medical trust, red for human warmth, with tints that cover every use.' },
        sketch: 'sketches/afia-2.webp',
      },
      {
        title: { ar: 'الفلسفة', en: 'The philosophy' },
        text: { ar: 'توثيق معنى الهوية حتى يستخدمها فريق المجمع بثبات في كل مكان.', en: 'Documenting the meaning of the identity so the team can apply it consistently.' },
      },
    ],
  },
  logos: {
    brief: {
      ar: 'جهات مختلفة جدًا: شركات تقنية، مكاتب هندسية، مساجد ومشاريع شخصية. لكل واحدة لغة بصرية خاصة بها.',
      en: 'Very different clients: tech firms, engineering offices, mosques and personal brands, each with its own visual language.',
    },
    idea: {
      ar: 'لا أسلوب واحد مفروض على الجميع. أبدأ من معنى الاسم، ثم أختار الأداة: شكل هندسي حديث، خط عربي حر، أو كوفي مربع.',
      en: 'No single style forced on everyone. I start from the meaning of the name, then choose the tool: modern geometry, free calligraphy or square Kufic.',
    },
    result: {
      ar: 'مجموعة شعارات يجمعها الوضوح والبساطة، وتعمل بلون واحد وبأحجام صغيرة.',
      en: 'A collection united by clarity and simplicity, working in one colour and at small sizes.',
    },
    steps: [
      {
        title: { ar: 'المعنى', en: 'Meaning' },
        text: { ar: 'تفكيك الاسم والنشاط إلى فكرة واحدة يمكن رسمها.', en: 'Reducing the name and activity to one idea that can be drawn.' },
        sketch: 'sketches/logos-1.webp',
      },
      {
        title: { ar: 'الشبكة', en: 'The grid' },
        text: { ar: 'بناء الأشكال على شبكة دقيقة، وهنا تساعدني خلفيتي كمهندس معماري.', en: 'Building shapes on a precise grid, where my architecture background helps.' },
        sketch: 'sketches/logos-2.webp',
      },
      {
        title: { ar: 'الاختبار', en: 'Testing' },
        text: { ar: 'تجربة الشعار بالأبيض والأسود وبحجم الأيقونة قبل اعتماده.', en: 'Testing each logo in black and white and at icon size before approval.' },
      },
    ],
  },
  social: {
    brief: {
      ar: 'المحتوى يمر بسرعة على الشاشة، فلا بد أن يوصل المنشور رسالته في ثوانٍ مع بقائه ضمن هوية الجهة.',
      en: 'Content moves fast on screen, so each post has to land its message in seconds while staying true to the client’s identity.',
    },
    idea: {
      ar: 'التعامل مع كل منشور كملصق صغير: عنوان واحد واضح، وتسلسل بصري يقود العين، ومساحة كافية حول النص.',
      en: 'Treating each post as a small poster: one clear headline, a visual order that leads the eye, and room around the words.',
    },
    result: {
      ar: 'منشورات مناسبات وحملات توعوية وتصاميم كاروسيل متصلة، تحكي القصة خطوة بخطوة مع كل سحبة.',
      en: 'Occasion posts, awareness campaigns and seamless carousels that tell the story one swipe at a time.',
    },
    steps: [
      {
        title: { ar: 'الرسالة', en: 'The message' },
        text: { ar: 'تحديد الجملة الأهم في المنشور قبل فتح أي برنامج.', en: 'Choosing the single most important line before opening any software.' },
        sketch: 'sketches/social-1.webp',
      },
      {
        title: { ar: 'التسلسل', en: 'The flow' },
        text: { ar: 'في الكاروسيل، تتصل العناصر بين الشرائح فتدفع الناس إلى السحب.', en: 'In carousels, elements continue across slides, which invites the next swipe.' },
        sketch: 'sketches/social-2.webp',
      },
      {
        title: { ar: 'النظام', en: 'The system' },
        text: { ar: 'قوالب مرنة تحافظ على شكل الحساب مهما زادت المنشورات.', en: 'Flexible templates that keep the account consistent as posts add up.' },
      },
    ],
  },
  print: {
    brief: {
      ar: 'مطبوعات يقرؤها الناس باليد: منشورات وبروشورات يجب أن تشرح الكثير من المعلومات دون ازدحام.',
      en: 'Print people hold in their hands: flyers and brochures that must explain a lot without feeling crowded.',
    },
    idea: {
      ar: 'التفكير في الورقة كمبنى: لكل معلومة مكانها، وتقود الطيّات القارئ من الغلاف إلى التفاصيل.',
      en: 'Thinking of the page as a building: every piece of information has its place, and the folds lead the reader from cover to detail.',
    },
    result: {
      ar: 'تصاميم تناسب هوية كل جهة وتعرض المعلومات بوضوح، وجاهزة للطباعة.',
      en: 'Designs that fit each client’s identity, present information clearly and are ready for print.',
    },
    steps: [
      {
        title: { ar: 'المحتوى', en: 'Content' },
        text: { ar: 'ترتيب النص حسب الأهمية قبل التفكير في الشكل.', en: 'Ordering the text by importance before thinking about form.' },
      },
      {
        title: { ar: 'التخطيط', en: 'Layout' },
        text: { ar: 'توزيع الأقسام على الطيّات، ومراعاة ما يراه القارئ مع كل فتحة.', en: 'Placing sections across the folds, considering what the reader sees at each opening.' },
        sketch: 'sketches/print-1.webp',
      },
      {
        title: { ar: 'الطباعة', en: 'Production' },
        text: { ar: 'تجهيز الألوان والهوامش والدقة حتى تخرج النسخة كما صُممت.', en: 'Preparing colour, bleed and resolution so the printed piece matches the design.' },
      },
    ],
  },
  '3d': {
    brief: {
      ar: 'صور منتجات واقعية دون جلسة تصوير، مع حرية كاملة في الزاوية والإضاءة والمادة.',
      en: 'Photoreal product images without a photo shoot, with full freedom over angle, light and material.',
    },
    idea: {
      ar: 'بناء كل منتج من الصفر في Blender، ومعاملة الإضاءة كما في استوديو تصوير حقيقي.',
      en: 'Building each product from scratch in Blender, and treating light as in a real photo studio.',
    },
    result: {
      ar: 'رندرات جاهزة للإعلان، ومجسّمات تفاعلية هنا تدوّرها وتفككها وترى خطوط الميش الخاصة بها.',
      en: 'Ad-ready renders, plus interactive models here that you can rotate, explode and inspect down to their mesh lines.',
    },
    steps: [
      {
        title: { ar: 'النمذجة', en: 'Modelling' },
        text: { ar: 'بناء الشكل بدقة من الصور والقياسات، مع ميش نظيف يتحمل التفاصيل.', en: 'Building the form accurately from references, with a clean mesh that holds the detail.' },
        sketch: 'sketches/3d-1.webp',
      },
      {
        title: { ar: 'المواد', en: 'Materials' },
        text: { ar: 'ضبط لمعة البلاستيك والمعدن والملصقات حتى تقترب من الواقع.', en: 'Tuning the sheen of plastic, metal and labels until they feel real.' },
      },
      {
        title: { ar: 'الإضاءة', en: 'Lighting' },
        text: { ar: 'توزيع الأضواء لإبراز شكل المنتج، ثم الرندر النهائي.', en: 'Placing lights to reveal the product’s form, then the final render.' },
      },
    ],
  },
};

/*
 * TESTIMONIALS: the section stays hidden until this list has real quotes.
 * Only add words a client actually said, with their permission.
 * { quote: { ar: '...', en: '...' }, name: { ar: '...', en: '...' }, role: { ar: '...', en: '...' } }
 */
export interface Testimonial {
  quote: Bilingual;
  name: Bilingual;
  role: Bilingual;
}

export const testimonials: Testimonial[] = [];
