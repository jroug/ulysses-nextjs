import { notFound, permanentRedirect } from 'next/navigation';
import TagPage, { tagMetadata } from '../../../../../../components/TagPage';
type Props = { params: Promise<{ slug: string; page: string }> };
export const dynamic = 'force-dynamic';
function pageNumber(value: string) {
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) notFound();
  return Number(value);
}
export async function generateMetadata({ params }: Props) {
  const { slug, page } = await params;
  return tagMetadata(slug, pageNumber(page));
}
export default async function PaginatedTag({ params }: Props) {
  const { slug, page } = await params;
  const number = pageNumber(page);
  if (number === 1) permanentRedirect(`/tag/${encodeURIComponent(slug)}/`);
  return <TagPage slug={slug} number={number} />;
}
