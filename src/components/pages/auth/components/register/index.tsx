'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TextInput } from '@/components/ui/input/text-input';
import { persianToEnglish } from '@/utils/persianToEnglish';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../../schemas';
import type { RegisterFormData } from '../../schemas';
import { PasswordInput } from '../components/password-input';
import AuthBackground from '../login/AuthBackground';
import TermsModal from './TermsModal';

import { TokenAuthService } from '@/apis';
import { ArrowLeftAuthIcon } from '@/assets/images/svg/ArrowLeftAuth';
import { useAppDispatch } from '@/store';
import { setPermission } from '@/store/userPermissionsSlice';
import { setToken } from '@/utils/cookies';
import { getPermissionsFromToken } from '@/utils/jwtDecoder';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface RegisterProps {
  mobileNumber?: string;
  setStep?: (step: 'login' | 'otp' | 'password' | 'register') => void;
}

const Register = ({ mobileNumber = '', setStep }: RegisterProps) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      lastName: '',
      mobileNumber,
      password: '',
      acceptedTerms: false,
    },
  });

  const acceptedTerms = watch('acceptedTerms');

  useEffect(() => {
    if (mobileNumber) {
      setValue('mobileNumber', mobileNumber);
    }
  }, [mobileNumber, setValue]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const convertedValue = persianToEnglish(value);
    const digitsOnly = convertedValue.replace(/\D/g, '');
    setValue('mobileNumber', digitsOnly);
  };

  const signup = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const res = await TokenAuthService.apiTokenauthAppregisterPost({
        name: data.name,
        lastname: data.lastName,
        phoneNumber: data.mobileNumber,
        plainPassword: data.password,
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
    onSettled: () => {
      setLoading(false);
    },
  });

  const handlePhoneNumberKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const allowedKeys = new Set([
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End',
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

  const handlePasswordChange = (value: string) => {
    setValue('password', value, { shouldValidate: true });
  };

  const handleEditMobileNumber = () => {
    setStep?.('login');
  };

  const passwordRequirements = [
    {
      text: 'شامل حداقل ۸ کاراکتر باشد.',
      check: (password: string) => password.length >= 8,
    },
    {
      text: 'شامل حداقل یک عدد (۰-۹) باشد.',
      check: (password: string) => /\d/.test(password),
    },
    {
      text: 'شامل حداقل یک کاراکتر خاص مانند (!، @، #، $، %، &) باشد.',
      check: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const onSubmit = (data: RegisterFormData) => {
    setLoading(true);
    signup.mutate(data);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-full md:w-1/2 bg-base-black flex items-center justify-center p-6 md:pl-12 overflow-y-auto">
        <div className="w-[358px]  ">
          <div className="flex flex-col items-center">
            <Image
              priority
              alt="Ario Logo"
              height={48}
              src="/images/logo.svg"
              width={56}
            />
            <h1 className="title-sm-demibold text-base-white text-center mt-7">
              ثبت نام به آریو
            </h1>

            {mobileNumber && (
              <div className="text-center mt-4">
                <p className="text-sm-demibold text-textSecondary">
                  رمز عبور مربوط به شماره {mobileNumber} را وارد کنید.
                </p>
              </div>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              className="w-full"
              label="نام"
              placeholder="نام خود را وارد کنید"
              {...register('name')}
              error={errors.name?.message}
            />

            <TextInput
              className="w-full"
              label="نام و نام خانوادگی"
              placeholder="نام خانوادگی خود را وارد کنید"
              {...register('lastName')}
              error={errors.lastName?.message}
            />

            <TextInput
              className="w-full text-right"
              dir="rtl"
              disabled={!!mobileNumber}
              inputMode="numeric"
              label="شماره موبایل"
              placeholder="شماره موبایل"
              type="tel"
              {...register('mobileNumber')}
              error={errors.mobileNumber?.message}
              onKeyDown={handlePhoneNumberKeyDown}
              onChange={e => {
                handlePhoneNumberChange(e);
                register('mobileNumber').onChange(e);
              }}
            />

            <PasswordInput
              convertPersianToEnglish
              showRequirements
              useWebkitTextSecurity
              error={errors.password?.message}
              id="register-password"
              label="رمز عبور"
              placeholder="یک رمز عبور بسازید"
              requirements={passwordRequirements}
              onPasswordChange={handlePasswordChange}
              {...register('password')}
            />

            <div className="space-y-2">
              <Checkbox
                checked={acceptedTerms}
                label="من شرایط و ضوابط را مطالعه کرده ام."
                labelClassName="text-sm-medium text-primary-300 hover:text-primary-200  cursor-pointer select-none transition-colors"
                onCheckedChange={(checked: boolean | 'indeterminate') => {
                  setValue('acceptedTerms', checked === true);
                  trigger('acceptedTerms');
                }}
                onLabelClick={(e: React.MouseEvent<HTMLLabelElement>) => {
                  e.preventDefault();
                  setIsTermsModalOpen(true);
                }}
              />
              {errors.acceptedTerms && (
                <p className="text-sm text-error-500" role="alert">
                  {errors.acceptedTerms.message}
                </p>
              )}
            </div>

            <Button
              className="w-full"
              disabled={!acceptedTerms}
              loading={loading}
              size="lg"
              type="submit"
              variant="primary"
            >
              ثبت نام
            </Button>
            {mobileNumber && (
              <div className="flex justify-center">
                <button
                  className="flex items-center justify-center gap-2 text-md-demibold text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
                  type="button"
                  onClick={handleEditMobileNumber}
                >
                  اصلاح شماره موبایل
                  <ArrowLeftAuthIcon />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <AuthBackground />

      <TermsModal
        initialChecked={acceptedTerms}
        open={isTermsModalOpen}
        onOpenChange={setIsTermsModalOpen}
        onConfirm={() => {
          setValue('acceptedTerms', true);
          trigger('acceptedTerms');
        }}
      />
    </div>
  );
};

export default Register;
