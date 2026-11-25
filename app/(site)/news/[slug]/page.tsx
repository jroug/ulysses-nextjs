import GenericPage, { generateMetadata as genericMetadata } from '../../[...slug]/page';

type Props = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return genericMetadata({ params: Promise.resolve({ slug: ['news', slug] }) });
}

export default async function NewsArticle({ params }: Props) {
  const { slug } = await params;
  return <GenericPage params={Promise.resolve({ slug: ['news', slug] })} />;
}
