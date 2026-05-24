'use client';

import { TokenAuthService } from '@/apis';
import { PhoneAuthIcon } from '@/assets/images/svg/PhoneAuth';
import { RefreshAuthIcon } from '@/assets/images/svg/RefreshAuth';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input/otp-input';
import { useAppDispatch } from '@/store';
import { setPermission } from '@/store/userPermissionsSlice';
import { setToken } from '@/utils/cookies';
import { getPermissionsFromToken } from '@/utils/jwtDecoder';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { otpSchema } from '../../schemas';
import type { OTPFormData } from '../../schemas';
import AuthBackground from '../login/AuthBackground';

interface OTPProps {
  mobileNumber?: string;
  setStep?: (step: 'login' | 'otp' | 'password' | 'register') => void;
}

const OTP = ({ mobileNumber = '', setStep }: OTPProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const lastValidatedOtp = useRef<string>('');
  const otpContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const otp = watch('otp');

  useEffect(() => {
    const focusInput = () => {
      const container = otpContainerRef.current;
      if (!container) {
        return;
      }

      let firstInput = container.querySelector(
        '[data-slot="input-otp"] input',
      ) as HTMLInputElement;
      if (!firstInput) {
        firstInput = container.querySelector('input') as HTMLInputElement;
      }

      if (firstInput) {
        firstInput.focus();
      }
    };

    setTimeout(focusInput, 100);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer(prev => {
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
  }, [resendTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEditMobile = () => {
    setStep?.('login');
  };

  const sendOtp = useMutation({
    mutationFn: async () => {
      const res = await TokenAuthService.apiTokenauthAppsendotpPost(
        mobileNumber,
      );
      return res;
    },
    onSuccess: () => {
      toast.success('رمز یکبار مصرف ارسال شد.');
    },
  });

  const handleResend = () => {
    if (canResend) {
      setResendTimer(120);
      setCanResend(false);
      sendOtp.mutate();
    }
  };

  const handleReceiveViaCall = () => {
    console.log('Receive code via call requested');
  };

  const otpLogin = useMutation({
    mutationFn: async (data: string) => {
      const res = await TokenAuthService.apiTokenauthAppauthenticatePost({
        phoneNumber: mobileNumber,
        otpCode: data,
      });
      return res;
    },
    onSuccess: data => {
      if (data.isFirstLogin) {
        setStep?.('register');
      } else {
        setToken(data.accessToken as string, true);
        const permissions = getPermissionsFromToken(data.accessToken as string);
        if (permissions) {
          dispatch(setPermission(permissions));
        }
        router.push('/dashboard');
      }
    },
    onError: () => {
      setError('otp', {
        type: 'manual',
        message: 'کد وارد شده اشتباه است. لطفاً دوباره تلاش کنید.',
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const onSubmit = (data: OTPFormData) => {
    otpLogin.mutate(data.otp);
    clearErrors('otp');
    setLoading(true);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-full md:w-1/2 bg-base-black flex items-center justify-center p-6 md:p-12">
        <div className="w-[358px] space-y-8">
          <div className="flex flex-col items-center">
            <Image
              priority
              alt="Ario Logo"
              height={48}
              src="/images/logo.svg"
              width={56}
            />
            <h1 className="title-sm-demibold text-base-white text-center mt-7">
              تایید شماره همراه
            </h1>
            <p className="text-sm-demibold text-textSecondary text-center mt-4">
              کد ۵ رقمی به شماره {mobileNumber} ارسال شد. کد را وارد کن
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="flex justify-center">
                <div
                  ref={otpContainerRef}
                  className={
                    errors.otp
                      ? "[&_div[data-slot='input-otp-slot']]:!border-(--color-error-500) [&_div[data-slot='input-otp-slot']]:!border-2 [&_div[data-slot='input-otp-slot']]:!text-(--color-error-400)"
                      : ''
                  }
                >
                  <Controller
                    control={control}
                    name="otp"
                    render={({ field }) => (
                      <InputOTP
                        aria-invalid={!!errors.otp}
                        maxLength={5}
                        value={field.value}
                        onChange={value => {
                          field.onChange(value);
                          if (errors.otp) {
                            clearErrors('otp');
                          }
                          if (
                            value.length < 5 ||
                            value !== lastValidatedOtp.current
                          ) {
                            lastValidatedOtp.current = '';
                          }
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot aria-invalid={!!errors.otp} index={0} />
                          <InputOTPSlot aria-invalid={!!errors.otp} index={1} />
                          <InputOTPSlot aria-invalid={!!errors.otp} index={2} />
                          <InputOTPSlot aria-invalid={!!errors.otp} index={3} />
                          <InputOTPSlot aria-invalid={!!errors.otp} index={4} />
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                </div>
              </div>
              {errors.otp && (
                <p
                  className="text-sm text-(--color-error-500) text-center mt-3"
                  role="alert"
                >
                  {errors.otp.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                className="flex items-center justify-center gap-2 text-md-demibold text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
                onClick={handleEditMobile}
              >
                <PhoneAuthIcon className=" text-primary-300" />
                اصلاح شماره موبایل
              </button>
              <button
                disabled={!canResend}
                className={`flex items-center justify-center gap-2 text-md-demibold transition-colors ${
                  canResend
                    ? 'text-primary-300 hover:text-primary-200 cursor-pointer'
                    : 'text-primary-300 cursor-not-allowed opacity-50'
                }`}
                onClick={handleResend}
              >
                <RefreshAuthIcon />
                ارسال مجدد {!canResend && `(${formatTimer(resendTimer)})`}
              </button>
              <button
                className="flex items-center justify-center gap-2 text-md-demibold text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
                onClick={handleReceiveViaCall}
              >
                <PhoneAuthIcon className=" text-primary-300" />
                دریافت کد از طریق تماس
              </button>
            </div>

            <Button
              className="w-full"
              disabled={otp.length !== 5}
              loading={loading}
              size="lg"
              type="submit"
              variant="primary"
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

export default OTP;
