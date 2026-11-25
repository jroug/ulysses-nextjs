import YouTubeVideo from './YouTubeVideo';
import { youtubeEmbed } from '../lib/youtube';
import { yachtText } from '../lib/yacht-media';
import type { CmsSite, RenderedImage } from '../lib/types';

export default function YachtVideo({ html, title, site, poster }: {
  html: string; title: string; site: CmsSite; poster?: RenderedImage | null;
}) {
  const embed = youtubeEmbed(html);
  return <section className="yacht-video" aria-label={`${title} video`}>
    {embed ? <YouTubeVideo key={embed.id} id={embed.id} poster={poster} embedUrl={embed.url} title={embed.title || `${title} video`} />
      : <div dangerouslySetInnerHTML={{ __html: yachtText(html, site, `${title} video preview`) }} />}
  </section>;
}
