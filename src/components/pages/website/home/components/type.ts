import type { GetAssistantDetailOutput } from "@/apis/models/GetAssistantDetailOutput";
import { CUSTOM_ASSISTANT_SORTING } from "@/enums/enum";

export type SortingTabKey = keyof typeof CUSTOM_ASSISTANT_SORTING;

export type TabItem = {
  label: string;
  value: SortingTabKey;
};

export const DEFAULT_SORTING_KEY: SortingTabKey = "TopSelling";

export const tabItems: TabItem[] = [
  {
    label: "پرفروش ترین ها",
    value: DEFAULT_SORTING_KEY,
  },
  {
    label: "جدیدترین ها",
    value: "Newest",
  },
  {
    label: "پیشنهادات ویژه",
    value: "Cheapest",
  },
];

export type VoiceAssistantItem = GetAssistantDetailOutput;

export type FeatureSlideProps = {
  imageSrc: string;
  imageAlt: string;
  title?: string;
  description?: string;
  showOverlay?: boolean;
};

export const Brands = [
  { src: "/images/ghalamchi.png", alt: "brand1", width: 70, height: 70 },
  { src: "/images/image18.png", alt: "brand2", width: 173, height: 47 },
  { src: "/images/image11.png", alt: "brand3", width: 133, height: 49 },
  { src: "/images/image8.png", alt: "brand4", width: 131, height: 66 },
  { src: "/images/image9.png", alt: "brand5", width: 151, height: 31 },
  { src: "/images/image17.png", alt: "brand6", width: 140, height: 50 },
  { src: "/images/gaj.png", alt: "brand7", width: 49, height: 70 },
  { src: "/images/image13.png", alt: "brand8", width: 68, height: 68 },
];

export const featureSlides: FeatureSlideProps[] = [
  {
    imageSrc: "/video/featcher.webp",
    imageAlt: "Feature demonstration",
    title: "تعامل به زبان فارسی و محاوره‌ای",
    description: "توانایی برقراری ارتباط طبیعی و درک زبان محاوره‌ای تجربه‌ای راحت و کاربرپسند را برای شما به ارمغان می‌آورد.",
  },
  {
    imageSrc: "/video/featcher.webp",
    imageAlt: "Feature demonstration",
    title: "دستیار تخصصی در تمامی حوزه‌ها",
    description: "با داشتن پروفایل‌های متنوع، دستیار صوتی آریو پاسخ‌های دقیق و تخصصی در زمینه‌های گوناگون ارائه می‌دهد.",
  },
  {
    imageSrc: "/video/featcher.webp",
    imageAlt: "Feature demonstration",
    title: "دستیار تخصصی در تمامی حوزه‌ها",
    description: "با داشتن پروفایل‌های متنوع، دستیار صوتی آریو پاسخ‌های دقیق و تخصصی در زمینه‌های گوناگون ارائه می‌دهد.",
  },
  {
    imageSrc: "/video/featcher.webp",
    imageAlt: "Feature demonstration",
    title: "دستیار تخصصی در تمامی حوزه‌ها",
    description: "با داشتن پروفایل‌های متنوع، دستیار صوتی آریو پاسخ‌های دقیق و تخصصی در زمینه‌های گوناگون ارائه می‌دهد.",
  },
  {
    imageSrc: "/video/featcher.webp",
    imageAlt: "Feature demonstration",
    title: "دستیار تخصصی در تمامی حوزه‌ها",
    description: "با داشتن پروفایل‌های متنوع، دستیار صوتی آریو پاسخ‌های دقیق و تخصصی در زمینه‌های گوناگون ارائه می‌دهد.",
  },
  {
    imageSrc: "/video/featcher.webp",
    imageAlt: "Feature demonstration",
    title: "دستیار تخصصی در تمامی حوزه‌ها",
    description: "با داشتن پروفایل‌های متنوع، دستیار صوتی آریو پاسخ‌های دقیق و تخصصی در زمینه‌های گوناگون ارائه می‌دهد.",
  },
];
