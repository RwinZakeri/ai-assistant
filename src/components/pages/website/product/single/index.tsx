'use client';

import { UserDashboardService } from '@/apis';
import { AssistantsService } from '@/apis/services/AssistantsService';
import { ArrowRightIcon } from '@/assets/images/svg/ArrowRight';
import ContentWrapper from '@/components/layouts/wrappers/ContentWrapper';
import { Button } from '@/components/ui/button';
import CommentsSection from '@/components/ui/cards/comments/CommentsSection';
import VoiceCarouselCard from '@/components/ui/cards/voice-assistants/carousel-card';
import VoiceCard from '@/components/ui/cards/voice-assistants/products-card';
import useDevice from '@/hooks/useDevice';
import { getToken } from '@/utils/cookies';
import getFileUrl, { mapImagesToUrls } from '@/utils/getFileUrl';
import ToPersainNumber from '@/utils/toPersainNumber';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductConfiguration from './components/ProductConfiguration';
import ProductHeader from './components/ProductHeader';
import ProductImage from './components/ProductImage';
import ProductPageSkeleton from './components/ProductPageSkeleton';
import type { ProductConfig } from './type';

const useProductData = (productId: number) => {
  return useQuery({
    queryKey: ['product-detail', productId],
    queryFn: () =>
      AssistantsService.apiServicesAppAssistantsGetassistantdetailbyidPost(
        productId,
      ),
    enabled: !!productId,
  });
};

