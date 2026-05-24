'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import type { GetTicketCategoriesOutput } from '@/apis';
import { UserDashboardService } from '@/apis';
import { DashboardUploadIcon } from '@/assets/images/svg/DashboardUpload';
import { Button } from '@/components/ui/button';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { TextInput } from '@/components/ui/input/text-input';
import { TextAreaField } from '@/components/ui/input/textarea-input';
import ReactQuery from '@/configs/react_query_keys';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import HeaderDashboard from '../../components/HeaderDashboard';
import { createTicketSchema } from '../schemas';
import type { CreateTicketFormData } from '../schemas';

const convertToSupportedData = (options: GetTicketCategoriesOutput[] = []) => {
  return options.map(item => ({
    value: item.id,
    label: item.title,
  }));
};

const MAX_DESCRIPTION_LENGTH = 500;

const CreateTicketForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dropdownOptions, setDropDownOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const { data: allTicketCategories } = useQuery({
    queryKey: [ReactQuery.allTicketCategories],
    queryFn: () => {
      return UserDashboardService.apiServicesAppUserdashboardGetticketcategoriesGet();
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      attachment: null,
    },
  });

  const description = watch('description');
  const attachment = watch('attachment');

  const createTicketMutation = useMutation({
    mutationFn: async (data: CreateTicketFormData) => {
      const categoryId =
        typeof data.subject === 'string' ? Number(data.subject) : data.subject;

      if (!categoryId || isNaN(categoryId)) {
        throw new Error('موضوع معتبر انتخاب نشده است');
      }

      const formData: {
        files?: Array<Blob>;
        Title: string;
        CategoryId: number;
        Content: string;
      } = {
        Title: data.title,
        CategoryId: categoryId,
        Content: data.description,
      };

      if (data.attachment) {
        formData.files = [data.attachment];
      }

      return UserDashboardService.apiServicesAppUserdashboardCreatenewticketwithfilesPost(
        formData,
      );
    },
    onSuccess: () => {
      toast.success('تیکت با موفقیت ایجاد شد');
      router.push('/dashboard/support');
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'خطا در ایجاد تیکت. لطفاً دوباره تلاش کنید.',
      );
    },
  });

  const handleCancel = () => {
    router.push('/dashboard/support');
  };

  const onSubmit = (data: CreateTicketFormData) => {
    createTicketMutation.mutate(data);
  };

  useEffect(() => {
    const result = convertToSupportedData(allTicketCategories)
      .map(item => ({
        value: String(item.value),
        label: item.label || '',
      }))
      .filter(item => item.label.length > 0);
    setDropDownOptions(result);
  }, [allTicketCategories]);

  useEffect(() => {
    const withdraw = searchParams.get('withdraw');

    if (withdraw === 'true') {
      setValue('title', 'برداشت از کیف پول');
      setValue(
        'description',
        `
سلام
من قصد دارم مبلغ [مبلغ موردنظر] تومان را از حساب کاربری‌ام برداشت کنم.
مشخصات من به شرح زیر است:

نام و نام خانوادگی: [نام کامل]

شماره همراه ثبت‌شده: [شماره موبایل]

ایمیل حساب: [ایمیل]

مبلغ درخواستی برای برداشت: [مبلغ]

شماره شبا (در صورت نیاز): [شماره شبا]

توضیحات تکمیلی: [اگر توضیحی لازم است بنویسید]
        `,
      );

      const financialCategory = allTicketCategories?.find(
        category => category.title === 'مالی',
      );

      if (financialCategory) {
        setValue('subject', String(financialCategory.id));
      }
    }
  }, [searchParams, allTicketCategories, dropdownOptions, setValue]);

  return (
    <HeaderDashboard label="ایجاد تیکت جدید">
      <form
        className="flex flex-col gap-5 w-full justify-center mt-12"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full flex justify-center items-center relative border-b border-gray-800 pb-5">
          <p className="text-sm-medium text-textSecondary w-70 absolute right-0 top-0">
            عنوان
          </p>
          <TextInput
            {...register('title')}
            className="w-[512px]"
            error={errors.title?.message}
            inputClassName="w-[512px]"
            placeholder="عنوان تیکت خود را وارد کنید"
          />
        </div>
        <div className="w-full flex justify-center items-center relative border-b border-gray-800 pb-5">
          <p className="text-sm-medium text-textSecondary w-70 absolute right-0 top-0">
            موضوع
          </p>
          <Controller
            control={control}
            name="subject"
            render={({ field }) => {
              const currentValue = field.value
                ? String(field.value)
                : undefined;

              return (
                <DropdownInput
                  className="w-[512px]"
                  error={errors.subject?.message}
                  options={dropdownOptions}
                  placeholder="موضوع تیکت خود را انتخاب کنید"
                  type="default"
                  value={currentValue}
                  onValueChange={value => {
                    const selectedValue = Array.isArray(value)
                      ? value[0]
                      : value;
                    field.onChange(selectedValue || '');
                  }}
                />
              );
            }}
          />
        </div>
        <div className="w-full flex flex-col justify-center items-center relative border-b border-gray-800 pb-5">
          <div className="w-full flex justify-center items-center relative">
            <p className="text-sm-medium text-textSecondary w-70 absolute right-0 top-0">
              توضیحات
            </p>
            <TextAreaField
              {...register('description')}
              className="w-[512px]"
              error={errors.description?.message}
              maxLength={MAX_DESCRIPTION_LENGTH}
              placeholder="متن توضیحات را وارد نمایید..."
              textareaClassName="w-[512px] min-h-[160px]"
            />
          </div>
          {!errors.description && (
            <div className="flex justify-between items-center w-[512px] mt-2">
              <span className="text-sm text-textSecondary">
                حداکثر {MAX_DESCRIPTION_LENGTH} کاراکتر
              </span>
              <span className="text-sm text-textSecondary">
                {MAX_DESCRIPTION_LENGTH - (description?.length ?? 0)}
              </span>
            </div>
          )}
        </div>
        <div className="w-full border-t border-gray-800">
          <div className="w-full flex justify-center items-center relative pb-5 mt-10">
            <Controller
              control={control}
              name="attachment"
              render={({ field }) => (
                <>
                  <label
                    htmlFor="ticket-attachment"
                    className={cn(
                      'flex min-h-[200px] w-full py-[48px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed bg-surfaceSecondary/40 text-center text-sm text-textSecondary transition-colors hover:border-primary-300 hover:text-primary-200',
                      errors.attachment
                        ? 'border-destructive'
                        : 'border-linePrimary',
                    )}
                  >
                    <div className="w-[711px] h-full p-12 flex flex-row justify-center gap-4 items-center">
                      <div>
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surfaceSecondary">
                          <DashboardUploadIcon />
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 items-start justify-center">
                        <p className="text-lg-bold text-gray-25">
                          {attachment ? attachment.name : 'آپلود فایل'}
                        </p>
                        <p className="text-textSecondary">
                          (SVG, JPG, PNG, or pdf maximum 80×80)
                        </p>
                      </div>
                    </div>
                  </label>
                  <input
                    accept=".svg,.jpg,.jpeg,.png,.pdf"
                    className="sr-only"
                    id="ticket-attachment"
                    type="file"
                    onChange={e => {
                      const file = e.target.files?.[0] ?? null;
                      field.onChange(file);
                    }}
                  />
                </>
              )}
            />
            {errors.attachment && (
              <p className="text-sm text-destructive mt-1 absolute bottom-0 right-0">
                {errors.attachment.message}
              </p>
            )}
          </div>

          <div className="mt-12 flex w-full justify-start gap-4">
            <Button
              className="w-[90px]"
              disabled={createTicketMutation.isPending}
              loading={createTicketMutation.isPending}
              size="xl"
              type="submit"
              variant="primary"
            >
              ثبت
            </Button>
            <Button
              className="w-[90px]"
              disabled={createTicketMutation.isPending}
              size="xl"
              type="button"
              variant="secondary"
              onClick={handleCancel}
            >
              انصراف
            </Button>
          </div>
        </div>
      </form>
    </HeaderDashboard>
  );
};

export default CreateTicketForm;
