"use client";

import { TokenAuthService } from "@/apis";
import { Mail01Icon } from "@/assets/images/svg/Mail01";
import { PhoneAuthIcon } from "@/assets/images/svg/PhoneAuth";
import { RefreshAuthIcon } from "@/assets/images/svg/RefreshAuth";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input/otp-input";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import MobileNumberForm from "./components/MobileNumberForm";
import NewPasswordForm from "./components/NewPasswordForm";

type ResetPasswordStep = "mobile" | "otp" | "newPassword";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const initialMobileNumber = searchParams.get("mobile") || "";

  const [step, setStep] = useState<ResetPasswordStep>("mobile");
  const [mobileNumber, setMobileNumber] = useState(initialMobileNumber);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const otpContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMobileNumber) {
      setMobileNumber(initialMobileNumber);
    }
  }, [initialMobileNumber]);

  useEffect(() => {
    if (step === "otp") {
      const focusInput = () => {
        const container = otpContainerRef.current;
        if (!container) return;

        let firstInput = container.querySelector(
          '[data-slot="input-otp"] input'
        ) as HTMLInputElement;
        if (!firstInput) {
          firstInput = container.querySelector("input") as HTMLInputElement;
        }

        if (firstInput) {
          firstInput.focus();
        }
      };

      setTimeout(focusInput, 100);
    }
  }, [step]);

  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer, step]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const sendOtp = useMutation({
    mutationFn: async (phone: string) => {
      const res = await TokenAuthService.apiTokenauthApppasswordrecoveryPost({
        phoneNumber: phone,
      });
      return res;
    },
    onSuccess: () => {
      toast.success("کد یکبار مصرف ارسال شد.");
    },
  });
  const VerifyOtp = useMutation({
    mutationFn: async () => {
      const res =
        await TokenAuthService.apiTokenauthApppasswordrecoverywithcodePost({
          phoneNumber: mobileNumber,
          otpCode: otp,
        });
      return res;
    },
    onError: () => {
      setError("کد وارد شده اشتباه است. لطفاً دوباره تلاش کنید.");
    },
    onSuccess: () => {
      setError("");
      setStep("newPassword");
    },
  });

  const handleResend = () => {
    if (canResend) {
      setResendTimer(120);
      setCanResend(false);
      sendOtp.mutate(mobileNumber);
    }
  };

  const handleReceiveViaCall = () => {
    console.log("Receive code via call requested");
  };

  const handleEditMobile = () => {
    setStep("mobile");
    setOtp("");
    setError("");
  };

  const handleMobileNumberSubmit = (normalizedMobileNumber: string) => {
    sendOtp.mutate(normalizedMobileNumber);
    setMobileNumber(normalizedMobileNumber);
    setStep("otp");
    setOtp("");
    setError("");
    setResendTimer(120);
    setCanResend(false);
  };

  if (step === "newPassword") {
    return (
      <NewPasswordForm
        mobileNumber={mobileNumber}
        onEditMobile={handleEditMobile}
      />
    );
  }

  if (step === "mobile") {
    return (
      <MobileNumberForm
        initialMobileNumber={mobileNumber}
        onSubmit={handleMobileNumberSubmit}
      />
    );
  }

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
            کد ۵ رقمی به شماره {mobileNumber} ارسال شد. کد ارسالی را وارد کنید
          </p>
        </div>

        <div>
          <div className="flex justify-center" ref={otpContainerRef}>
            <div
              className={
                error
                  ? "mb-3 [&_div[data-slot='input-otp-slot']]:!border-(--color-error-500) [&_div[data-slot='input-otp-slot']]:!border-2 [&_div[data-slot='input-otp-slot']]:!text-(--color-error-400)"
                  : ""
              }
            >
              <InputOTP
                maxLength={5}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  if (error) {
                    setError("");
                  }
                  if (value.length === 5) {
                    VerifyOtp.mutate();
                  }
                }}
                aria-invalid={!!error}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} aria-invalid={!!error} />
                  <InputOTPSlot index={1} aria-invalid={!!error} />
                  <InputOTPSlot index={2} aria-invalid={!!error} />
                  <InputOTPSlot index={3} aria-invalid={!!error} />
                  <InputOTPSlot index={4} aria-invalid={!!error} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          {error && (
            <p className="text-sm text-error-500 text-center" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`flex items-center justify-center gap-2 text-md-demibold transition-colors ${
              canResend
                ? "text-primary-300 hover:text-primary-200 cursor-pointer"
                : "text-primary-300 cursor-not-allowed opacity-50"
            }`}
          >
            <RefreshAuthIcon />
            ارسال مجدد {!canResend && `(${formatTimer(resendTimer)})`}
          </button>
          <button
            onClick={handleReceiveViaCall}
            className="flex items-center justify-center gap-2 text-md-demibold text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
          >
            <PhoneAuthIcon />
            دریافت کد از طریق تماس
          </button>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => VerifyOtp.mutate()}
          disabled={otp.length !== 5}
        >
          ادامه
        </Button>

        <div className="flex justify-center">
          <button
            onClick={handleEditMobile}
            className="flex items-center justify-center gap-2 text-md-demibold text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
          >
            <PhoneAuthIcon />
            اصلاح شماره موبایل
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
