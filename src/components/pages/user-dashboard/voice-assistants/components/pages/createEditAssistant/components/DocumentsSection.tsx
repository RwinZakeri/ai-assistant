'use client';

import { PlusplusIcon } from '@/assets/images/svg/Plusplus';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import type { DocumentsSectionProps } from '../types';

const DocumentsSection = ({
  uploadedDocs,
  docCurrentPage,
  docPageSize,
  docTotalPages,
  docStartIndex,
  paginatedDocs,
  onDocUpload,
  onDeleteDoc,
  onPageChange,
  onPageSizeChange,
}: DocumentsSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">داکیومنت های آموزشی</p>
        <label>
          <input
            multiple
            accept=".docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
            className="hidden"
            id="doc-upload-input"
            type="file"
            onChange={onDocUpload}
          />
          <Button
            size="lg"
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('doc-upload-input')?.click()}
          >
            <PlusplusIcon stroke="white" />
            افزودن فایل
          </Button>
        </label>
      </div>

      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>نام فایل</TableHead>
              <TableHead>تاریخ</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploadedDocs.length === 0 || paginatedDocs.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center text-textSecondary"
                  colSpan={4}
                >
                  فایلی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              <>
                {paginatedDocs.map((doc, index) => (
                  <TableRow key={doc.id}>
                    <TableCell className="text-textSecondary">
                      {docStartIndex + index + 1}
                    </TableCell>
                    <TableCell className="text-textTertiary">
                      {doc.fileName}
                    </TableCell>
                    <TableCell className="text-textSecondary">
                      {doc.uploadDate.toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        className="text-error-500 hover:text-error-400"
                        size="sm"
                        type="button"
                        variant="link"
                        onClick={() => onDeleteDoc(doc.id)}
                      >
                        <RedTrash01Icon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {docTotalPages > 1 && (
                  <TableRow>
                    <TableCell className="p-4" colSpan={4}>
                      <Pagination
                        currentPage={docCurrentPage}
                        pageSize={docPageSize}
                        pageSizeOptions={[10, 20, 50]}
                        totalItems={uploadedDocs.length}
                        totalPages={docTotalPages}
                        onPageChange={onPageChange}
                        onPageSizeChange={newSize => {
                          onPageSizeChange(newSize);
                          onPageChange(1);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentsSection;
