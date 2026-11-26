import type { Metadata } from 'next';
import Link from 'next/link';
import { getSitemapData } from '../../../lib/cms';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Sitemap | Ulysses Sailing', description: 'Explore Ulysses Sailing: our yacht fleet, sailing training, latest news and booking information.' };

export default async function SitemapPage() {
  const { entries } = await getSitemapData();
  const pages = entries.filter((entry) => entry.kind === 'page' && entry.path.replace(/\/$/, '') !== '/stoicheia');
  const boats = pages.filter((entry) => entry.path.startsWith('/the-yachts/'));
  const news = entries.filter((entry) => entry.kind === 'post');
  const tags = entries.filter((entry) => entry.kind === 'tag');
  const groups = [
    { title: 'Explore Ulysses', description: 'Plan your next sailing adventure.', items: pages.filter((entry) => !boats.includes(entry)) },
    { title: 'Our fleet', description: 'Discover your next yacht.', items: boats },
    { title: 'Latest news', description: 'Stories and updates from the water.', items: news },
    { title: 'News topics', description: 'Browse articles by tag.', items: tags },
  ];
  return <section className="sitemap-page">
    <div className="sitemap-intro"><p className="sitemap-eyebrow">ULYSSES SAILING</p><h1>Find your way</h1><p>Explore our fleet, plan your trip, and catch up on life at sea.</p>
      <div className="sitemap-stats"><span><strong>{pages.length}</strong> pages</span><span><strong>{news.length}</strong> news articles</span><span><strong>{tags.length}</strong> topics</span><a href="/sitemap.xml">View XML sitemap ↗</a></div>
    </div>
    <div className="sitemap-groups">{groups.map((group) => <section className="sitemap-card" key={group.title}>
      <div className="sitemap-card-heading"><h2>{group.title}</h2><span>{group.items.length}</span></div><p>{group.description}</p>
      <ul>{group.items.map((entry) => <li key={entry.path}><Link href={entry.path}><span dangerouslySetInnerHTML={{ __html: entry.title }} /><span aria-hidden="true">↗</span></Link>
        {entry.modified && <time dateTime={entry.modified}>Updated {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(entry.modified))}</time>}
      </li>)}</ul>
    </section>)}</div>
  </section>;
}
