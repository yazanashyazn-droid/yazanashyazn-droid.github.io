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

export const hasImg = (path: string) => Boolean(files[`../assets/${path}`]);

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

export interface ModelVariant {
  name: Bilingual;
  /** Colour of the swatch button */
  swatch: string;
  /** Material name in the GLB -> linear RGB */
  colors: Record<string, [number, number, number]>;
  /** Rotates the hue of image textures, in degrees (for label colourways) */
  hue?: number;
}

export interface ModelItem {
  /** Path under public/, e.g. models/tripod.glb */
  src: string;
  title: Bilingual;
  variants?: ModelVariant[];
  /** Parts spread out along this axis in the exploded view; without it they spread from the centre. */
  explodeAxis?: [number, number, number];
  /** Total width of that spread, where the model's largest side is 1. */
  explodeSpread?: number;
}

export interface FeedPost {
  /** One image is a post, several are a swipeable carousel. */
  images: string[];
  caption: Bilingual;
  /** Optional story circle at the top of the profile. */
  highlight?: Bilingual;
  square?: boolean;
}

export interface Project {
  id: string;
  title: Bilingual;
  category: Bilingual;
  year: string;
  /** Shown everywhere outside the gallery, always framed 4:3. New covers go in src/assets/covers/. */
  cover: string;
  summary: Bilingual;
  palette?: string[];
  items: WorkItem[];
  /** Interactive 3D stage with X-ray view, shown above the gallery grid. */
  models?: ModelItem[];
  /** Replaces the gallery grid with the Instagram phone mockup. */
  feed?: FeedPost[];
}

const page = (n: number, title: Bilingual): WorkItem => ({
  image: `pages/p${String(n).padStart(2, '0')}.webp`,
  title,
  wide: true,
});

const identity: Bilingual = { ar: 'هوية بصرية', en: 'Visual identity' };

/*
 * INSTAGRAM PHONE (social media gallery)
 * To add a post: drop the image into src/assets/works/social/feed/ (4:5 looks best) and add a line
 * at the top of this list. The profile grid, feed and story circles build themselves.
 */
const socialFeed: FeedPost[] = [
  {
    images: [1, 2, 3, 4, 5].map((n) => `works/social/feed/yzn-${n}.webp`),
    caption: { ar: 'كاروسيل تعريفي متصل: مين YZN وشو خدماتنا. اسحب للآخر.', en: 'A seamless intro carousel: who YZN is and what we do. Swipe to the end.' },
    highlight: { ar: 'كاروسيل', en: 'Carousel' },
  },
  {
    images: ['works/social/feed/eid.webp'],
    caption: { ar: 'بطاقة تهنئة بعيد الفطر لأسرة جامع الأنيس.', en: 'Eid al-Fitr greeting for the Al-Anees Mosque family.' },
    highlight: { ar: 'عيد الفطر', en: 'Eid' },
  },
  {
    images: ['works/social/feed/smash.webp'],
    caption: { ar: 'الجبنة بتحوب معك: حملة Smash Burger.', en: 'A campaign visual for Smash Burger.' },
    highlight: { ar: 'Smash', en: 'Smash' },
    square: true,
  },
  {
    images: ['works/social/feed/ramadan.webp'],
    caption: { ar: 'منشور رمضاني بأسلوب هادئ يخدم النص.', en: 'A calm Ramadan post that lets the words lead.' },
    highlight: { ar: 'رمضان', en: 'Ramadan' },
  },
  {
    images: ['works/social/feed/itikaf.webp'],
    caption: { ar: 'إعلان الاعتكاف: كل المعلومات بنظرة واحدة.', en: 'An i\u2019tikaf announcement with every detail at a glance.' },
  },
  {
    images: ['works/social/feed/donate.webp'],
    caption: { ar: 'حملة دعم إفطار وسحور الشباب المعتكفين.', en: 'A donation campaign for the i\u2019tikaf meals.' },
  },
];

