'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { Pagination } from '@/components/ui/pagination/index';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserTableProps } from './types';
import UserTableSkeleton from './skeletons/UserTableSkeleton';

const UserTable: React.FC<UserTableProps> = ({
  users,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const router = useRouter();

  const handleViewDetails = (userId: number) => {
    router.push(`/dashboard/users/${userId}`);
  };

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>نام و نام خانوادگی</TableHead>
              <TableHead>ایمیل</TableHead>
              <TableHead>تلفن</TableHead>
              <TableHead>نقش</TableHead>
              <TableHead className="text-center" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <UserTableSkeleton rows={5} />
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center text-textSecondary"
                  colSpan={6}
                >
                  هیچ کاربری یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => {
                return (
                  <TableRow key={user.userId}>
                    <TableCell className="text-textSecondary w-[56px]">
                      {user.rowNumber}
                    </TableCell>
                    <TableCell className="text-gray-25 ">
                      {user.fullname}
                    </TableCell>
                    <TableCell className="text-gray-25">
                      {user.emailAddress || (
                        <span className="text-gray-25/50">ایمیل ثبت نشده</span>
                      )}
                    </TableCell>
                    <TableCell className="text-textSecondary">
                      {user.phoneNumber || 'شماره تلفن ثبت نشده'}
                    </TableCell>
                    <TableCell>
                      <span className="text-textSecondary">
                        {user.roleName}
                      </span>
                    </TableCell>
                    <TableCell className="text-center w-[172px]">
                      <Button
                        aria-label={`مشاهده جزئیات ${user.fullname}`}
                        className="w-full sm:w-auto text-primary-300 hover:text-primary-200 cursor-pointer flex items-center gap-2 justify-center"
                        size="sm"
                        type="button"
                        variant="linkColor"
                        onClick={() => handleViewDetails(user.userId)}
                      >
                        مشاهده جزئیات
                        <ArrowLeft className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && (
        <div className="border-t border-gray-800 px-6 py-4">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default UserTable;
