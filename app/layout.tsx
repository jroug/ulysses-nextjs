import './globals.css';
import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { getHomepage } from '../lib/cms';

export const dynamic = 'force-dynamic';
export const viewport: Viewport = { themeColor: '#075264' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { site, navigation } = await getHomepage();
  return (
    <html lang={site.language || 'en'}>
      <body className="site-background">
        <Header site={site} items={navigation.items} />
        <div className="site-shell">
          <main id="content">{children}</main>
          <Footer site={site} />
        </div>
        <BackToTop />
      </body>
    </html>
  );
}
