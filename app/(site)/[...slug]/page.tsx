import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getPageByPath, getPostByPath, getLegacyPostRedirect, imageProps, richText } from '../../../lib/cms';
import { pageMetadata } from '../../../lib/metadata';

export const dynamic = 'force-dynamic';

type CmsPageProps = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = '/' + slug.join('/') + '/';
  const data = await getPageByPath(path) || await getPostByPath(path);
  if (!data) return { title: '404 Page not Found! | Ulysses Sailing', robots: { index: false, follow: true } };
  return pageMetadata(data.site, data.page);
}

export default async function GenericPage({ params }: CmsPageProps) {
  const { slug } = await params;
  const path = '/' + slug.join('/') + '/';
  const data = await getPageByPath(path) || await getPostByPath(path);
  if (!data) {
    const redirect = await getLegacyPostRedirect(path);
    if (redirect) permanentRedirect(redirect);
    notFound();
  }
  const { site, page } = data;
  const hero = page.acf?.hero_section;
  const image = imageProps(hero?.hero_image || page.featured_image, site, `${page.title} hero image`) || {
    src: '/assets/images/placeholder.svg', alt: 'Page image placeholder', width: 1600, height: 900,
  };

  return <>
    <section className="hero page-hero">
      <img className="hero-image" {...image} loading="eager" fetchPriority="high" sizes="93vw" />
      <div className="hero-copy">
        <h1>{page.title}</h1>
        {hero?.hero_sub_text && <div dangerouslySetInnerHTML={{ __html: richText(hero.hero_sub_text, site, { preserveLinks: true }) }} />}
      </div>
    </section>
    <section className="page-content" style={{ backgroundColor: page.acf?.body_background_color || '#ffffff' }}>
      <div className="prose" dangerouslySetInnerHTML={{ __html: richText(page.content?.html, site, { preserveLinks: true }) }} />
    </section>
  </>;
}
