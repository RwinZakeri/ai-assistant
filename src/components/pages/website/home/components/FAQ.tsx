import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionsHeader from "@/components/ui/headers/SectionsHeader";

const FAQ = () => {
  return (
    <ContentWrapper>
      <div className="flex flex-col gap-16">
        <SectionsHeader
          title="سوالات متداول"
          description="پاسخ به پرسش‌های رایج درباره امکانات و نحوه استفاده از دستیار صوتی"
        />
      </div>
      <div className="max-w-[1088px] mx-auto ">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-right">
              {" "}
              دستیار صوتی آریو چیست؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              دستیار صوتی آریو یک پلتفرم هوشمند است که به شما کمک می‌کند تا در
              زمینه‌های مختلف مانند آموزش، سرگرمی و خدمات روزمره با استفاده از
              دستورات صوتی پاسخ‌های دقیق و تخصصی دریافت کنید.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-right">
              {" "}
              آیا دستیار صوتی آریو به زبان فارسی صحبت می‌کند؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              دستیار صوتی آریو یک پلتفرم هوشمند است که به شما کمک می‌کند تا در
              زمینه‌های مختلف مانند آموزش، سرگرمی و خدمات روزمره با استفاده از
              دستورات صوتی پاسخ‌های دقیق و تخصصی دریافت کنید.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-right">
              آیا برای بهره مندی از خدمات دستیاران صوتی حتما باید از اسپیکرهای
              هوشمند آریو استفاده کرد؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              دستیار صوتی آریو یک پلتفرم هوشمند است که به شما کمک می‌کند تا در
              زمینه‌های مختلف مانند آموزش، سرگرمی و خدمات روزمره با استفاده از
              دستورات صوتی پاسخ‌های دقیق و تخصصی دریافت کنید.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-right">
              چگونه می‌توانم اسپیکر هوشمند را به اکانت آریو خودم متصل کنم؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              دستیار صوتی آریو یک پلتفرم هوشمند است که به شما کمک می‌کند تا در
              زمینه‌های مختلف مانند آموزش، سرگرمی و خدمات روزمره با استفاده از
              دستورات صوتی پاسخ‌های دقیق و تخصصی دریافت کنید.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-right">
              آیا دستیار صوتی آریو به اینترنت نیاز دارد؟{" "}
            </AccordionTrigger>
            <AccordionContent className="text-right">
              دستیار صوتی آریو یک پلتفرم هوشمند است که به شما کمک می‌کند تا در
              زمینه‌های مختلف مانند آموزش، سرگرمی و خدمات روزمره با استفاده از
              دستورات صوتی پاسخ‌های دقیق و تخصصی دریافت کنید.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-right">
              آیا می‌توانم از آریو برای یادگیری کودکان استفاده کنم؟{" "}
            </AccordionTrigger>
            <AccordionContent className="text-right">
              دستیار صوتی آریو یک پلتفرم هوشمند است که به شما کمک می‌کند تا در
              زمینه‌های مختلف مانند آموزش، سرگرمی و خدمات روزمره با استفاده از
              دستورات صوتی پاسخ‌های دقیق و تخصصی دریافت کنید.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-right">
              {" "}
              آیا دستیار صوتی آریو به سرویس‌های بومی متصل می‌شود؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              دستیار صوتی آریو یک پلتفرم هوشمند است که به شما کمک می‌کند تا در
              زمینه‌های مختلف مانند آموزش، سرگرمی و خدمات روزمره با استفاده از
              دستورات صوتی پاسخ‌های دقیق و تخصصی دریافت کنید.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger className="text-right">
              {" "}
              اطلاعات شخصی من چطور محافظت می‌شود؟{" "}
            </AccordionTrigger>
            <AccordionContent className="text-right">
              دستیار صوتی آریو یک پلتفرم هوشمند است که به شما کمک می‌کند تا در
              زمینه‌های مختلف مانند آموزش، سرگرمی و خدمات روزمره با استفاده از
              دستورات صوتی پاسخ‌های دقیق و تخصصی دریافت کنید.{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-10">
            <AccordionTrigger className="text-right">
              آیا دستیار صوتی آریو چند زبانه است؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              دستیار صوتی آریو یک پلتفرم هوشمند است که به شما کمک می‌کند تا در
              زمینه‌های مختلف مانند آموزش، سرگرمی و خدمات روزمره با استفاده از
              دستورات صوتی پاسخ‌های دقیق و تخصصی دریافت کنید.{" "}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ContentWrapper>
  );
};

export default FAQ;
