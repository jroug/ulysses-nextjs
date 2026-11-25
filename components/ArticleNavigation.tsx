import Link from 'next/link';
import { imageProps } from '../lib/cms';
import type { CmsSite, NewsPostSummary } from '../lib/types';

export default function ArticleNavigation({ previous, next, site }: {
  previous: NewsPostSummary | null; next: NewsPostSummary | null; site: CmsSite;
}) {
  if (!previous && !next) return null;
  return <nav className="article-navigation" aria-label="Adjacent news articles">
    {([{ post: previous, direction: 'prev', label: 'Prev' }, { post: next, direction: 'next', label: 'Next' }] as const).map(({ post, direction, label }) => {
      if (!post) return <div key={direction} />;
      const thumbnail = imageProps(post.featured_image, site);
      return <Link key={direction} href={post.path} rel={direction} className={`article-navigation-link article-navigation-${direction}`}>
        {thumbnail && <img {...thumbnail} alt="" width={75} height={75} sizes="75px" loading="lazy" decoding="async" />}
        <span><span className="article-navigation-label">{label}</span><span className="article-navigation-title" dangerouslySetInnerHTML={{ __html: post.title }} /></span>
      </Link>;
    })}
  </nav>;
}
