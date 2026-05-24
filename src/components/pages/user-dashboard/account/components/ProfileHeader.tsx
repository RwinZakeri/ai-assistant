"use client";

import { Button } from "@/components/ui/button";
import { DashboardLockIcon } from "@/assets/images/svg/DashboardLock";
import ProfilePictureUpload from "./ProfilePictureUpload";
import type { GetCurrentAppUserProfilePictureOutput } from "@/apis/models/GetCurrentAppUserProfilePictureOutput";

interface ProfileHeaderProps {
  fullName: string;
  profilePictureData: GetCurrentAppUserProfilePictureOutput | undefined;
  onChangePasswordClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  profilePictureData,
  onChangePasswordClick,
}) => {
  return (
    <section className="w-full rounded-3xl">
      <div
        className="w-full h-[251px] rounded-2xl relative flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/profiledashboardbanner.png')",
        }}
      >
        <ProfilePictureUpload profilePictureData={profilePictureData} />
      </div>
      <div className="mt-6 flex w-full items-center justify-between rounded-2xl bg-[#050505] px-6 py-4 text-right">
        <span className="text-lg-demibold pr-36 text-gray-100">
          {fullName || "کاربر"}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="flex-row-reverse gap-2 px-5 cursor-pointer"
          onClick={onChangePasswordClick}
        >
          تغییر رمز عبور
          <DashboardLockIcon />
        </Button>
      </div>
    </section>
  );
};

export default ProfileHeader;

