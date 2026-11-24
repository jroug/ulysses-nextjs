import type { CmsSite, RenderedImage } from '../lib/types';
import { imageProps } from '../lib/cms';

const fallbackLogo: RenderedImage = { src: '/assets/images/placeholder.svg', alt: 'Logo placeholder', width: 214, height: 106 };

export default function Footer({ site }: { site: CmsSite }) {
  return <footer className="site-footer">
    <a href="/" aria-label={`${site.name} home`}>
      <img {...(imageProps(site.footer_logo, site, site.name) || fallbackLogo)} loading="lazy" decoding="async" />
    </a>
    {site.copyright_text && <p>{site.copyright_text}</p>}
  </footer>;
}
