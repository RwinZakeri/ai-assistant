import { AppGetLanguagesOutput } from "@/apis/models/AppGetLanguagesOutput";
import { GetAllAssistantCategoriesOutput } from "@/apis/models/GetAllAssistantCategoriesOutput";

export interface FilterProps {
  categories: GetAllAssistantCategoriesOutput[];
  languages: AppGetLanguagesOutput[];
  selectedCategories: number[];
  selectedSubscriptions: number[];
  selectedLanguages: number[];
  localPriceRange: number[];
  currentTab: string;
  onCategoryToggle: (categoryId: number, checked: boolean) => void;
  onSubscriptionToggle: (subscriptionId: number, checked: boolean) => void;
  onLanguageToggle: (languageId: number, checked: boolean) => void;
  onPriceChange: (values: number[]) => void;
  onPriceCommit: (values: number[]) => void;
  onClearFilters: () => void;
  onTabChange: (value: string) => void;
}
