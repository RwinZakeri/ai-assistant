'use client';

import type { SimilarSpeaker } from '../type';
import { SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { SmartSpeakerCarouselCard } from '@/components/ui/cards/smart-speakers/carousel-card';
import { SmartSpeakerCard } from '@/components/ui/cards/smart-speakers/products-card';
import GenericSwiper from '@/components/ui/GenericSwiper';
import useDevice from '@/hooks/useDevice';
import getFileUrl from '@/utils/getFileUrl';

const SimilarSpeakers = ({ speakers }: { speakers: SimilarSpeaker[] }) => {
  const device = useDevice();

  return (
    <div className="flex flex-col gap-16">
      <h3 className="title-md-demibold text-gray-25">کالاهای مشابه</h3>
      <div className="w-full">
        {device === 'mobile' ? (
          <GenericSwiper
            modules={[Pagination]}
            slidesPerView={1.2}
            spaceBetween={24}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
            }}
            className={
              // Container styles
              '!overflow-visible w-full ' +
              // Pagination container - positioning (centered)
              '[&_.swiper-pagination]:!-bottom-12 [&_.swiper-pagination]:!left-1/2 [&_.swiper-pagination]:!-translate-x-1/2 [&_.swiper-pagination]:!transform ' +
              // Pagination container - layout
              '[&_.swiper-pagination]:!justify-center [&_.swiper-pagination]:!gap-2 ' +
              // Pagination container - styling
              '[&_.swiper-pagination]:!py-2 ' +
              // Pagination container - hide on desktop (md and above)
              '[&_.swiper-pagination]:md:!hidden ' +
              // Pagination bullet - default state
              '[&_.swiper-pagination-bullet]:!bg-[#353535] [&_.swiper-pagination-bullet]:!w- [&_.swiper-pagination-bullet]:!h-2 ' +
              // Pagination bullet - active state
              '[&_.swiper-pagination-bullet-active]:!w-7'
            }
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
          >
            {speakers.map(speaker => {
              const thumbnail =
                getFileUrl(speaker.fileId) || '/images/Image.png';
              return (
                <SwiperSlide key={speaker.id}>
                  <SmartSpeakerCarouselCard
                    discountPercent={speaker.discountPercent}
                    finalPrice={speaker.finalPrice}
                    id={speaker.id}
                    originalPrice={speaker.originalPrice}
                    quantityInStorage={speaker.quantityInStorage}
                    stars={speaker.stars}
                    thumbnail={thumbnail}
                    title={speaker.title}
                  />
                </SwiperSlide>
              );
            })}
          </GenericSwiper>
        ) : (
          <div className="grid grid-cols-3 gap-12">
            {speakers.map(speaker => {
              const thumbnail =
                getFileUrl(speaker.fileId) || '/images/Image.png';
              return (
                <SmartSpeakerCard
                  key={speaker.id}
                  discountPercent={speaker.discountPercent}
                  finalPrice={speaker.finalPrice}
                  id={speaker.id}
                  originalPrice={speaker.originalPrice}
                  quantityInStorage={speaker.quantityInStorage}
                  stars={speaker.stars}
                  thumbnail={thumbnail}
                  title={speaker.title}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimilarSpeakers;
