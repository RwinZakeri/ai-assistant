"use client";

import { DashboardCloseIcon } from "@/assets/images/svg/DashboardClose";
import { LogOut02Icon } from "@/assets/images/svg/LogOut02";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const LogoutModal = ({ open, onOpenChange, onConfirm }: LogoutModalProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-surfacePrimary  rounded-lg p-0 w-[400px]"
        showCloseButton={false}
      >
        {/* Close button - top left */}
        <DialogClose asChild>
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 p-1 hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="بستن"
          >
            <DashboardCloseIcon />
          </button>
        </DialogClose>

        <div className="flex flex-col items-start px-6 pt-[32px] pb-6 ">
          <div className="w-16 h-16  rounded-full bg-primary-600 border-8 border-primary-900 flex items-center justify-center">
            <LogOut02Icon />
          </div>
          <div className="mt-3 gap-4 flex flex-col items-start">
            <DialogTitle className="text-lg-demibold text-gray-25 ">
              خروج
            </DialogTitle>

            <p className="text-sm-regular text-textTertiary  leading-relaxed">
              آیا مطمئن هستید که می‌خواهید خارج شوید؟
            </p>
          </div>

          <div className="flex flex-row gap-3 w-full mt-8">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleClose}
              className="flex-1"
            >
              لغو
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirm}
              className="flex-1"
            >
              بله
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
