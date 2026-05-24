'use client';

import { Controller } from 'react-hook-form';
import FormFieldGroup from '@/components/pages/user-dashboard/account/components/FormFieldGroup';
import { Toggle } from '@/components/ui/toggle';
import { TextInput } from '@/components/ui/input/text-input';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import type { BasicInfoSectionProps } from '../types';

const BasicInfoSection = ({
  register,
  errors,
  control,
  isActive,
  usePublicKnowledge,
  setValue,
  languageOptions,
}: BasicInfoSectionProps) => {
  return (
    <>
      <FormFieldGroup
        className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
        label="وضعیت"
      >
        <div className="w-[512px] flex items-center gap-4">
          <Toggle
            pressed={isActive}
            onPressedChange={value => setValue('isActive', value)}
          />
        </div>
      </FormFieldGroup>

      <FormFieldGroup
        className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
        label="استفاده از دانش عمومی"
      >
        <div className="w-[512px] flex items-center gap-4">
          <Toggle
            pressed={usePublicKnowledge}
            onPressedChange={value => setValue('usePublicKnowledge', value)}
          />
        </div>
      </FormFieldGroup>

      <FormFieldGroup
        className="flex justify-center items-center border-b border-gray-800 pb-5"
        label="نام"
      >
        <div className="flex gap-4">
          <TextInput
            className="w-[244px]"
            error={errors.persianName?.message}
            inputClassName="w-[244px] text-right"
            placeholder="نام فارسی"
            {...register('persianName')}
          />
          <TextInput
            className="w-[244px]"
            error={errors.englishName?.message}
            inputClassName="w-[244px] text-right"
            placeholder="نام انگلیسی"
            {...register('englishName')}
          />
        </div>
      </FormFieldGroup>

      <FormFieldGroup
        className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
        label="توضیحات برای LLM"
      >
        <TextInput
          className="w-[512px]"
          error={errors.llmDescription?.message}
          inputClassName="w-[512px] text-right"
          placeholder="توضیحات برای LLM"
          {...register('llmDescription')}
        />
      </FormFieldGroup>

      <FormFieldGroup
        className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
        label="توضیحات برای کاربر"
      >
        <TextInput
          className="w-[512px]"
          error={errors.userDescription?.message}
          inputClassName="w-[512px] text-right"
          placeholder="توضیحات برای کاربر"
          {...register('userDescription')}
        />
      </FormFieldGroup>

      <FormFieldGroup
        className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
        label="پرامپت سیستمی LLM"
      >
        <TextInput
          className="w-[512px]"
          error={errors.systemLlmPrompt?.message}
          inputClassName="w-[512px] text-right"
          placeholder="پرامپت سیستمی LLM"
          {...register('systemLlmPrompt')}
        />
      </FormFieldGroup>

      <FormFieldGroup
        className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
        label="زبان‌ها"
      >
        <Controller
          control={control}
          name="selectedLanguages"
          render={({ field }) => (
            <DropdownInput
              className="w-[512px]"
              error={errors.selectedLanguages?.message}
              options={languageOptions}
              placeholder="انتخاب زبان‌ها"
              type="tags"
              value={field.value.map(String)}
              onValueChange={value =>
                field.onChange(
                  Array.isArray(value)
                    ? value.map(Number).filter(n => !isNaN(n))
                    : [Number(value)].filter(n => !isNaN(n)),
                )
              }
            />
          )}
        />
      </FormFieldGroup>
    </>
  );
};

export default BasicInfoSection;
