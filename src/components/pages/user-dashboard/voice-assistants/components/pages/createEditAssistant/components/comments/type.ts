import type { DropdownInputProps } from '@/components/ui/input/dropdown-input';
import { CommentStatus, LifecycleBounds } from '@/enums/enum';

export interface CommentTableProps {
  comment: {
    commentId?: number;
    fullname?: string | null;
    comment?: string | null;
    date?: string | null;
    status?: number;
    rowNumber?: number;
  };
  assistantId: number;
}

type DropdownOption = DropdownInputProps['options'][number];

export const newestOldestItem: DropdownOption[] = [
  {
    label: 'همه',
    value: 'all',
  },
  {
    label: 'جدیدترین',
    value: LifecycleBounds.Newest.toString(),
  },
  {
    label: 'قدیمی ترین',
    value: LifecycleBounds.Oldest.toString(),
  },
] as const;

export const commentStatus: DropdownOption[] = [
  {
    label: 'همه',
    value: 'all',
  },
  {
    label: 'تایید شده',
    value: CommentStatus.Accepted.toString(),
  },
  {
    label: 'رد شده',
    value: CommentStatus.Rejected.toString(),
  },
  {
    label: 'در انتظار تایید',
    value: CommentStatus.Pending.toString(),
  },
] as const;
