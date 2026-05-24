"use client";

import React, { useState } from "react";
import { TextInput } from "@/components/ui/input/text-input";
import { TextAreaField } from "@/components/ui/input/textarea-input";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "نام الزامی است";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "نام خانوادگی الزامی است";
    }

    if (!formData.email.trim()) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "فرمت ایمیل صحیح نیست";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "موضوع الزامی است";
    }

    if (!formData.description.trim()) {
      newErrors.description = "توضیحات الزامی است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Handle form submission here
      console.log("Form submitted:", formData);
      // You can add API call here
    }
  };

  return (
    <div className="w-full md:my-24 mt-16">
      <div className="bg-surfacePrimary rounded-4xl md:pt-16 md:pb-24 py-12 flex flex-col gap-16 items-center justify-start">
        <div className="w-full max-w-[1280px] px-4 flex flex-col gap-16 items-center justify-start ">
          {/* Header Section */}
          <div className="flex flex-col gap-12 items-center justify-start w-full text-center">
            <div className="flex flex-col px-8 gap-6 items-center w-full">
              <h2 className="md:title-lg-demibold title-md-demibold text-gray-25">
                با ما در تماس باشید
              </h2>
              <p className="md:text-xl-regular text-lg-regular text-textSecondary">
                مایلیم از شما بشنویم. لطفاً این فرم را پر کنید.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-[480px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <TextInput
                  label="نام"
                  placeholder="نام"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  error={errors.firstName}
                  required
                  className="w-full"
                  labelClassName="text-sm font-medium text-text-tertiary"
                />
                <TextInput
                  label="نام خانوادگی"
                  placeholder="نام خانوادگی"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  error={errors.lastName}
                  required
                  className="w-full"
                  labelClassName="text-sm font-medium text-text-tertiary"
                />
              </div>

              <TextInput
                label="ایمیل"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                required
                inputClassName="w-full"
                labelClassName="text-sm font-medium text-text-tertiary"
              />

              <TextInput
                label="موضوع"
                placeholder="دریافت API"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                error={errors.subject}
                required
                inputClassName="w-full "
                labelClassName="text-sm font-medium text-text-tertiary"
              />

              <TextAreaField
                label="توضیحات"
                placeholder="متن توضیحات را وارد نمایید..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                error={errors.description}
                required
                rows={6}
                textareaClassName="w-full h-[154px] resize-none"
                labelClassName="text-sm font-medium text-text-tertiary"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-3"
              >
                ارسال
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
