"use client";

import { Swiper, SwiperProps } from "swiper/react";
import { ReactNode } from "react";

interface GenericSwiperProps extends Omit<SwiperProps, "className"> {
  children: ReactNode;
  className?: string;
}

const GenericSwiper = ({
  children,
  className = "",
  ...swiperProps
}: GenericSwiperProps) => {
  const commonPaginationClasses = [
    // common layout
    "[&_.swiper-pagination]:!w-auto",
    "[&_.swiper-pagination]:!flex",
    "[&_.swiper-pagination]:!items-center",
    // common styling
    "[&_.swiper-pagination]:!bg-[#1B1B1B]/50",
    "[&_.swiper-pagination]:!rounded-full",
    // common default state
    "[&_.swiper-pagination-bullet]:!opacity-100",
    "[&_.swiper-pagination-bullet]:!rounded-full",
    "[&_.swiper-pagination-bullet]:!transition-all",
    "[&_.swiper-pagination-bullet]:!duration-300",
    // common active state
    "[&_.swiper-pagination-bullet-active]:!bg-gray-300",
    "[&_.swiper-pagination-bullet-active]:!opacity-100",
    "[&_.swiper-pagination-bullet-active]:!rounded-full",
  ].join(" ");

  const finalClassName = [className, commonPaginationClasses]
    .filter(Boolean)
    .join(" ");

  return (
    <Swiper className={finalClassName} {...swiperProps}>
      {children}
    </Swiper>
  );
};

export default GenericSwiper;
