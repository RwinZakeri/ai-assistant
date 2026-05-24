'use client';

import { Controller } from 'react-hook-form';
import { DeleteIcon } from '@/assets/images/svg/Delete';
import { Button } from '@/components/ui/button';
import UploadFile from '@/components/ui/upload';
import MultipleUpload from '@/components/ui/upload/multiple-upload';
import { cn } from '@/lib/utils';
import BinaryToMb from '@/utils/binaryToMb';
import type { ImageUploadSectionProps } from '../types';

const ImageUploadSection = ({
  control,
  errors,
  thumbnailPreview,
  imagePreviews,
  thumbnailFileId,
  imageFileIds,
  isUploadingThumbnail,
  isUploadingImages,
  isEditMode,
  onThumbnailUpload,
  onImagesUpload,
  onThumbnailRemove,
  onImageRemove,
  watch,
  setValue,
}: ImageUploadSectionProps) => {
  const thumbnail = watch('thumbnail');
  const images = watch('images');

  return (
    <div className="border-linePrimary border rounded-xl">
      <div className="flex">
        <div className="w-full">
          <Controller
            name="thumbnail"
            control={control}
            render={({ field }) => (
              <UploadFile
                label="آپلود تصویر اصلی"
                id="thumbnail-upload"
                attachment={field.value}
                changeHandler={async file => {
                  if (file) {
                    field.onChange(file);
                    const result = await onThumbnailUpload(file);
                    if (result?.shouldClearThumbnail) {
                      setValue('thumbnail', undefined as unknown as File);
                    }
                  } else {
                    onThumbnailRemove();
                  }
                }}
                errors={{
                  attachment: errors.thumbnail,
                }}
                className="w-full"
                labelClassName="border-solid border-0 hover:border-linePrimary"
                helperText={
                  isUploadingThumbnail
                    ? 'در حال آپلود...'
                    : '(SVG, JPG, PNG, or gif - الزامی)'
                }
              />
            )}
          />
        </div>

        <div className="w-full">
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <MultipleUpload
                labelClassName="border-solid border-0 hover:border-linePrimary"
                label="آپلود تصویرهای دیگر"
                id="images-upload"
                attachments={field.value || []}
                changeHandler={async files => {
                  field.onChange(files);
                  if (files && files.length > 0) {
                    const result = await onImagesUpload(files);
                    if (result?.shouldClearImages) {
                      setValue('images', []);
                    }
                  } else {
                    setValue('images', []);
                  }
                }}
                errors={{
                  attachment: errors.images,
                }}
                className="w-full"
                helperText={
                  isUploadingImages
                    ? 'در حال آپلود...'
                    : '(SVG, JPG, PNG, or gif - اختیاری)'
                }
              />
            )}
          />
        </div>
      </div>
      <div
        className={cn(
          'grid grid-cols-3 gap-4 px-36',
          (thumbnailPreview || imagePreviews.length) && 'pb-12',
        )}
      >
        {thumbnailPreview && (
          <div className="w-full rounded-xl overflow-hidden bg-primary-700">
            <div className="w-full h-36">
              <img
                src={thumbnailPreview.imageUrl}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between items-center p-4">
              <div>
                <Button
                  type="button"
                  variant="tertiaryColor"
                  size="sm"
                  onClick={onThumbnailRemove}
                >
                  <DeleteIcon />
                </Button>
              </div>
              <div className="text-left">
                <p className="line-clamp-1 text-gray-25 text-sm">
                  {thumbnailPreview.imageName}
                </p>
                <p className="text-textSecondary">
                  Mb {BinaryToMb(thumbnailPreview.imageSize)}{' '}
                </p>
              </div>
            </div>
          </div>
        )}

        {imagePreviews?.length > 0 && (
          <>
            {imagePreviews?.map((preview, index) => (
              <div
                key={index}
                className="w-full rounded-xl overflow-hidden bg-surfaceSecondary"
              >
                <div className="w-full h-36">
                  <img
                    src={preview.imageUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-center p-4">
                  <div>
                    <Button
                      type="button"
                      variant="tertiaryColor"
                      size="sm"
                      onClick={() => onImageRemove(index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                  <div className="text-left">
                    <p className="line-clamp-1 text-gray-25 text-sm">
                      {preview.imageName}
                    </p>
                    <p className="text-textSecondary">
                      Mb {BinaryToMb(preview.imageSize)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;
