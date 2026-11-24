import type { Metadata, Viewport } from 'next';
import type { RenderedImage } from '../lib/types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Slideshow from '../components/Slideshow';
import EspaBanner from '../components/EspaBanner';
import { getHomepage, imageProps, richText } from '../lib/cms';

export const dynamic = 'force-dynamic';
export const viewport: Viewport = { themeColor: '#075264' };

export async function generateMetadata(): Promise<Metadata> {
  const { site, page } = await getHomepage();
  const { seo } = page;
  const facebook = seo.facebook;
  const twitter = seo.twitter;
  const article = facebook?.tags || {};
  return {
    title: seo.title || page.title, description: seo.description || undefined,
    alternates: { canonical: seo.canonical_url },
    icons: { icon: site.icon?.url || '/assets/images/shared/ulysses-sailing-favicon-192.png' },
    openGraph: facebook?.enabled ? {
      title: facebook.title || undefined, description: facebook.description || undefined, url: facebook.url || undefined,
      siteName: facebook.site_name || undefined, locale: facebook.locale || undefined,
      type: facebook.type === 'article' ? 'article' : 'website',
      ...(facebook.type === 'article' ? { publishedTime: typeof article['article:published_time'] === 'string' ? article['article:published_time'] : undefined, modifiedTime: typeof article['article:modified_time'] === 'string' ? article['article:modified_time'] : undefined } : {}),
      images: facebook.image ? [{ url: facebook.image.url, width: facebook.image.width || undefined, height: facebook.image.height || undefined, alt: facebook.image.alt || undefined }] : [],
    } : undefined,
    twitter: twitter?.enabled ? {
      card: twitter.card === 'summary_large_image' ? 'summary_large_image' : 'summary', title: twitter.title || undefined, description: twitter.description || undefined,
      site: twitter.site || undefined, creator: twitter.creator || undefined,
      images: twitter.image ? [{ url: twitter.image.url, alt: twitter.image.alt || undefined }] : [],
    } : undefined,
  };
}

// Missing CMS boat images use a neutral placeholder instead of another yacht photograph.
const boatPlaceholder: RenderedImage = { src: '/assets/images/placeholder.svg', alt: 'Yacht image placeholder', width: 1600, height: 900 };

export default async function Homepage() {
  const { site, page } = await getHomepage();
  const fields = page.acf || {};
  const boats = fields.boat_repeater || [];
  const slides = (fields.home_slider || []).map((image) => imageProps(image, site, 'Sailing in Greece')).filter((image): image is RenderedImage => image !== null);
  
  return <>
    <Header site={site} boats={boats} />
    <div className="site-shell">
      <main id="content">
        <Slideshow images={slides} title={fields.home_slider_title} subtitle={fields.home_slider_sub_title} />
        <img className="yacht-award" src="/assets/images/home/european-yacht-of-the-year-2022-award-383.webp" alt="European Yacht of the Year 2022" width="383" height="561" />
        {fields.text_section_1 && <section className="intro" dangerouslySetInnerHTML={{ __html: richText(fields.text_section_1, site) }} />}
        {boats.map((boat, index) => <section className={`split${index % 2 ? ' reverse' : ''}`} key={`${index}-${boat.button_link}`}>
          <img {...(imageProps(boat.boat_image, site, `${boat.button_text?.replace(/^Explore\s+/i, '') || 'Performance yacht'} sailing`) || boatPlaceholder)} loading="lazy" decoding="async" sizes="(max-width:600px) 92vw, 47vw" />
          <div className="split-copy"><div dangerouslySetInnerHTML={{ __html: richText(boat.boat_text, site) }} />
            {boat.button_text && boat.button_link && <a className="button" href={boat.button_link}>{boat.button_text}</a>}
          </div>
        </section>)}
        {fields.text_section_2 && <section className="contact-cta narrow" dangerouslySetInnerHTML={{ __html: richText(fields.text_section_2, site, { preserveLinks: true }) }} />}
        {fields.html_widget && <section className="testimonials" dangerouslySetInnerHTML={{ __html: richText(fields.html_widget, site) }} />}
        {fields.text_section_3 && <section className="esim narrow" dangerouslySetInnerHTML={{ __html: richText(fields.text_section_3, site) }} />}
      </main>
      <Footer site={site} />
      <EspaBanner />
    </div>
    <a className="back-to-top" href="#top" aria-label="Back to top">↑</a>
  </>;
}
