'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RaitingiconIcon } from '@/assets/images/svg/Raitingicon';
import { ArrowUpRightIcon } from '@/assets/images/svg/ArrowUpRight';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useDevice from '@/hooks/useDevice';

interface SmartSpeakerCarouselCardProps {
  id: number;
  thumbnail: string;
  title: string;
  quantityInStorage: number;
  stars: number;
  finalPrice: number;
  discountPercent: number;
  originalPrice: number;
}

export const SmartSpeakerCarouselCard: React.FC<
  SmartSpeakerCarouselCardProps
> = ({
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
  const device = useDevice();

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  const getStorageText = (quantity: number) => {
    if (quantity < 4) {
      return `تنها ${quantity} عدد در انبار باقی مانده`;
    }
    return null;
  };

  const handleCardClick = () => {
    router.push(`/speaker/${id}`);
  };

  const titleElement = (
    <div className="text-gray-25 text-lg-bold truncate flex-1 min-w-0">
      {title}
    </div>
  );

  return (
    <div
      className="bg-surfacePrimary rounded-2xl flex flex-col h-[454px] gap-4 w-full cursor-pointer transition-opacity hover:opacity-90"
      onClick={handleCardClick}
    >
      {/* Image Header */}
      <div className="rounded-tl-2xl rounded-tr-2xl self-stretch shrink-0 h-60 relative overflow-hidden bg-white">
        <Image
          fill
          alt={title}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
          src={thumbnail}
        />
      </div>
      {/* Image Header end */}

      {/* Content Body start */}
      <div className="pr-6 pl-6 pb-6 flex flex-col gap-4">
        <div className="flex flex-col">
          {/* Main Content start */}
          <div className="flex flex-col gap-4 w-full">
            {/* Title and Arrow */}
            <div className="flex flex-row items-center justify-between">
              {device === 'desktop' ? (
                <Tooltip>
                  <TooltipTrigger asChild>{titleElement}</TooltipTrigger>
                  <TooltipContent>
                    <p>{title}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                titleElement
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between h-[30px]">
              <div className="flex gap-2 items-center">
                <div className="text-gray-25 text-xl-bold">{stars}</div>
                <div>
                  <RaitingiconIcon />
                </div>
              </div>
              <div>
                <ArrowUpRightIcon className="w-6 h-6" />
              </div>
            </div>
            <div>
              {quantityInStorage < 4 && (
                <div className="text-error-400 text-sm-medium">
                  {getStorageText(quantityInStorage)}
                </div>
              )}
            </div>

            {/* Storage quantity */}
          </div>
          {/* Main Content end */}
        </div>

        {/* Pricing and Discount */}
        <div className="flex flex-row items-start justify-between mt-auto">
          {discountPercent > 0 && (
            <div className="bg-error-500 rounded-2xl border border-error-700 pl-2 pr-2 pt-0.5 pb-0.5 flex flex-row gap-0 items-center justify-end shrink-0 relative">
              <div className="text-error-100 text-center font-medium text-sm">
                {discountPercent}٪
              </div>
            </div>
          )}
          <div className="flex flex-col items-end justify-start">
            <div className="flex flex-row gap-2 items-center justify-start">
              <div className="text-gray-25 text-xl-bold">
                {formatPrice(finalPrice)}
              </div>
              <div className="text-gray-25 text-sm-bold">تومان</div>
            </div>
            {discountPercent > 0 && (
              <div className="pr-3.5 pl-[46px] flex flex-col gap-0 items-center justify-start">
                <div className="text-textSecondary text-md-bold relative after:content-[''] after:block after:w-[calc(100%+4px)] after:h-1 after:absolute after:top-3 after:-left-0.5 after:border-t after:border-textSecondary">
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

export default SmartSpeakerCarouselCard;
