"use client";

import type { AddCommentInput } from "@/apis/models/AddCommentInput";
import { CommentsService } from "@/apis/services/CommentsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "../../../button";
import StarRating from "../../../star-rating";
import CommentModal from "./CommentModal";

interface CommentSubmissionCardProps {
  averageRating: number;
  totalReviews: number;
  onSubmitComment?: () => void;
  assistantName?: string;
  speakerId?: number;
  assistantId?: number;
}

const CommentSubmissionCard: React.FC<CommentSubmissionCardProps> = ({
  averageRating,
  totalReviews,
  onSubmitComment,
  assistantName = "دستیار پزشکی",
  speakerId,
  assistantId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: async (data: { comment: string; rating: number }) => {
      const requestBody: AddCommentInput = {
        content: data.comment,
        stars: data.rating,
      };

      if (speakerId !== undefined && speakerId !== null) {
        requestBody.speakerId = speakerId;
      }

      if (assistantId !== undefined && assistantId !== null) {
        requestBody.assistantId = assistantId;
      }

      return await CommentsService.apiServicesAppCommentsAddcommentPost(
        requestBody
      );
    },
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: [
          "comments",
          speakerId ? `speaker-${speakerId}` : null,
          assistantId ? `assistant-${assistantId}` : null,
        ].filter(Boolean),
      });
      onSubmitComment?.();
    },
    onError: (error) => {
      console.error("Error submitting comment:", error);
    },
  });

  const handleSubmitComment = (comment: string, rating: number) => {
    addCommentMutation.mutate({ comment, rating });
  };

  return (
    <>
      <div className="bg-surfaceSecondary rounded-2xl p-6 w-full md:w-full ">
        <div className="flex flex-col  justify-between mb-6">
          <div className="flex flex-row items-end gap-2">
            <span className="text-gray-25 title-md-bold">{averageRating}</span>
            <span className="text-textSecondary text-md-medium">از ۵</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 ">
              <StarRating rating={averageRating} interactive={false} />
              <span className="text-textSecondary text-md-medium">
                ({totalReviews})
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-25 text-md-medium">
            شما هم درباره این کالا دیدگاه ثبت کنید
          </p>
        </div>

        <div className="flex w-full justify-center">
          <Button
            variant="secondary"
            size="xl"
            onClick={() => setIsModalOpen(true)}
            className="w-full max-w-md cursor-pointer text-textTertiary"
          >
            ثبت دیدگاه
          </Button>
        </div>
      </div>

      <CommentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        assistantName={assistantName}
        onSubmit={handleSubmitComment}
        isLoading={addCommentMutation.isPending}
      />
    </>
  );
};

export default CommentSubmissionCard;
