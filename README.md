# YZN Portfolio

موقع بورتفوليو يزن أبوشعر — عربي/إنكليزي، صفحة واحدة، مبني بـ [Astro](https://astro.build) ومنشور على GitHub Pages.

## الأوامر

```bash
npm install      # أول مرة فقط
npm run dev      # تطوير محلي على http://localhost:4321
npm run build    # بناء النسخة النهائية في dist/
npm run preview  # معاينة النسخة النهائية
```

## إضافة عمل جديد

1. ضع الصورة في `src/assets/works/` (WebP أو PNG أو JPG).
2. افتح `src/data/works.ts` وأضف سطراً في القسم المناسب:

```ts
{ image: 'works/my-logo.webp', title: { ar: 'اسم العمل', en: 'Work name' } },
```

ضغط الصور وتوليد الأحجام المختلفة وبطاقة "اكتشف المزيد" يتم تلقائياً.

## تعديل النصوص

كل النصوص باللغتين موجودة في `src/i18n/ui.ts`.

## النشر

أي `push` على فرع `main` ينشر الموقع تلقائياً عبر `.github/workflows/deploy.yml`.
