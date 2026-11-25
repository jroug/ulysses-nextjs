import PageHero from './PageHero';
import YachtGallery from './YachtGallery';
import { yachtImage, yachtText } from '../lib/yacht-media';
import type { BoatDetails, CmsPage, CmsSite, RenderedImage } from '../lib/types';

export default function YachtPage({ page, site }: { page: CmsPage; site: CmsSite }) {
  const fields = page.acf || {};
  const details = Object.entries(fields)
    .filter((entry): entry is [string, BoatDetails] => /^boat_details_\d+$/.test(entry[0]) && !!entry[1] && typeof entry[1] === 'object')
    .sort(([a], [b]) => Number(a.split('_').pop()) - Number(b.split('_').pop()))
    .map(([, detail]) => detail).filter((detail) => detail.image?.url || detail.title || detail.text);
  const gallery = (images: typeof fields.more_images_gallery, label: string) => (images || [])
    .map((image, index) => yachtImage(image, site, `${page.title} — ${label} ${index + 1}`))
    .filter((image): image is RenderedImage => image !== null);
  return <>
    <PageHero page={page} site={site} />
    <div className="yacht-page" style={{ backgroundColor: fields.body_background_color || '#ffffff' }}>
      {(fields.text_section_1 || page.content?.html) && <section className="yacht-introduction narrow">
        {fields.text_section_1 && <div dangerouslySetInnerHTML={{ __html: yachtText(fields.text_section_1, site, `${page.title} sailing yacht`) }} />}
        {page.content?.html && <div dangerouslySetInnerHTML={{ __html: yachtText(page.content.html, site, `${page.title} sailing yacht`) }} />}
      </section>}
      {fields.video_section && <section className="yacht-video" aria-label={`${page.title} video`} dangerouslySetInnerHTML={{ __html: yachtText(fields.video_section, site, `${page.title} video preview`) }} />}
      {details.map((detail, index) => {
        const image = yachtImage(detail.image, site, `${page.title} — ${detail.title || 'yacht detail'}`);
        return <section className={`split yacht-detail${index % 2 ? ' reverse' : ''}${image ? '' : ' yacht-detail-text'}`} key={index}>
          {image && <div className="boat-image"><img {...image} loading="lazy" decoding="async" sizes="(max-width: 600px) 92vw, 47vw" /></div>}
          <div className="split-copy">{detail.title && <h2>{detail.title}</h2>}
            {detail.text && <div dangerouslySetInnerHTML={{ __html: yachtText(detail.text, site, `${page.title} — ${detail.title || 'yacht detail'}`) }} />}
          </div>
        </section>;
      })}
      <YachtGallery title={fields.specifications_title || 'Specifications'} images={gallery(fields.specifications_gallery, 'specifications')} specifications />
      <YachtGallery title={fields.more_images_title || 'More Images'} images={gallery(fields.more_images_gallery, 'gallery image')} />
    </div>
  </>;
}
