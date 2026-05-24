"use client";

import { ArrowRightIcon } from "@/assets/images/svg/ArrowRight";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import FeatureSlide from "./FeatureSlide";
import { featureSlides } from "./type";

const MobileFeatures = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleDotClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <>
      <div className="w-full md:hidden">
        <Swiper
          loop={false}
          className="w-full"
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
          breakpoints={{
            0: {
              slidesPerView: 1.1,
              spaceBetween: 16,
            },
          }}
        >
          {featureSlides.map((slide, index) => (
            <SwiperSlide key={index} className="!flex items-stretch">
              <div className="w-full h-full">
                <FeatureSlide
                  imageSrc={slide.imageSrc}
                  imageAlt={slide.imageAlt}
                  title={slide.title}
                  description={slide.description}
                  showOverlay={slide.showOverlay}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex justify-center items-center md:hidden mt-8">
        <div className="p-3 rounded-full bg-surfaceSecondary w-fit flex justify-center items-center gap-4">
          <ArrowRightIcon className="cursor-pointer" onClick={handlePrev} />
          {Array.from(
            { length: Math.min(featureSlides.length, 6) },
            (_, item) => item
          ).map((item) => (
            <div
              key={item}
              className={`w-[10px] h-[10px] rounded-full cursor-pointer transition-colors duration-200 ${
                activeIndex === item ? "bg-base-white" : "bg-surfaceTertiary"
              }`}
              onClick={() => handleDotClick(item)}
            />
          ))}

          <ArrowRightIcon
            className="cursor-pointer rotate-180"
            onClick={handleNext}
          />
        </div>
      </div>
    </>
  );
};

export default MobileFeatures;
