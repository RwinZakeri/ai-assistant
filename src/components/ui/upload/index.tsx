import { DashboardUploadIcon } from '@/assets/images/svg/DashboardUpload';
import { cn } from '@/lib/utils';
import React from 'react';
import type { UploadFileProps } from './type';

const UploadFile = ({
  errors,
  attachment,
  changeHandler,
  className,
  labelClassName,
  id = 'file-attachment',
  accept = '.svg,.jpg,.jpeg,.png,.pdf',
  helperText = '(SVG, JPG, PNG maximum 80×80)',
  label = 'آپلود فایل',
}: UploadFileProps) => {
  const errorMessage =
    typeof errors?.attachment === 'string'
      ? errors.attachment
      : errors?.attachment?.message;

  const hasError = !!errorMessage;

  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className={cn(
          'flex min-h-[200px] w-full py-[48px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed bg-surfaceSecondary/40 text-center text-sm text-textSecondary transition-colors hover:border-primary-300 hover:text-primary-200',
          hasError ? 'border-destructive' : 'border-linePrimary',
          labelClassName,
        )}
      >
        <div
          className={cn(
            'w-[711px] h-full p-12 flex flex-row justify-center gap-4 items-center',
            className,
          )}
        >
          <div>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surfaceSecondary">
              <DashboardUploadIcon />
            </span>
          </div>
          <div className="flex flex-col gap-2 items-start justify-center">
            <p className="text-lg-bold text-gray-25">
              {attachment ? attachment.name : label}
            </p>
            <p className="text-textSecondary">{helperText}</p>
          </div>
        </div>
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={e => {
          const file = e.target.files?.[0] ?? null;
          changeHandler(file);
        }}
        className="sr-only"
      />
      {hasError && (
        <p className="text-sm text-destructive mt-2" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default UploadFile;
