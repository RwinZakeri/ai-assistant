import type { GetAppCommentOutput } from "@/apis/models/GetAppCommentOutput";

export type CommentsSectionProps = {
  speakerId?: number;
  assistantId?: number;
  averageRating: number;
  totalReviews: number;
  assistantName?: string;
  pageSize?: number;
  initialDisplayCount?: number;
  defaultOpen?: boolean;
  title?: string;
  className?: string;
  gridClassName?: string;
  commentsListClassName?: string;
  onCommentSubmitted?: () => void;
  onCommentsLoaded?: (comments: GetAppCommentOutput[]) => void;
};

