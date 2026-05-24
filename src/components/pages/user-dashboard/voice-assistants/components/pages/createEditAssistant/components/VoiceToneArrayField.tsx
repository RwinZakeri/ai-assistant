'use client';

import { PlusplusIcon } from '@/assets/images/svg/Plusplus';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/input/text-input';

interface VoiceToneArrayFieldProps {
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  error?: string | { [key: number]: string };
  placeholder?: string;
}

const VoiceToneArrayField = ({
  items,
  onAdd,
  onRemove,
  onChange,
  error,
  placeholder = 'لحن بیان ویس',
}: VoiceToneArrayFieldProps) => {
  const getItemError = (index: number): string | undefined => {
    if (typeof error === 'object' && error !== null) {
      return error[index];
    }
    return undefined;
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Button
            aria-label="حذف"
            className="h-10 w-10 p-0 flex-shrink-0 rounded-lg"
            size="sm"
            type="button"
            variant="primary"
            onClick={() => onRemove(index)}
          >
            <RedTrash01Icon className="text-white" />
          </Button>
          <TextInput
            className="flex-1"
            error={getItemError(index)}
            inputClassName="w-full text-right"
            placeholder={placeholder}
            value={item}
            onChange={e => onChange(index, e.target.value)}
          />
        </div>
      ))}
      <div className="flex gap-2 items-center">
        <Button
          aria-label="افزودن"
          className="h-10 w-10 p-0 flex-shrink-0 rounded-lg"
          size="sm"
          type="button"
          variant="primary"
          onClick={onAdd}
        >
          <PlusplusIcon className="text-white" />
        </Button>
        <TextInput
          disabled
          readOnly
          className="flex-1"
          inputClassName="w-full text-right"
          placeholder={placeholder}
          value=""
        />
      </div>
      {typeof error === 'string' && error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default VoiceToneArrayField;
