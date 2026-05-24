"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
import { ArrowLeftAuthIcon } from "@/assets/images/svg/ArrowLeftAuth";
import { RedTrash01Icon } from "@/assets/images/svg/RedTrash01";

import { useRouter } from "next/navigation";
import { AdminDashboardService } from "@/apis";
import ReactQuery from "@/configs/react_query_keys";
import DeleteSpeakerModal from "./DeleteSpeakerModal";
import TruncatedTextWithTooltip from "./TruncatedTextWithTooltip";
import type { Speaker } from "./types";
import { parseUserIdWithFallback } from "../utils";
import SpeakersTableSkeleton from "./skeletons/SpeakersTableSkeleton";
import { useUserProfile } from "./UserProfileContext";

const SpeakersTable = () => {
  const { userId } = useUserProfile();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string | null>(
    null
  );

  const userIdNumber = parseUserIdWithFallback(userId);

  const { data: speakersData, isLoading } = useQuery({
    queryKey: [ReactQuery.userSpeakers, userId],
    queryFn: () => {
      return AdminDashboardService.apiServicesAppAdmindashboardGetallspeakersforselecteduserGet(
        userIdNumber
      );
    },
    enabled: !!userIdNumber && !isNaN(userIdNumber),
  });

  const speakers: Speaker[] =
    speakersData?.map((speaker) => ({
      id: speaker.id?.toString() || "",
      name: speaker.title || "",
      deviceModel: speaker.deviceModel || "",
      connectedAccount: speaker.connectedAssistant || "",
    })) || [];

  const deleteSpeakerMutation = useMutation({
    mutationFn: ({
      userId,
      speakerId,
    }: {
      userId: number;
      speakerId: number;
    }) =>
      AdminDashboardService.apiServicesAppAdmindashboardDeleteuserspeakerDelete(
        userId,
        speakerId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.userSpeakers, userId],
      });
      setDeleteModalOpen(false);
      setSelectedSpeakerId(null);
    },
  });

  const handleViewDetails = (speakerId: string) => {
    router.push(`/dashboard/users/${userId}/speakers/${speakerId}`);
  };

  const handleDeleteClick = (speakerId: string) => {
    setSelectedSpeakerId(speakerId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedSpeakerId || isNaN(userIdNumber)) return;

    deleteSpeakerMutation.mutate({
      userId: userIdNumber,
      speakerId: parseInt(selectedSpeakerId, 10),
    });
  };

  return (
    <>
      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-none">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[56px]">#</TableHead>
                <TableHead className="w-1/4">نام</TableHead>
                <TableHead className="w-1/4">مدل دستگاه</TableHead>
                <TableHead className="w-1/4">اکانت متصل</TableHead>
                <TableHead className="w-1/4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <SpeakersTableSkeleton rows={5} />
              ) : speakers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-textSecondary"
                  >
                    هیچ اسپیکری یافت نشد.
                  </TableCell>
                </TableRow>
              ) : (
                speakers.map((speaker, index) => (
                  <TableRow key={speaker.id}>
                    <TableCell className="text-textSecondary w-[56px] px-3 py-2 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-gray-25 px-3 py-2 w-1/4">
                      <TruncatedTextWithTooltip text={speaker.name} />
                    </TableCell>
                    <TableCell className="text-textSecondary px-3 py-2 w-1/4">
                      <TruncatedTextWithTooltip text={speaker.deviceModel} />
                    </TableCell>
                    <TableCell className="text-gray-25 px-3 py-2 w-1/4">
                      <TruncatedTextWithTooltip
                        text={speaker.connectedAccount}
                      />
                    </TableCell>
                    <TableCell className="text-center flex items-center gap-12 px-3 py-2 w-1/4">
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(speaker.id)}
                        className="text-error-500 hover:text-error-400 cursor-pointer p-1 transition-colors"
                        aria-label={`حذف ${speaker.name}`}
                      >
                        <RedTrash01Icon className="size-5" />
                      </button>
                      <Button
                        variant="linkColor"
                        size="sm"
                        className="text-primary-300 hover:text-primary-200 cursor-pointer flex items-center gap-2 justify-center"
                        type="button"
                        onClick={() => handleViewDetails(speaker.id)}
                        aria-label={`مشاهده جزئیات ${speaker.name}`}
                      >
                        مشاهده جزئیات
                        <ArrowLeftAuthIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeleteSpeakerModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteSpeakerMutation.status === "pending"}
      />
    </>
  );
};

export default SpeakersTable;
