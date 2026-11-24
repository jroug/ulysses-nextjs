import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';

// Read on each request: saving WordPress exports is enough; no frontend rebuild is needed.
export const getHomepage = cache(async () => {
  const directory = path.resolve(process.env.CMS_DATA_DIR || '../headless-cms/data');
  const index = JSON.parse(await readFile(path.join(directory, 'pages.json'), 'utf8'));
  const entry = index.pages.find((page) => page.is_homepage);
  if (!entry) throw new Error('No published homepage was found in the CMS JSON export.');
  const file = path.resolve(directory, entry.file);
  if (!file.startsWith(directory + path.sep)) throw new Error('Invalid homepage export path.');
  const page = JSON.parse(await readFile(file, 'utf8'));
  return { site: index.site, page };
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

// Only the homepage exists in Next.js; other links use the existing HTML pages for now.
export function pageUrl(href) {
  if (!href || href.startsWith('#')) return href || '/';
  const route = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  if (route === '/' || route === 'index.html') return '/';
  const file = routes[route] || (Object.values(routes).includes(route) ? route : null);
  return file ? `${process.env.HTML_BASE_URL?.replace(/\/$/, '') || ''}/${file}` : href;
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
