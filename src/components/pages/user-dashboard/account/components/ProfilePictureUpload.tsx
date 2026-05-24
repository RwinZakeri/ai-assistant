"use client";

import { useState, useRef } from "react";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserDashboardService } from "@/apis";
import ReactQuery from "@/configs/react_query_keys";
import { useProfilePictureUrl } from "./ProfilePictureUrlResolver";
import type { GetCurrentAppUserProfilePictureOutput } from "@/apis/models/GetCurrentAppUserProfilePictureOutput";
import { useAppDispatch } from "@/store/index";
import { setProfilePicture } from "@/store/userProfileSlice";

interface ProfilePictureUploadProps {
  profilePictureData: GetCurrentAppUserProfilePictureOutput | undefined;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePictureData,
}) => {
  const dispatch = useAppDispatch();
  const [isHoveringProfilePicture, setIsHoveringProfilePicture] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const profilePictureUrl = useProfilePictureUrl(profilePictureData);

  const uploadProfilePictureMutation = useMutation({
    mutationFn: (file: File) => {
      return UserDashboardService.apiServicesAppUserdashboardUploadandapplyprofilepicturePost(
        {
          file: file,
        }
      );
    },
    onSuccess: async () => {
      try {
        const pictureResponse =
          await UserDashboardService.apiServicesAppUserdashboardGetcurrentappuserprofilepictureGet();
        dispatch(setProfilePicture(pictureResponse));
      } catch (error) {
        console.error("Failed to fetch updated profile picture:", error);
      }
      queryClient.invalidateQueries({ queryKey: [ReactQuery.userProfilePicture] });
      toast.success("عکس پروفایل با موفقیت آپلود شد.");
    },
    onError: () => {
      toast.error("خطا در آپلود عکس پروفایل. لطفاً دوباره تلاش کنید.");
    },
  });

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("لطفاً یک فایل تصویری انتخاب کنید.");
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد.");
        return;
      }
      uploadProfilePictureMutation.mutate(file);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className="absolute -bottom-12 right-6 size-30 rounded-full bg-gray-600 overflow-hidden"
      onMouseEnter={() => setIsHoveringProfilePicture(true)}
      onMouseLeave={() => setIsHoveringProfilePicture(false)}
    >
      <Image
        src={profilePictureUrl}
        alt="Profile picture"
        width={120}
        height={120}
        className="h-full w-full object-cover"
        unoptimized={
          typeof profilePictureUrl === "string" &&
          profilePictureUrl.startsWith("data:")
        }
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="flex-1"></div>
        <div className="flex-1"></div>
        <div
          className="flex-1 relative cursor-pointer pointer-events-auto"
          onClick={handleProfilePictureClick}
        >
          {isHoveringProfilePicture && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200">
              <CameraIcon className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;

