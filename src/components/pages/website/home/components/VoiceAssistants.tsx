import { AssistantsService } from "@/apis";
import type { PagedResultDtoOfGetAssistantDetailOutput } from "@/apis/models/PagedResultDtoOfGetAssistantDetailOutput";
import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionsHeader from "@/components/ui/headers/SectionsHeader";
import {
  UnderlineTabs,
  UnderlineTabsContent,
  UnderlineTabsList,
  UnderlineTabsTrigger,
} from "@/components/ui/tabs/underline";
import ReactQuery from "@/configs/react_query_keys";
import { CUSTOM_ASSISTANT_SORTING, CustomAssistantSorting } from "@/enums/enum";
import useDevice from "@/hooks/useDevice";
import { useQuery } from "@tanstack/react-query";
import { useId, useMemo, useState } from "react";
import DesktopVoiceAssistants from "./DesktopVoiceAssistants";
import MobileVoiceAssistants from "./MobileVoiceAssistants";
import {
  DEFAULT_SORTING_KEY,
  SortingTabKey,
  tabItems,
  VoiceAssistantItem,
} from "./type";

const VoiceAssistants = () => {
  const skeletonId = useId();
  const device = useDevice();
  const [sortByCategory, setSortCategory] = useState<CustomAssistantSorting>(
    CUSTOM_ASSISTANT_SORTING[DEFAULT_SORTING_KEY]
  );

  const selectedTab =
    tabItems.find(
      (tab) => CUSTOM_ASSISTANT_SORTING[tab.value] === sortByCategory
    )?.value ?? DEFAULT_SORTING_KEY;

  const currentTab = useMemo(() => {
    if (sortByCategory === CUSTOM_ASSISTANT_SORTING.TopSelling)
      return "topSelling";
    if (sortByCategory === CUSTOM_ASSISTANT_SORTING.Newest) return "newest";
    if (sortByCategory === CUSTOM_ASSISTANT_SORTING.Cheapest) return "special";
    return "topSelling";
  }, [sortByCategory]);

  const handleTabChange = (value: SortingTabKey) => {
    setSortCategory(CUSTOM_ASSISTANT_SORTING[value]);
  };

  const handleTabChangeFromFilter = (value: string) => {
    const tabMap: Record<string, SortingTabKey> = {
      topSelling: "TopSelling",
      newest: "Newest",
      special: "Cheapest",
    };
    const tabKey = tabMap[value] ?? "TopSelling";
    setSortCategory(CUSTOM_ASSISTANT_SORTING[tabKey]);
  };

  const { data, isLoading, error } =
    useQuery<PagedResultDtoOfGetAssistantDetailOutput>({
      queryKey: [ReactQuery.allAssistance, sortByCategory],
      queryFn: () => {
        return AssistantsService.apiServicesAppAssistantsGetallassistantsPost({
          maxResultCount: 6,
          skipCount: 0,
          sorting: null,
          customAssistantSortingType: sortByCategory,
          selectedCategoriesToFilter: [],
          selectedSubscriptionsToFilter: [],
          selectedLanguagesToFilter: [],
          priceRangeToFilter: {
            startPrice: 0.0,
            endPrice: 1000000000,
          },
        });
      },
    });

  const items: VoiceAssistantItem[] = (data?.items ?? []).filter(
    (item): item is VoiceAssistantItem => item !== null && item !== undefined
  );

  return (
    <ContentWrapper>
      <div className="flex flex-col gap-16 ">
        <SectionsHeader
          title="دستیاران صوتی"
          description="دستیارهای صوتی با شخصیت‌های متنوع و قابلیت‌های منحصربه‌فرد برای هر نوع کاربرد"
        />

        {device === "mobile" && (
          <Accordion type="single" collapsible className="flex  flex-col gap-4">
            <AccordionItem
              value="sort"
              className="border !border-b border-linePrimary rounded-[8px]  h-auto px-4 py-2.5"
            >
              <AccordionTrigger className="p-0 ">مرتب‌سازی</AccordionTrigger>
              <AccordionContent className="mt-4 h-auto">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleTabChangeFromFilter("topSelling")}
                    className={`w-full text-right px-2 py-1 rounded-[8px] transition-colors ${
                      currentTab === "topSelling"
                        ? " text-white"
                        : " text-linePrimary hover:bg-surfaceSecondary"
                    }`}
                  >
                    پرفروش ترین ها
                  </button>
                  <button
                    onClick={() => handleTabChangeFromFilter("newest")}
                    className={`w-full text-right px-2 py-1 rounded-[8px] transition-colors ${
                      currentTab === "newest"
                        ? " text-white"
                        : " text-linePrimary hover:bg-surfaceSecondary"
                    }`}
                  >
                    جدیدترین ها
                  </button>
                  <button
                    onClick={() => handleTabChangeFromFilter("special")}
                    className={`w-full text-right px-2 py-1 rounded-[8px] transition-colors ${
                      currentTab === "special"
                        ? " text-white"
                        : " text-linePrimary hover:bg-surfaceSecondary"
                    }`}
                  >
                    پیشنهادات ویژه
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <UnderlineTabs
          value={selectedTab}
          onValueChange={(value) => handleTabChange(value as SortingTabKey)}
        >
          {device === "desktop" && (
            <UnderlineTabsList>
              {tabItems.map((tab) => (
                <UnderlineTabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </UnderlineTabsTrigger>
              ))}
            </UnderlineTabsList>
          )}
          <UnderlineTabsContent value={selectedTab}>
            {device === "mobile" ? (
              <MobileVoiceAssistants
                isLoading={isLoading}
                items={items}
                skeletonId={skeletonId}
              />
            ) : (
              <DesktopVoiceAssistants
                isLoading={isLoading}
                items={items}
                skeletonId={skeletonId}
              />
            )}
          </UnderlineTabsContent>
        </UnderlineTabs>
      </div>
    </ContentWrapper>
  );
};

export default VoiceAssistants;
