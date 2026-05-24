"use client";

import { MessageSquare02Icon } from "@/assets/images/svg/MessageSquare02";
import { XCloseModalIcon } from "@/assets/images/svg/XCloseModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextAreaField } from "@/components/ui/input/textarea-input";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/ui/star-rating";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { commentFormSchema, type CommentFormData } from "./schemas";

interface CommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistantName?: string;
  onSubmit?: (comment: string, rating: number) => void | Promise<void>;
  isLoading?: boolean;
}

const CommentModal: React.FC<CommentModalProps> = ({
  open,
  onOpenChange,
  assistantName = "دستیار پزشکی",
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const rating = watch("rating");

  useEffect(() => {
    if (open) {
      reset({
        rating: 5,
        comment: "",
      });
    }
  }, [open, reset]);

  const handleRatingChange = (newRating: number) => {
    setValue("rating", newRating, { shouldValidate: true });
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmitForm = async (data: CommentFormData) => {
    if (!onSubmit) return;

    const comment = data.comment.trim();
    const rating = data.rating;

    if (!comment) {
      toast.error("متن دیدگاه نمی‌تواند خالی باشد");
      return;
    }

    try {
      await onSubmit(comment, rating);

      toast.success("دیدگاه شما ثبت و پس از تایید نمایش داده خواهد شد");
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Submit comment failed:", error);
      toast.error("خطا در ثبت دیدگاه. لطفا دوباره تلاش کنید");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[400px] p-0 bg-surfacePrimary rounded-lg"
        showCloseButton={false}
      >
        <DialogHeader className="w-full flex flex-row-reverse justify-between items-center px-6 pt-6 pb-4 relative">
          <DialogClose asChild>
            <button
              className="p-1 hover:opacity-70 transition-opacity cursor-pointer flex-shrink-0"
              onClick={handleCancel}
              aria-label="بستن"
            >
              <XCloseModalIcon className="text-gray-25 [&_path]:stroke-gray-500" />
            </button>
          </DialogClose>

          <div className="p-3 border border-linePrimary rounded-[10px] flex items-center justify-center flex-shrink-0">
            <MessageSquare02Icon />
          </div>
        </DialogHeader>
        <div className="flex flex-row justify-between px-6 items-center">
          <DialogTitle className="text-lg-demibold">
            {assistantName}
          </DialogTitle>
        </div>

        <form
          className="w-full max-w-full md:max-w-96"
          onSubmit={handleSubmit(onSubmitForm)}
        >
          <div className="px-6 pb-3">
            <div className="flex flex-col">
              <div className="flex flex-col gap-1.5">
                <Label className="text-md-medium text-gray-25">امتیاز</Label>
                <p className="text-sm text-textSecondary">
                  امتیاز خود را از ۱ تا ۵ انتخاب کنید
                </p>
              </div>

              <div className="rounded-xl py-5 w-full">
                <div className="flex items-center justify-between gap-4">
                  <StarRating
                    rating={rating}
                    onRatingChange={handleRatingChange}
                    interactive={true}
                  />

                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                      rating > 0
                        ? "bg-primary-500/10 animate-[fadeInSlideDown_0.2s_ease-in-out_forwards]"
                        : "bg-surfaceSecondary/50"
                    }`}
                  >
                    <span
                      className={`text-md-bold ${
                        rating > 0 ? "text-primary-300" : "text-textSecondary"
                      }`}
                    >
                      {rating}
                    </span>
                    <span className="text-sm text-textSecondary">از ۵</span>
                  </div>
                </div>
              </div>
            </div>

            <TextAreaField
              {...register("comment")}
              placeholder="نظر خود را در مورد این دستیار با کاربران دیگر به اشتراک بگذارید..."
              textareaClassName="w-full md:w-[352px] min-h-[180px] text-gray-25 resize-none"
              className="space-y-0"
              error={errors.comment?.message}
              errorClassName="transition-all duration-200 ease-in-out"
            />
          </div>

          <DialogFooter className="px-6 pb-6 gap-3 flex-row">
            <div className="flex gap-3 ml-auto">
              <Button
                type="submit"
                variant="primary"
                className="cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "در حال ارسال..." : "ثبت دیدگاه"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="cursor-pointer"
              >
                لغو
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
