"use client";

import { AssistantsService, CategoriesService, LanguageService } from "@/apis";
import { CustomAssistantSortingType } from "@/apis/models/CustomAssistantSortingType";
import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";
import VoiceCard from "@/components/ui/cards/voice-assistants/products-card";
import SectionsHeader from "@/components/ui/headers/SectionsHeader";
import { Pagination } from "@/components/ui/pagination/index";
import {
  UnderlineTabs,
  UnderlineTabsContent,
  UnderlineTabsList,
  UnderlineTabsTrigger,
} from "@/components/ui/tabs/underline";
import ReactQuery from "@/configs/react_query_keys";
import useDevice from "@/hooks/useDevice";
import { useQueryParams } from "@/hooks/useQueryParams";
import getFileUrl from "@/utils/getFileUrl";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useState } from "react";
import CardSkeleton from "../../../../ui/cards/CardSkeleton";
import Filter from "./components/Filter";

const ProductListPage = () => {
  const skeletonId = useId();
  const { getAllParams, setParams, clearParams } = useQueryParams();

  const [sortingType, setSortingType] = useState<CustomAssistantSortingType>(
    CustomAssistantSortingType._1
  );
  const device = useDevice();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const selectedCategories = useMemo(() => {
    return getAllParams("categories")
      .map(Number)
      .filter((id) => !isNaN(id));
  }, [getAllParams]);

  const selectedSubscriptions = useMemo(() => {
    return getAllParams("subscriptions")
      .map(Number)
      .filter((id) => !isNaN(id));
  }, [getAllParams]);

  const selectedLanguages = useMemo(() => {
    return getAllParams("languages")
      .map(Number)
      .filter((id) => !isNaN(id));
  }, [getAllParams]);

  const priceRange = useMemo(() => {
    const min = getAllParams("minPrice")[0];
    const max = getAllParams("maxPrice")[0];
    return [min ? Number(min) : 0, max ? Number(max) : 1000000000];
  }, [getAllParams]);

  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const queriesResult = useQueries({
    queries: [
      {
        queryKey: [ReactQuery.allAssistanceCategories],
        queryFn: () =>
          CategoriesService.apiServicesAppCategoriesGetallassistantcategoriesGet(),
      },
      {
        queryKey: [ReactQuery.allLanguages],
        queryFn: () =>
          LanguageService.apiServicesAppLanguageAppgetlanguagesGet(),
      },
    ],
  });

  const categories = queriesResult[0]?.data ?? [];
  const languages = queriesResult[1]?.data ?? [];

  const {
    data: assistantsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      ReactQuery.allAssistance,
      selectedCategories,
      selectedSubscriptions,
      selectedLanguages,
      priceRange,
      sortingType,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      AssistantsService.apiServicesAppAssistantsGetallassistantsPost({
        maxResultCount: pageSize,
        skipCount: (currentPage - 1) * pageSize,
        sorting: null,
        customAssistantSortingType: sortingType,
        selectedCategoriesToFilter:
          selectedCategories.length > 0 ? selectedCategories : null,
        selectedSubscriptionsToFilter:
          selectedSubscriptions.length > 0 ? selectedSubscriptions : null,
        selectedLanguagesToFilter:
          selectedLanguages.length > 0 ? selectedLanguages : null,
        priceRangeToFilter: {
          startPrice: priceRange[0],
          endPrice: priceRange[1],
        },
      }),
  });

  const handleCategoryToggle = (categoryId: number, checked: boolean) => {
    const current = selectedCategories;
    const updated = checked
      ? [...current, categoryId]
      : current.filter((id) => id !== categoryId);
    setParams({ categories: updated });
  };

  const handleSubscriptionToggle = (
    subscriptionId: number,
    checked: boolean
  ) => {
    const current = selectedSubscriptions;
    const updated = checked
      ? [...current, subscriptionId]
      : current.filter((id) => id !== subscriptionId);
    setParams({ subscriptions: updated });
  };

  const handleLanguageToggle = (languageId: number, checked: boolean) => {
    const current = selectedLanguages;
    const updated = checked
      ? [...current, languageId]
      : current.filter((id) => id !== languageId);
    setParams({ languages: updated });
  };

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
  };

  const handlePriceCommit = (values: number[]) => {
    setParams({
      minPrice: values[0] > 0 ? String(values[0]) : null,
      maxPrice: values[1] < 1000000000 ? String(values[1]) : null,
    });
  };

  const handleClearFilters = () => {
    clearParams();
    setLocalPriceRange([0, 1000000000]);
  };

  const handleTabChange = (value: string) => {
    const tabMap: Record<string, CustomAssistantSortingType> = {
      topSelling: CustomAssistantSortingType._1,
      newest: CustomAssistantSortingType._3,
      special: CustomAssistantSortingType._2,
    };
    setSortingType(tabMap[value] ?? CustomAssistantSortingType._1);
  };

  const currentTab = useMemo(() => {
    if (sortingType === CustomAssistantSortingType._1) return "topSelling";
    if (sortingType === CustomAssistantSortingType._3) return "newest";
    return "special";
  }, [sortingType]);

  const assistants = assistantsData?.items ?? [];
  const totalCount = assistantsData?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories,
    selectedSubscriptions,
    selectedLanguages,
    priceRange,
    sortingType,
  ]);

  return (
    <ContentWrapper>
      <div className="flex flex-col gap-16">
        <SectionsHeader
          title="دستیاران صوتی"
          description="دستیارهای صوتی با شخصیت‌های متنوع و قابلیت‌های منحصربه‌فرد برای هر نوع کاربرد"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-8">
          <Filter
            categories={categories}
            languages={languages}
            selectedCategories={selectedCategories}
            selectedSubscriptions={selectedSubscriptions}
            selectedLanguages={selectedLanguages}
            localPriceRange={localPriceRange}
            currentTab={currentTab}
            onCategoryToggle={handleCategoryToggle}
            onSubscriptionToggle={handleSubscriptionToggle}
            onLanguageToggle={handleLanguageToggle}
            onPriceChange={handlePriceChange}
            onPriceCommit={handlePriceCommit}
            onClearFilters={handleClearFilters}
            onTabChange={handleTabChange}
          />
          <div className="col-span-3">
            <UnderlineTabs value={currentTab} onValueChange={handleTabChange}>
              {device === "desktop" && (
                <UnderlineTabsList>
                  <UnderlineTabsTrigger value="topSelling">
                    پرفروش ترین ها
                  </UnderlineTabsTrigger>
                  <UnderlineTabsTrigger value="newest">
                    جدیدترین ها
                  </UnderlineTabsTrigger>
                  <UnderlineTabsTrigger value="special">
                    پیشنهادات ویژه
                  </UnderlineTabsTrigger>
                </UnderlineTabsList>
              )}
              <UnderlineTabsContent value={currentTab}>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-10 w-full">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <CardSkeleton key={`${skeletonId}-${index}`} />
                    ))
                  ) : error ? (
                    <p className="col-span-2 text-center text-textSecondary">
                      خطا در بارگذاری دستیاران صوتی. لطفا دوباره تلاش کنید.
                    </p>
                  ) : assistants.length > 0 ? (
                    assistants.map((item) => {
                      const imageUrl = getFileUrl(item?.thumbnail);
                      return (
                        <VoiceCard
                          key={item.id}
                          id={item.id || "/"}
                          imageSrc={imageUrl || "/images/product1.png"}
                          languageTags={item.languages ?? []}
                          category={item?.category?.title ?? ""}
                          title={item.title ?? ""}
                          subscriptionType={""}
                          ratingValue={String(item.stars ?? 0)}
                          badges={item.tones ?? []}
                          description={item.description ?? ""}
                          currentPrice={String(item.finalPrice ?? 0)}
                          currency="تومان"
                          originalPrice={String(
                            item.originalPrice ?? item.finalPrice ?? 0
                          )}
                          discountPercent={Number(item.discountPercent ?? 0)}
                        />
                      );
                    })
                  ) : (
                    <p>موردی یافت نشد</p>
                  )}
                </div>
              </UnderlineTabsContent>
            </UnderlineTabs>
            {!isLoading && assistants.length > 0 && totalCount > 0 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={totalCount}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ProductListPage;
