import { ArrowUpRightIcon } from "@/assets/images/svg/ArrowUpRight";
import { RaitingiconIcon } from "@/assets/images/svg/Raitingicon";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import Image from "next/image";
import React from "react";

interface VoiceCarouselCardProps {
  // Image props
  imageSrc: string;

  // Language tags
  languageTags: string[];

  // Product info
  category: string;
  title: string;
  subscriptionType: string;

  // Rating
  ratingValue: string;

  // Badges
  badges: string[];

  // Description
  description: string;

  // Pricing
  currentPrice: string;
  currency: string;
  originalPrice: string;
  discountPercent: number;
}

export const VoiceCarouselCard: React.FC<VoiceCarouselCardProps> = ({
  imageSrc,
  languageTags,
  category,
  title,
  subscriptionType,
  ratingValue,
  badges,
  description,
  currentPrice,
  currency,
  originalPrice,
  discountPercent,
}) => {
  return (
    <div className="bg-surfacePrimary rounded-2xl flex flex-col gap-5 h-[573px] md:w-[300px] ">
      {/* Image Header */}
      <div className="rounded-tl-2xl rounded-tr-2xl self-stretch shrink-0 h-60 relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 300px"
        />

        {/* Language Tags */}
        <div className="flex gap-1 items-center justify-start absolute right-4 bottom-4 ">
          {languageTags.map((tag, index) => (
            <Tag key={index} size="md">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
      {/* Image Header end */}

      {/* Content Body start */}
      <div className="pr-6 pl-6 flex flex-col gap-5 ">
        <div className="flex flex-col ">
          {/* Main Content start */}
          <div className="flex flex-col gap-2 w-full">
            {/* Category */}
            <div className="text-primary-200  text-xs-bold   ">{category}</div>
            {/* Title and Subscription */}
            <div className="flex gap-4 flex-col">
              <div className="text-gray-25 text-xl-bold">{title}</div>

              {/* Subscription and icon start */}
              <div className="flex flex-row gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="text-gray-25 text-lg-bold ">
                    {ratingValue}
                  </div>
                  <div>
                    <RaitingiconIcon />
                  </div>
                </div>
                <div className="text-textTertiary flex flex-row items-center gap-2 text-sm-bold">
                  {subscriptionType}
                  <ArrowUpRightIcon className="w-6 h-6" />
                </div>
              </div>
              {/* Subscription and icon end */}
            </div>

            {/* Rating and Badges */}
            <div className="flex items-center justify-between h-12 ">
              <div className=" flex flex-row gap-1 ">
                {badges.map((badge, index) => (
                  <Badge key={index} variant="gray" size="sm">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div
              className="text-textTertiary text-sm-regular overflow-hidden h-[59px]"
              style={{ textOverflow: "ellipsis" }}
            >
              {description}
            </div>
          </div>
          {/* Main Content end */}
        </div>

        {/* Pricing and Discount */}
        <div className="flex flex-row items-start justify-between">
          {discountPercent > 0 && (
            <div className="bg-error-500 rounded-2xl border border-error-700 pt-0.5 pr-2 pb-0.5 pl-2 md:pr-2.5 md:pl-2.5 flex flex-row gap-0 items-center justify-end shrink-0 relative">
              <div className="text-error-100 text-center text-xs-medium">
                {discountPercent}٪
              </div>
            </div>
          )}
          <div className="flex flex-col items-end justify-start">
            <div className="flex flex-row gap-2 items-center justify-start">
              <div className="text-gray-25 text-xl-bold">{currentPrice}</div>
              <div className="text-gray-25 text-sm-bold">{currency}</div>
            </div>
            {discountPercent > 0 && (
              <div className="pr-3.5 pl-[38px] flex flex-col gap-0 items-center justify-start ">
                <div className="text-textSecondary text-md-bold relative after:content-[''] after:block after:w-[calc(100%+4px)] after:h-1 after:absolute after:top-3 after:-left-0.5 after:border-t after:border-textSecondary">
                  {originalPrice}
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

export default VoiceCarouselCard;
