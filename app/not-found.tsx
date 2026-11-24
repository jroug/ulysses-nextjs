import NotFoundContent from '../components/NotFoundContent';
import { unstable_rethrow } from 'next/navigation';
import type { Metadata } from 'next';
import type { CmsSite, MenuItem } from '../lib/types';
import Header from '../components/Header';
import { getSiteData } from '../lib/cms';

export const metadata: Metadata = {
  title: '404 Page not Found! | Ulysses Sailing',
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  // Keep the 404 usable even if CMS data cannot be fetched.
  let site: CmsSite = {
    name: 'Ulysses Sailing', wordpress_url: process.env.CMS_BASE_URL || '',
    header_logo: { url: '/assets/images/shared/ulysses-sailing-logo-white.webp', alt: 'Ulysses Sailing', width: 214, height: 106 },
  };
  let items: MenuItem[] = [];
  try {
    const data = await getSiteData();
    site = data.site;
    items = data.navigation.items;
  } catch (error) {
    unstable_rethrow(error);
    console.error('Unable to load the 404 header from the CMS:', error);
  }
  return <div className="not-found-layout">
    <Header site={site} items={items} />
    <main id="content" className="not-found-page">
      <NotFoundContent />
    </main>
  </div>;
}
