'use client';

import { UserDashboardService } from '@/apis';
import type { GetSpeakerDetailOutput } from '@/apis/models/GetSpeakerDetailOutput';
import type { SpeakerAvailableColors } from '@/apis/models/SpeakerAvailableColors';
import type { SpeakerDetailsViewOutput } from '@/apis/models/SpeakerDetailsViewOutput';
import type { SpeakerTechnicalDetails } from '@/apis/models/SpeakerTechnicalDetails';
import { SpeakersService } from '@/apis/services/SpeakersService';
import { ArrowLeftAuthIcon } from '@/assets/images/svg/ArrowLeftAuth';
import ContentWrapper from '@/components/layouts/wrappers/ContentWrapper';
import { Button } from '@/components/ui/button';
import CommentsSection from '@/components/ui/cards/comments/CommentsSection';
import useDevice from '@/hooks/useDevice';
import { getToken } from '@/utils/cookies';
import { mapImagesToUrls } from '@/utils/getFileUrl';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ColorSelection from './components/ColorSelection';
import SimilarSpeakers from './components/SimilarSpeakers';
import SpeakerHeader from './components/SpeakerHeader';
import SpeakerImage from './components/SpeakerImage';
import SpeakerPageSkeleton from './components/SpeakerPageSkeleton';
import SpeakerPriceDisplay from './components/SpeakerPriceDisplay';
import TechnicalDetails from './components/TechnicalDetails';
import TopTechnicalDetails from './components/TopTechnicalDetails';
import type {
  SimilarSpeaker,
  SpeakerColor,
  SpeakerConfig,
  TechnicalDetail,
} from './type';

const defaultColorValue: SpeakerColor = {
  id: 0,
  name: '',
  hexColor: '#000000',
};

const mapColorToSpeakerColor = (
  color: SpeakerAvailableColors,
): SpeakerColor => {
  return {
    id: color.id ?? 0,
    name: color.name ?? '',
    hexColor: color.hexColor ?? '#000000',
  };
};

const mapTechnicalDetail = (
  detail: SpeakerTechnicalDetails,
): TechnicalDetail | null => {
  if (!detail.title || !detail.value) {
    return null;
  }
  return {
    title: detail.title,
    value: detail.value,
  };
};

const mapSimilarSpeaker = (
  speaker: GetSpeakerDetailOutput,
): SimilarSpeaker | null => {
  if (speaker.id === undefined) {
    return null;
  }
  return {
    id: speaker.id,
    title: speaker.title ?? '',
    quantityInStorage: speaker.quantityInStorage ?? 0,
    stars: speaker.stars ?? 0,
    finalPrice: speaker.finalPrice ?? 0,
    discountPercent: speaker.discountPercent ?? 0,
    originalPrice: speaker.originalPrice ?? 0,
    fileId: speaker.fileId ?? null,
  };
};

const useSpeakerData = (speakerId: number) => {
  return useQuery({
    queryKey: ['speaker-detail', speakerId],
    queryFn: () =>
      SpeakersService.apiServicesAppSpeakersGetspeakerdetailbyidPost(speakerId),
    enabled: !!speakerId,
  });
};

const useSpeakerConfig = (
  speakerData: SpeakerDetailsViewOutput | null | undefined,
) => {
  const [speakerConfig, setSpeakerConfig] = useState<SpeakerConfig>({
    color: defaultColorValue,
  });

  useEffect(() => {
    const firstColor = speakerData?.availableColors?.[0];
    if (firstColor) {
      setSpeakerConfig({
        color: {
          id: firstColor.id ?? 0,
          name: firstColor.name ?? '',
          hexColor: firstColor.hexColor ?? '#000000',
        },
      });
    }
  }, [speakerData]);

  const handleColorChange = (color: SpeakerColor) => {
    setSpeakerConfig({ color });
  };

  return {
    selectedColor: speakerConfig.color,
    handleColorChange,
  };
};

interface SingleSmartSpeakerPageProps {
  speakerId?: number;
}

