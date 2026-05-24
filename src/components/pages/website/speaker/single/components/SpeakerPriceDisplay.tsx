'use client';

import { Badge } from '@/components/ui/badge';

const SpeakerPriceDisplay = ({
  currentPrice,
  originalPrice,
  discountPercent,
  quantityInStorage,
}: {
  currentPrice: number;
  originalPrice: number;
  discountPercent: number;
  quantityInStorage: number;
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div className="flex flex-row w-full justify-between items-start">
      <div className="flex flex-col gap-2">
        {quantityInStorage <= 0 ? (
          <span className="text-sm md:text-md-medium text-error-400">
            ناموجود
          </span>
        ) : quantityInStorage < 4 ? (
          <span className="text-sm md:text-md-medium text-error-400">
            تنها {quantityInStorage} عدد در انبار باقی مانده
          </span>
        ) : null}
        {discountPercent > 0 && (
          <Badge size="lg" variant="sale">
            {discountPercent}%
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-2 items-end">
        <span className="text-xl md:title-xs-bold flex flex-row gap-1 md:gap-2 items-start text-gray-25">
          {formatPrice(currentPrice)}
          <span className="text-sm md:text-md-bold text-gray-25">تومان</span>
        </span>

        {discountPercent > 0 && (
          <span className="text-base md:title-xs-bold px-2 md:px-[14px] text-textSecondary line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>
    </div>
  );
};

export default SpeakerPriceDisplay;
