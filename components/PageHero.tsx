import Slideshow from './Slideshow';
import { imageProps } from '../lib/cms';
import type { CmsPage, CmsSite, RenderedImage } from '../lib/types';

/** All WordPress pages share the top-slider ACF contract; posts use their own hero. */
export default function PageHero({ page, site }: { page: CmsPage; site: CmsSite }) {
  const fields = page.acf || {};
  const title = fields.top_slider_title ?? page.title;
  const subtitle = fields.top_slider_sub_text;
  const images = (fields.top_slider_images || [])
    .map((image) => imageProps(image, site, `${page.title} hero image`))
    .filter((image): image is RenderedImage => image !== null);

  if (images.length > 1) {
    return <Slideshow key={page.id} images={images} title={title} subtitle={subtitle} />;
  }

  return <section className="hero page-hero">
    {images[0] && <img className="hero-image" {...images[0]} loading="eager" fetchPriority="high" sizes="93vw" />}
    <div className="hero-copy"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
  </section>;
}