const SingleSmartSpeakerPage = ({
  speakerId = 1,
}: SingleSmartSpeakerPageProps) => {
  const { data: speakerData, isLoading, error } = useSpeakerData(speakerId);

  const { selectedColor, handleColorChange } = useSpeakerConfig(speakerData);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const device = useDevice();
  const router = useRouter();
  const token = getToken();

  const createOrder = useMutation({
    mutationFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardAddordertocardforuserPost(
          {
            speakerId,
            speakerColorId: selectedColor.id,
          },
        );
      return res;
    },
    onSuccess: res => {
      router.push('/payment/' + res);
    },
  });

  if (isLoading) {
    return <SpeakerPageSkeleton />;
  }

  if (error) {
    return (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl-regular text-error-400">
            خطا در بارگذاری اطلاعات. لطفا دوباره تلاش کنید.
          </p>
        </div>
      </ContentWrapper>
    );
  }

  if (!speakerData) {
    return (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl-regular text-textSecondary">اسپیکر پیدا نشد</p>
        </div>
      </ContentWrapper>
    );
  }

  const quantityInStorage = speakerData.quantityInStorage ?? 0;
  const isOutOfStock = quantityInStorage <= 0;

  const addOrder = () => {
    if (isOutOfStock) {
      return;
    }
    if (token) {
      createOrder.mutate();
    } else {
      toast.error('لطفا ابتدا وارد حساب کاربری خود شوید');
    }
  };

  const images = speakerData.images
    ? mapImagesToUrls(speakerData.images)
    : ['/images/speakerimage.png'];

  return (
    <ContentWrapper>
      <div className="flex flex-col">
        {/* Product Section */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12 md:mb-[96px] md:h-[594px]">
          <SpeakerImage
            alt={speakerData.title || ''}
            src={images[0] || '/images/speakerimage.png'}
            thumbnails={images}
          />
          <div className="flex flex-col w-full md:w-[617px] justify-between items-start gap-8 md:gap-0">
            <SpeakerHeader
              rating={speakerData.avgStars ?? 0}
              reviewCount={speakerData.countStars ?? 0}
              title={speakerData.title || ''}
            />

            <ColorSelection
              selectedColor={selectedColor}
              colors={(speakerData.availableColors || [])
                .map(mapColorToSpeakerColor)
                .filter(c => c.id !== 0 || c.name !== '')}
              onColorChange={handleColorChange}
            />

            <TopTechnicalDetails
              details={(speakerData.topTechnicalDetails || [])
                .map(mapTechnicalDetail)
                .filter((d): d is TechnicalDetail => d !== null)}
            />

            <SpeakerPriceDisplay
              currentPrice={speakerData.finalPrice ?? 0}
              discountPercent={speakerData.discountPercent ?? 0}
              originalPrice={speakerData.originalPrice ?? 0}
              quantityInStorage={quantityInStorage}
            />

            <Button
              className="w-full md:w-auto"
              disabled={createOrder.isPending || isOutOfStock}
              loading={createOrder.isPending}
              size="xxl"
              variant="primary"
              onClick={addOrder}
            >
              {isOutOfStock ? 'ناموجود' : 'خرید'}
            </Button>
          </div>
        </div>

        {/* Description Section */}
        <div className="flex flex-col gap-8 md:gap-16 py-12 md:py-[96px]">
          <p className="text-xl md:title-md-demibold text-gray-25">معرفی</p>
          <div>
            <p
              className={`text-xl-regular text-textSecondary ${
                device === 'mobile' && !isDescriptionExpanded
                  ? 'line-clamp-3'
                  : ''
              }`}
            >
              {speakerData.description || ''}
            </p>
            {device === 'mobile' && (
              <button
                className="text-primary-300 cursor-pointer flex items-center gap-2 hover:text-primary-400 transition-colors"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                <span>
                  {isDescriptionExpanded ? 'مشاهده کمتر' : 'مشاهده بیشتر'}
                </span>
                <ArrowLeftAuthIcon
                  className={`flex-1 text-primary-300 rotate-0 transition-transform ${
                    isDescriptionExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>

          <TechnicalDetails
            details={(speakerData.allTechnicalDetails || [])
              .map(mapTechnicalDetail)
              .filter((d): d is TechnicalDetail => d !== null)}
          />
        </div>

        {/* Comments Section */}
        <CommentsSection
          averageRating={speakerData.avgStars ?? 0}
          initialDisplayCount={4}
          pageSize={4}
          speakerId={speakerId}
          totalReviews={speakerData.countStars ?? 0}
        />

        {/* Similar Speakers */}
        <div className="my-12 md:my-[96px]">
          <SimilarSpeakers
            speakers={(speakerData.similarSpeakers || [])
              .map(mapSimilarSpeaker)
              .filter((s): s is SimilarSpeaker => s !== null)}
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default SingleSmartSpeakerPage;
