'use client';

import { PlusplusIcon } from '@/assets/images/svg/Plusplus';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/input/text-input';

interface ArrayInputFieldProps {
  items: Array<{ title: string }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  error?: string | { [key: number]: string };
  placeholder?: string;
  label?: string;
}

const ArrayInputField = ({
  items,
  onAdd,
  onRemove,
  onChange,
  error,
  placeholder = 'عنوان مشخصه',
  label,
}: ArrayInputFieldProps) => {
  const getItemError = (index: number): string | undefined => {
    if (typeof error === 'object' && error !== null) {
      return error[index];
    }
    return undefined;
  };

  return (
    <div className="flex flex-col gap-4">
      {label && <p className="text-sm-medium text-textSecondary">{label}</p>}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-start">
            <TextInput
              className="flex-1"
              error={getItemError(index)}
              inputClassName="w-full text-right"
              placeholder={placeholder}
              value={item.title}
              onChange={e => onChange(index, e.target.value)}
            />
            <Button
              className="text-error-500 hover:text-error-400"
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
        افزودن
      </Button>
      {typeof error === 'string' && error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ArrayInputField;
