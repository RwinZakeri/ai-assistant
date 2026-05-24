"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/input/dropdown-input";
import useDevice from "@/hooks/useDevice";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 48],
  className,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();
  const device = useDevice();

  return (
    <div
      className={cn(
        "flex items-center gap-4",
        device === "desktop" ? "justify-between" : "justify-center",
        className
      )}
    >
      {device === "desktop" ? (
        <>
          <div className="flex gap-3 items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              قبلی
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              بعدی
            </Button>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              {pageNumbers.map((page, index) => {
                if (page === "ellipsis") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="text-textSecondary px-2"
                    >
                      ...
                    </span>
                  );
                }

                const pageNum = page as number;
                return (
                  <Button
                    key={pageNum}
                    variant={"link"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={`h-9 w-9 p-0 rounded-full ${
                      currentPage === pageNum
                        ? "bg-surfaceTertiary text-blakc"
                        : "text-textSecondary"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-3 justify-between items-center w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              قبلی
            </Button>
            <div className="flex items-center justify-between flex-wrap gap-">
              <div className="flex items-center gap-2">
                {pageNumbers.map((page, index) => {
                  if (page === "ellipsis") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="text-textSecondary px-2"
                      >
                        ...
                      </span>
                    );
                  }

                  const pageNum = page as number;
                  return (
                    <Button
                      key={pageNum}
                      variant={"link"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                      className={`h-9 w-9 p-0 rounded-full ${
                        currentPage === pageNum
                          ? "bg-surfaceTertiary text-blakc"
                          : "text-textSecondary"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              بعدی
            </Button>
          </div>
        </>
      )}

      <div className=" items-center gap-2 hidden md:flex">
        <span className="text-textSecondary text-sm-regular">نمایش</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-20 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-textSecondary text-sm-regular">
          از {totalItems.toLocaleString()} مورد
        </span>
      </div>
    </div>
  );
}
