import React from "react";
import { CoinsStacked01Icon } from "@/assets/images/svg/CoinsStacked01";

interface SubscriptionCardProps {
  label: string;
  amount: string;
  currency: string;
  className?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  label,
  amount,
  currency,
  className = "",
}) => {
  return (
    <div className={`w-[285px] ${className}`}>
      {/* Top Right Label */}
      <div className="flex justify-start mb-2 text-sm-demibold">
        <div className="text-textTertiary">{label}</div>
      </div>

      {/* Bottom Section with Amount and Icon */}
      <div className="flex items-center gap-3">
        <div className="text-purple-500 w-5 h-[19px]">
          <CoinsStacked01Icon className="" />
        </div>
        {/* Amount */}
        <div className=" flex gap-2 items-center">
          <div className="text-textTertiary  text-xl-demibold">{amount}</div>
          <div className="text-textSecondary  text-sm-medium">{currency}</div>
        </div>

        {/* Coins Icon */}
      </div>
    </div>
  );
};

export default SubscriptionCard;
