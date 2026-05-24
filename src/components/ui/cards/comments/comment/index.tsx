"use client";

import React from "react";
import { Badge } from "../../../badge";
import StarRating from "../../../star-rating";

interface CommentsCardProps {
  fullName: string;
  isCustomer: boolean;
  date: string;
  stars: number;
  content: string;
}

// Function to format ISO date to Persian date
const formatPersianDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "تاریخ نامعتبر";
    }

    try {
      const persianDate = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
      return persianDate;
    } catch {
      const fallbackDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
      return fallbackDate;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "خطا در نمایش تاریخ";
  }
};

const CommentsCard: React.FC<CommentsCardProps> = ({
  fullName,
  isCustomer,
  date,
  stars,
  content,
}) => {
  return (
    <>
      <div className="bg-surfaceSecondary rounded-2xl p-7 w-full  ">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-3">
            <p className="text-gray-25 text-xl-bold">{fullName}</p>
            {isCustomer && (
              <Badge variant="primary" size="md">
                خریدار
              </Badge>
            )}
          </div>
          <div>
            <p className="text-textSecondary text-md-medium">
              {formatPersianDate(date)}
            </p>
          </div>
          <div className="mt-[13px]">
            <StarRating
              rating={stars}
              interactive={false}
              onRatingChange={(newRating) =>
                console.log("New rating:", newRating)
              }
            />
          </div>
        </div>
        <div className="text-gray-25 text-md-medium text-right mt-[47px]">
          {content}
        </div>
      </div>
    </>
  );
};

// Example usage with sample data
export const CommentsCardExample = () => {
  return (
    <div className="p-4">
      <h3 className="text-white mb-4">Comments Card Example</h3>
      <CommentsCard
        fullName="هدی تارا"
        isCustomer={true}
        date="2025-10-18T11:38:35.421Z" // ISO date format
        stars={4}
        content="من طی چند هفته‌ی اخیر از این دستیار صوتی هوشمند در محیط کلینیک استفاده کردم و تجربه‌ی کلی من بسیار مثبت بوده است."
      />
    </div>
  );
};

export default CommentsCard;
