import Image from "next/image";
import ContentWrapper from "../wrappers/ContentWrapper";
import { TextInput } from "@/components/ui/input/text-input";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { IconLink } from "@/components/ui/icon-link";
import { Tel24Icon } from "@/assets/images/svg/Tel24";
import { Linek24Icon } from "@/assets/images/svg/Linek24";
import { Insta24Icon } from "@/assets/images/svg/Insta24";
import { X24Icon } from "@/assets/images/svg/X24";

const Footer = () => {
  return (
    <div className="pt-12 md:pt-16 pb-12 border-t-[2px] border-linePrimary">
      <ContentWrapper hiddenPaddingY>
        <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-8">
          <div className="flex flex-col gap-8 w-full lg:max-w-[384px] lg:flex-1">
            <Image src="/images/logo.svg" alt="logo" width={40} height={34} />
            <p className="text-md-regular">
              با آریو، زندگی خود را هوشمندتر کنید! به سادگی با صدای خود دستورات
              را به آریو بدهید و از پاسخ‌های تخصصی و خدمات متنوع آن بهره‌مند
              شوید. از مدیریت کارهای روزانه تا دسترسی به اطلاعات دقیق، دستیار
              صوتی آریو هوشمند ترین همراه شماست.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <TextInput
                placeholder=" ایمیل خود را وارد کنید"
                label="بروز باشید"
                inputClassName="w-full sm:w-[205px]"
                className="w-full sm:w-[205px]"
              />
              <Button size="lg" className="w-full sm:w-auto">
                دریافت پروفایل ها
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-[670px] flex flex-row justify-between gap-8 sm:gap-4">
            <div className="gap-4 flex flex-col sm:pr-8 lg:pr-16">
              <p className="text-md-bold">شرکت های همکار</p>
              <p className="text-md-demibold text-textSecondary">
                پایاسازه پاسارگاد
              </p>
              <p className="text-md-demibold text-textSecondary">
                معمار اندیشه پایامهر
              </p>
            </div>
            <div className="gap-4 flex flex-col">
              <p className="text-md-bold">دسترسی ها</p>
              <NavLink href="/product">دستیاران صوتی</NavLink>
              <NavLink href="/speaker">اسپیکرهای هوشمند</NavLink>
              <NavLink href="/guide#faq">سوالات متداول</NavLink>
              <NavLink href="/about-us">درباره ما</NavLink>
              <NavLink href="/guide">راهنما</NavLink>
            </div>
          </div>
        </div>
        <div className="mt-16 md:mt-12 md:pt-8">
          <div className="h-px w-full bg-gradient-to-r from-black via-purple-400 to-black mb-8" />
          <div className="flex flex-col-reverse md:flex-row-reverse justify-between items-start md:items-center gap-8 md:gap-0">
            <div className="w-full md:w-auto flex flex-row-reverse justify-center md:justify-start items-center gap-4 md:gap-3">
              <IconLink href="#" label="Twitter">
                <X24Icon />
              </IconLink>
              <IconLink href="#" label="Instagram">
                <Insta24Icon />
              </IconLink>
              <IconLink href="#" label="LinkedIn">
                <Linek24Icon />
              </IconLink>
              <IconLink href="#" label="Telegram">
                <Tel24Icon />
              </IconLink>
            </div>
            <p className="text-md-regular text-base-white text-center md:text-left w-full md:w-auto">
              محصول فروشگاه اینترنتی دستیار صوتی - کلیه حقوق محفوظ است.
            </p>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Footer;
