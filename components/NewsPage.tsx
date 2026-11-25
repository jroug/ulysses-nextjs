import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from './PageHero';
import { notFound } from 'next/navigation';
import { getNewsArchive, imageProps, richText } from '../lib/cms';
import { pageMetadata } from '../lib/metadata';

export const newsPath = (number: number) => number === 1 ? '/news/' : `/news/page/${number}/`;

export async function newsMetadata(number: number): Promise<Metadata> {
  const data = await getNewsArchive(number);
  if (!data) return { title: 'News page not found', robots: { index: false } };
  const metadata = pageMetadata(data.site, data.page);
  if (number === 1) return metadata;
  const origin = data.page.seo.canonical_url || `${data.site.frontend?.base_url || process.env.FRONTEND_BASE_URL}/news/`;
  const url = new URL(newsPath(number), origin).toString();
  const title = `${data.page.seo.title || data.page.title} – Page ${number}`;
  return { ...metadata, title, alternates: { canonical: url },
    openGraph: metadata.openGraph ? { ...metadata.openGraph, title, url } : undefined,
    twitter: metadata.twitter ? { ...metadata.twitter, title } : undefined };
}

export default async function NewsPage({ number = 1 }: { number?: number }) {
  const data = await getNewsArchive(number);
  if (!data) notFound();
  const { site, page, posts, totalPages } = data;
  return <>
    <PageHero page={page} site={site} />
    <section className="news-section" style={{ backgroundColor: page.acf?.body_background_color || '#ffffff' }}>
      <div className="news-list">
        {page.content?.html && <div className="news-introduction" dangerouslySetInnerHTML={{ __html: richText(page.content.html, site) }} />}
        {!posts.length && <p>No news has been published yet.</p>}
        {posts.map((post) => {
          const thumbnail = imageProps(post.featured_image, site, post.title);
          return <article className={`news-item${thumbnail ? '' : ' news-item-text'}`} key={post.id}>
            {thumbnail && <Link href={post.path} tabIndex={-1} aria-hidden="true"><img {...thumbnail} loading="lazy" decoding="async" sizes="(max-width: 700px) 90vw, 440px" /></Link>}
            <div><h2><Link href={post.path} dangerouslySetInnerHTML={{ __html: post.title }} /></h2>
              <p>{post.excerpt}</p><Link className="read-more" href={post.path}>Continue reading<span className="sr-only">: <span dangerouslySetInnerHTML={{ __html: post.title }} /></span></Link>
            </div>
          </article>;
        })}
        {totalPages > 1 && <nav className="pagination" aria-label="News pages">
          {number > 1 && <Link href={newsPath(number - 1)} rel="prev" aria-label="Previous news page">‹</Link>}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => value === number
            ? <span key={value} aria-current="page" aria-label={`Page ${value}`}>{value}</span>
            : <Link key={value} href={newsPath(value)} aria-label={`News page ${value}`}>{value}</Link>)}
          {number < totalPages && <Link href={newsPath(number + 1)} rel="next" aria-label="Next news page">›</Link>}
        </nav>}
      </div>
    </section>
  </>;
}
