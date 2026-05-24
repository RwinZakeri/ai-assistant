"use client";

import { UserDashboardService } from "@/apis";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/progress";
import {
  setDashboardSubscription,
  setError,
  setLoading,
} from "@/store/dashboardSubscriptionSlice";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { XIcon } from "lucide-react";
import { useEffect } from "react";

const SubscriptionUsageAlert = () => {
  const dispatch = useAppDispatch();
  const { data: dashboardSubscription } = useAppSelector(
    (state) => state.dashboardSubscription
  );

  useEffect(() => {
    const fetchDashboardSubscription = async () => {
      dispatch(setLoading(true));
      try {
        const response =
          await UserDashboardService.apiServicesAppUserdashboardGetdashboardsubscriptionGet();
        dispatch(setDashboardSubscription(response));
      } catch (error) {
        dispatch(
          setError(error instanceof Error ? error.message : "An error occurred")
        );
      }
    };

    fetchDashboardSubscription();
  }, [dispatch]);

  return (
    <div className="px-4 py-5 rounded-xl relative bg-surfacePrimary">
      <div className="flex gap-4 justify-between flex-col">
        <div className="w-[70px] h-[70px]">
          <CircularProgress
            indicatorClassName="text-white"
            value={dashboardSubscription?.usedSubPercentage ?? 0}
            strokeWidth={7}
            size={70}
            color="#fff"
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-base-white">
            اشتراک مصرف شده
          </p>
          <p className="text-textSecondary text-sm">
            تیم شما از {dashboardSubscription?.usedSubPercentage ?? 0} درصد فضای
            موجود شما استفاده کرده است. نیاز بیشتری دارید ؟
          </p>
        </div>
        <div className="flex gap-3">
          <Button size={"sm"} variant={"link"} className="p-0">
            لغو
          </Button>
          <Button size={"sm"} variant={"link"} className="text-primary-300 p-0">
            ارتقاء طرح
          </Button>
        </div>
      </div>

      <Button variant="link" className="absolute top-1 left-1" size="icon">
        <XIcon className="size-5" />
      </Button>
    </div>
  );
};

export default SubscriptionUsageAlert;
