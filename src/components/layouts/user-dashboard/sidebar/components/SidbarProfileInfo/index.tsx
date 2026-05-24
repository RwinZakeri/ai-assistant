"use client";

import { UserDashboardService } from "@/apis";
import { LogOut01Icon } from "@/assets/images/svg/LogOut01";
import { useProfilePictureUrl } from "@/components/pages/user-dashboard/account/components/ProfilePictureUrlResolver";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactQuery from "@/configs/react_query_keys";
import { clearDashboardSubscription } from "@/store/dashboardSubscriptionSlice";
import { useAppDispatch, useAppSelector } from "@/store/index";
import {
  clearUserProfile,
  setProfilePicture,
  setUserProfile,
} from "@/store/userProfileSlice";
import { removeRefreshToken, removeToken } from "@/utils/cookies";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutModal from "../LogoutModal";

const SidbarProfileInfo = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { data: profileData, profilePicture } = useAppSelector(
    (state) => state.userProfile
  );
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: [ReactQuery.userProfileDetail],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetcurrentuserprofiledetailGet(),
  });

  const { data: pictureResponse, isLoading: isLoadingPicture } = useQuery({
    queryKey: [ReactQuery.userProfilePicture],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetcurrentappuserprofilepictureGet(),
  });

  useEffect(() => {
    if (profileResponse) {
      dispatch(setUserProfile(profileResponse));
    }
  }, [dispatch, profileResponse]);

  useEffect(() => {
    if (pictureResponse) {
      dispatch(setProfilePicture(pictureResponse));
    }
  }, [dispatch, pictureResponse]);

  const profilePictureUrl = useProfilePictureUrl(profilePicture || undefined);
  const loading = isLoadingProfile || isLoadingPicture;

  const handleLogout = () => {
    queryClient.clear();
    dispatch(clearUserProfile());
    dispatch(clearDashboardSubscription());
    removeToken();
    removeRefreshToken();
    router.push("/auth");
  };

  if (loading || !profileData) {
    return (
      <div className="w-full pt-6 border-t border-gray-800 flex justify-between items-center">
        <div className="w-full flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full pt-6 border-t border-gray-800 flex justify-between items-center">
        <div className="w-full flex gap-3 cursor-pointer">
          <Image
            src={profilePictureUrl}
            alt="Profile information"
            className="h-10 w-10 rounded-full object-cover"
            width={40}
            height={40}
            onClick={() => router.push("/dashboard/account")}
            unoptimized={
              typeof profilePictureUrl === "string" &&
              profilePictureUrl.startsWith("data:")
            }
          />
          <div className="w-full flex flex-col">
            <div className="relative flex justify-between items-center w-full">
              <p
                className="text-md font-semibold text-base-white"
                onClick={() => router.push("/dashboard/account")}
              >
                {profileData?.name && profileData?.lastName
                  ? `${profileData.name} ${profileData.lastName}`
                  : profileData?.name || profileData?.lastName || "کاربر جدید"}
              </p>
              <div className="absolute left-0">
                <Button
                  variant="linkColor"
                  size="icon"
                  onClick={() => setIsLogoutModalOpen(true)}
                >
                  <LogOut01Icon className="w-5 h-5 text-textSecondary" />
                </Button>
              </div>
            </div>
            <p
              className="text-sm font-medium text-textSecondary"
              onClick={() => router.push("/dashboard/account")}
            >
              {profileData?.phoneNumber || ""}
            </p>
          </div>
        </div>
      </div>

      <LogoutModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default SidbarProfileInfo;
