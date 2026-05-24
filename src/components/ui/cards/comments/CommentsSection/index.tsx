"use client";

import type { GetAppCommentOutput } from "@/apis/models/GetAppCommentOutput";
import { CommentsService } from "@/apis/services/CommentsService";
import { PlusIcon } from "@/assets/images/svg/Plus";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CommentsCard from "../comment";
import CommentSubmissionCard from "../comment-submission";
import type { CommentsSectionProps } from "./type";

const CommentsSection = ({
  speakerId,
  assistantId,
  averageRating,
  totalReviews,
  assistantName = "دستیار پزشکی",
  pageSize = 4,
  initialDisplayCount = 4,
  defaultOpen = false,
  title = "دیدگاه‌ها",
  className,
  gridClassName,
  commentsListClassName,
  onCommentSubmitted,
  onCommentsLoaded,
}: CommentsSectionProps) => {
  const [showComments, setShowComments] = useState(defaultOpen);
  const [loadedComments, setLoadedComments] = useState<GetAppCommentOutput[]>(
    []
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const queryKey = [
    "comments",
    speakerId ? `speaker-${speakerId}` : null,
    assistantId ? `assistant-${assistantId}` : null,
  ].filter(Boolean);

  const {
    data: initialComments,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const result =
        await CommentsService.apiServicesAppCommentsGetproductcommentsbyidPost({
          maxResultCount: initialDisplayCount,
          skipCount: 0,
          ...(speakerId && { speakerId }),
          ...(assistantId && { assistantId }),
        });
      setLoadedComments(result);
      setHasMore(result.length === initialDisplayCount);
      onCommentsLoaded?.(result);
      return result;
    },
    enabled: showComments && !!(speakerId || assistantId),
  });

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const result =
        await CommentsService.apiServicesAppCommentsGetproductcommentsbyidPost({
          maxResultCount: pageSize,
          skipCount: loadedComments.length,
          ...(speakerId && { speakerId }),
          ...(assistantId && { assistantId }),
        });
      setLoadedComments((prev) => [...prev, ...result]);
      setHasMore(result.length === pageSize);
    } catch (err) {
      console.error("Error loading more comments:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments((prev) => {
      if (prev) {
        setLoadedComments(initialComments || []);
        setHasMore(initialComments?.length === initialDisplayCount);
      }
      return !prev;
    });
  };

  return (
    <div
      className={cn(
        "py-12 h-full flex flex-col border-t border-b border-linePrimary",
        className
      )}
    >
      <div className="flex justify-between w-full h-full">
        <p className="title-md-demibold text-gray-25">{title}</p>
        <PlusIcon
          className={cn(
            "transition-transform duration-300 cursor-pointer",
            showComments && "rotate-45"
          )}
          onClick={handleToggleComments}
        />
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          showComments ? "max-h-full opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-12 mt-8 w-full",
            gridClassName
          )}
        >
          <div className="col-span-1 w-full">
            <CommentSubmissionCard
              averageRating={averageRating}
              totalReviews={totalReviews}
              speakerId={speakerId}
              assistantId={assistantId}
              assistantName={assistantName}
              onSubmitComment={onCommentSubmitted}
            />
          </div>

          <div
            className={cn(
              "col-span-2 flex flex-col gap-5",
              commentsListClassName
            )}
          >
            {isLoading ? (
              <div className="flex flex-col gap-5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-surfaceSecondary rounded-2xl p-7 flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-32 rounded-md" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-xl-regular text-error-400">
                خطا در بارگذاری دیدگاه‌ها
              </p>
            ) : loadedComments.length > 0 ? (
              <>
                {loadedComments.map((comment, index) => (
                  <CommentsCard
                    key={`${comment.commentedAt}-${index}`}
                    fullName={comment.fullName ?? ""}
                    isCustomer={comment.isCustomer ?? false}
                    date={comment.commentedAt ?? ""}
                    stars={comment.stars ?? 0}
                    content={comment.content ?? ""}
                  />
                ))}
                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="text-primary-300 text-md-medium hover:text-primary-400 transition-colors text-right mt-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoadingMore ? "در حال بارگذاری..." : "نمایش بیشتر"}
                  </button>
                )}
              </>
            ) : (
              <p className="text-xl-regular text-textSecondary">
                دیدگاهی ثبت نشده است
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
