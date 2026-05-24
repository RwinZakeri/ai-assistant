'use client';
import { ArrowUpRightIcon } from '@/assets/images/svg/ArrowUpRight';
import { RaitingiconIcon } from '@/assets/images/svg/Raitingicon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip/tooltip';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface SmartSpeakerCardProps {
  id: number;
  thumbnail: string;
  title: string;
  quantityInStorage: number;
  stars: number;
  finalPrice: number;
  discountPercent: number;
  originalPrice: number;
}

export const SmartSpeakerCard: React.FC<SmartSpeakerCardProps> = ({
  id,
  thumbnail,
  title,
  quantityInStorage,
  stars,
  finalPrice,
  discountPercent,
  originalPrice,
}) => {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  const getStorageText = (quantity: number) => {
    if (quantity <= 0) {
      return 'ناموجود';
    }
    if (quantity < 4) {
      return `تنها ${quantity} عدد در انبار باقی مانده`;
    }
    return null;
  };

  const handleCardClick = () => {
    router.push(`/speaker/${id}`);
  };

  const isOutOfStock = quantityInStorage <= 0;

  return (
    <div
      className="bg-surfacePrimary rounded-2xl flex flex-col gap-4 md:gap-5 h-auto md:h-[438px] w-full cursor-pointer transition-opacity hover:opacity-90"
      onClick={handleCardClick}
    >
      {/* Image Header */}
      <div className="rounded-tl-2xl rounded-tr-2xl self-stretch shrink-0 h-48 md:h-60 relative overflow-hidden bg-white">
        <Image
          alt={title}
          className="w-full h-full absolute inset-0"
          height={500}
          src={thumbnail}
          style={{ objectFit: 'cover' }}
          width={500}
        />
      </div>
      {/* Image Header end */}

      {/* Content Body start */}
      <div className="px-4 md:px-6 pb-4 md:pb-6 flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col">
          {/* Main Content start */}
          <div className="flex flex-col gap-4 md:gap-6 w-full">
            {/* Title and Arrow */}
            <div className="flex flex-row items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-gray-25 text-base md:text-xl-bold line-clamp-1">
                    {title}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
              </Tooltip>
              <ArrowUpRightIcon className="w-5 h-5 md:w-6 md:h-6" />
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between min-h-[30px]">
              <div>
                {quantityInStorage < 4 && (
                  <div className="text-error-400 text-sm md:text-md-medium">
                    {getStorageText(quantityInStorage)}
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 md:gap-2 items-center">
                <div className="text-gray-25 text-base md:text-xl-bold">
                  {stars}
                </div>
                <div>
                  <RaitingiconIcon className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Storage quantity */}
          </div>
          {/* Main Content end */}
        </div>

        {/* Pricing and Discount */}
        <div className="flex flex-row items-start justify-between">
          {discountPercent > 0 && (
            <div className="bg-error-500 rounded-lg md:rounded-2xl border border-error-700 px-2 py-0.5 md:px-2.5 flex flex-row gap-0 items-center justify-end shrink-0 relative">
              <div className="text-error-100 text-center font-medium text-xs md:text-sm">
                {discountPercent}٪
              </div>
            </div>
          )}
          <div className="flex flex-col items-end justify-start">
            <div className="flex flex-row gap-1.5 md:gap-2 items-center justify-start">
              <div
                className={`font-bold text-lg md:text-xl ${
                  isOutOfStock ? 'text-textSecondary' : 'text-gray-25'
                }`}
              >
                {formatPrice(finalPrice)}
              </div>
              <div
                className={`text-xs md:text-sm-bold ${
                  isOutOfStock ? 'text-textSecondary' : 'text-gray-25'
                }`}
              >
                تومان
              </div>
            </div>
            {discountPercent > 0 && (
              <div className="pr-2 md:pr-3.5 pl-8 md:pl-[46px] flex flex-col gap-0 items-center justify-start">
                <div className="text-textSecondary text-sm md:text-md-bold relative after:content-[''] after:block after:w-[calc(100%+4px)] after:h-0.5 md:after:h-1 after:absolute after:top-2.5 md:after:top-3 after:-left-0.5 after:border-t after:border-textSecondary">
                  {formatPrice(originalPrice)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Content Body end */}
    </div>
  );
};

export default SmartSpeakerCard;
