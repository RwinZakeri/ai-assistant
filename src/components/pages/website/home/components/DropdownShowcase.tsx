"use client";

import React, { useState } from "react";
import { DropdownInput } from "@/components/ui/input/dropdown-input";
import { Tag } from "@/components/ui/tag";

const sampleOptions = [
  { value: "phoenix", label: "Phoenix Baker" },
  { value: "olivia", label: "Olivia Rhye" },
  { value: "lana", label: "Lana Steiner" },
  { value: "demi", label: "Demi Wilkinson" },
  { value: "candice", label: "Candice Wu" },
  { value: "natali", label: "Natali Craig" },
  { value: "drew", label: "Drew Cano" },
  { value: "drew3", label: "Drew Cano" },
  { value: "dre4w", label: "Drew Cano" },
  { value: "dre5w", label: "Drew Cano" },
];

const productOptions = [
  { value: "ph3oenix", label: "Phoenix Baker" },
  { value: "ol4ivia", label: "Olivia Rhye" },
  { value: "lan4a", label: "Lana Steiner" },
  { value: "dem5i", label: "Demi Wilkinson" },
  { value: "cand4ice", label: "Candice Wu" },
  { value: "nat5ali", label: "Natali Craig" },
  { value: "dre3w", label: "Drew Cano" },
];

const categoryOptions = [
  { value: "electronics", label: "دستیار پزشک" },
  { value: "smart-home", label: "دستیار زبان" },
  { value: "audio", label: "صوتی" },
  { value: "gadgets", label: "گجت‌ها" },
  { value: "accessories", label: "لوازم جانبی" },
  { value: "accessories2", label: "لوازم جانبی" },
  { value: "accessorisdes2", label: "لواsزم جانبی" },
  { value: "accessorisdessd3", label: "لوازsdم جانبی" },
];

export default function DropdownShowcase() {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            نمونه کامپوننت‌های Dropdown
          </h2>
          <p className="text-lg text-muted-foreground">
            سه نوع مختلف از کامپوننت‌های انتخاب برای نیازهای مختلف
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Default Type */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              انتخاب ساده
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              برای انتخاب یک مورد از لیست گزینه‌ها
            </p>
            <DropdownInput
              type="default"
              label="انتخاب کاربر"
              placeholder="کاربر را انتخاب کنید"
              helperText="یکی از کاربران موجود را انتخاب کنید"
              options={sampleOptions}
              className="w-80"
              value={selectedUser}
              onValueChange={(value) => setSelectedUser(value as string)}
            />
            {selectedUser && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  کاربر انتخاب شده:{" "}
                  {
                    sampleOptions.find((opt) => opt.value === selectedUser)
                      ?.label
                  }
                </p>
              </div>
            )}
          </div>

          {/* Search Type */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              جستجو و انتخاب
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              برای جستجو و فیلتر کردن گزینه‌ها
            </p>
            <DropdownInput
              type="search"
              label="جستجوی محصول"
              placeholder="محصول را انتخاب کنید"
              searchPlaceholder="جستجو کنید..."
              options={productOptions}
              className="w-80"
              onValueChange={(value) => setSearchProduct(value as string)}
            />
            {searchProduct && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  محصول انتخاب شده:{" "}
                  {
                    productOptions.find((opt) => opt.value === searchProduct)
                      ?.label
                  }
                </p>
              </div>
            )}
          </div>

          {/* Tags Type */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              انتخاب چندگانه
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              برای انتخاب چندین مورد به صورت همزمان
            </p>
            <DropdownInput
              type="tags"
              label="دسته‌بندی‌ها"
              multiple={false}
              placeholder="دسته‌بندی انتخاب کنید"
              helperText="می‌توانید چندین دسته‌بندی انتخاب کنید"
              options={categoryOptions}
              value={selectedCategories}
              className="w-80"
              onValueChange={(value) =>
                setSelectedCategories(value as string[])
              }
            />
            {selectedCategories.length > 0 && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-2">
                  دسته‌بندی‌های انتخاب شده ({selectedCategories.length}):
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedCategories.map((cat, index) => (
                    <Tag
                      key={index}
                      showCloseIcon={true}
                      onClose={() => {
                        const newCategories = selectedCategories.filter(
                          (_, i) => i !== index
                        );
                        setSelectedCategories(newCategories);
                      }}
                      size="sm"
                    >
                      {categoryOptions.find((opt) => opt.value === cat)?.label}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              setSelectedUser("");
              setSearchProduct("");
              setSelectedCategories([]);
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            پاک کردن همه انتخاب‌ها
          </button>
        </div>

        {/* Usage Examples */}
        <div className="mt-16 bg-muted/30 p-8 rounded-lg">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            نحوه استفاده
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                انتخاب ساده
              </h4>
              <p className="text-sm text-muted-foreground">
                برای انتخاب یک مورد از لیست
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">جستجو</h4>
              <p className="text-sm text-muted-foreground">
                برای فیلتر کردن و جستجو در گزینه‌ها
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">چندگانه</h4>
              <p className="text-sm text-muted-foreground">
                برای انتخاب چندین مورد همزمان
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
