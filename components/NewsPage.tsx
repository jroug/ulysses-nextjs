import type { Metadata } from 'next';
import NewsList, { NewsPagination } from './NewsList';
import PageHero from './PageHero';
import { notFound } from 'next/navigation';
import { getNewsArchive, richText } from '../lib/cms';
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
        <NewsList posts={posts} site={site} />
        <NewsPagination number={number} totalPages={totalPages} path={newsPath} />
      </div>
    </section>
  </>;
}
