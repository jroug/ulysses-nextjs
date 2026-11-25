import type { ReactNode } from 'react';
import type { CmsSite, MenuItem, RenderedImage, SocialLinks as SocialLinkData, SocialPlatform } from '../lib/types';
import { imageProps } from '../lib/cms';
import Navigation from './Navigation';
import Link from 'next/link';

function SocialLinks({ links }: { links?: SocialLinkData }) {
  const icons: Record<SocialPlatform, ReactNode> = {
    facebook: <span aria-hidden="true">f</span>, twitter: <span aria-hidden="true">𝕏</span>,
    youtube: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" /><path d="m10 9 6 3-6 3z" fill="#075264" /></svg>,
    instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".8" /></svg>,
  };
  return <div className="social-links">{(Object.entries(links || {}) as [SocialPlatform, string][]).filter(([name, url]) => url && icons[name]).map(([name, url]) => <a key={name} href={url} aria-label={name === 'twitter' ? 'Twitter / X' : name[0].toUpperCase() + name.slice(1)}>{icons[name]}</a>)}</div>;
}

const fallbackLogo: RenderedImage = { src: '/assets/images/placeholder.svg', alt: 'Logo placeholder', width: 214, height: 106 };

export default function Header({ site, items }: { site: CmsSite; items: MenuItem[] }) {

  return <>
    <a className="skip-link" href="#content">Skip to content</a>
    <header className="site-header" id="top">
      <Link className="brand" href="/" aria-label={`${site.name} home`}><img {...(imageProps(site.header_logo, site, site.name) || fallbackLogo)} /></Link>
      <Navigation items={items} />
      <SocialLinks links={site.social_links} />
    </header>
  </>;
}
