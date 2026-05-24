'use client';

import { Controller } from 'react-hook-form';
import CollorPallet from '@/components/ui/color-pallete';
import { TextInput } from '@/components/ui/input/text-input';
import { TextAreaField } from '@/components/ui/input/textarea-input';
import LabeledInputRow from './LabeledInputRow';
import type { BasicInfoSectionProps } from '../types';

const BasicInfoSection = ({
  control,
  errors,
  allColors,
}: BasicInfoSectionProps) => {
  return (
    <div>
      <LabeledInputRow label="نام">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              className="w-[512px] mx-auto"
              placeholder="نام"
              value={field.value}
              onChange={field.onChange}
              error={errors.name?.message}
            />
          )}
        />
      </LabeledInputRow>
      <LabeledInputRow label="مدل دستگاه">
        <Controller
          name="deviceModel"
          control={control}
          render={({ field }) => (
            <TextInput
              className="w-[512px] mx-auto"
              placeholder="مدل دستگاه"
              value={field.value}
              onChange={field.onChange}
              error={errors.deviceModel?.message}
            />
          )}
        />
      </LabeledInputRow>
      <LabeledInputRow label="رنگ">
        <div className="max-w-[512px] min-w-[512px] mx-auto">
          <Controller
            name="colors"
            control={control}
            render={({ field }) => (
              <CollorPallet
                selectedColors={field.value || []}
                setSelectedColors={colors => {
                  field.onChange(colors);
                }}
                colors={allColors || []}
              />
            )}
          />
          {errors.colors && (
            <p className="text-sm text-destructive mt-1 text-right">
              {errors.colors.message}
            </p>
          )}
        </div>
      </LabeledInputRow>
      <LabeledInputRow label="قیمت (تومان)">
        <div className="grid grid-cols-6 gap-4 justify-between w-[512px] mx-auto">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextInput
                className="w-full col-span-4"
                placeholder="قیمت"
                value={field.value}
                onChange={field.onChange}
                error={errors.price?.message}
              />
            )}
          />
          <Controller
            name="discountPercent"
            control={control}
            render={({ field }) => (
              <TextInput
                className="w-full col-span-2"
                placeholder="تخفیف درصد"
                value={field.value}
                onChange={field.onChange}
                error={errors.discountPercent?.message}
              />
            )}
          />
        </div>
      </LabeledInputRow>
      <LabeledInputRow label="موجودی">
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <TextInput
              className="w-[512px] mx-auto"
              placeholder="1"
              value={field.value}
              onChange={field.onChange}
              error={errors.quantity?.message}
            />
          )}
        />
      </LabeledInputRow>
      <LabeledInputRow label="توضیحات">
        <div className="w-[512px] mx-auto">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextAreaField
                placeholder="متن توضیحات"
                maxLength={4000}
                helperText="حداکثر ۴۰۰۰ کاراکتر"
                className="w-full"
                textareaClassName="w-full"
                value={field.value}
                onChange={field.onChange}
                error={errors.description?.message}
              />
            )}
          />
        </div>
      </LabeledInputRow>
    </div>
  );
};

export default BasicInfoSection;

