import Image from "next/image";

export default function GuideHeroSection() {
  return (
    <section className="flex items-center justify-center w-full px-4 overflow-visible lg:h-fit lg:px-20 lg:py-0 md:mb-24 mt-16">
      <div className="flex flex-col items-center justify-between w-full h-full max-w-[1280px] gap-8 mx-auto md:flex-row lg:gap-16 ">
        <div className="flex flex-col w-full gap-6 order-2 lg:w-[593px] lg:gap-8 lg:order-1">
          <h1 className="text-center text-gray-25 title-md-demibold lg:text-right lg:title-xl-demibold">
            راهنمای جامع استفاده از دستیار صوتی
          </h1>
          <p className="text-center leading-relaxed text-textSecondary text-lg-regular lg:text-right lg:text-xl-regular">
            همه چیز درباره شروع، استفاده هوشمندانه و بهره‌وری بیشتر با دستیار
            صوتی
          </p>
        </div>

        <div className="relative w-full h-[400px] order-2 lg:w-[489px] lg:h-[488px] lg:order-1 overflow-visible">
          <div className="absolute z-0 w-[349px] h-[271px] rounded-[20px] bg-primary-300 left-[-70px] top-[20px] lg:w-[650px] lg:h-[380px] lg:left-[-220px] lg:-top-2" />

          <div className="absolute left-0 top-0 z-10 w-[335px] h-[335px] lg:w-full lg:h-full">
            <Image
              src="/images/hero-section-photo-guide.png"
              alt="Smart Speaker and Phone"
              fill
              className="object-cover scale-125 lg:scale-115"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
