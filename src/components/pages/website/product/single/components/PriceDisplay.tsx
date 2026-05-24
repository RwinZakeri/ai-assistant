import { Badge } from "@/components/ui/badge";

const PriceDisplay = ({
  currentPrice,
  originalPrice,
  discountPercentage,
}: {
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
}) => (
  <div className="flex w-full justify-between md:w-auto py-6 md:py-0 gap-6">
    <Badge size="lg" variant="sale">
      {discountPercentage}%
    </Badge>
    <div className="flex flex-col items-end">
      <div className="flex gap-2 items-center">
        <span className="text-gray-25 title-sm-bold">{currentPrice}</span>
        <span className="text-gray-25 text-md-bold">تومان</span>
      </div>
      <div className="pr-3.5 pl-[38px] flex flex-col items-center">
        <span className="text-textSecondary title-xs-bold relative after:content-[''] after:block after:w-[calc(100%+4px)] after:h-1 after:absolute after:top-3 after:border-t after:border-textSecondary">
          {originalPrice}
        </span>
      </div>
    </div>
  </div>
);

export default PriceDisplay;
