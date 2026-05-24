import SupportSingle from '@/components/pages/user-dashboard/support/SupportSingle';
import type { SupportSinglePageProps } from '@/components/pages/user-dashboard/support/type';

const SupportSinglePage = async ({ params }: SupportSinglePageProps) => {
  const { slug } = await params;
  return <SupportSingle ticketChatId={slug} />;
};

export default SupportSinglePage;
