import { useMutation } from '@tanstack/react-query';
import { CreateOrEditSpeakerDto } from '@/apis';
import { SpeakersService } from '@/apis/services/SpeakersService';
import { toast } from 'sonner';
import { extractFileId } from '../utils';
import type { AddSpeakerFormData } from '../schemas';

export const useSpeakerMutation = (
  isEditMode: boolean,
  speakerId: number | undefined,
  thumbnailFileId: string | undefined,
  imageFileIds: string[],
  speakerDetailData: any,
  reset: () => void,
  setThumbnailFileId: (id: string | undefined) => void,
  setImageFileIds: (ids: string[]) => void,
) => {
  return useMutation({
    mutationFn: async (data: AddSpeakerFormData) => {
      if (!isEditMode && !thumbnailFileId) {
        throw new Error('لطفا تصویر اصلی را آپلود کنید');
      }

      const files: Array<{ fileId: string; isThumbnail: boolean }> = [];

      if (thumbnailFileId) {
        files.push({
          fileId: thumbnailFileId,
          isThumbnail: true,
        });
      } else if (
        isEditMode &&
        speakerDetailData?.images &&
        speakerDetailData.images.length > 0
      ) {
        const firstImageId = extractFileId(speakerDetailData.images[0]);
        if (firstImageId) {
          files.push({
            fileId: firstImageId,
            isThumbnail: true,
          });
        }

        if (speakerDetailData.images.length > 1) {
          speakerDetailData.images.slice(1).forEach((img: string) => {
            const fileId = extractFileId(img);
            if (fileId) {
              files.push({
                fileId,
                isThumbnail: false,
              });
            }
          });
        }
      }

      if (imageFileIds.length > 0) {
        imageFileIds.forEach(fileId => {
          files.push({
            fileId,
            isThumbnail: false,
          });
        });
      }

      const selectedColorIds = data.colors.map(colorId => Number(colorId));

      const speakerTechnicalDetails = data.technicalSpecs.map(spec => ({
        key: spec.title,
        value: spec.description,
        showOnTop: spec.showontop,
      }));

      const requestBody: CreateOrEditSpeakerDto & {
        selectedColorIds?: number[];
        files?: Array<{ fileId: string; isThumbnail: boolean }>;
        speakerTechnicalDetails?: Array<{
          key: string;
          value: string;
          showOnTop: boolean;
        }>;
        discountPercentage?: number;
        id?: number;
      } = {
        title: data.name,
        deviceModel: data.deviceModel,
        price: Number(data.price),
        quantity: Number(data.quantity),
        description: data.description,
        selectedColorIds,
        files,
        speakerTechnicalDetails,
        discountPercentage: data.discountPercent
          ? Number(data.discountPercent)
          : 0,
      };

      if (isEditMode && speakerId) {
        requestBody.id = speakerId;
      }

      return SpeakersService.apiServicesAppSpeakersCreateoreditPost(
        requestBody as any,
      );
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? 'اسپیکر با موفقیت ویرایش شد' : 'اسپیکر با موفقیت ایجاد شد',
      );
      if (!isEditMode) {
        reset();
        setThumbnailFileId(undefined);
        setImageFileIds([]);
      }
    },
    onError: error => {
      console.error('Error creating/editing speaker:', error);
      toast.error(isEditMode ? 'خطا در ویرایش اسپیکر' : 'خطا در ایجاد اسپیکر');
    },
  });
};

