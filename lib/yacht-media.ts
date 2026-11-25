import { imageProps, richText } from './cms';
import descriptions from './yacht-image-alts.json';
import type { CmsSite, MediaImage } from './types';

export function yachtImage(image: MediaImage | null | undefined, site: CmsSite, context: string) {
  const filename = image?.url.split(/[?#]/)[0].split('/').pop() || '';
  const known = (descriptions as Record<string, string>)[filename];
  return imageProps(image ? { ...image, alt: image.alt?.trim() || known || context } : image, site, context);
}

/** Also cover images inserted directly into WordPress rich text. */
export function yachtText(html: string | null | undefined, site: CmsSite, context: string) {
  return richText(html, site, { preserveLinks: true }).replace(/<img\b[^>]*>/gi, (tag) => {
    const alt = tag.match(/\balt\s*=\s*(["'])([\s\S]*?)\1/i);
    if (alt?.[2].trim()) return tag;
    const safe = context.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return tag.replace(/\s+alt\s*=\s*(["'])[\s\S]*?\1/i, '').replace(/\s*\/?>$/, ` alt="${safe}">`);
  });
}
