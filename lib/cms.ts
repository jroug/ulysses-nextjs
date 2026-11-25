import { cache } from 'react';
import type { CmsIndex, CmsPage, CmsSite, HomepageData, MediaImage, RenderedImage, MenuItem, NavigationData, NewsIndex } from './types';

// All environments use the public CMS JSON URLs, with fresh data on each request.
async function readJson<T>(file: string): Promise<T> {
  const dataUrl = process.env.CMS_DATA_URL;
  if (!dataUrl) throw new Error('CMS_DATA_URL must point to the CMS data URL.');
  const base = new URL(dataUrl.replace(/\/?$/, '/'));
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('CMS_DATA_URL must use HTTP or HTTPS.');
  const url = new URL(file, base);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw new Error('Invalid CMS export path.');
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`CMS export unavailable: ${url} (${response.status})`);
  return response.json() as Promise<T>;
}

const getIndex = cache(() => readJson<CmsIndex>('pages.json'));

export const getSiteData = cache(async () => {
  const index = await getIndex();
  const navigation = await readJson<NavigationData>('navigation.json');
  return { site: index.site, navigation: { ...navigation, items: navigation.items.map((item) => frontendMenuItem(item, index.site)) } };
});

export const getHomepage = cache(async (): Promise<HomepageData> => {
  const index = await getIndex();
  const entry = index.pages.find((page) => page.is_homepage);
  if (!entry) throw new Error('No published homepage was found in the CMS JSON export.');
  return { ...await getSiteData(), page: await readJson<CmsPage>(entry.file) };
});

export const getPageByPath = cache(async (pathname: string) => {
  const index = await getIndex();
  const normalize = (value: string) => {
    const clean = value.replace(/\/$/, '') || '/';
    try { return decodeURIComponent(clean); } catch { return clean; }
  };
  const normalized = normalize(pathname);
  const entry = index.pages.find((page) => normalize(page.path) === normalized);
  return entry ? { site: index.site, page: await readJson<CmsPage>(entry.file) } : null;
});

export function mediaUrl(url: string | null | undefined, site: CmsSite): string {
  if (!url) return '';
  const source = site.wordpress_url?.replace(/\/$/, '');
  const target = process.env.CMS_BASE_URL?.replace(/\/$/, '');
  return source && target && (url === source || url.startsWith(source + '/')) ? target + url.slice(source.length) : url;
}

const routes: Record<string, string> = {
  '/': 'index.html', '/the-yachts': 'jpk-39-fc.html',
  '/the-yachts/jpk-39-fc': 'jpk-39-fc.html', '/the-yachts/pogo-36': 'pogo-36.html',
  '/the-yachts/x46': 'x46.html', '/the-yachts/jpk-48-fc': 'jpk-48-fc.html',
  '/the-yachts/pk-48-fc': 'jpk-48-fc.html', '/training-schedule': 'training-schedule.html',
  '/pricelist': 'pricelist.html', '/news': 'news.html', '/about-us': 'about-us.html', '/contact': 'contact.html',
};

// Dedicated Next.js pages stay local; remaining links can use the HTML website.
export function pageUrl(href: string | null | undefined): string {
  if (!href || href.startsWith('#')) return href || '/';
  const route = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  if (route === '/' || route === 'index.html') return '/';
  if (route === '/news' || route === 'news.html') return '/news/';
  if (route === '/training-schedule' || route === 'training-schedule.html') return '/training-schedule/';
  const file = routes[route] || (Object.values(routes).includes(route) ? route : null);
  if (!file) return href;
  if (process.env.HTML_BASE_URL) return `${process.env.HTML_BASE_URL.replace(/\/$/, '')}/${file}`;
  const routePaths: Record<string, string> = {
    'jpk-39-fc.html': '/the-yachts/jpk-39-fc/', 'pogo-36.html': '/the-yachts/pogo-36/',
    'x46.html': '/the-yachts/x46/', 'jpk-48-fc.html': '/the-yachts/jpk-48-fc/',
  };
  const routePath = routePaths[file] || `/${file.replace(/\.html$/, '')}/`;
  return `${process.env.FRONTEND_BASE_URL?.replace(/\/$/, '') || ''}${routePath}`;
}

