import type { MetadataRoute } from 'next';
import { getSiteData } from '../lib/cms';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getSiteData();
  const base = (site.frontend?.base_url || process.env.FRONTEND_BASE_URL || '').replace(/\/$/, '');
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${base}/sitemap.xml` };
}
