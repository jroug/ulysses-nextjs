import { cache } from 'react';

// Both local development and production load public CMS JSON over HTTP(S).
export const getHomepage = cache(async () => {
  const dataUrl = process.env.CMS_DATA_URL;
  if (!dataUrl) throw new Error('CMS_DATA_URL must point to the CMS data URL.');
  const base = new URL(dataUrl.replace(/\/?$/, '/'));
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('CMS_DATA_URL must use HTTP or HTTPS.');
  async function readJson(file) {
    const url = new URL(file, base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw new Error('Invalid CMS export path.');
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`CMS export unavailable: ${url} (${response.status})`);
    return response.json();
  }
  const index = await readJson('pages.json');
  const entry = index.pages.find((page) => page.is_homepage);
  if (!entry) throw new Error('No published homepage was found in the CMS JSON export.');
  return { site: index.site, page: await readJson(entry.file) };
});

export function mediaUrl(url, site) {
  if (!url) return '';
  const source = site.wordpress_url?.replace(/\/$/, '');
  const target = process.env.CMS_BASE_URL?.replace(/\/$/, '');
  return source && target && (url === source || url.startsWith(source + '/')) ? target + url.slice(source.length) : url;
}

const routes = {
  '/': 'index.html', '/the-yachts': 'jpk-39-fc.html',
  '/the-yachts/jpk-39-fc': 'jpk-39-fc.html', '/the-yachts/pogo-36': 'pogo-36.html',
  '/the-yachts/x46': 'x46.html', '/the-yachts/jpk-48-fc': 'jpk-48-fc.html',
  '/the-yachts/pk-48-fc': 'jpk-48-fc.html', '/training-schedule': 'training-schedule.html',
  '/pricelist': 'pricelist.html', '/news': 'news.html', '/about-us': 'about-us.html', '/contact': 'contact.html',
};

// Only the homepage exists in Next.js; other links use the existing public website.
export function pageUrl(href) {
  if (!href || href.startsWith('#')) return href || '/';
  const route = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  if (route === '/' || route === 'index.html') return '/';
  const file = routes[route] || (Object.values(routes).includes(route) ? route : null);
  if (!file) return href;
  if (process.env.HTML_BASE_URL) return `${process.env.HTML_BASE_URL.replace(/\/$/, '')}/${file}`;
  const routePath = {
    'jpk-39-fc.html': '/the-yachts/jpk-39-fc/', 'pogo-36.html': '/the-yachts/pogo-36/',
    'x46.html': '/the-yachts/x46/', 'jpk-48-fc.html': '/the-yachts/jpk-48-fc/',
  }[file] || `/${file.replace(/\.html$/, '')}/`;
  return `${process.env.FRONTEND_BASE_URL?.replace(/\/$/, '') || ''}${routePath}`;
}

export function richText(html, site) {
  return (html || '')
    .replace(/(src|href)=(['"])(.*?)\2/g, (match, key, quote, value) => {
      let url = mediaUrl(value, site);
      // The CMS currently embeds the QR image using its former HTML asset URL.
      if (/\/assets\/images\/(?:home\/)?ulysses-sailing-esim-qr-code\.(png|webp)$/.test(url)) url = '/assets/images/home/ulysses-sailing-esim-qr-code.webp';
      if (key === 'href') url = pageUrl(url);
      return `${key}=${quote}${url}${quote}`;
    });
}

export function imageProps(image, site, fallbackAlt = '') {
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
