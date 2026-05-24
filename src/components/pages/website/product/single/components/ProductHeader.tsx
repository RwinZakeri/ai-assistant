import { Badge } from "@/components/ui/badge";
import ProductRating from "./ProductRating";

const ProductHeader = ({
  category,
  title,
  rating,
  reviewCount,
}: {
  category: string;
  title: string;
  rating: number;
  reviewCount: number;
}) => (
  <div className="flex flex-col gap-5">
    <p className="text-lg-bold text-primary-300">{category}</p>
    <p className="text-gray-25 title-md-demibold">{title}</p>
    <div className="flex gap-4">
      <ProductRating rating={rating} reviewCount={reviewCount} />
      <Badge size="lg" variant="primary" icon="trailing">
        دیدگاه‌ها
      </Badge>
    </div>
  </div>
);

export default ProductHeader;
