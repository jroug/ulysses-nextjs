import './globals.css';
import type { ReactNode } from 'react';
import { getHomepage } from '../lib/cms';

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { site } = await getHomepage();
  return <html lang={site.language || 'en'}><body className="page-home">{children}</body></html>;
}
