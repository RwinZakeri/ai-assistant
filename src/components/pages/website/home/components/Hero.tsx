import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <ContentWrapper hiddenPaddingY>
      <div className="md:min-h-[621px] min-h-[600px] flex flex-col justify-start items-start md:justify-end md:items-center relative overflow-hidden">
        {/* Background Video */}
        <video
          muted
          loop
          playsInline
          className="w-[99%] h-auto mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:w-[990px] md:h-[621px] md:translate-x-0 md:translate-y-0 object-contain"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>

        {/* Content */}
        <div className="text-center absolute top-[80px] md:inset-0 z-10 flex flex-col justify-start items-center md:justify-center md:pb-8 pt-4 md:pt-0">
          <div>
            <p className="font-extrabold text-white text-center [text-shadow:0_6px_57.3px_rgba(0,0,0,0.75)] text-4xl md:text-[64px] leading-[72px] tracking-[-1.28px] mb-3 px-5 md:px-0">
              هر آنچه نیاز دارید در یک صدا
            </p>
            <p className="text-white text-center  px-0 md:px-0 [text-shadow:0_0_19.6px_#662BFE] font-[Pelak] text-[20px] font-semibold leading-[30px] not-italic max-w-[872px] mx-auto text-sm md:text-xl mb-12">
              با آریو، با صدای خود کارها را مدیریت و از پاسخ‌های تخصصی، خدمات
              متنوع و اطلاعات دقیق بهره‌مند شوید؛ هوشمندترین همراه شما.
            </p>
            <Button onClick={() => router.push("/product")} size="xxl">
              مشاهده دستیاران صوتی
            </Button>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Hero;
