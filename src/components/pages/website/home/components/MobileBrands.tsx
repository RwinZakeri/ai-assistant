import Image from "next/image";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Brands } from "./type";

const MobileBrands = () => {
  return (
    <>
      <div className="w-full md:hidden overflow-hidden">
        <Swiper
          modules={[]}
          spaceBetween={32}
          slidesPerView="auto"
          loop={true}
          speed={3000}
          allowTouchMove={false}
          className="brands-swiper"
          breakpoints={{
            0: {
              slidesPerView: 2.5,
            },
          }}
          style={{
            transitionTimingFunction: "linear",
          }}
        >
          {[...Brands].map((brand, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <div className="flex items-center justify-center">
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={brand.width}
                  height={brand.height}
                  className="object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default MobileBrands;
