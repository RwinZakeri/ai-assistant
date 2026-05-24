

import { Skeleton } from "@/components/ui/skeleton";


const UserProfileFormFieldsSkeleton = () => {
  return (
    <section className="flex justify-center w-full">
      <div className="flex flex-col items-center gap-5 w-full justify-center">
        <div className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5 w-full">
          <div className="w-[512px] flex flex-col gap-4">
            <div className="flex flex-row gap-7">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center border-b border-gray-800 pb-5 w-full">
          <div className="w-[512px] flex flex-col gap-4">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <div className="flex justify-center items-center border-b border-gray-800 pb-5 w-full">
          <div className="w-[512px] flex flex-col gap-4">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center pb-5 gap-7 w-full">
          <div className="w-[512px] flex flex-col gap-4">
            <Skeleton className="w-full h-[288px] rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center border-b border-gray-800 pb-5 w-full">
          <div className="w-full flex flex-col justify-center items-center relative gap-7">
            <div className="w-[512px] flex flex-col gap-4">
              <div className="flex flex-row gap-7">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center border-b border-gray-800 pb-5 gap-5 w-full">
          <div className="w-[512px] flex flex-col gap-4">
            <Skeleton className="h-[46px] w-full rounded-xl" />
          </div>
        </div>

        <div className="flex flex-col justify-end w-full xl:w-auto mt-6">
          <Skeleton className="h-12 w-full xl:w-[180px] rounded-xl" />
        </div>
      </div>
    </section>
  );
};

export default UserProfileFormFieldsSkeleton;
