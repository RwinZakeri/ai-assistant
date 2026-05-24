"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/components/ui/input/text-input";
import { Button } from "@/components/ui/button";
import { Mail01Icon } from "@/assets/images/svg/Mail01";
import { loginSchema, type LoginFormData } from "../../schemas";
import { persianToEnglish } from "@/utils/persianToEnglish";
import { PhoneAuthIcon } from "@/assets/images/svg/PhoneAuth";

interface MobileNumberFormProps {
  initialMobileNumber?: string;
  onSubmit: (mobileNumber: string) => void;
}

const MobileNumberForm = ({
  initialMobileNumber = "",
  onSubmit,
}: MobileNumberFormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobileNumber: initialMobileNumber,
      rememberMe: false,
    },
  });

  const formMobileNumber = watch("mobileNumber");

  useEffect(() => {
    if (initialMobileNumber) {
      reset({
        mobileNumber: initialMobileNumber,
        rememberMe: false,
      });
    }
  }, [initialMobileNumber, reset]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const convertedValue = persianToEnglish(value);
    const digitsOnly = convertedValue.replace(/\D/g, "");
    setValue("mobileNumber", digitsOnly);
  };

  const handlePhoneNumberKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const allowedKeys = new Set([
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
      "Enter",
    ]);
    if (allowedKeys.has(e.key)) {
      return;
    }
    const isEnglishDigit = /^\d$/.test(e.key);
    const isPersianDigit = /^[۰-۹]$/.test(e.key);
    if (!isEnglishDigit && !isPersianDigit) {
      e.preventDefault();
    }
  };

  const isMobileNumberValid = () => {
    if (!formMobileNumber) return false;
    const cleanedNumber = persianToEnglish(formMobileNumber.replace(/\s/g, ""));
    return (
      cleanedNumber.length === 11 &&
      cleanedNumber.startsWith("09") &&
      /^\d+$/.test(cleanedNumber)
    );
  };

  const onSubmitForm = (data: LoginFormData) => {
    const normalizedMobileNumber = persianToEnglish(data.mobileNumber);
    onSubmit(normalizedMobileNumber);
  };

  return (
    <div className="min-h-screen w-full bg-base-black flex items-center justify-center p-6">
      <div className="w-[358px] space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-xl border border-linePrimary flex items-center justify-center">
            <Mail01Icon className="h-7 w-7 text-base-white" />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="title-sm-demibold text-base-white">
            بازیابی رمز عبور
          </h1>
          <p className="text-sm-demibold text-textSecondary">
            برای دریافت کد تأیید شماره تلفن خود را وارد کنید
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <TextInput
            label="شماره موبایل"
            placeholder="برای مثال ۰۹۱۲۳۴۵۶۷۲۰"
            type="tel"
            inputMode="numeric"
            className="w-full text-right"
            dir="rtl"
            {...register("mobileNumber")}
            onChange={(e) => {
              handlePhoneNumberChange(e);
              register("mobileNumber").onChange(e);
            }}
            onKeyDown={handlePhoneNumberKeyDown}
            error={errors.mobileNumber?.message}
          />

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            type="submit"
            disabled={!isMobileNumberValid()}
          >
            ادامه
          </Button>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => router.push("/auth")}
              className="flex items-center justify-center gap-2 text-md-demibold text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
            >
              <PhoneAuthIcon />
              اصلاح شماره موبایل
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileNumberForm;
