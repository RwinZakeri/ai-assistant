'use client';

import { changePasswordSchema } from '../schemas';
import type { ChangePasswordFormData } from '../schemas';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DashboardAccountCloseIcon } from '@/assets/images/svg/DashboardAccountClose';
import { EyeIcon } from '@/assets/images/svg/Eye';
import { EyeOffIcon } from '@/assets/images/svg/EyeOff';
import { cn } from '@/lib/utils';
import { TokenAuthService } from '@/apis';
import { toast } from 'sonner';

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormData) => {
      return TokenAuthService.apiTokenauthAppsetnewpasswordPost({
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
    },
    onSuccess: () => {
      toast.success('رمز عبور با موفقیت تغییر کرد.');
      handleCancel();
    },
    onError: () => {
      toast.error('خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید.');
    },
  });

  const handleCancel = () => {
    reset();
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onOpenChange(false);
  };

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[400px] p-0 bg-surfacePrimary rounded-lg flex flex-col"
        showCloseButton={false}
      >
        {/* Header with Close Button */}
        <DialogHeader className="flex flex-row-reverse justify-between items-center px-6 pt-6 pb-4 relative">
          {/* Close button (top left) */}
          <DialogClose asChild>
            <button
              className="p-1 hover:opacity-70 transition-opacity cursor-pointer flex-shrink-0 absolute left-6 top-6"
              onClick={handleCancel}
              aria-label="بستن"
            >
              <DashboardAccountCloseIcon />
            </button>
          </DialogClose>
        </DialogHeader>

        {/* Title */}
        <div className="px-6 pb-4">
          <DialogTitle className="text-lg-demibold text-base-white text-right">
            تغییر رمز عبور
          </DialogTitle>
        </div>

        {/* Password Rules */}
        <div className="px-6 pb-4 space-y-2">
          <p className="text-sm-medium text-textSecondary text-right">
            شامل حداقل ۸ کاراکتر باشد.
          </p>
          <p className="text-sm-medium text-textSecondary text-right">
            شامل حداقل یک عدد (۰-۹) باشد.
          </p>
          <p className="text-sm-medium text-textSecondary text-right text-nowrap">
            شامل حداقل یک کاراکتر خاص مانند ! ، @ ، # ، $ ، % ، &) باشد.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 pb-6 flex-1 flex flex-col gap-4"
        >
          {/* New Password Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="newPassword"
              className="text-sm-medium text-base-white text-right block"
            >
              رمز عبور جدید
            </label>
            <div className="relative h-10 md:h-11 w-full">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="رمز عبور جدید را اینجا بنویسید"
                className={cn(
                  'h-10 md:h-11 w-full rounded-md border px-3 py-1 pr-3 pl-10',
                  'text-base md:text-md-regular text-base-white placeholder:text-textSecondary',
                  'bg-transparent shadow-xs outline-none',
                  'transition-[background-color,color,box-shadow,border] duration-200',
                  'focus-visible:border-primary-300 focus-visible:ring-primary-300/20 focus-visible:ring-[3px]',
                  errors.newPassword
                    ? 'border-error-500'
                    : 'border-linePrimary',
                )}
                aria-invalid={!!errors.newPassword}
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-textSecondary hover:text-base-white transition-colors cursor-pointer"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? (
                  <EyeIcon className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <EyeOffIcon className="h-4 w-4 flex-shrink-0" />
                )}
              </button>
            </div>
            <div className="min-h-[1.25rem]">
              {errors.newPassword && (
                <p className="text-sm text-error-500 text-right" role="alert">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-sm-medium text-base-white text-right block"
            >
              تکرار رمز عبور جدید
            </label>
            <div className="relative h-10 md:h-11 w-full">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="رمز عبور جدید را دوباره اینجا بنویسید"
                className={cn(
                  'h-10 md:h-11 w-full rounded-md border px-3 py-1 pr-3 pl-10',
                  'text-base md:text-md-regular text-base-white placeholder:text-textSecondary',
                  'bg-transparent shadow-xs outline-none',
                  'transition-[background-color,color,box-shadow,border] duration-200',
                  'focus-visible:border-primary-300 focus-visible:ring-primary-300/20 focus-visible:ring-[3px]',
                  errors.confirmPassword
                    ? 'border-error-500'
                    : 'border-linePrimary',
                )}
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-textSecondary hover:text-base-white transition-colors cursor-pointer"
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >
                {showConfirmPassword ? (
                  <EyeIcon className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <EyeOffIcon className="h-4 w-4 flex-shrink-0" />
                )}
              </button>
            </div>
            <div className="min-h-[1.25rem]">
              {errors.confirmPassword && (
                <p className="text-sm text-error-500 text-right" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-0 pb-0 pt-4 gap-3 flex-row">
            <div className="flex gap-3 w-full">
              <Button
                type="submit"
                variant="primary"
                className="cursor-pointer flex-1"
                disabled={changePasswordMutation.isPending}
              >
                تایید
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="cursor-pointer flex-1"
                disabled={changePasswordMutation.isPending}
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

export default ChangePasswordModal;
