'use client';

import { PlusplusIcon } from '@/assets/images/svg/Plusplus';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import FormFieldGroup from '@/components/pages/user-dashboard/account/components/FormFieldGroup';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/input/text-input';
import { useState } from 'react';
import type { VoiceToneSectionProps } from '../types';

const VoiceToneSection = ({
  control,
  errors,
  voiceToneValues,
  setValue,
  watch,
}: VoiceToneSectionProps) => {
  const [newVoiceTone, setNewVoiceTone] = useState('');

  const handleAddVoiceTone = () => {
    if (newVoiceTone.trim()) {
      const currentValues = watch('voiceTone') || [];
      setValue('voiceTone', [...currentValues, newVoiceTone.trim()]);
      setNewVoiceTone('');
    }
  };

  return (
    <FormFieldGroup
      className="gap-7 flex flex-col justify-center items-center border-b border-gray-800 pb-5"
      label="لحن بیان ویس"
    >
      <div className="w-[512px]">
        <div className="flex flex-col gap-3">
          {voiceToneValues.map((value, index) => (
            <div key={index} className="flex gap-2 items-start">
              <TextInput
                className="flex-1"
                inputClassName="w-full text-right"
                placeholder="لحن بیان ویس"
                value={value || ''}
                error={
                  errors.voiceTone?.[index]?.message ||
                  (typeof errors.voiceTone === 'object' &&
                  Array.isArray(errors.voiceTone) &&
                  typeof errors.voiceTone[index] === 'string'
                    ? errors.voiceTone[index]
                    : undefined)
                }
                onChange={e => {
                  const newValues = [...voiceToneValues];
                  newValues[index] = e.target.value;
                  setValue('voiceTone', newValues);
                }}
              />
              <Button
                className="text-error-500 hover:text-error-400"
                size="sm"
                type="button"
                variant="link"
                onClick={() => {
                  const newValues = voiceToneValues.filter(
                    (_, i) => i !== index,
                  );
                  setValue('voiceTone', newValues);
                }}
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
            placeholder="لحن بیان ویس"
            value={newVoiceTone}
            onChange={e => setNewVoiceTone(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddVoiceTone();
              }
            }}
          />
          <Button
            className="h-11 w-11 rounded-lg bg-primary-500 hover:bg-primary-600 flex-shrink-0 p-0"
            size="icon"
            type="button"
            variant="primary"
            onClick={handleAddVoiceTone}
          >
            <PlusplusIcon stroke="white" />
          </Button>
        </div>
        {typeof errors.voiceTone === 'string' && errors.voiceTone && (
          <p className="text-sm text-destructive mt-2" role="alert">
            {errors.voiceTone}
          </p>
        )}
      </div>
    </FormFieldGroup>
  );
};

export default VoiceToneSection;
