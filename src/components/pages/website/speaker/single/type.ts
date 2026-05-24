export interface SpeakerColor {
  id: number;
  name: string;
  hexColor: string;
}

export interface TechnicalDetail {
  title: string;
  value: string;
}

export interface SimilarSpeaker {
  id: number;
  title: string;
  quantityInStorage: number;
  stars: number;
  finalPrice: number;
  discountPercent: number;
  originalPrice: number;
  fileId?: string | null;
}

export interface SpeakerData {
  id: number;
  title: string;
  deviceModel: string;
  avgStars: number;
  countStars: number;
  images: string[];
  availableColors: SpeakerColor[];
  topTechnicalDetails: TechnicalDetail[];
  quantityInStorage: number;
  finalPrice: number;
  discountPercent: number;
  originalPrice: number;
  description: string;
  allTechnicalDetails: TechnicalDetail[];
  similarSpeakers: SimilarSpeaker[];
}

export interface SpeakerConfig {
  color: SpeakerColor;
}
