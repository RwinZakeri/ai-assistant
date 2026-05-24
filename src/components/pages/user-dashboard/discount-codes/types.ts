export interface DiscountCode {
  id: string;
  code: string;
  percentage: number;
  voiceAssistants: string[];
  devices: string[];
  expirationDate: string;
  minimumPurchaseAmount?: number;
  usageCount?: number;
  creationDate?: string;
  rowNumber?: number;
}

export interface DiscountCodeFormData {
  code: string;
  percentage: number;
  voiceAssistants: string[];
  devices: string[];
  startDate: string | null;
  endDate: string | null;
  creationDate?: string;
}
