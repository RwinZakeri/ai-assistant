// @ts-nocheck

'use client';

import { useState } from 'react';
import { PlusplusIcon } from '@/assets/images/svg/Plusplus';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import FormFieldGroup from '@/components/pages/user-dashboard/account/components/FormFieldGroup';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/input/text-input';
import WithBorderTabs from '@/components/ui/tabs/with-border';
import type { SubscriptionSectionProps } from '../types';

const subscriptionTabs = [
  { label: 'رایگان', value: '0' },
  { label: 'اشتراک زماندار', value: '1' },
  { label: 'اعتباری', value: '2' },
];

const SubscriptionSection = ({
  control,
  errors,
  subscriptionType,
  pricingFields,
  setValue,
  watch,
  appendPricing,
  removePricing,
}: SubscriptionSectionProps) => {
  const [newPricing, setNewPricing] = useState({
    duration: '',
    price: '',
    discount: '',
  });

  const handleAddPricing = () => {
    if (
      newPricing.duration.trim() ||
      newPricing.price.trim() ||
      newPricing.discount.trim()
    ) {
      appendPricing({
        duration: newPricing.duration.trim(),
        price: newPricing.price.trim(),
        discount: newPricing.discount.trim(),
      });
      setNewPricing({
        duration: '',
        price: '',
        discount: '',
      });
    }
  };

  const handlePricingKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPricing();
    }
  };

  return (
    <>
      <FormFieldGroup
        className="flex flex-col justify-center items-center border-b border-gray-800 pb-5 gap-5"
        label="نوع اشتراک"
      >
        <div className="w-[512px]">
          <WithBorderTabs
            activeTab={subscriptionType}
            activeTabClassName="text-textSecondary bg-surfaceSecondary"
            containerClassName="p-[4px] h-[46px]"
            inactiveTabClassName="text-textSecondary"
            tabClassName="h-[36px]"
            tabs={subscriptionTabs}
            setActiveTab={value => {
              setValue('subscriptionType', value as '0' | '1' | '2');
              if (value === '0') {
                setValue('pricing', undefined);
              }
            }}
          />
        </div>
      </FormFieldGroup>

      <FormFieldGroup
        className="gap-7 flex flex-col justify-center items-center border-b border-gray-800 pb-5"
        label="قیمت"
      >
        <div className="w-[512px]">
          {subscriptionType !== '0' && (
            <>
              <div className="flex flex-col gap-3">
                {pricingFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <TextInput
                      className="flex-1"
                      error={errors.pricing?.message}
                      inputClassName="w-full text-right"
                      placeholder="مدت زمان (روز)"
                      type="number"
                      value={watch(`pricing.${index}.duration`) || ''}
                      onChange={e => {
                        setValue(`pricing.${index}.duration`, e.target.value);
                      }}
                    />
                    <TextInput
                      className="flex-1"
                      inputClassName="w-full text-right"
                      placeholder="قیمت (تومان)"
                      type="number"
                      value={watch(`pricing.${index}.price`) || ''}
                      error={
                        errors.pricing?.[index]?.price?.message ||
                        (typeof errors.pricing === 'object' &&
                        errors.pricing?.[index] &&
                        typeof errors.pricing[index] === 'object' &&
                        'price' in errors.pricing[index] &&
                        typeof errors.pricing[index].price === 'string'
                          ? errors.pricing[index].price
                          : undefined)
                      }
                      onChange={e =>
                        setValue(`pricing.${index}.price`, e.target.value)
                      }
                    />
                    <TextInput
                      className="flex-1"
                      inputClassName="w-full text-right"
                      placeholder="تخفیف (%)"
                      type="number"
                      value={watch(`pricing.${index}.discount`) || ''}
                      error={
                        errors.pricing?.[index]?.discount?.message ||
                        (typeof errors.pricing === 'object' &&
                        errors.pricing?.[index] &&
                        typeof errors.pricing[index] === 'object' &&
                        'discount' in errors.pricing[index] &&
                        typeof errors.pricing[index].discount === 'string'
                          ? errors.pricing[index].discount
                          : undefined)
                      }
                      onChange={e =>
                        setValue(`pricing.${index}.discount`, e.target.value)
                      }
                    />
                    <Button
                      className="text-error-500 hover:text-error-400"
                      size="sm"
                      type="button"
                      variant="link"
                      onClick={() => removePricing(index)}
                    >
                      <RedTrash01Icon />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 items-center mt-3">
                <TextInput
                  className="flex-1"
                  inputClassName="w-full text-right"
                  placeholder="مدت زمان (روز)"
                  type="number"
                  value={newPricing.duration}
                  onKeyDown={handlePricingKeyDown}
                  onChange={e =>
                    setNewPricing({
                      ...newPricing,
                      duration: e.target.value,
                    })
                  }
                />
                <TextInput
                  className="flex-1"
                  inputClassName="w-full text-right"
                  placeholder="قیمت (تومان)"
                  type="number"
                  value={newPricing.price}
                  onKeyDown={handlePricingKeyDown}
                  onChange={e =>
                    setNewPricing({
                      ...newPricing,
                      price: e.target.value,
                    })
                  }
                />
                <TextInput
                  className="flex-1"
                  inputClassName="w-full text-right"
                  placeholder="تخفیف (%)"
                  type="number"
                  value={newPricing.discount}
                  onKeyDown={handlePricingKeyDown}
                  onChange={e =>
                    setNewPricing({
                      ...newPricing,
                      discount: e.target.value,
                    })
                  }
                />
                <Button
                  className="h-11 w-11 rounded-lg bg-primary-500 hover:bg-primary-600 flex-shrink-0 p-0"
                  size="icon"
                  type="button"
                  variant="primary"
                  onClick={handleAddPricing}
                >
                  <PlusplusIcon stroke="white" />
                </Button>
              </div>
            </>
          )}
          {subscriptionType !== '0' && errors.pricing?.message && (
            <p className="text-sm text-destructive mt-2" role="alert">
              {errors.pricing.message}
            </p>
          )}
          {subscriptionType === '0' && (
            <p className="text-sm text-textSecondary mt-2">
              اشتراک رایگان نیازی به تعریف قیمت ندارد
            </p>
          )}
        </div>
      </FormFieldGroup>
    </>
  );
};

export default SubscriptionSection;
