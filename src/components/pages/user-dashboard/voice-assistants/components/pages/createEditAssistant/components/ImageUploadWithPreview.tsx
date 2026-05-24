'use client';

import { DashboardUploadIcon } from '@/assets/images/svg/DashboardUpload';
import { XCloseIcon } from '@/assets/images/svg/XClose';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface ImageUploadWithPreviewProps {
  images?: File[];
  previewUrls?: string[];
  onChange: (files: File[]) => void;
  error?: string;
  multiple?: boolean;
  className?: string;
}

const ImageUploadWithPreview = ({
  images = [],
  previewUrls = [],
  onChange,
  error,
  multiple = true,
  className,
}: ImageUploadWithPreviewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...images, ...newFiles] : newFiles;
      onChange(updatedFiles);

      if (multiple) {
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setLocalPreviews(prev => [...prev, ...newPreviews]);
      } else {
        setLocalPreviews(prev => {
          prev.forEach(url => URL.revokeObjectURL(url));
          return [URL.createObjectURL(newFiles[0])];
        });
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const updatedFiles = images.filter((_, i) => i !== index);
    onChange(updatedFiles);
    if (localPreviews[index]) {
      URL.revokeObjectURL(localPreviews[index]);
    }
    setLocalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const allPreviews = previewUrls.length > 0 ? previewUrls : localPreviews;
  const hasFiles = images.length > 0 || previewUrls.length > 0;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        className={cn(
          'flex min-h-[200px] w-full py-[48px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed bg-surfaceSecondary/40 text-center text-sm text-textSecondary transition-colors hover:border-primary-300 hover:text-primary-200',
          error ? 'border-destructive' : 'border-linePrimary',
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-[711px] h-full p-12 flex flex-row justify-center gap-4 items-center">
          <div>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surfaceSecondary">
              <DashboardUploadIcon />
            </span>
          </div>
          <div className="flex flex-col gap-2 items-start justify-center">
            <p className="text-lg-bold text-gray-25">
              {hasFiles
                ? `${images.length + previewUrls.length} فایل انتخاب شده`
                : 'آپلود تصویر'}
            </p>
            <p className="text-textSecondary">
              (SVG, JPG, PNG, or GIF - حداکثر ۵ مگابایت)
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        accept=".svg,.jpg,.jpeg,.png,.gif"
        className="sr-only"
        multiple={multiple}
        type="file"
        onChange={handleFileSelect}
      />

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {allPreviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allPreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-800">
                <Image
                  fill
                  alt={`Preview ${index + 1}`}
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  src={preview}
                />
                <Button
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  size="sm"
                  type="button"
                  variant="destructive"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                >
                  <XCloseIcon />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadWithPreview;