export const projects: Project[] = [
  {
    id: 'smash',
    title: { ar: 'Smash Burger', en: 'Smash Burger' },
    category: identity,
    year: '2025',
    cover: 'covers/smash.webp',
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
    cover: 'covers/nawaf.webp',
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
    cover: 'covers/afia.webp',
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
      { image: 'logos/hadeel.webp', title: { ar: 'هديل', en: 'Hadeel' } },
      { image: 'logos/kufic.webp', title: { ar: 'كوفي مربع', en: 'Square Kufic' } },
      { image: 'logos/osama.webp', title: { ar: 'م. أسامة الحسيني', en: 'Arc. Osama Al-Houssieni' } },
      { image: 'logos/madaryara.webp', title: { ar: 'مدار يارا', en: 'Madar Yara Co.' } },
      { image: 'logos/alanees.webp', title: { ar: 'جامع الأنيس', en: 'Al-Anees Mosque' } },
      { image: 'logos/musab.webp', title: { ar: 'جامع مصعب بن عمير', en: 'Musab bin Umair Mosque' } },
    ],
  },
  {
    id: 'social',
    feed: socialFeed,
    title: { ar: 'منشورات وكاروسيل', en: 'Posts & carousels' },
    category: { ar: 'سوشل ميديا', en: 'Social media' },
    year: '2024 — 2026',
    cover: 'covers/social.webp',
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
    cover: 'covers/print.webp',
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
    models: [
      {
        src: 'models/tripod.glb',
        title: { ar: 'حامل كاميرا', en: 'Camera tripod' },
        variants: [
          { name: { ar: 'أحمر', en: 'Red' }, swatch: '#c8222a', colors: { plastic_01: [0.552, 0.017, 0.02] } },
          { name: { ar: 'كورال', en: 'Coral' }, swatch: '#f96450', colors: { plastic_01: [0.95, 0.13, 0.08] } },
          { name: { ar: 'بترولي', en: 'Petrol' }, swatch: '#22708a', colors: { plastic_01: [0.016, 0.16, 0.25] } },
          { name: { ar: 'ذهبي', en: 'Gold' }, swatch: '#d9a441', colors: { plastic_01: [0.69, 0.37, 0.05] } },
        ],
      },
      {
        src: 'models/iphone.glb',
        title: { ar: 'iPhone Air', en: 'iPhone Air' },
        explodeAxis: [1, 0, 0],
        explodeSpread: 1.7,
        variants: [
          {
            name: { ar: 'أزرق فاتح', en: 'Sky Blue' },
            swatch: '#bcd3ea',
            colors: { anodized_alu_03: [0.7, 0.81, 0.92], car_metallic_paint_01: [0.62, 0.76, 0.9] },
          },
          {
            name: { ar: 'ذهبي فاتح', en: 'Light Gold' },
            swatch: '#ecdcc0',
            colors: { anodized_alu_03: [0.92, 0.82, 0.66], car_metallic_paint_01: [0.86, 0.74, 0.56] },
          },
          {
            name: { ar: 'أبيض', en: 'Cloud White' },
            swatch: '#f2f1ec',
            colors: { anodized_alu_03: [0.93, 0.93, 0.92], car_metallic_paint_01: [0.88, 0.88, 0.85] },
          },
          {
            name: { ar: 'أسود', en: 'Space Black' },
            swatch: '#26262a',
            colors: { anodized_alu_03: [0.03, 0.03, 0.035], car_metallic_paint_01: [0.02, 0.02, 0.024] },
          },
        ],
      },
      {
        src: 'models/prime.glb',
        title: { ar: 'عبوة Prime', en: 'Prime bottle' },
        explodeAxis: [1, 0, 0],
        explodeSpread: 1.5,
        variants: [
          { name: { ar: 'أحمر', en: 'Red' }, swatch: '#d9213a', hue: 0, colors: { 'Material.002': [0.62, 0.01, 0.02] } },
          { name: { ar: 'أزرق', en: 'Blue' }, swatch: '#1f6fe0', hue: 225, colors: { 'Material.002': [0.01, 0.1, 0.7] } },
          { name: { ar: 'أخضر', en: 'Green' }, swatch: '#3fae3a', hue: 115, colors: { 'Material.002': [0.06, 0.42, 0.03] } },
          { name: { ar: 'برتقالي', en: 'Orange' }, swatch: '#f47a1f', hue: 28, colors: { 'Material.002': [0.9, 0.2, 0.01] } },
          { name: { ar: 'بنفسجي', en: 'Purple' }, swatch: '#8a3fd1', hue: 285, colors: { 'Material.002': [0.25, 0.03, 0.62] } },
        ],
      },
    ],
    title: { ar: 'رندرات منتجات', en: 'Product renders' },
    category: { ar: 'تصاميم 3D', en: '3D design' },
    year: '2025',
    cover: 'covers/3d.webp',
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
