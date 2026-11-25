import type { Metadata } from 'next';
import { mediaUrl } from './cms';
import type { CmsPage, CmsSite } from './types';

export function pageMetadata(site: CmsSite, page: CmsPage): Metadata {
  const { seo } = page;
  const facebook = seo.facebook;
  const twitter = seo.twitter;
  const article = facebook?.tags || {};
  return {
    title: seo.title || page.title, description: seo.description || undefined,
    alternates: { canonical: seo.canonical_url },
    icons: { icon: mediaUrl(site.icon?.url, site) || '/assets/images/shared/ulysses-sailing-favicon-192.png' },
    openGraph: facebook?.enabled ? {
      title: facebook.title || undefined, description: facebook.description || undefined, url: facebook.url || undefined,
      siteName: facebook.site_name || undefined, locale: facebook.locale || undefined,
      type: facebook.type === 'article' ? 'article' : 'website',
      ...(facebook.type === 'article' ? { publishedTime: typeof article['article:published_time'] === 'string' ? article['article:published_time'] : undefined, modifiedTime: typeof article['article:modified_time'] === 'string' ? article['article:modified_time'] : undefined } : {}),
      images: facebook.image ? [{ url: mediaUrl(facebook.image.url, site), width: facebook.image.width || undefined, height: facebook.image.height || undefined, alt: facebook.image.alt || undefined }] : [],
    } : undefined,
    twitter: twitter?.enabled ? {
      card: twitter.card === 'summary_large_image' ? 'summary_large_image' : 'summary', title: twitter.title || undefined, description: twitter.description || undefined,
      site: twitter.site || undefined, creator: twitter.creator || undefined,
      images: twitter.image ? [{ url: mediaUrl(twitter.image.url, site), alt: twitter.image.alt || undefined }] : [],
    } : undefined,
  };
}

