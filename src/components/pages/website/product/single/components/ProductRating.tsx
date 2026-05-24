import { RaitingiconIcon } from "@/assets/images/svg/Raitingicon";

const ProductRating = ({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) => (
  <div className="flex gap-2 items-center">
    <RaitingiconIcon />
    <span className="text-gray-25 text-xl-bold">{rating}</span>
    <span className="text-textSecondary text-xl-demibold">({reviewCount})</span>
  </div>
);

export default ProductRating;