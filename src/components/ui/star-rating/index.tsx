import React from "react";

interface StarRatingProps {
  rating?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onRatingChange,
  interactive = true,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  const [selectedRating, setSelectedRating] = React.useState(rating);

  const handleStarClick = (starIndex: number) => {
    if (interactive) {
      const newRating = starIndex + 1;
      setSelectedRating(newRating);
      if (onRatingChange) {
        onRatingChange(newRating);
      }
    }
  };

  const handleMouseEnter = (starIndex: number) => {
    if (interactive) {
      setHoverRating(starIndex + 1);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  // Determine if a star should be filled based on hover or selection
  const isStarFilled = (starIndex: number) => {
    const starNumber = starIndex + 1;
    const currentDisplay = hoverRating || selectedRating;
    return starNumber <= currentDisplay;
  };

  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }, (_, index) => {
        const isFilled = isStarFilled(index);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={`${
              interactive ? "cursor-pointer" : "cursor-default"
            } transition-all duration-200 p-0 border-0 bg-transparent`}
            style={{
              width: 18.6,
              height: 18,
            }}
          >
            <svg
              width={22}
              height={20}
              viewBox="0 0 22 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.45 1.824c.231-.467.346-.7.503-.775a.5.5 0 0 1 .43 0c.157.074.272.308.502.775l2.187 4.43c.068.138.102.206.152.26a.5.5 0 0 0 .155.113c.066.03.143.042.295.064l4.891.715c.515.075.773.113.892.239a.5.5 0 0 1 .133.41c-.023.17-.21.353-.583.716l-3.538 3.446c-.11.107-.165.16-.2.225a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.868c.088.513.132.77.05.922a.5.5 0 0 1-.349.253c-.17.031-.4-.09-.862-.332l-4.373-2.3c-.136-.071-.204-.107-.276-.121a.5.5 0 0 0-.192 0c-.072.014-.14.05-.276.121l-4.373 2.3c-.461.242-.692.363-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.41.049-.922l.835-4.868c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.183c-.035-.064-.09-.118-.2-.225L2.329 8.77c-.373-.363-.56-.545-.583-.717a.5.5 0 0 1 .133-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.033.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26z"
                fill={
                  isFilled ? "var(--color-warning-300, #FEC84B)" : "transparent"
                }
                stroke={isFilled ? "none" : "var(--color-linePrimary)"}
                strokeWidth={isFilled ? "0" : "2"}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: "all 0.2s ease",
                }}
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
