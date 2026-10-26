import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';

/*
 * HOW TO ADD A NEW WORK
 * 1. Drop the image into src/assets/works/ (any sub-folder is fine).
 * 2. Add an item to a project below:
 *      { image: 'works/my-folder/my-image.webp', title: { ar: 'اسم العمل', en: 'Work name' } }
 *    or add a whole new project object to `projects`.
 * The list row, cursor preview, "Discover more" gallery and image optimisation are automatic.
 */

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/**/*.{webp,png,jpg,jpeg,avif}', {
  eager: true,
});

export function img(path: string): ImageMetadata {
  const mod = files[`../assets/${path}`];
  if (!mod) throw new Error(`Missing image: src/assets/${path}`);
  return mod.default;
}

type Bilingual = Record<Lang, string>;

export interface WorkItem {
  image: string;
  title: Bilingual;
  /** Set to show a before/after comparison slider; `image` is the "after". */
  before?: string;
  /** Wide items span the full gallery width. */
  wide?: boolean;
}

export interface Project {
  id: string;
  title: Bilingual;
  category: Bilingual;
  year: string;
  cover: string;
  summary: Bilingual;
  palette?: string[];
  items: WorkItem[];
}

const page = (n: number, title: Bilingual): WorkItem => ({
  image: `pages/p${String(n).padStart(2, '0')}.webp`,
  title,
  wide: true,
});

const identity: Bilingual = { ar: 'هوية بصرية', en: 'Visual identity' };

