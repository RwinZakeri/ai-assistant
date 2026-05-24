import { AdminDashboardService } from '@/apis';
import { CloseIcon } from '@/assets/images/svg/Close';
import { TickIcon } from '@/assets/images/svg/Tick';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { CommentAction_enum } from '@/enums/enum';
import { formatPersianDate } from '@/utils/formatPersianDate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import type { CommentTableProps } from './type';

const CommentTable: React.FC<CommentTableProps> = ({
  comment,
  assistantId,
}) => {
  const queryClient = useQueryClient();

  const approveRejectHandler = useMutation({
    mutationFn: async (
      action: (typeof CommentAction_enum)[keyof typeof CommentAction_enum],
    ) => {
      if (!comment.commentId) {
        return;
      }
      await AdminDashboardService.apiServicesAppAdmindashboardAdminactionforcommentPost(
        {
          commentId: comment.commentId,
          act: action,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['GetAssistantCommentsById', assistantId],
      });
      toast.success('وضعیت نظر با موفقیت به‌روزرسانی شد');
    },
    onError: () => {
      toast.error('خطا در به‌روزرسانی وضعیت نظر');
    },
  });

  const handleApprove = () => {
    approveRejectHandler.mutate(CommentAction_enum.Approve);
  };

  const handleReject = () => {
    approveRejectHandler.mutate(CommentAction_enum.Reject);
  };

  return (
    <TableRow>
      <TableCell className="text-textSecondary">
        {comment.rowNumber ?? '-'}
      </TableCell>
      <TableCell className="text-gray-25">{comment.fullname ?? '-'}</TableCell>
      <TableCell className="text-textSecondary max-w-md">
        <div className="text-wrap" title={comment.comment ?? ''}>
          {comment.comment ?? '-'}
        </div>
      </TableCell>
      <TableCell className="text-textSecondary">
        {formatPersianDate(comment?.date ?? '')}
      </TableCell>
      <TableCell>
        {comment.status === undefined ? (
          <Skeleton className="h-6 w-20" />
        ) : comment.status === 1 ? (
          <Badge size="md" variant="success">
            تایید شده
          </Badge>
        ) : comment.status === 2 ? (
          <Badge size="md" variant="error">
            رد شده
          </Badge>
        ) : (
          <Badge size="md" variant="primary">
            در انتظار
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            className="cursor-pointer"
            disabled={approveRejectHandler.isPending || comment.status === 1}
            loading={approveRejectHandler.isPending}
            size="sm"
            type="button"
            variant="link"
            onClick={handleApprove}
          >
            <TickIcon />
          </Button>
          <Button
            className="cursor-pointer"
            disabled={approveRejectHandler.isPending || comment.status === 2}
            loading={approveRejectHandler.isPending}
            size="sm"
            type="button"
            variant="link"
            onClick={handleReject}
          >
            <CloseIcon />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CommentTable;
