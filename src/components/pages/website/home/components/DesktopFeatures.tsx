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

const DesktopFeatures = () => {
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
      <div className="hidden md:block w-full">
        <Swiper
          loop={false}
          className="w-full"
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 2.49,
            },
            1441: {
              slidesPerView: 3,
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
      <div className="hidden md:flex justify-center items-center mt-8">
        <div className="p-3 rounded-full bg-surfaceSecondary w-fit flex justify-center items-center gap-4">
          <ArrowRightIcon className="cursor-pointer" onClick={handlePrev} />
          {Array.from({ length: Math.min(featureSlides.length, 4) }, (_, item) => item).map((item) => (
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

export default DesktopFeatures;

