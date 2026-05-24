'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { Pagination } from '@/components/ui/pagination/index';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import { Tag } from '@/components/ui/tag';
import { Edit01Icon } from '@/assets/images/svg/Edit01';
import DeleteDiscountCodeModal from './DeleteDiscountCodeModal';
import type { DiscountCode } from '../types';

interface DiscountCodesTableProps {
  discountCodes: DiscountCode[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const DiscountCodesTable: React.FC<DiscountCodesTableProps> = ({
  discountCodes,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);

  const handleDeleteClick = (codeId: string) => {
    setSelectedCodeId(codeId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCodeId) {
      onDelete(selectedCodeId);
      setDeleteModalOpen(false);
      setSelectedCodeId(null);
    }
  };

  const startItem = (currentPage - 1) * pageSize + 1;

  return (
    <>
      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[56px]">ردیف</TableHead>
                <TableHead>کد تخفیف</TableHead>
                <TableHead>درصد تخفیف</TableHead>
                <TableHead>دستیار صوتی</TableHead>
                <TableHead>دستگاه</TableHead>
                <TableHead>تاریخ اعتبار</TableHead>
                <TableHead className="text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    className="text-center text-textSecondary"
                    colSpan={7}
                  >
                    در حال بارگذاری...
                  </TableCell>
                </TableRow>
              ) : discountCodes.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-center text-textSecondary"
                    colSpan={7}
                  >
                    هیچ کد تخفیفی یافت نشد.
                  </TableCell>
                </TableRow>
              ) : (
                discountCodes.map((code, index) => (
                  <TableRow key={code.id}>
                    <TableCell className="text-textSecondary w-[56px] px-3 py-2 text-center">
                      {startItem + index}
                    </TableCell>
                    <TableCell className="text-gray-25 px-3 py-2">
                      {code.code}
                    </TableCell>
                    <TableCell className="text-textSecondary px-3 py-2">
                      {code.percentage}%
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {code.voiceAssistants.map((va, idx) => (
                          <Tag key={idx} size="sm">
                            {va}
                          </Tag>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-textSecondary px-3 py-2">
                      {code.devices.join(' / ')}
                    </TableCell>
                    <TableCell className="text-textSecondary px-3 py-2">
                      {code.expirationDate}
                    </TableCell>
                    <TableCell className="text-center flex items-center gap-4 justify-center px-3 py-2">
                      <button
                        aria-label={`حذف ${code.code}`}
                        className="text-error-500 hover:text-error-400 cursor-pointer p-1 transition-colors"
                        type="button"
                        onClick={() => handleDeleteClick(code.id)}
                      >
                        <RedTrash01Icon className="size-5" />
                      </button>
                      <button
                        aria-label={`ویرایش ${code.code}`}
                        className="text-primary-300 hover:text-primary-200 cursor-pointer p-1 transition-colors"
                        type="button"
                        onClick={() => onEdit(code.id)}
                      >
                        <Edit01Icon className="size-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
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

      <DeleteDiscountCodeModal
        isLoading={false}
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onOpenChange={setDeleteModalOpen}
      />
    </>
  );
};

export default DiscountCodesTable;