export function richText(html: string | null | undefined, site: CmsSite, { preserveLinks = false }: { preserveLinks?: boolean } = {}): string {
  return (html || '')
    .replace(/srcset=(['"])(.*?)\1/g, (_match, quote: string, value: string) => `srcset=${quote}${value.split(',').map((part) => {
      const [url, size] = part.trim().split(/\s+/);
      return [mediaUrl(url, site), size].filter(Boolean).join(' ');
    }).join(', ')}${quote}`)
    .replace(/(src|href)=(['"])(.*?)\2/g, (match: string, key: string, quote: string, value: string) => {
      if (key === 'href' && preserveLinks) return match;
      let url = mediaUrl(value, site);
      // The CMS currently embeds the QR image using its former HTML asset URL.
      if (/\/assets\/images\/(?:home\/)?ulysses-sailing-esim-qr-code\.(png|webp)$/.test(url)) url = '/assets/images/home/ulysses-sailing-esim-qr-code.webp';
      if (key === 'href') url = pageUrl(url);
      return `${key}=${quote}${url}${quote}`;
    });
}

export function imageProps(image: MediaImage | null | undefined, site: CmsSite, fallbackAlt = ''): RenderedImage | null {
  if (!image?.url) return null;
  return {
    src: mediaUrl(image.url, site), alt: image.alt || fallbackAlt,
    width: image.width || undefined, height: image.height || undefined,
    srcSet: image.srcset ? image.srcset.split(',').map((part) => {
      const [url, size] = part.trim().split(/\s+/);
      return `${mediaUrl(url, site)} ${size}`;
    }).join(', ') : undefined,
  };
}

/** WordPress page links become frontend paths; external/custom destinations are preserved. */
function frontendMenuItem(item: MenuItem, site: CmsSite): MenuItem {
  let url = item.url;
  for (const source of [site.wordpress_url, process.env.CMS_BASE_URL]) {
    const base = source?.replace(/\/$/, '');
    if (base && (url === base || url.startsWith(base + '/'))) {
      url = url.slice(base.length) || '/';
      break;
    }
  }
  return { ...item, url, children: item.children.map((child) => frontendMenuItem(child, site)) };
}

const getNewsIndex = cache(async () => {
  const news = await readJson<NewsIndex>('news.json');
  return { ...news, posts: news.posts.map((post) => ({
    ...post, wordpressPath: post.path, path: `/news/${post.slug}/`,
  })) };
});

export const getNewsArchive = cache(async (pageNumber: number) => {
  const data = await getPageByPath('/news/');
  if (!data) return null;
  const news = await getNewsIndex();
  const perPage = Math.max(1, news.posts_per_page);
  const totalPages = Math.max(1, Math.ceil(news.posts.length / perPage));
  if (!Number.isSafeInteger(pageNumber) || pageNumber < 1 || pageNumber > totalPages) return null;
  return { ...data, totalPages, pageNumber, posts: news.posts.slice((pageNumber - 1) * perPage, pageNumber * perPage) };
});

export const getPostByPath = cache(async (pathname: string) => {
  const news = await getNewsIndex();
  const entry = news.posts.find((post) => post.path.replace(/\/$/, '') === pathname.replace(/\/$/, ''));
  if (!entry) return null;
  const siteData = await getSiteData();
  const page = await readJson<CmsPage>(entry.file);
  const canonical = new URL(entry.path, page.seo.canonical_url || siteData.site.frontend?.base_url || process.env.FRONTEND_BASE_URL).toString();
  return { ...siteData, page: { ...page, seo: {
    ...page.seo, canonical_path: entry.path, canonical_url: canonical,
    facebook: page.seo.facebook ? { ...page.seo.facebook, url: canonical,
      tags: { ...page.seo.facebook.tags, 'og:url': canonical } } : undefined,
    twitter: page.seo.twitter ? { ...page.seo.twitter,
      tags: { ...page.seo.twitter.tags, 'twitter:url': canonical } } : undefined,
  } } };
});

export const getLegacyPostRedirect = cache(async (pathname: string) => {
  const news = await getNewsIndex();
  const entry = news.posts.find((post) => post.wordpressPath.replace(/\/$/, '') === pathname.replace(/\/$/, ''));
  return entry && entry.path.replace(/\/$/, '') !== pathname.replace(/\/$/, '') ? entry.path : null;
});
