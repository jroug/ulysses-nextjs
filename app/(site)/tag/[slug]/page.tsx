import TagPage, { tagMetadata } from '../../../../components/TagPage';
type Props = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: Props) { return tagMetadata((await params).slug); }
export default async function TagArchive({ params }: Props) { return <TagPage slug={(await params).slug} />; }