export const projects: Project[] = [
  {
    id: 'smash',
    title: { ar: 'Smash Burger', en: 'Smash Burger' },
    category: identity,
    year: '2025',
    cover: 'works/smash/model.webp',
    summary: {
      ar: 'تم تطوير الهوية البصرية لعلامة SMASH من خلال عملية تصميم مدروسة بدأت بفهم عميق لرؤية العميل وأهدافه، وانتهت ببناء نظام بصري متكامل يعكس شخصية البراند ويعزز حضوره في السوق.',
      en: 'A complete visual identity for SMASH, built through a careful process that started with the client’s vision and goals and ended in a coherent visual system that expresses the brand and strengthens its market presence.',
    },
    palette: ['#E9C46A', '#2A9D8F', '#D62828', '#F4A261', '#1D1D1D'],
    items: [
      page(4, { ar: 'الهوية', en: 'Identity' }),
      page(5, { ar: 'تصميم الشعار', en: 'Logo design' }),
      { image: 'works/smash/phone.webp', title: { ar: 'تطبيق على الموبايل', en: 'Mobile application' } },
      { image: 'works/smash/fries.webp', title: { ar: 'التغليف', en: 'Packaging' } },
      page(6, { ar: 'لوحة الألوان', en: 'Colour palette' }),
      page(7, { ar: 'الجبنة بتحوب معك', en: 'Campaign visual' }),
      page(8, { ar: 'No Rules. Just Smash!', en: 'No Rules. Just Smash!' }),
      { image: 'works/smash/table.webp', title: { ar: 'تجربة البراند', en: 'Brand in use' } },
    ],
  },
  {
    id: 'nawaf',
    title: { ar: 'نواف المطيري', en: 'Nawaf Al-Mutairi' },
    category: identity,
    year: '2025',
    cover: 'works/nawaf/stationery.webp',
    summary: {
      ar: 'شعار بأسلوب الخط العربي الحر يعكس الأصالة والهوية الثقافية العربية، مع لمسة عصرية تعزز من حضوره البصري، ويعبّر عن الهيبة والوقار والتميز.',
      en: 'A free-form Arabic calligraphy mark reflecting authenticity and Arab cultural identity, with a contemporary touch that expresses presence, dignity and distinction.',
    },
    palette: ['#8E2A2E', '#0B4038', '#DAD8D4', '#B07A2A', '#000000'],
    items: [
      page(9, { ar: 'فكرة الشعار', en: 'Logo concept' }),
      page(10, { ar: 'الشعار الرسمي', en: 'Official logo' }),
      page(11, { ar: 'لوحة الألوان', en: 'Colour palette' }),
      page(12, { ar: 'الخطوط', en: 'Typography' }),
      page(13, { ar: 'التطبيقات', en: 'Stationery' }),
    ],
  },
  {
    id: 'afia',
    title: { ar: 'مجمع العافية الطبي الخيري', en: 'Al-Afia Medical Complex' },
    category: identity,
    year: '2025',
    cover: 'works/afia/social.webp',
    summary: {
      ar: 'هوية بصرية تعكس رؤية إنسانية متكاملة للرعاية الصحية؛ شعار يجمع بين رمز القلب ورمز اليد في تداخل متناغم يجسّد قيم الرحمة والعطاء ممزوجة بالاحترافية الطبية والموثوقية.',
      en: 'An identity expressing a humane vision of healthcare: a mark that interlocks a heart and a hand, embodying compassion and giving alongside medical professionalism and trust.',
    },
    palette: ['#0D92F4', '#77CDFF', '#C62E2E', '#F95454', '#161515'],
    items: [
      page(14, { ar: 'تطوير الهوية', en: 'Identity development' }),
      page(15, { ar: 'فكرة الشعار', en: 'Logo concept' }),
      page(16, { ar: 'لوحة الألوان', en: 'Colour palette' }),
      page(17, { ar: 'فلسفة الهوية', en: 'Identity philosophy' }),
    ],
  },
  {
    id: 'logos',
    title: { ar: 'مجموعة شعارات', en: 'Logo collection' },
    category: { ar: 'شعارات', en: 'Logos' },
    year: '2021 — 2026',
    cover: 'covers/logos.webp',
    summary: {
      ar: 'شعارات لشركات تقنية، مكاتب هندسية، مساجد ومشاريع شخصية — من الأشكال الهندسية الحديثة إلى الخط العربي الحر والكوفي المربع.',
      en: 'Marks for tech companies, engineering offices, mosques and personal brands — from modern geometric forms to free Arabic calligraphy and square Kufic.',
    },
    items: [
      { image: 'logos/codeup.webp', title: { ar: 'CodeUP', en: 'CodeUP' } },
      { image: 'logos/link.webp', title: { ar: 'ورشات Link', en: 'Link Workshops' } },
      { image: 'logos/k.webp', title: { ar: 'K', en: 'K' } },
      { image: 'logos/mark.webp', title: { ar: 'رمز', en: 'Monogram' } },
      { image: 'logos/bracketflow.webp', title: { ar: 'Bracket Flow', en: 'Bracket Flow' } },
      { image: 'logos/barbus.webp', title: { ar: 'Barbus Code', en: 'Barbus Code' } },
      { image: 'logos/haykal.webp', title: { ar: 'هيكل', en: 'Haykal' } },
      { image: 'logos/kufic.webp', title: { ar: 'كوفي مربع', en: 'Square Kufic' } },
      { image: 'logos/osama.webp', title: { ar: 'م. أسامة الحسيني', en: 'Arc. Osama Al-Houssieni' } },
      { image: 'logos/madaryara.webp', title: { ar: 'مدار يارا', en: 'Madar Yara Co.' } },
      { image: 'logos/alanees.webp', title: { ar: 'جامع الأنيس', en: 'Al-Anees Mosque' } },
      { image: 'logos/musab.webp', title: { ar: 'جامع مصعب بن عمير', en: 'Musab bin Umair Mosque' } },
    ],
  },
  {
    id: 'social',
    title: { ar: 'منشورات وكاروسيل', en: 'Posts & carousels' },
    category: { ar: 'سوشل ميديا', en: 'Social media' },
    year: '2024 — 2026',
    cover: 'works/social/carousel.webp',
    summary: {
      ar: 'تصاميم لجميع منصات التواصل الاجتماعي: منشورات مناسبات، حملات توعوية وتصاميم كاروسيل تحكي قصة الخدمة خطوة بخطوة.',
      en: 'Designs for every social platform: occasion posts, awareness campaigns and carousels that tell a service’s story step by step.',
    },
    items: [
      { image: 'works/social/post-1.webp', title: { ar: 'منشور', en: 'Post' } },
      { image: 'works/social/post-2.webp', title: { ar: 'منشور', en: 'Post' } },
      { image: 'works/social/post-3.webp', title: { ar: 'عيد الفطر', en: 'Eid al-Fitr' } },
      { image: 'works/social/post-4.webp', title: { ar: 'رمضان', en: 'Ramadan' } },
      { image: 'works/social/carousel.webp', title: { ar: 'تصاميم كاروسيل', en: 'Carousel designs' }, wide: true },
    ],
  },
  {
    id: 'print',
    title: { ar: 'منشورات وبروشورات', en: 'Flyers & brochures' },
    category: { ar: 'مطبوعات', en: 'Print' },
    year: '2024 — 2026',
    cover: 'works/print/poster.webp',
    summary: {
      ar: 'منشورات إعلانية تناسب هوية الجهة وتطرح المعلومات بطريقة واضحة، وبروشورات شركات جاهزة للطباعة.',
      en: 'Promotional flyers that fit each client’s identity and present information clearly, plus print-ready company brochures.',
    },
    items: [
      page(24, { ar: 'تصميم منشورات', en: 'Flyers & posters' }),
      page(25, { ar: 'بروشور شركات', en: 'Company brochures' }),
      { image: 'works/print/poster.webp', title: { ar: 'ملصق', en: 'Poster' } },
    ],
  },
  {
    id: '3d',
    title: { ar: 'رندرات منتجات', en: 'Product renders' },
    category: { ar: 'تصاميم 3D', en: '3D design' },
    year: '2025',
    cover: 'works/3d/nike.webp',
    summary: {
      ar: 'نمذجة وإضاءة ورندر منتجات واقعية باستخدام Blender — من النموذج الخام حتى الصورة النهائية.',
      en: 'Modelling, lighting and photoreal product rendering in Blender — from the raw model to the final image.',
    },
    items: [
      { image: 'works/3d/prime.webp', title: { ar: 'Prime', en: 'Prime' } },
      { image: 'works/3d/perfume.webp', title: { ar: 'عطر', en: 'Perfume' } },
      { image: 'works/3d/nike.webp', title: { ar: 'Nike', en: 'Nike' } },
      { image: 'works/3d/tripod.webp', title: { ar: 'حامل كاميرا', en: 'Tripod' } },
      {
        image: 'works/3d/after.webp',
        before: 'works/3d/before.webp',
        title: { ar: 'قبل وبعد الرندر', en: 'Before / after render' },
      },
    ],
  },
];
