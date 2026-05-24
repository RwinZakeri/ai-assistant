import type { ImagePreview } from '@/components/pages/user-dashboard/voice-assistants/type';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isValidGuid, uploadFile } from '../components/utils';

export const useImageHandling = (
  images: File[] | undefined,
  isEditMode: boolean,
) => {
  const [imageFileIds, setImageFileIds] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  useEffect(() => {
    if (images && images.length > 0) {
      const urls = images.map((file: File) => ({
        imageUrl: URL.createObjectURL(file),
        imageName: file.name,
        imageSize: file.size,
      }));

      setImagePreviews(urls);
      return () => {
        urls.forEach(preview => {
          URL.revokeObjectURL(preview.imageUrl);
        });
      };
    } else if (!isEditMode) {
      setImagePreviews([]);
    }
  }, [images, isEditMode]);

  const handleImagesUpload = async (
    files: File[],
  ): Promise<{ shouldClearImages?: boolean } | void> => {
    setIsUploadingImages(true);
    try {
      const uploadPromises = files.map(file => uploadFile(file));
      const fileIds = await Promise.all(uploadPromises);
      const validFileIds = fileIds.filter(isValidGuid);
      setImageFileIds(validFileIds);
      toast.success('تصاویر با موفقیت آپلود شدند');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('خطا در آپلود تصاویر');
      return { shouldClearImages: true };
    } finally {
      setIsUploadingImages(false);
    }
  };

  return {
    imageFileIds,
    setImageFileIds,
    isUploadingImages,
    imagePreviews,
    handleImagesUpload,
  };
};
