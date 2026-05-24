'use client';

import { Skeleton } from '@/components/ui/skeleton';
import FormFieldGroup from '@/components/pages/user-dashboard/account/components/FormFieldGroup';

const DeliveryTimeFormSkeleton = () => {
  return (
    <form className="flex flex-col gap-6">
      <section className="flex justify-center w-full">
        <div className="flex flex-col items-center gap-5 w-full justify-center mt-6">
          <FormFieldGroup
            className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
            label="روز"
          >
            <Skeleton className="w-[512px] h-10 rounded-md" />
          </FormFieldGroup>

          <FormFieldGroup
            className="gap-7 flex justify-center items-start border-b border-gray-800 pb-5"
            label="بازه زمانی"
          >
            <div className="w-[512px] flex flex-col">
              <div className="flex flex-row gap-7 items-start">
                <div className="flex-1">
                  <Skeleton className="w-full h-10 rounded-md" />
                </div>
                <Skeleton className="h-4 w-8 mt-2.5" />
                <div className="flex-1">
                  <Skeleton className="w-full h-10 rounded-md" />
                </div>
              </div>
            </div>
          </FormFieldGroup>

          <FormFieldGroup
            className="flex justify-center items-start border-b border-gray-800 pb-5"
            label="مبلغ (تومان)"
          >
            <div className="w-[512px] flex flex-col">
              <Skeleton className="w-full h-10 rounded-md" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </FormFieldGroup>

          <div className="flex justify-start w-full">
            <Skeleton className="h-11 w-40 rounded-md" />
          </div>
        </div>
      </section>
    </form>
  );
};

export default DeliveryTimeFormSkeleton;
