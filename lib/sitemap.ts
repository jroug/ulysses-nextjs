import { getSitemapData } from './cms';

export const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const declaration = '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/css" href="/sitemap-style.css"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>\n';
const response = (xml: string) => new Response(declaration + xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300' } });

export async function sitemapIndex() {
  const { baseUrl, entries } = await getSitemapData();
  return response('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + (['page', 'post'] as const).map((kind) => {
    const dates = entries.filter((entry) => entry.kind === kind && entry.modified).map((entry) => entry.modified!).sort((a, b) => Date.parse(b) - Date.parse(a));
    return `<sitemap><loc>${escapeXml(`${baseUrl}/${kind}-sitemap.xml`)}</loc>${dates[0] ? `<lastmod>${escapeXml(dates[0])}</lastmod>` : ''}</sitemap>`;
  }).join('') + '</sitemapindex>');
}

export async function sitemapUrls(kind: 'page' | 'post') {
  const { entries } = await getSitemapData();
  return response('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + entries.filter((entry) => entry.kind === kind).map((entry) =>
    `<url><loc>${escapeXml(entry.url)}</loc>${entry.modified ? `<lastmod>${escapeXml(entry.modified)}</lastmod>` : ''}</url>`
  ).join('') + '</urlset>');
}