const SingleProductPage = ({ productId }: { productId: number }) => {
  const { data: productData, isLoading, error } = useProductData(productId);
  const device = useDevice();
  const token = getToken();
  const [productConfig, setProductConfig] = useState<ProductConfig>({
    language: 0,
    voice: 0,
    duration: 0,
  });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (productData) {
      const firstLanguage = productData?.supportingLanguages?.[0]?.id;
      const firstTone = productData?.supportingTones?.[0]?.id;
      const firstDuration = productData?.subscriptionDurations?.[0]?.id;

      setProductConfig({
        language: firstLanguage || 0,
        voice: firstTone || 0,
        duration: firstDuration || 0,
      });
    }
  }, [productData]);

  const handleConfigChange = useCallback(
    (key: keyof ProductConfig) => (value: number) => {
      setProductConfig(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  useEffect(() => {
    console.log('Product configuration changed:', productConfig);
  }, [productConfig]);

  const { mutate: addOrder } = useMutation({
    mutationKey: ['create-assistant-order'],
    mutationFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardAddordertocardforuserPost(
          {
            assistantId: productId,
            languageId: productConfig.language,
            subscriptionId: productConfig.duration,
            assistantDetailToneId: productConfig.voice,
          },
        );
      return res;
    },
    onSuccess: res => {
      router.push('/payment/' + res + '?orderType=assistant');
    },
    onError: () => {
      toast.error('خطا در ایجاد سفارش. لطفاً دوباره تلاش کنید.');
    },
  });

  const orderHandler = () => {
    if (token) {
      addOrder();
    } else {
      toast.error('لطفا ابتدا وارد حساب کاربری خود شوید');
    }
  };

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  const images = mapImagesToUrls(productData?.images ?? []);
  const mainImage = images[0] || '/images/product1.png';
  const selectedDuration = productData?.subscriptionDurations?.find(
    d => d?.id === productConfig.duration,
  );

  return (
    <ContentWrapper>
      <div className="flex flex-col gap-28 md:gap-[192px]">
        <div className="flex flex-col md:flex-row gap-16 h-auto md:h-[506px]">
          <ProductImage alt={productData?.title || ''} src={mainImage} />
          <div className="flex flex-col justify-between">
            <ProductHeader
              category={productData?.category?.title || ''}
              rating={productData?.avgStars ?? 0}
              reviewCount={productData?.countStars ?? 0}
              title={productData?.title || ''}
            />
            <ProductConfiguration
              currentPrice={selectedDuration?.finalPrice ?? 0}
              discountPercentage={selectedDuration?.discountPercent ?? 0}
              duration={productConfig.duration}
              language={productConfig.language}
              originalPrice={selectedDuration?.price ?? 0}
              voice={productConfig.voice}
              durationOptions={
                productData?.subscriptionDurations?.map(dur => ({
                  label: dur?.title || '',
                  value: dur?.id || 0,
                })) || []
              }
              languageOptions={
                productData?.supportingLanguages?.map(lang => ({
                  label: lang?.title || '',
                  value: lang?.id || 0,
                })) || []
              }
              voiceOptions={
                productData?.supportingTones?.map(tone => ({
                  label: tone?.title || '',
                  value: tone?.id || 0,
                })) || []
              }
              onDurationChange={handleConfigChange('duration')}
              onLanguageChange={handleConfigChange('language')}
              onVoiceChange={handleConfigChange('voice')}
            />
            <div className="flex flex-col md:flex-row gap-4">
              <Button size="xxl" variant="primary" onClick={orderHandler}>
                خرید
              </Button>
              <Button size="xxl" variant="tertiaryColor">
                تست رایگان
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-16">
          <p className="title-md-demibold text-gray-25">معرفی</p>
          <div>
            <p
              className={`text-xl-regular text-textSecondary ${
                device === 'mobile' && !isDescriptionExpanded
                  ? 'line-clamp-3'
                  : ''
              }`}
            >
              {productData?.description}
            </p>
            {device === 'mobile' && (
              <button
                className="text-primary-300 cursor-pointer flex items-center gap-2 hover:text-primary-400 transition-colors"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                <span>
                  {isDescriptionExpanded ? 'مشاهده کمتر' : 'مشاهده بیشتر'}
                </span>
                <ArrowRightIcon
                  className={`flex-1 text-purple-300 rotate-180 transition-transform ${
                    isDescriptionExpanded ? 'rotate-0' : ''
                  }`}
                />
              </button>
            )}
          </div>
        </div>
        <CommentsSection
          assistantId={productId}
          assistantName={productData?.title || ''}
          averageRating={productData?.avgStars ?? 0}
          initialDisplayCount={4}
          pageSize={4}
          totalReviews={productData?.countStars ?? 0}
        />
        <div className="flex flex-col gap-16">
          <p className="title-md-demibold text-gray-25 text-center md:text-right">
            دستیار های مشابه
          </p>
          {!productData?.similarAssistants ||
          productData?.similarAssistants?.length === 0 ? (
            <p className="text-center text-textSecondary">
              دستیار مشابهی یافت نشد.
            </p>
          ) : device === 'mobile' ? (
            <div className="w-full relative overflow-visible">
              <Swiper
                allowTouchMove
                loop
                resistance
                className="h-[600px] !overflow-visible w-full [&_.swiper-pagination]:!-bottom-[45px] [&_.swiper-pagination]:!left-1/2 [&_.swiper-pagination]:!-translate-x-1/2 [&_.swiper-pagination]:!w-auto [&_.swiper-pagination]:!flex [&_.swiper-pagination]:!gap-2 [&_.swiper-pagination]:!bg-[#1B1B1B]/50 [&_.swiper-pagination]:!px-4 [&_.swiper-pagination]:!py-2 [&_.swiper-pagination]:!rounded-full [&_.swiper-pagination-bullet]:!bg-[#353535] [&_.swiper-pagination-bullet]:!opacity-100 [&_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination-bullet]:!h-2 [&_.swiper-pagination-bullet]:!rounded-full [&_.swiper-pagination-bullet]:!transition-all [&_.swiper-pagination-bullet]:!duration-300 [&_.swiper-pagination-bullet-active]:!bg-gray-300 [&_.swiper-pagination-bullet-active]:!opacity-100 [&_.swiper-pagination-bullet-active]:!w-8"
                direction="horizontal"
                modules={[Autoplay, Pagination]}
                resistanceRatio={0.85}
                slidesPerView={1.2}
                spaceBetween={16}
                threshold={10}
                touchEventsTarget="container"
                touchRatio={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{
                  clickable: true,
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                  bulletClass: 'swiper-pagination-bullet',
                }}
              >
                {productData?.similarAssistants?.map(assistant => (
                  <SwiperSlide key={assistant?.id}>
                    <VoiceCarouselCard
                      key={assistant?.id}
                      badges={assistant?.tones || []}
                      category={assistant?.category?.title || ''}
                      currency="تومان"
                      description={assistant?.description || ''}
                      discountPercent={assistant?.discountPercent || 0}
                      languageTags={assistant?.languages || []}
                      ratingValue={assistant?.stars?.toString() || '0'}
                      title={assistant?.title || ''}
                      currentPrice={
                        assistant?.finalPrice
                          ? new Intl.NumberFormat('fa-IR').format(
                              assistant.finalPrice,
                            )
                          : '0'
                      }
                      imageSrc={
                        assistant?.thumbnail
                          ? getFileUrl(assistant.thumbnail) ||
                            '/images/product1.png'
                          : '/images/product1.png'
                      }
                      originalPrice={
                        assistant?.originalPrice
                          ? new Intl.NumberFormat('fa-IR').format(
                              assistant.originalPrice,
                            )
                          : '0'
                      }
                      subscriptionType={
                        assistant?.subscriptionType !== undefined
                          ? assistant.subscriptionType.toString()
                          : 'پیشرفته'
                      }
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-12">
              {productData?.similarAssistants?.map(assistant => (
                <VoiceCard
                  key={assistant?.id}
                  badges={assistant?.tones || []}
                  category={assistant?.category?.title || ''}
                  currency="تومان"
                  currentPrice={ToPersainNumber(assistant?.finalPrice)}
                  description={assistant?.description || ''}
                  discountPercent={assistant?.discountPercent || 0}
                  id={assistant?.id ?? 0}
                  languageTags={assistant?.languages || []}
                  originalPrice={ToPersainNumber(assistant?.originalPrice)}
                  ratingValue={assistant?.stars?.toString() || '0'}
                  title={assistant?.title || ''}
                  imageSrc={
                    assistant?.thumbnail
                      ? getFileUrl(assistant.thumbnail) ||
                        '/images/product1.png'
                      : '/images/product1.png'
                  }
                  subscriptionType={
                    assistant?.subscriptionType !== undefined
                      ? assistant.subscriptionType.toString()
                      : 'پیشرفته'
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default SingleProductPage;
