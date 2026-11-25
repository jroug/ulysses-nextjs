import type { Metadata } from 'next';
import { pageMetadata } from '../../lib/metadata';
import type { RenderedImage } from '../../lib/types';
import Slideshow from '../../components/Slideshow';
import EspaBanner from '../../components/EspaBanner';
import { getHomepage, imageProps, richText } from '../../lib/cms';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { site, page } = await getHomepage();
  return pageMetadata(site, page);
}

// Missing CMS boat images use a neutral placeholder instead of another yacht photograph.
const boatPlaceholder: RenderedImage = { src: '/assets/images/placeholder.svg', alt: 'Yacht image placeholder', width: 1600, height: 900 };

export default async function Homepage() {
  const { site, page } = await getHomepage();
  const fields = page.acf || {};
  const boats = fields.boat_repeater || [];
  const slides = (fields.top_slider_images || []).map((image) => imageProps(image, site, 'Sailing in Greece')).filter((image): image is RenderedImage => image !== null);
  
  return <>
    <Slideshow images={slides} title={fields.top_slider_title} subtitle={fields.top_slider_sub_text} />
    <img className="yacht-award" src="/assets/images/home/european-yacht-of-the-year-2022-award-383.webp" alt="European Yacht of the Year 2022" width="383" height="561" />
    {fields.text_section_1 && <section className="intro" dangerouslySetInnerHTML={{ __html: richText(fields.text_section_1, site) }} />}
    {boats.map((boat, index) => <section className={`split${index % 2 ? ' reverse' : ''}`} key={`${index}-${boat.button_link}`}>
      <div className="boat-image">
        <img {...(imageProps(boat.boat_image, site, `${boat.button_text?.replace(/^Explore\s+/i, '') || 'Performance yacht'} sailing`) || boatPlaceholder)} loading="lazy" decoding="async" sizes="(max-width:600px) 92vw, 47vw" />
      </div>
      <div className="split-copy"><div dangerouslySetInnerHTML={{ __html: richText(boat.boat_text, site) }} />
        {boat.button_text && boat.button_link && <a className="button" href={boat.button_link}>{boat.button_text}</a>}
      </div>
    </section>)}
    {fields.text_section_2 && <section className="contact-cta narrow" dangerouslySetInnerHTML={{ __html: richText(fields.text_section_2, site, { preserveLinks: true }) }} />}
    {fields.html_widget && <section className="testimonials" dangerouslySetInnerHTML={{ __html: richText(fields.html_widget, site) }} />}
    {fields.text_section_3 && <section className="esim narrow" dangerouslySetInnerHTML={{ __html: richText(fields.text_section_3, site) }} />}
    <EspaBanner />
  </>;
}
