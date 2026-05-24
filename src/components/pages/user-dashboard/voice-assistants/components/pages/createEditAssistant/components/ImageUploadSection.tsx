'use client';

import { Controller } from 'react-hook-form';
import { DeleteIcon } from '@/assets/images/svg/Delete';
import MultipleUpload from '@/components/ui/upload/multiple-upload';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import BinaryToMb from '@/utils/binaryToMb';
import type { ImageUploadSectionProps } from '../types';

const ImageUploadSection = ({
  control,
  errors,
  imagePreviews,
  imageFileIds,
  isUploadingImages,
  onImagesChange,
  onImageRemove,
  watch,
  setValue,
}: ImageUploadSectionProps) => {
  return (
    <section className="flex justify-center w-full">
      <div className="flex flex-col items-center gap-5 w-full justify-center">
        <div className="border-linePrimary border-2 border-dashed rounded-xl w-full">
          <div className="w-full">
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <MultipleUpload
                  attachments={field.value || []}
                  className="w-full"
                  id="images-upload"
                  label="آپلود تصویر"
                  labelClassName="border-solid border-0 hover:border-linePrimary"
                  changeHandler={async files => {
                    field.onChange(files);
                    if (files && files.length > 0) {
                      const result = await onImagesChange(files);
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
                  helperText={
                    isUploadingImages
                      ? 'در حال آپلود...'
                      : '(SVG, JPG, PNG, or GIF - اختیاری)'
                  }
                />
              )}
            />
          </div>
          <div
            className={cn(
              'grid grid-cols-3 gap-4 px-36',
              imagePreviews.length > 0 && 'pb-12',
            )}
          >
            {imagePreviews?.length > 0 && (
              <>
                {imagePreviews?.map((preview, index) => (
                  <div
                    key={index}
                    className="w-full rounded-xl overflow-hidden bg-surfaceSecondary"
                  >
                    <div className="w-full h-36">
                      <img
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        src={preview.imageUrl}
                      />
                    </div>
                    <div className="flex justify-between items-center p-4">
                      <div>
                        <Button
                          size="sm"
                          type="button"
                          variant="tertiaryColor"
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
      </div>
    </section>
  );
};

export default ImageUploadSection;
