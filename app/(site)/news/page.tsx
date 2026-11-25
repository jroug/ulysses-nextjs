import NewsPage, { newsMetadata } from '../../../components/NewsPage';

export const dynamic = 'force-dynamic';
export const generateMetadata = () => newsMetadata(1);
export default function News() { return <NewsPage />; }
