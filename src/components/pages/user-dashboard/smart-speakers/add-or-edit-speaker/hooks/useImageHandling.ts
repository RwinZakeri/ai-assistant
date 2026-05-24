import { mapImagesToUrls } from '@/utils/getFileUrl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { ImagePreview } from '../types';
import { extractFileId, uploadFile } from '../utils';

export const useImageHandling = (
  thumbnail: File | undefined,
  images: File[] | undefined,
  isEditMode: boolean,
  speakerDetailData: any,
  hasSetInitialFileIds: boolean,
  setHasSetInitialFileIds: (value: boolean) => void,
) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<ImagePreview | null>(
    null,
  );
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [thumbnailFileId, setThumbnailFileId] = useState<string | undefined>();
  const [imageFileIds, setImageFileIds] = useState<string[]>([]);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleThumbnailUpload = async (file: File) => {
    setIsUploadingThumbnail(true);
    try {
      const fileId = await uploadFile(file);
      setThumbnailFileId(fileId);
      toast.success('تصویر اصلی با موفقیت آپلود شد');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error('خطا در آپلود تصویر اصلی');
      setThumbnailFileId(undefined);
      return { shouldClearThumbnail: true };
    } finally {
      setIsUploadingThumbnail(false);
    }
    return { shouldClearThumbnail: false };
  };

  const handleImagesUpload = async (files: File[]) => {
    setIsUploadingImages(true);
    try {
      const uploadPromises = files.map(file => uploadFile(file));
      const fileIds = await Promise.all(uploadPromises);
      setImageFileIds(fileIds);
      toast.success('تصاویر با موفقیت آپلود شدند');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('خطا در آپلود تصاویر');
      setImageFileIds([]);
      return { shouldClearImages: true };
    } finally {
      setIsUploadingImages(false);
    }
    return { shouldClearImages: false };
  };

  // Handle thumbnail preview
  useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail);
      setThumbnailPreview({
        imageUrl: url,
        imageName: thumbnail.name,
        imageSize: thumbnail.size,
      });
      return () => URL.revokeObjectURL(url);
    } else if (
      isEditMode &&
      speakerDetailData?.images &&
      speakerDetailData.images.length > 0 &&
      !thumbnailPreview
    ) {
      const mappedImages = mapImagesToUrls(speakerDetailData.images);
      if (mappedImages.length > 0) {
        setThumbnailPreview({
          imageUrl: mappedImages[0],
          imageName: 'thumbnail',
          imageSize: 0,
        });
      }
    } else if (!thumbnail && !isEditMode) {
      setThumbnailPreview(null);
    }
  }, [thumbnail, speakerDetailData, isEditMode, thumbnailPreview]);

  // Handle image previews from edit mode
  useEffect(() => {
    if (
      isEditMode &&
      speakerDetailData?.images &&
      speakerDetailData.images.length > 1
    ) {
      const mappedImages = mapImagesToUrls(speakerDetailData.images);
      const imageUrls = mappedImages.slice(1);
      setImagePreviews(
        imageUrls.map((url, index) => ({
          imageUrl: url,
          imageName: `image-${index + 1}`,
          imageSize: 0,
        })),
      );
    }
  }, [speakerDetailData, isEditMode]);

  // Handle new image uploads
  useEffect(() => {
    if (images && images.length > 0) {
      const urls = images.map(file => ({
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
    } else if (
      !isEditMode ||
      !speakerDetailData?.images ||
      speakerDetailData.images.length <= 1
    ) {
      if (!isEditMode) {
        setImagePreviews([]);
      }
    }
  }, [images, isEditMode, speakerDetailData]);

  // Initialize file IDs from edit mode
  useEffect(() => {
    if (
      isEditMode &&
      speakerDetailData?.images &&
      speakerDetailData.images.length > 0 &&
      !hasSetInitialFileIds
    ) {
      const imageIds = speakerDetailData.images.filter(
        (img: any): img is string => typeof img === 'string' && img.length > 0,
      );

      if (imageIds.length > 0) {
        const firstImageId = extractFileId(imageIds[0]);
        if (firstImageId) {
          setThumbnailFileId(firstImageId);
        }

        if (imageIds.length > 1) {
          const additionalImageIds = imageIds
            .slice(1)
            .map(extractFileId)
            .filter((id: string | undefined): id is string => Boolean(id));
          if (additionalImageIds.length > 0) {
            setImageFileIds(additionalImageIds);
          }
        }

        setHasSetInitialFileIds(true);
      }
    }
  }, [speakerDetailData, isEditMode, hasSetInitialFileIds]);

  return {
    thumbnailPreview,
    imagePreviews,
    thumbnailFileId,
    imageFileIds,
    isUploadingThumbnail,
    isUploadingImages,
    setThumbnailFileId,
    setImageFileIds,
    setHasSetInitialFileIds,
    handleThumbnailUpload,
    handleImagesUpload,
  };
};
