import HistorySingle from '@/components/pages/user-dashboard/history/singlePage';

interface HistorySinglePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const HistorySinglePage = async ({ params }: HistorySinglePageProps) => {
  const { slug } = await params;
  return <HistorySingle id={slug} />;
};

export default HistorySinglePage;
