

import { Skeleton } from "@/components/ui/skeleton";
import FormFieldGroup from "../../../account/components/FormFieldGroup";

const SpeakerDetailsSkeleton = () => {
  return (
    <section className="flex justify-center w-full">
      <div className="flex flex-col items-center gap-5 w-full justify-center">
        <FormFieldGroup
          label="نام اسپیکر"
          className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
        >
          <div className="w-[512px]">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </FormFieldGroup>

        <FormFieldGroup
          label="مدل دستگاه"
          className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
        >
          <div className="w-[512px]">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </FormFieldGroup>

        <FormFieldGroup
          label="سرعت پاسخ‌گویی"
          className="flex flex-col justify-center items-center border-b border-gray-800 pb-5 gap-5"
        >
          <div className="w-[512px]">
            <Skeleton className="h-[46px] w-full rounded-xl" />
          </div>
        </FormFieldGroup>

        <FormFieldGroup
          label="دستیارهای فعال"
          className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
        >
          <div className="w-[512px]">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </FormFieldGroup>
      </div>
    </section>
  );
};

export default SpeakerDetailsSkeleton;
