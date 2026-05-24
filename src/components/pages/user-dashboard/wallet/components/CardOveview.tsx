import type { WalletSummaryOutput } from '@/apis/models/WalletSummaryOutput';
import Image from 'next/image';

interface CardOverViewProps {
  walletData?: WalletSummaryOutput | null;
}

const CardOverView = ({ walletData }: CardOverViewProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b border-gray-800 pb-6">
        <p className="text-lg font-semibold">نمای کلی</p>
        <p className="text-textSecondary text-sm">
          مدیریت و پیگیری هزینه‌های کارت خود را انجام دهید
        </p>
      </div>
      <div className="border-b border-gray-800 pb-8">
        <div className="relative w-[348px] h-[302px] rounded-3xl bg-surfaceSecondary overflow-visible">
          <div className="absolute -left-[12%] -top-[15%] w-[125%] max-w-none">
            <Image
              alt="card container"
              height={1200}
              src="/cardContainer.svg"
              width={1200}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardOverView;
