"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Button } from "@/components/ui/button";
import { XClose24Icon } from "@/assets/images/svg/XClose24";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  initialChecked?: boolean;
}

const TermsModal = ({
  open,
  onOpenChange,
  onConfirm,
  initialChecked = false,
}: TermsModalProps) => {
  const [internalAccepted, setInternalAccepted] = useState(initialChecked);

  useEffect(() => {
    if (open) {
      setInternalAccepted(initialChecked);
    }
  }, [open, initialChecked]);

  const handleConfirm = () => {
    if (internalAccepted) {
      onConfirm();
      onOpenChange(false);
      setInternalAccepted(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setInternalAccepted(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="w-[400px] p-0 bg-base-black rounded-lg overflow-hidden"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center self-stretch">
          <DialogHeader className="relative flex flex-row justify-between items-center w-full px-6 pt-6 pb-0 ">
            <DialogTitle className="text-xl-bold text-base-white absolute ">
              قوانین
            </DialogTitle>
            <div className="flex-1" />
            <DialogClose asChild>
              <button
                onClick={handleClose}
                className="p-1 hover:opacity-70 transition-opacity cursor-pointer flex-shrink-0"
                aria-label="بستن"
              >
                <XClose24Icon />
              </button>
            </DialogClose>
          </DialogHeader>

          <div className="mt-2 px-6 w-full max-h-[366px] overflow-y-auto">
            <div className="text-[#98a2b3]">
              <p className="text-sm-regular">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
                استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله
                در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد
                نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد،
                کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان
                جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را
                برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در
                زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و
                دشواری موجود در ارائه راهکارها، و شرایط تایپ به پایان رسد و زمان
                مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته
                اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
              </p>
            </div>
          </div>

          <div className="mt-6 px-6 pb-6 w-full space-y-6 text-sm-demibold">
            <Checkbox
              label="من شرایط و ضوابط را مطالعه کرده ام."
              checked={internalAccepted}
              labelClassName="text-primary-300  "
              onCheckedChange={(checked) =>
                setInternalAccepted(checked === true)
              }
            />
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleConfirm}
              disabled={!internalAccepted}
            >
              تایید
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
