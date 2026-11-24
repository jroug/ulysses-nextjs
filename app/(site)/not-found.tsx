import type { Metadata } from 'next';
import NotFoundContent from '../../components/NotFoundContent';

export const metadata: Metadata = {
  title: '404 Page not Found! | Ulysses Sailing',
  robots: { index: false, follow: true },
};

export default function SiteNotFound() {
  return <div className="not-found-in-site"><NotFoundContent /></div>;
}
