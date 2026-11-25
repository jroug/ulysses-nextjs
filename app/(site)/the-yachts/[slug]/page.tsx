import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import YachtPage from '../../../../components/YachtPage';
import { getPageByPath } from '../../../../lib/cms';
import { pageMetadata } from '../../../../lib/metadata';

type Props = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPageByPath(`/the-yachts/${slug}/`);
  return data ? pageMetadata(data.site, data.page) : { title: 'Yacht not found', robots: { index: false } };
}

export default async function BoatPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPageByPath(`/the-yachts/${slug}/`);
  if (!data) notFound();
  return <YachtPage page={data.page} site={data.site} />;
}
