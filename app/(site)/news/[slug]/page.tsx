import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleNavigation from '../../../../components/ArticleNavigation';
import { getPostByPath, imageProps, richText } from '../../../../lib/cms';
import { pageMetadata } from '../../../../lib/metadata';

type Props = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPostByPath(`/news/${slug}/`);
  if (!data) return { title: 'News article not found', robots: { index: false } };
  return pageMetadata(data.site, data.page);
}

export default async function NewsArticle({ params }: Props) {
  const { slug } = await params;
  const data = await getPostByPath(`/news/${slug}/`);
  if (!data) notFound();
  const { site, page, previous, next } = data;
  const hero = page.acf?.hero_section;
  const image = imageProps(hero?.hero_image || page.featured_image, site, page.title);
  return <>
    <section className="hero page-hero">
      {image && <img className="hero-image" {...image} loading="eager" fetchPriority="high" sizes="93vw" />}
      <div className="hero-copy">
        <h1 dangerouslySetInnerHTML={{ __html: page.title }} />
        {hero?.hero_sub_text && <div dangerouslySetInnerHTML={{ __html: richText(hero.hero_sub_text, site, { preserveLinks: true }) }} />}
      </div>
    </section>
    <section className="page-content news-article" style={{ backgroundColor: page.acf?.body_background_color || '#ffffff' }}>
      <div className="article-content">
        <Link className="article-back news-back-link" href="/news/">← All news</Link>
        <div className="prose" dangerouslySetInnerHTML={{ __html: richText(page.content?.html, site, { preserveLinks: true }) }} />
        {!!page.tags?.length && <nav className="article-tags" aria-label="Article tags">
          <span>Tags</span>{page.tags.map((tag) => <Link key={tag.id} href={tag.path} rel="tag">{tag.name}</Link>)}
        </nav>}
        <ArticleNavigation previous={previous} next={next} site={site} />
      </div>
    </section>
  </>;
}
