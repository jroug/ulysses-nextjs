import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTagArchive } from '../lib/cms';
import PageHero from './PageHero';
import NewsList, { NewsPagination } from './NewsList';

export async function tagMetadata(slug: string, number = 1): Promise<Metadata> {
  const data = await getTagArchive(slug, number);
  if (!data) return { title: 'Tag not found', robots: { index: false } };
  const title = `${data.tag.name} — News${number > 1 ? ` — Page ${number}` : ''} | ${data.site.name}`;
  const description = data.tag.description || `News and articles tagged ${data.tag.name} from ${data.site.name}.`;
  const path = number === 1 ? data.tag.path : `${data.tag.path}page/${number}/`;
  const canonical = new URL(path, data.site.frontend?.base_url || process.env.FRONTEND_BASE_URL).toString();
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: 'website' }, twitter: { card: 'summary', title, description } };
}

export default async function TagPage({ slug, number = 1 }: { slug: string; number?: number }) {
  const data = await getTagArchive(slug, number);
  if (!data) notFound();
  const { page, site, tag, posts, total, totalPages } = data;
  const tagPage = { ...page, acf: { ...page.acf, top_slider_title: tag.name, top_slider_sub_text: `News tagged “${tag.name}”` } };
  const path = (value: number) => value === 1 ? tag.path : `${tag.path}page/${value}/`;
  return <>
    <PageHero page={tagPage} site={site} />
    <section className="news-section" style={{ backgroundColor: page.acf?.body_background_color || '#ffffff' }}>
      <div className="news-list">
        <div className="tag-introduction"><Link className="news-back-link" href="/news/">← All news</Link>
          <p>{total} {total === 1 ? 'article' : 'articles'} tagged <strong>{tag.name}</strong></p>
          {tag.description && <p>{tag.description}</p>}
        </div>
        <NewsList posts={posts} site={site} />
        <NewsPagination number={number} totalPages={totalPages} path={path} />
      </div>
    </section>
  </>;
}
