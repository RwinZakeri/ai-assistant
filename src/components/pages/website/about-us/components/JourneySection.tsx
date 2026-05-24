import Image from "next/image";
import { CountingNumber } from "@/components/ui/counting-number";

export default function JourneySection() {
  return (
    <section className="w-full py-12 px-4 md:py-[96px] md:px-20  flex justify-center items-center bg-surfacePrimary">
      <div className="w-full max-w-[1280px] flex flex-col md:flex-row justify-between items-center gap-8 md:gap-[96px]">
        <div className="w-full md:w-[560px] h-[280px] md:h-[560px] relative overflow-hidden order-3 md:order-1">
          <Image
            src="/images/abouttopspeaker.png"
            alt="Smart Speaker with Hand Interaction"
            fill
            className="object-cover scale-120 object-center"
            priority
          />
        </div>

        <div className="w-full md:w-[568px] flex flex-col gap-8 md:gap-16 order-1 md:order-2">
          <h2 className="md:text-right md:title-lg-demibold title-sm-demibold">
            ما تازه در حال شروع سفر خود هستیم
          </h2>

          <div className="flex flex-col gap-6 md:gap-12">
            <div className="flex flex-row gap-4 md:gap-8">
              <div className="flex w-full flex-col">
                <div className="md:title-xl-demibold text-primary-25 mb-2 md:mb-3 title-md-demibold">
                  +<CountingNumber number={100} inView className="inline" />
                </div>
                <div className="text-sm-demibold text-gray-25">
                  دستیار صوتی تخصصی
                </div>
              </div>
              <div className="flex w-full flex-col">
                <div className="md:title-xl-demibold text-primary-25 mb-2 md:mb-3 title-md-demibold">
                  +<CountingNumber number={20} inView className="inline" />
                </div>
                <div className="text-sm-demibold text-gray-25">حوزه کاری</div>
              </div>
            </div>

            <div className="flex w-full flex-row gap-4 md:gap-8">
              <div className="flex w-full flex-col">
                <div className="md:title-xl-demibold text-primary-25 mb-2 md:mb-3 title-md-demibold">
                  <CountingNumber number={6} inView className="inline" />
                </div>
                <div className="text-sm-demibold text-gray-25">
                  سال سابقه فعالیت تخصصی در حوزه هوش مصنوعی
                </div>
              </div>
              <div className="flex w-full flex-col">
                <div className="md:title-xl-demibold text-primary-25 mb-2 md:mb-3 title-md-demibold">
                  +<CountingNumber number={10} inView className="inline" />
                </div>
                <div className="text-sm-demibold text-gray-25">
                  همکار فعال در زمینه تولید دستیار صوتی
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
