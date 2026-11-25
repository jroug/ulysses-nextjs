import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '../../../components/PageHero';
import { getPageByPath, imageProps, richText } from '../../../lib/cms';
import { pageMetadata } from '../../../lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageByPath('/the-yachts/');
  if (!data) return { title: 'The Yachts | Ulysses Sailing', robots: { index: false } };
  return pageMetadata(data.site, data.page);
}

export default async function TheYachtsPage() {
  const data = await getPageByPath('/the-yachts/');
  if (!data) notFound();
  const { site, page } = data;
  const fields = page.acf || {};

  const boats = fields.boat_repeater || [];

  return <>
    <PageHero page={page} site={site} />
    <section className="fleet-section" style={{ backgroundColor: fields.body_background_color || '#ffffff' }}>
      <div className="fleet-container">
        {page.content?.html?.trim() && <div className="fleet-introduction" dangerouslySetInnerHTML={{ __html: richText(page.content.html, site, { preserveLinks: true }) }} />}
        <div className="fleet-grid">
          {boats.map((boat, index) => {
            const image = imageProps(boat.boat_image, site, `${boat.button_text?.replace(/^Explore\s+/i, '') || 'Performance yacht'} sailing`) || {
              src: '/assets/images/placeholder.svg', alt: 'Yacht image placeholder', width: 1600, height: 900,
            };
            const photo = <img {...image} className="fleet-image" loading="lazy" decoding="async" sizes="(max-width: 700px) 90vw, 460px" />;
            return <article className="fleet-card" key={`${index}-${boat.button_link}`}>
              {boat.button_link ? <Link className="fleet-image-link" href={boat.button_link}>{photo}</Link> : photo}
              <div className="fleet-copy" dangerouslySetInnerHTML={{ __html: richText(boat.boat_text, site, { preserveLinks: true }) }} />
              {boat.button_link && <Link className="button fleet-link" href={boat.button_link}>{boat.button_text || 'Explore yacht'}</Link>}
            </article>;
          })}
        </div>
      </div>
    </section>
  </>;
}
