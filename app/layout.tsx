import './globals.css';
import type { ReactNode } from 'react';
import type { Viewport } from 'next';

export const viewport: Viewport = { themeColor: '#075264' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body className="site-background">{children}</body></html>;
}
