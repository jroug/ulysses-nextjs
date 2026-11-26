import Link from 'next/link';
import { imageProps } from '../lib/cms';
import type { CmsSite, NewsPostSummary } from '../lib/types';

export default function NewsList({ posts, site }: { posts: NewsPostSummary[]; site: CmsSite }) {
  return <>{posts.map((post) => {
    const image = imageProps(post.featured_image, site, post.title);
    return <article className={`news-item${image ? '' : ' news-item-text'}`} key={post.id}>
      {image && <Link href={post.path} tabIndex={-1} aria-hidden="true"><img {...image} loading="lazy" decoding="async" sizes="(max-width: 700px) 90vw, 440px" /></Link>}
      <div><h2><Link href={post.path} dangerouslySetInnerHTML={{ __html: post.title }} /></h2>
        <p>{post.excerpt}</p><Link className="read-more" href={post.path}>Continue reading<span className="sr-only">: <span dangerouslySetInnerHTML={{ __html: post.title }} /></span></Link>
      </div>
    </article>;
  })}</>;
}

export function NewsPagination({ number, totalPages, path }: { number: number; totalPages: number; path: (number: number) => string }) {
  if (totalPages < 2) return null;
  return <nav className="pagination" aria-label="News pages">
    {number > 1 && <Link href={path(number - 1)} rel="prev" aria-label="Previous news page">‹</Link>}
    {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => value === number
      ? <span key={value} aria-current="page" aria-label={`Page ${value}`}>{value}</span>
      : <Link key={value} href={path(value)} aria-label={`News page ${value}`}>{value}</Link>)}
    {number < totalPages && <Link href={path(number + 1)} rel="next" aria-label="Next news page">›</Link>}
  </nav>;
}
