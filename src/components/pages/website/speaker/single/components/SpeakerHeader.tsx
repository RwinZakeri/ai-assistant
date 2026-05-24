import { Badge } from "@/components/ui/badge";
import ProductRating from "../../../product/single/components/ProductRating";

const SpeakerHeader = ({
  title,
  rating,
  reviewCount,
}: {
  title: string;
  rating: number;
  reviewCount: number;
}) => (
  <div className="flex flex-col gap-4 md:gap-5 w-full">
    <p className="text-gray-25 title-md-demibold">{title}</p>
    <div className="flex flex-row items-center gap-3 md:gap-4">
      <ProductRating rating={rating} reviewCount={reviewCount} />
      <Badge size="lg" variant="primary" icon="trailing">
        دیدگاه‌ها
      </Badge>
    </div>
  </div>
);

export default SpeakerHeader;
