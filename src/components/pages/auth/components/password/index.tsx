'use client';

import { TokenAuthService } from '@/apis';
import { ArrowLeftAuthIcon } from '@/assets/images/svg/ArrowLeftAuth';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store';
import { setToken } from '@/utils/cookies';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { passwordLoginSchema } from '../../schemas';
import type { PasswordLoginFormData } from '../../schemas';
import { PasswordInput } from '../components/password-input';
import AuthBackground from '../login/AuthBackground';
import { getPermissionsFromToken } from '@/utils/jwtDecoder';
import { setPermission } from '@/store/userPermissionsSlice';

interface PasswordProps {
  mobileNumber?: string;
  setStep?: (step: 'login' | 'otp' | 'password') => void;
}

const Password = ({ mobileNumber = '', setStep }: PasswordProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PasswordLoginFormData>({
    resolver: zodResolver(passwordLoginSchema),
    defaultValues: {
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: string) => {
      const res =
        await TokenAuthService.apiTokenauthAppauthenticatewithpasswordPost({
          phoneNumber: mobileNumber as string,
          password: data as string,
        });
      return res;
    },
    onSuccess: data => {
      setToken(data.accessToken as string, true);
      const permissions = getPermissionsFromToken(data.accessToken as string);
      if (permissions) {
        dispatch(setPermission(permissions));
      }
      router.push('/dashboard');
    },
    onError: () => {
      setError('password', {
        type: 'manual',
        message: 'رمز عبور نادرست میباشد',
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const sendOtp = useMutation({
    mutationFn: async () => {
      const res = await TokenAuthService.apiTokenauthAppsendotpPost(
        mobileNumber,
      );
      return res;
    },
  });

  const onSubmit = async (data: PasswordLoginFormData) => {
    setLoading(true);
    mutation.mutate(data.password);
  };

  const handleEditMobile = () => {
    setStep?.('login');
  };

  const handleSwitchToOTP = () => {
    setStep?.('otp');
    sendOtp.mutate();
  };

  const handleRecoverPassword = () => {
    router.push(`/reset-password?mobile=${encodeURIComponent(mobileNumber)}`);
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
            <h1 className="title-sm-demibold text-primary-50 mt-7">
              ورود به آریو
            </h1>
            <p className="text-sm-demibold text-textSecondary mt-4">
              رمز عبور مربوط به شماره {mobileNumber} را وارد کنید.
            </p>
          </div>

          <form className="space-y-[34px]" onSubmit={handleSubmit(onSubmit)}>
            <PasswordInput
              error={errors.password?.message}
              id="password"
              label="رمز عبور"
              placeholder="کلمه عبور خود را وارد نمایید"
              {...register('password')}
            />

            <div className="flex flex-col items-center gap-4">
              <button
                className="flex items-center justify-center gap-2 text-sm-demibold text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
                onClick={handleEditMobile}
              >
                اصلاح شماره موبایل
                <ArrowLeftAuthIcon />
              </button>
              <button
                className="flex items-center justify-center gap-2 text-sm-demibold text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
                onClick={handleSwitchToOTP}
              >
                تغییر به ورود با رمز یکبار مصرف
                <ArrowLeftAuthIcon />
              </button>
              <button
                className="flex items-center justify-center gap-2 text-sm-demibold text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
                onClick={handleRecoverPassword}
              >
                بازیابی رمز عبور
                <ArrowLeftAuthIcon />
              </button>
            </div>

            <Button
              className="w-full"
              loading={loading}
              size="lg"
              type="submit"
              variant="primary"
            >
              ورود
            </Button>
          </form>
        </div>
      </div>

      <AuthBackground />
    </div>
  );
};

export default Password;
