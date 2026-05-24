"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardTrashIcon } from "@/assets/images/svg/DashboardTrash";
import { DashboardCloseIcon } from "@/assets/images/svg/DashboardClose";

interface DeleteSpeakerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteSpeakerModal = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteSpeakerModalProps) => {
  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !isLoading && onOpenChange(open)}
    >
      <DialogContent
        className="bg-surfacePrimary  rounded-lg p-0 w-[400px]"
        showCloseButton={false}
      >
        {/* Close button - top left */}
        <DialogClose asChild>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 left-4 p-1 hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="بستن"
          >
            <DashboardCloseIcon />
          </button>
        </DialogClose>

        <div className="flex flex-col items-start px-6 pt-[32px] pb-6 ">
          <div className="w-16 h-16  rounded-full bg-error-600 border border-8 border-error-900 flex items-center justify-center">
            <DashboardTrashIcon />
          </div>
          <div className="mt-3 gap-4 flex flex-col items-start">
            <DialogTitle className="text-lg-demibold text-gray-25 ">
              حذف اسپیکر
            </DialogTitle>

            <p className="text-sm-regular text-textTertiary  leading-relaxed">
              آیا مطمئن هستید که می‌خواهید این اسپیکر را حذف کنید؟ این عمل قابل
              لغو نیست.
            </p>
          </div>

          <div className="flex flex-row gap-3 w-full mt-8">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              لغو
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleConfirm}
              className="flex-1"
              loading={isLoading}
              disabled={isLoading}
            >
              حذف
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSpeakerModal;
