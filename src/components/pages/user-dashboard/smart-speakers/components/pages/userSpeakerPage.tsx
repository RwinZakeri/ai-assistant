"use client";

import type { GetUserSpeakersDashboardOutput } from "@/apis/models/GetUserSpeakersDashboardOutput";
import type { ResponseSpeed } from "@/apis/models/ResponseSpeed";
import { UserDashboardService } from "@/apis/services/UserDashboardService";
import { SmartSpeakerDashboardCard } from "@/components/ui/cards/smart-speakers/dashboard-card";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import ReactQuery from "@/configs/react_query_keys";
import getFileUrl from "@/utils/getFileUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import DeleteSpeakerModal from "../DeleteSpeakerModal";

const SpeakerCardSkeleton = () => (
  <div className=" min-h-[514px] rounded-2xl flex flex-col overflow-hidden">
    <Skeleton className="w-full aspect-[4/3] rounded-t-2xl" />
    <div className="flex flex-col gap-5 mt-[23px] mx-6 flex-1 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>
        <Skeleton className="h-6 w-6 rounded-md shrink-0" />
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-[46px] w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

const UserSpeakerPage = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<number | null>(
    null
  );

  const {
    data: speakersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQuery.userSpeakersDashboard],
    queryFn: async () => {
      return UserDashboardService.apiServicesAppUserdashboardGetuserspeakersdashboardPost(
        {
          maxResultCount: 100,
          skipCount: 0,
          sorting: "",
        }
      );
    },
    placeholderData: (previousData) => previousData,
  });

  const speakers: GetUserSpeakersDashboardOutput[] = Array.isArray(speakersData)
    ? speakersData
    : [];

  const { data: activeAssistants = [] } = useQuery({
    queryKey: [ReactQuery.userActiveAssistantsLightweight],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetalluserassistantslightweightGet(),
  });

  const deleteSpeakerMutation = useMutation({
    mutationFn: (speakerId: number) =>
      UserDashboardService.apiServicesAppUserdashboardDeletespeakerforuserDelete(
        speakerId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.userSpeakersDashboard],
      });
      setSelectedSpeakerId(null);
      setDialogOpen(false);
      toast.success("اسپیکر با موفقیت حذف شد");
    },
  });

  const updateResponseSpeedMutation = useMutation({
    mutationFn: ({
      speakerId,
      speed,
    }: {
      speakerId: number;
      speed: ResponseSpeed;
    }) =>
      UserDashboardService.apiServicesAppUserdashboardUpdatespeakerresponsespeedPut(
        speakerId,
        speed
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.userSpeakersDashboard],
      });
    },
  });

  const attachAssistantMutation = useMutation({
    mutationFn: ({
      speakerId,
      assistantId,
    }: {
      speakerId: number;
      assistantId: number;
    }) =>
      UserDashboardService.apiServicesAppUserdashboardAttachassistanttospeakerPost(
        assistantId,
        speakerId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.userSpeakersDashboard],
      });
    },
  });

  const detachAssistantMutation = useMutation({
    mutationFn: ({
      speakerId,
      assistantId,
    }: {
      speakerId: number;
      assistantId: number;
    }) =>
      UserDashboardService.apiServicesAppUserdashboardDetachassistantfromspeakerDelete(
        assistantId,
        speakerId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.userSpeakersDashboard],
      });
    },
  });

  const handleResponseSpeedChange = (id: number, speed: ResponseSpeed) => {
    updateResponseSpeedMutation.mutate({ speakerId: id, speed });
  };

  const handleAttachAssistant = (speakerId: number, assistantId: number) => {
    attachAssistantMutation.mutate({ speakerId, assistantId });
  };

  const handleDetachAssistant = (speakerId: number, assistantId: number) => {
    detachAssistantMutation.mutate({ speakerId, assistantId });
  };

  const handleDeleteRequest = (id: number) => {
    setSelectedSpeakerId(id);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSpeakerId !== null) {
      deleteSpeakerMutation.mutate(selectedSpeakerId);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSpeakerId(null);
  };

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <SpeakerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-xl-regular text-error-400">
          خطا در بارگذاری اسپیکرها. لطفاً دوباره تلاش کنید.
        </p>
      </div>
    );
  }

  if (speakers.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-xl-regular text-textSecondary">اسپیکری یافت نشد</p>
      </div>
    );
  }

  return (
    <>
      <div
        dir="rtl"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {speakers.map((speaker: GetUserSpeakersDashboardOutput) => (
          <SmartSpeakerDashboardCard
            key={speaker.id}
            id={speaker.id ?? 0}
            title={speaker.title ?? ""}
            thumbnail={
              getFileUrl(speaker.thumbnail) ?? "/images/speakerimage.png"
            }
            responseSpeed={speaker.responseSpeed}
            activeAssistants={activeAssistants}
            attachedAssistants={speaker.activeAssistants ?? []}
            onDelete={handleDeleteRequest}
            onResponseSpeedChange={handleResponseSpeedChange}
            onAttachAssistant={handleAttachAssistant}
            onDetachAssistant={handleDetachAssistant}
          />
        ))}
      </div>

      <DeleteSpeakerModal
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteSpeakerMutation.isPending}
      />
    </>
  );
};

export default UserSpeakerPage;
