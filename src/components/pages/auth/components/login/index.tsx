"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { TextInput } from "@/components/ui/input/text-input";
import { persianToEnglish } from "@/utils/persianToEnglish";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, type LoginFormData } from "../../schemas";
import AuthBackground from "./AuthBackground";

interface LoginProps {
  mobileNumber?: string;
  setMobileNumber?: (mobileNumber: string) => void;
  setStep?: (step: "login" | "otp" | "password" | "register") => void;
}

const Login = ({
  mobileNumber: initialMobileNumber = "",
  setMobileNumber,
  setStep,
}: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobileNumber: initialMobileNumber,
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");
  const mobileNumber = watch("mobileNumber");

  useEffect(() => {
    if (initialMobileNumber) {
      setValue("mobileNumber", initialMobileNumber);
    }
  }, [initialMobileNumber, setValue]);

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
    if (!mobileNumber) return false;
    const cleanedNumber = persianToEnglish(mobileNumber.replace(/\s/g, ""));
    return (
      cleanedNumber.length === 11 &&
      cleanedNumber.startsWith("09") &&
      /^\d+$/.test(cleanedNumber)
    );
  };

  const onSubmit = (data: LoginFormData) => {
    if (setMobileNumber && setStep) {
      const normalizedMobileNumber = persianToEnglish(data.mobileNumber);
      setMobileNumber(normalizedMobileNumber);
      setStep("password");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-full md:w-1/2 bg-base-black flex items-center justify-center p-6 md:p-12">
        <div className="w-[358px] h-[456px] space-y-[75px]">
          <div className="flex flex-col items-center">
            <Image
              src="/images/logo.svg"
              alt="Ario Logo"
              width={56}
              height={48}
              priority
            />
            <h1 className="title-sm-demibold text-primary-50 mt-7">
              ورود به آریو
            </h1>
            <p className="text-sm-demibold text-textSecondary mt-4">
              برای ورود یا ثبت نام شماره موبایل خود را وارد کنید.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="شماره موبایل"
              placeholder="برای مثال ۰۹۱۲۳۴۵۶۷۲۰"
              type="tel"
              inputMode="numeric"
              className="w-full text-right mb-7"
              inputClassName="text-md-regular"
              dir="rtl"
              {...register("mobileNumber")}
              onChange={(e) => {
                handlePhoneNumberChange(e);
                register("mobileNumber").onChange(e);
              }}
              onKeyDown={handlePhoneNumberKeyDown}
              error={errors.mobileNumber?.message}
            />

            <Checkbox
              label="مرا به خاطر بسپار"
              labelClassName="text-sm-medium"
              checked={rememberMe}
              onCheckedChange={(checked) =>
                setValue("rememberMe", checked === true)
              }
            />

            <Button
              variant="primary"
              size="xl"
              className="w-full mt-[75px]"
              type="submit"
              disabled={!isMobileNumberValid()}
            >
              ادامه
            </Button>
          </form>
        </div>
      </div>

      <AuthBackground />
    </div>
  );
};

export default Login;
