export interface ProductConfig {
  language: number;
  voice: number;
  duration: number;
}

export interface ProductData {
  category: string;
  title: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  currentPrice: number;
  discountPercentage: number;
  imageUrl: string;
  description: string;
}
