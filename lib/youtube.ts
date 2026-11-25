/** Read the YouTube embed saved in ACF without changing its playback parameters. */
export function youtubeEmbed(html: string) {
  const iframe = html.match(/<iframe\b[^>]*>/i)?.[0];
  const source = iframe?.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2];
  if (!source) return null;
  try {
    const url = new URL(source.replace(/&amp;/gi, '&'));
    if (!['https:', 'http:'].includes(url.protocol) || !['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname)) return null;
    const id = url.pathname.match(/^\/embed\/([\w-]{11})\/?$/)?.[1];
    if (!id) return null;
    url.protocol = 'https:';
    url.searchParams.set('autoplay', '1');
    const title = iframe?.match(/\btitle\s*=\s*(["'])(.*?)\1/i)?.[2]?.replace(/&amp;/gi, '&').replace(/&quot;/gi, '"');
    return { id, url: url.toString(), title };
  } catch { return null; }
}
