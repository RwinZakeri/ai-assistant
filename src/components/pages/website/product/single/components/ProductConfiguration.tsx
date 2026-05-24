import WithBorderTabs from '@/components/ui/tabs/with-border';
import PriceDisplay from './PriceDisplay';

const ProductConfiguration = ({
  currentPrice,
  originalPrice,
  discountPercentage,
  language,
  voice,
  duration,
  languageOptions,
  voiceOptions,
  durationOptions,
  onLanguageChange,
  onVoiceChange,
  onDurationChange,
}: {
  language: number;
  voice: number;
  duration: number;
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
  languageOptions: Array<{ label: string; value: number }>;
  voiceOptions: Array<{ label: string; value: number }>;
  durationOptions: Array<{ label: string; value: number }>;
  onLanguageChange: (value: number) => void;
  onVoiceChange: (value: number) => void;
  onDurationChange: (value: number) => void;
}) => (
  <div className="flex flex-col gap-6 mt-8 md:mt-0">
    <div className="flex gap-6 flex-col md:flex-row">
      <WithBorderTabs
        activeTab={language}
        label="زبان"
        setActiveTab={onLanguageChange}
        tabs={languageOptions}
      />
      <WithBorderTabs
        activeTab={voice}
        label="لحن"
        setActiveTab={onVoiceChange}
        tabs={voiceOptions}
      />
    </div>
    <div className="flex flex-col md:flex-row  gap-4 md:gap-20">
      <WithBorderTabs
        activeTab={duration}
        label="مدت زمان اشتراک"
        setActiveTab={onDurationChange}
        tabs={durationOptions}
      />
      <PriceDisplay
        currentPrice={currentPrice}
        discountPercentage={discountPercentage}
        originalPrice={originalPrice}
      />
    </div>
  </div>
);

export default ProductConfiguration;
