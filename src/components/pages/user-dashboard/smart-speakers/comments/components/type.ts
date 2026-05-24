import { GetAllSpeakerCommentsOutput } from "@/apis/models/GetAllSpeakerCommentsOutput";
import { DropdownInputProps } from "@/components/ui/input/dropdown-input";
import { CommentStatus, LifecycleBounds } from "@/enums/enum";

export interface CommentRowProps {
  comment: GetAllSpeakerCommentsOutput;
  onAccept: (commentId: number) => void;
  onReject: (commentId: number) => void;
  isProcessing: boolean;
}

export interface CommentTableProps {
  comment: GetAllSpeakerCommentsOutput;
  speakerId: number;
}

type DropdownOption = DropdownInputProps["options"][number];

export const newestOldestItem: DropdownOption[] = [
  {
    label: "همه",
    value: "all",
  },
  {
    label: "جدیدترین",
    value: LifecycleBounds.Newest.toString(),
  },
  {
    label: "قدیمی ترین",
    value: LifecycleBounds.Oldest.toString(),
  },
] as const;

export const commentStatus: DropdownOption[] = [
  {
    label: "همه",
    value: "all",
  },
  {
    label: "تایید شده",
    value: CommentStatus.Accepted.toString(),
  },
  {
    label: "رد شده",
    value: CommentStatus.Rejected.toString(),
  },
  {
    label: "در انتظار تایید",
    value: CommentStatus.Pending.toString(),
  },
] as const;
