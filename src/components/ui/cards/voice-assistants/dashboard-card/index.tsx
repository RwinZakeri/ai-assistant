import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SubscriptionProgress } from "@/components/ui/progress";
import { SubscriptionCard } from "@/components/ui/subscription-card";
import { ArrowUpRightIcon } from "lucide-react";

interface VoiceDashboardCardProps {
  // Image props
  imageSrc: string;

  // Product info
  category: string;
  title: string;

  // Badge for active/inactive status
  badge: boolean; // true = active (green), false = inactive (red)

  // Tags/pills
  badges: string[];

  // Description
  description: string;

  // Subscription type: 0 = free (no design), 1 = progress, 2 = subscription-card
  subscriptionType: 0 | 1 | 2;

  // For subscription type 1 (progress)
  progressLabel?: string;
  daysLeft?: number;
  percentage?: number;

  // For subscription type 2 (subscription-card)
  subscriptionLabel?: string;
  amount?: string;
  currency?: string;
}

export const VoiceDashboardCard: React.FC<VoiceDashboardCardProps> = ({
  imageSrc,
  category,
  title,
  badge,
  badges,
  description,
  subscriptionType,
  progressLabel,
  daysLeft,
  percentage,
  subscriptionLabel,
  amount,
  currency,
}) => {
  return (
    <div className="bg-surfacePrimary rounded-xl flex flex-col h-[548px]  flex-1 overflow-hidden">
      {/* Image Header */}
      <div className="rounded-tl-2xl rounded-tr-2xl self-stretch shrink-0 h-60 relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      {/* Image Header end */}

      {/* Content Body start */}
      <div className="bg-surfacePrimary flex-1 flex flex-col px-6 py-4">
        {/* Back Arrow and Category */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-primary-200 text-xs-demibold">{category}</div>
        </div>

        {/* Title and Badge */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex flex-col flex-row items-center justify-between gap-2">
            <div className="text-gray-25 text-xl-bold ">{title}</div>
            <div className="">
              <Badge variant={badge ? "success" : "error"} size="md">
                {badge ? "فعال" : "غیر فعال"}
              </Badge>
            </div>
          </div>
          <div>
            <ArrowUpRightIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-5">
          {badges.map((badge, index) => (
            <Badge key={index} variant="gray" size="md">
              {badge}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <div className="text-textTertiary text-sm-regular overflow-hidden h-15 mb-4">
          {description}
        </div>

        {/* Subscription Section */}
        {subscriptionType === 1 &&
          progressLabel &&
          daysLeft !== undefined &&
          percentage !== undefined && (
            <SubscriptionProgress
              label={progressLabel}
              daysLeft={daysLeft}
              percentage={percentage}
            />
          )}

        {subscriptionType === 2 && subscriptionLabel && amount && currency && (
          <SubscriptionCard
            label={subscriptionLabel}
            amount={amount}
            currency={currency}
          />
        )}
      </div>
      {/* Content Body end */}
    </div>
  );
};

export default VoiceDashboardCard;
