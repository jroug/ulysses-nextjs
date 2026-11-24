import type { ReactNode } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BackToTop from '../../components/BackToTop';
import { getSiteData } from '../../lib/cms';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { site, navigation } = await getSiteData();
  return <>
    <Header site={site} items={navigation.items} />
    <div className="site-shell">
      <main id="content">{children}</main>
      <Footer site={site} />
    </div>
    <BackToTop />
  </>;
}
