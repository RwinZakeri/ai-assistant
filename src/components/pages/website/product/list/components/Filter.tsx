"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SubscribtionType_enum } from "@/enums/enum";
import useDevice from "@/hooks/useDevice";
import { FilterProps } from "./type";

const Filter = ({
  categories,
  languages,
  selectedCategories,
  selectedSubscriptions,
  selectedLanguages,
  localPriceRange,
  currentTab,
  onCategoryToggle,
  onSubscriptionToggle,
  onLanguageToggle,
  onPriceChange,
  onPriceCommit,
  onClearFilters,
  onTabChange,
}: FilterProps) => {
  const device = useDevice();

  return device === "mobile" ? (
    <Accordion
      className="bg-surfacePrimary rounded-[16px] mb-4"
      type="single"
      collapsible
    >
      <AccordionItem className="py-0" value="filters">
        <AccordionTrigger className="px-6 pt-6">فیلترها</AccordionTrigger>
        <AccordionContent className=" px-6 pb-6 ">
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            <AccordionItem
              value="sort"
              className="border border-linePrimary rounded-[8px]  h-auto px-4 py-2.5"
            >
              <AccordionTrigger className="p-0">مرتب‌سازی</AccordionTrigger>
              <AccordionContent className="mt-4 h-auto">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => onTabChange("topSelling")}
                    className={`w-full text-right px-2 py-1 rounded-[8px] transition-colors ${
                      currentTab === "topSelling"
                        ? " text-white"
                        : " text-linePrimary hover:bg-surfaceSecondary"
                    }`}
                  >
                    پرفروش ترین ها
                  </button>
                  <button
                    onClick={() => onTabChange("newest")}
                    className={`w-full text-right px-2 py-1 rounded-[8px] transition-colors ${
                      currentTab === "newest"
                        ? " text-white"
                        : " text-linePrimary hover:bg-surfaceSecondary"
                    }`}
                  >
                    جدیدترین ها
                  </button>
                  <button
                    onClick={() => onTabChange("special")}
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
            <AccordionItem
              value="categories"
              className="border border-linePrimary rounded-[8px] px-4 py-2.5"
            >
              <AccordionTrigger className="p-0">دسته بندی</AccordionTrigger>
              <AccordionContent className="mt-4">
                <div className="flex flex-col gap-3">
                  {categories.map((item) => {
                    const categoryId = item.category?.id;
                    if (!categoryId) return null;
                    return (
                      <Checkbox
                        key={categoryId}
                        checked={selectedCategories.includes(categoryId)}
                        onCheckedChange={(checked) =>
                          onCategoryToggle(categoryId, checked === true)
                        }
                        label={item.category?.title || ""}
                      />
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="subscriptions"
              className="border border-linePrimary rounded-[8px] px-4 py-2.5"
            >
              <AccordionTrigger className="p-0">نوع اشتراک</AccordionTrigger>
              <AccordionContent className="mt-4">
                <div className="flex flex-col gap-3">
                  <Checkbox
                    checked={selectedSubscriptions.includes(
                      SubscribtionType_enum.TimeBased
                    )}
                    onCheckedChange={(checked) =>
                      onSubscriptionToggle(
                        SubscribtionType_enum.TimeBased,
                        checked === true
                      )
                    }
                    label="اشتراک زمانی"
                  />
                  <Checkbox
                    checked={selectedSubscriptions.includes(
                      SubscribtionType_enum.PayToUse
                    )}
                    onCheckedChange={(checked) =>
                      onSubscriptionToggle(
                        SubscribtionType_enum.PayToUse,
                        checked === true
                      )
                    }
                    label="پرداخت به ازای مصرف"
                  />
                  <Checkbox
                    checked={selectedSubscriptions.includes(
                      SubscribtionType_enum.Free
                    )}
                    onCheckedChange={(checked) =>
                      onSubscriptionToggle(
                        SubscribtionType_enum.Free,
                        checked === true
                      )
                    }
                    label="اشتراک رایگان"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="languages"
              className="border border-linePrimary rounded-[8px] px-4 py-2.5"
            >
              <AccordionTrigger className="p-0">زبان</AccordionTrigger>
              <AccordionContent className="mt-4">
                <div className="flex flex-col gap-3">
                  {languages.map((item) => {
                    const languageId = item.id;
                    if (!languageId) return null;
                    return (
                      <Checkbox
                        key={languageId}
                        checked={selectedLanguages.includes(languageId)}
                        onCheckedChange={(checked) =>
                          onLanguageToggle(languageId, checked === true)
                        }
                        label={item.displayName || ""}
                      />
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="price"
              className="border border-linePrimary rounded-[8px] !border-b px-4 py-2.5"
            >
              <AccordionTrigger className="p-0">قیمت</AccordionTrigger>
              <AccordionContent className="mt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-6 items-center justify-center">
                    <div className="bg-surfaceTertiary px-3 py-2 rounded-[8px]">
                      <p className="text-textTertiary text-xs-demibold">
                        {localPriceRange[1].toLocaleString()} تومان
                      </p>
                    </div>
                    <div className="bg-surfaceTertiary px-3 py-2 rounded-[8px]">
                      <p className="text-textTertiary text-xs-demibold">
                        {localPriceRange[0].toLocaleString()} تومان
                      </p>
                    </div>
                  </div>
                  <Slider
                    value={localPriceRange}
                    max={1000000000}
                    step={10000}
                    onValueChange={onPriceChange}
                    onValueCommit={onPriceCommit}
                    className="w-[100%] mt-2"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : (
    <div className="col-span-1 bg-surfacePrimary p-6 rounded-[16px] h-fit">
      <div className="flex justify-between items-center">
        <h3 className="text-textTertiary text-xl-demibold">فیلترها</h3>
        <Button
          size={"sm"}
          variant={"linkColor"}
          className="text-primary-300"
          onClick={onClearFilters}
        >
          حذف فیلترها
        </Button>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="categories">
          <AccordionTrigger>دسته بندی</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              {categories.map((item) => {
                const categoryId = item.category?.id;
                if (!categoryId) return null;
                return (
                  <Checkbox
                    key={categoryId}
                    checked={selectedCategories.includes(categoryId)}
                    onCheckedChange={(checked) =>
                      onCategoryToggle(categoryId, checked === true)
                    }
                    label={item.category?.title || ""}
                  />
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="subscriptions">
          <AccordionTrigger>نوع اشتراک</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              <Checkbox
                checked={selectedSubscriptions.includes(
                  SubscribtionType_enum.TimeBased
                )}
                onCheckedChange={(checked) =>
                  onSubscriptionToggle(
                    SubscribtionType_enum.TimeBased,
                    checked === true
                  )
                }
                label="اشتراک زمانی"
              />
              <Checkbox
                checked={selectedSubscriptions.includes(
                  SubscribtionType_enum.PayToUse
                )}
                onCheckedChange={(checked) =>
                  onSubscriptionToggle(
                    SubscribtionType_enum.PayToUse,
                    checked === true
                  )
                }
                label="پرداخت به ازای مصرف"
              />
              <Checkbox
                checked={selectedSubscriptions.includes(
                  SubscribtionType_enum.Free
                )}
                onCheckedChange={(checked) =>
                  onSubscriptionToggle(
                    SubscribtionType_enum.Free,
                    checked === true
                  )
                }
                label="اشتراک رایگان"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="languages">
          <AccordionTrigger>زبان</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              {languages.map((item) => {
                const languageId = item.id;
                if (!languageId) return null;
                return (
                  <Checkbox
                    key={languageId}
                    checked={selectedLanguages.includes(languageId)}
                    onCheckedChange={(checked) =>
                      onLanguageToggle(languageId, checked === true)
                    }
                    label={item.displayName || ""}
                  />
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>قیمت</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-6 items-center justify-center">
                <div className="bg-surfaceTertiary px-3 py-2 rounded-[8px]">
                  <p className="text-textTertiary text-xs-demibold">
                    {localPriceRange[1].toLocaleString()} تومان
                  </p>
                </div>
                <div className="bg-surfaceTertiary px-3 py-2 rounded-[8px]">
                  <p className="text-textTertiary text-xs-demibold">
                    {localPriceRange[0].toLocaleString()} تومان
                  </p>
                </div>
              </div>
              <Slider
                value={localPriceRange}
                max={1000000000}
                step={10000}
                onValueChange={onPriceChange}
                onValueCommit={onPriceCommit}
                className="w-[100%] mt-2"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;
