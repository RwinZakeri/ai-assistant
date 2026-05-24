'use client';

import { PlusplusIcon } from '@/assets/images/svg/Plusplus';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/input/text-input';

interface PricingItem {
  duration: string;
  price: string;
  discount?: string;
}

interface PricingArrayProps {
  items: PricingItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof PricingItem, value: string) => void;
  error?: string | { [key: number]: { [field: string]: string } };
}

const PricingArray = ({
  items,
  onAdd,
  onRemove,
  onChange,
  error,
}: PricingArrayProps) => {
  const getFieldError = (index: number, field: string): string | undefined => {
    if (typeof error === 'object' && error !== null && error[index]) {
      return error[index][field];
    }
    return undefined;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 items-start p-4 border border-gray-800 rounded-lg"
          >
            <div className="flex-1">
              <TextInput
                className="w-full"
                error={getFieldError(index, 'duration')}
                inputClassName="w-full text-right"
                placeholder="مدت زمان (روز)"
                type="number"
                value={item.duration}
                onChange={e => onChange(index, 'duration', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <TextInput
                className="w-full"
                error={getFieldError(index, 'price')}
                inputClassName="w-full text-right"
                placeholder="قیمت (تومان)"
                type="number"
                value={item.price}
                onChange={e => onChange(index, 'price', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <TextInput
                className="w-full"
                error={getFieldError(index, 'discount')}
                inputClassName="w-full text-right"
                placeholder="تخفیف (%)"
                type="number"
                value={item.discount || ''}
                onChange={e => onChange(index, 'discount', e.target.value)}
              />
            </div>
            <Button
              className="text-error-500 hover:text-error-400 mt-2"
              size="sm"
              type="button"
              variant="link"
              onClick={() => onRemove(index)}
            >
              <RedTrash01Icon />
            </Button>
          </div>
        ))}
      </div>
      <Button
        className="w-fit gap-2"
        size="sm"
        type="button"
        variant="secondary"
        onClick={onAdd}
      >
        <PlusplusIcon />
        افزودن قیمت
      </Button>
      {typeof error === 'string' && error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PricingArray;
