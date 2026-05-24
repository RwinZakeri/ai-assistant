"use client";

import { UserDashboardService } from "@/apis";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactQuery from "@/configs/react_query_keys";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { setProfilePicture, setUserProfile } from "@/store/userProfileSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import HeaderDashboard from "../components/HeaderDashboard";
import AccountFormFields from "./components/AccountFormFields";
import ChangePasswordModal from "./components/ChangePasswordModal";
import ProfileHeader from "./components/ProfileHeader";
import { accountDetailsSchema, type AccountDetailsFormValues } from "./schemas";

const DEFAULT_FORM_STATE: AccountDetailsFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  addressLine: "",
  plaque: "",
  unit: "",
  postalCode: "",
};

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const { data: profileData, profilePicture } = useAppSelector(
    (state) => state.userProfile
  );

  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountDetailsFormValues>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: DEFAULT_FORM_STATE,
  });

  const queryClient = useQueryClient();

  const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: [ReactQuery.userProfileDetail],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetcurrentuserprofiledetailGet(),
  });

  const { data: pictureResponse, isLoading: isLoadingPicture } = useQuery({
    queryKey: [ReactQuery.userProfilePicture],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetcurrentappuserprofilepictureGet(),
    enabled: !!profileResponse,
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

  const loading = isLoadingProfile;

  const updateProfileMutation = useMutation({
    mutationFn: (data: AccountDetailsFormValues) => {
      const updateData = {
        name: data.firstName || null,
        lastName: data.lastName || null,
        emailAddress: data.email || null,
        fullAddress: data.addressLine || null,
        no: data.plaque || null,
        unit: data.unit ? parseInt(data.unit, 10) : null,
        postalCode: data.postalCode || null,
        latitude: lat,
        longitude: lng,
      };
      return UserDashboardService.apiServicesAppUserdashboardUpdatecurrentuserprofilePost(
        updateData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.userProfileDetail],
      });
      setShowSavedFeedback(true);
      toast.success("تغییرات با موفقیت ذخیره شد.");
    },
    onError: () => {
      toast.error("خطا در ذخیره تغییرات. لطفاً دوباره تلاش کنید.");
    },
  });

  useEffect(() => {
    if (profileData) {
      const formValues: AccountDetailsFormValues = {
        firstName: profileData.name || "",
        lastName: profileData.lastName || "",
        phone: profileData.phoneNumber || "",
        email: profileData.emailAddress || "",
        addressLine: profileData.fullAddress || "",
        plaque: profileData.no || "",
        unit: profileData.unit?.toString() || "",
        postalCode: profileData.postalCode || "",
      };
      reset(formValues);
      setLat(profileData.latitude ?? null);
      setLng(profileData.longitude ?? null);
    }
  }, [profileData, reset]);

  const watchedFirstName = watch("firstName");
  const watchedLastName = watch("lastName");

  const fullName = useMemo(() => {
    const firstName = watchedFirstName.trim();
    const lastName = watchedLastName.trim();

    if (!firstName && !lastName) {
      return "کاربر جدید";
    }

    return `${firstName} ${lastName}`.trim();
  }, [watchedFirstName, watchedLastName]);

  const registerField = <T extends keyof AccountDetailsFormValues>(
    fieldName: T
  ) =>
    register(fieldName, {
      onChange: () => setShowSavedFeedback(false),
    });

  const onSubmit = (data: AccountDetailsFormValues) => {
    updateProfileMutation.mutate(data);
  };

  if (loading || !profileData) {
    return (
      <HeaderDashboard label="پروفایل">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-12 w-[180px]" />
          </div>
        </div>
      </HeaderDashboard>
    );
  }

  return (
    <HeaderDashboard label="پروفایل">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col xl:flex-row gap-6"
      >
        <div className="flex-1 flex flex-col gap-6">
          <ProfileHeader
            fullName={fullName}
            profilePictureData={profilePicture || undefined}
            onChangePasswordClick={() => setIsChangePasswordModalOpen(true)}
          />

          <AccountFormFields
            errors={errors}
            registerField={registerField}
            onLocationChange={(lat, lng) => {
              setLat(lat);
              setLng(lng);
            }}
            initialLat={lat}
            initialLng={lng}
          />

          <div className="flex flex-col justify-end w-full xl:w-auto">
            {showSavedFeedback && (
              <p className="text-sm text-green-400 text-right mb-3">
                تغییرات با موفقیت ذخیره شد.
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full xl:w-[180px] cursor-pointer"
              disabled={isSubmitting || updateProfileMutation.isPending}
            >
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </form>
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onOpenChange={setIsChangePasswordModalOpen}
      />
    </HeaderDashboard>
  );
};

export default AccountPage;
