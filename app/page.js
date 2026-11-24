import Navigation from '../components/Navigation';
import Slideshow from '../components/Slideshow';
import { getHomepage, imageProps, pageUrl, richText } from '../lib/cms';

export const dynamic = 'force-dynamic';
export const viewport = { themeColor: '#075264' };

export async function generateMetadata() {
  const { site, page } = await getHomepage();
  const { seo } = page;
  const facebook = seo.facebook || {};
  const twitter = seo.twitter || {};
  const article = facebook.tags || {};
  return {
    title: seo.title || page.title, description: seo.description || undefined,
    alternates: { canonical: seo.canonical_url },
    icons: { icon: site.icon?.url || '/assets/images/shared/ulysses-sailing-favicon-192.png' },
    openGraph: facebook.enabled ? {
      title: facebook.title, description: facebook.description, url: facebook.url,
      siteName: facebook.site_name, locale: facebook.locale,
      type: facebook.type === 'article' ? 'article' : 'website',
      ...(facebook.type === 'article' ? { publishedTime: article['article:published_time'], modifiedTime: article['article:modified_time'] } : {}),
      images: facebook.image ? [{ url: facebook.image.url, width: facebook.image.width || undefined, height: facebook.image.height || undefined, alt: facebook.image.alt || undefined }] : [],
    } : undefined,
    twitter: twitter.enabled ? {
      card: twitter.card || 'summary', title: twitter.title, description: twitter.description,
      site: twitter.site || undefined, creator: twitter.creator || undefined,
      images: twitter.image ? [{ url: twitter.image.url, alt: twitter.image.alt || undefined }] : [],
    } : undefined,
  };
}

function SocialLinks({ links }) {
  const icons = {
    facebook: <span aria-hidden="true">f</span>, twitter: <span aria-hidden="true">𝕏</span>,
    youtube: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" /><path d="m10 9 6 3-6 3z" fill="#075264" /></svg>,
    instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".8" /></svg>,
  };
  return <div className="social-links">{Object.entries(links || {}).filter(([name, url]) => url && icons[name]).map(([name, url]) => <a key={name} href={url} aria-label={name === 'twitter' ? 'Twitter / X' : name[0].toUpperCase() + name.slice(1)}>{icons[name]}</a>)}</div>;
}

const fallbackBoats = [
  { src: '/assets/images/home/jpk-39-fc-yacht-hero-1600.webp', alt: 'JPK 39 FC sailing yacht under full sail', width: 1600, height: 900 },
  { src: '/assets/images/home/pogo-36-desert-witch-09-1378.webp', alt: 'Pogo 36 sailing near the coast', width: 1378, height: 775 },
  { src: '/assets/images/home/x46-yacht-home-feature-1600.webp', alt: 'X46 luxury performance cruiser entering a marina', width: 1600, height: 900 },
  { src: '/assets/images/home/jpk-48-fc-home-feature-1536.webp', alt: 'JPK 48 FC yacht rendering at anchor', width: 1536, height: 864 },
];

function fallbackFor(boat) {
  const value = `${boat.button_link || ''} ${boat.button_text || ''}`.toLowerCase();
  const index = [/jpk.?39/, /pogo.?36/, /x46/, /(?:jpk|pk).?48/].findIndex((pattern) => pattern.test(value));
  return fallbackBoats[index];
}
const fallbackLogo = { src: '/assets/images/shared/ulysses-sailing-logo-white.webp', alt: 'Ulysses Sailing', width: 214, height: 106 };

export default async function Homepage() {
  const { site, page } = await getHomepage();
  const fields = page.acf || {};
  const boats = fields.boat_repeater || [];
  const navigation = [['Training Schedule', '/training-schedule'], ['Pricelist', '/pricelist'], ['News', '/news'], ['About Us', '/about-us'], ['Contact', '/contact']].map(([label, href]) => ({ label, href: pageUrl(href) }));
  const boatLinks = boats.map((boat, index) => ({ label: boat.button_text?.replace(/^Explore\s+/i, '') || `Yacht ${index + 1}`, href: pageUrl(boat.button_link) }));
  const slides = (fields.home_slider || []).map((image) => imageProps(image, site, 'Sailing in Greece')).filter(Boolean);
  return <>
    <a className="skip-link" href="#content">Skip to content</a>
    <header className="site-header" id="top">
      <a className="brand" href="/" aria-label={`${site.name} home`}><img {...(imageProps(site.header_logo, site, site.name) || fallbackLogo)} /></a>
      <Navigation links={navigation} boats={boatLinks} />
      <SocialLinks links={site.social_links} />
    </header>
    <div className="site-shell">
      <main id="content">
        <Slideshow images={slides} title={fields.home_slider_title} subtitle={fields.home_slider_sub_title} />
        <img className="yacht-award" src="/assets/images/home/european-yacht-of-the-year-2022-award-383.webp" alt="European Yacht of the Year 2022" width="383" height="561" />
        {fields.text_section_1 && <section className="intro" dangerouslySetInnerHTML={{ __html: richText(fields.text_section_1, site) }} />}
        {boats.map((boat, index) => <section className={`split${index % 2 ? ' reverse' : ''}`} key={`${index}-${boat.button_link}`}>
          {(boat.boat_image || fallbackFor(boat)) && <img {...(imageProps(boat.boat_image, site, `${boat.button_text?.replace(/^Explore\s+/i, '') || 'Performance yacht'} sailing`) || fallbackFor(boat))} loading="lazy" decoding="async" sizes="(max-width:600px) 92vw, 47vw" />}
          <div className="split-copy"><div dangerouslySetInnerHTML={{ __html: richText(boat.boat_text, site) }} />
            {boat.button_text && boat.button_link && <a className="button" href={pageUrl(boat.button_link)}>{boat.button_text}</a>}
          </div>
        </section>)}
        {fields.text_section_2 && <section className="contact-cta narrow" dangerouslySetInnerHTML={{ __html: richText(fields.text_section_2, site) }} />}
        {fields.html_widget && <section className="testimonials" dangerouslySetInnerHTML={{ __html: richText(fields.html_widget, site) }} />}
        {fields.text_section_3 && <section className="esim narrow" dangerouslySetInnerHTML={{ __html: richText(fields.text_section_3, site) }} />}
      </main>
      <footer className="site-footer"><a href="/" aria-label={`${site.name} home`}><img {...(imageProps(site.footer_logo, site, site.name) || fallbackLogo)} loading="lazy" decoding="async" /></a>
        {site.copyright_text && <p>{site.copyright_text}</p>}
      </footer>
    </div>
    <a className="back-to-top" href="#top" aria-label="Back to top">↑</a>
  </>;
}
