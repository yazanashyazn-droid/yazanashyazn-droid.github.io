import type { APIRoute } from 'astro';

// Two language versions of one page, cross-linked with hreflang.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const ar = new URL(base, site).href;
  const en = new URL(`${base}en/`, site).href;
  const alt = `<xhtml:link rel="alternate" hreflang="ar" href="${ar}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${ar}"/>`;
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${ar}</loc><lastmod>${today}</lastmod>${alt}</url>
  <url><loc>${en}</loc><lastmod>${today}</lastmod>${alt}</url>
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
