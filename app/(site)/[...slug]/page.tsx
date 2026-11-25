import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getPageByPath, getLegacyPostRedirect, richText } from '../../../lib/cms';
import PageHero from '../../../components/PageHero';
import { pageMetadata } from '../../../lib/metadata';

export const dynamic = 'force-dynamic';

type CmsPageProps = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = '/' + slug.join('/') + '/';
  const data = await getPageByPath(path);
  if (!data) return { title: '404 Page not Found! | Ulysses Sailing', robots: { index: false, follow: true } };
  return pageMetadata(data.site, data.page);
}

export default async function GenericPage({ params }: CmsPageProps) {
  const { slug } = await params;
  const path = '/' + slug.join('/') + '/';
  const data = await getPageByPath(path);
  if (!data) {
    const redirect = await getLegacyPostRedirect(path);
    if (redirect) permanentRedirect(redirect);
    notFound();
  }
  const { site, page } = data;
  return <>
    <PageHero page={page} site={site} />
    <section className="page-content" style={{ backgroundColor: page.acf?.body_background_color || '#ffffff' }}>
      <div className="prose" dangerouslySetInnerHTML={{ __html: richText(page.content?.html, site, { preserveLinks: true }) }} />
    </section>
  </>;
}
