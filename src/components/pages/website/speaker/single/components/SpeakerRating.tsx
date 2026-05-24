import StarRating from "@/components/ui/star-rating";

const SpeakerRating = ({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) => (
  <div className="flex items-center gap-2">
    <StarRating rating={rating} />
    <span className="text-sm-regular text-textSecondary">
      {rating} ({reviewCount})
    </span>
  </div>
);

export default SpeakerRating;
