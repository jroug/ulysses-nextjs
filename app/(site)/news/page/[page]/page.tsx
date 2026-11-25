import { notFound, permanentRedirect } from 'next/navigation';
import NewsPage, { newsMetadata } from '../../../../../components/NewsPage';

type Props = { params: Promise<{ page: string }> };
export const dynamic = 'force-dynamic';

function pageNumber(value: string) {
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) notFound();
  return Number(value);
}
export async function generateMetadata({ params }: Props) {
  return newsMetadata(pageNumber((await params).page));
}
export default async function PaginatedNews({ params }: Props) {
  const number = pageNumber((await params).page);
  if (number === 1) permanentRedirect('/news/');
  return <NewsPage number={number} />;
}
