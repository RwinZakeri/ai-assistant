'use client';

import Image from 'next/image';
import { useState } from 'react';
import { SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import GenericSwiper from '@/components/ui/GenericSwiper';

const SpeakerImage = ({
  src,
  alt,
  thumbnails,
}: {
  src: string;
  alt: string;
  thumbnails: string[];
}) => {
  const [selectedImage, setSelectedImage] = useState(src);
  const allImages = thumbnails.length > 0 ? thumbnails : [src];
  const hasMultipleImages = allImages.length > 1;

  const handleThumbnailClick = (thumbnailSrc: string) => {
    setSelectedImage(thumbnailSrc);
  };

  return (
    <div className="flex flex-col gap-6 w-full md:w-[506px] md:self-start">
      {/* Mobile Swiper */}
      <div className="relative w-full h-[400px] overflow-hidden pb-12 md:hidden ">
        <GenericSwiper
          allowTouchMove
          resistance
          direction="horizontal"
          loop={hasMultipleImages}
          modules={hasMultipleImages ? [Autoplay, Pagination] : []}
          resistanceRatio={0.85}
          slidesPerView={1}
          spaceBetween={0}
          threshold={10}
          touchEventsTarget="container"
          touchRatio={1}
          autoplay={
            hasMultipleImages
              ? {
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          className={[
            'w-full h-full rounded-2xl',
            // Swiper Wrapper & Slides
            '[&_.swiper-wrapper]:!h-full',
            '[&_.swiper-slide]:!h-full',
            // Pagination Container
            '[&_.swiper-pagination]:!bottom-3',
            '[&_.swiper-pagination]:!left-4',
            '[&_.swiper-pagination]:!translate-x-0',
            '[&_.swiper-pagination]:!justify-start',
            '[&_.swiper-pagination]:!gap-[11.46px]',
            '[&_.swiper-pagination]:!px-2',
            '[&_.swiper-pagination]:!py-2',
            // Pagination Bullets
            '[&_.swiper-pagination-bullet]:!bg-surfaceTertiary',
            '[&_.swiper-pagination-bullet]:!w-[7px]',
            '[&_.swiper-pagination-bullet]:!h-[7px]',
            '[&_.swiper-pagination-bullet]:!mx-0',
            // Pagination Bullet Active
            '[&_.swiper-pagination-bullet-active]:!w-5',
            '[&_.swiper-pagination-bullet-active]:!h-1.5',
          ].join(' ')}
          pagination={
            hasMultipleImages
              ? {
                  clickable: true,
                  dynamicBullets: false,
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                  bulletClass: 'swiper-pagination-bullet',
                }
              : false
          }
        >
          {allImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full overflow-hidden bg-white  ">
                <Image
                  fill
                  alt={`${alt} ${index + 1}`}
                  className="object-contain "
                  priority={index === 0}
                  src={image}
                />
              </div>
            </SwiperSlide>
          ))}
        </GenericSwiper>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-col gap-6 w-full">
        <div className="relative w-[506px] h-[506px] bg-white rounded-2xl overflow-hidden flex-shrink-0">
          <Image
            fill
            priority
            alt={alt}
            className="object-contain"
            src={selectedImage}
          />
        </div>
        <div className="flex gap-[24.4px]">
          {allImages.map((thumbnail, index) => (
            <Image
              key={index}
              alt={`${alt} thumbnail ${index + 1}`}
              height={64}
              src={thumbnail}
              width={64}
              className={`rounded-lg cursor-pointer transition-all duration-200 ${
                selectedImage === thumbnail
                  ? ' scale-105 opacity-100'
                  : 'opacity-60 hover:opacity-80'
              }`}
              onClick={() => handleThumbnailClick(thumbnail)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeakerImage;
