// @ts-nocheck

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import WithBorderTabs from '@/components/ui/tabs/with-border';

import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import { ResponseSpeed } from '@/enums/enum';
import type { ResponseSpeed as ResponseSpeedType } from '@/apis/models/ResponseSpeed';
import type { SmartSpeakerDashboardCardProps } from './types';

const RESPONSE_SPEED_OPTIONS = [
  { label: 'حاضرجواب', value: ResponseSpeed.Kardo.toString() },
  { label: 'با طمأنینه', value: ResponseSpeed.Langourously.toString() },
];

export const SmartSpeakerDashboardCard: React.FC<
  SmartSpeakerDashboardCardProps
> = ({
  id,
  thumbnail,
  title,
  responseSpeed,
  activeAssistants = [],
  attachedAssistants = [],
  onDelete,
  onResponseSpeedChange,
  onAttachAssistant,
  onDetachAssistant,
}) => {
  const assistantOptions = activeAssistants.map(assistant => ({
    label: assistant.title ?? '',
    value: assistant.id?.toString() ?? '',
  }));

  const getInitialSpeed = (speed?: ResponseSpeedType): string => {
    const speedValue = speed as number | undefined;
    if (speedValue === 2) {
      return ResponseSpeed.Langourously.toString();
    }
    return ResponseSpeed.Kardo.toString();
  };

  const getInitialAttachedAssistants = (): string[] => {
    return attachedAssistants
      .map(assistant => assistant.id?.toString() ?? '')
      .filter(Boolean);
  };

  const [activeResponseSpeed, setActiveResponseSpeed] = useState<string>(
    getInitialSpeed(responseSpeed),
  );
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>(
    getInitialAttachedAssistants(),
  );

  useEffect(() => {
    const newSpeed = getInitialSpeed(responseSpeed);
    setActiveResponseSpeed(newSpeed);
  }, [responseSpeed]);

  useEffect(() => {
    const newAttachedAssistants = getInitialAttachedAssistants();
    setSelectedAssistants(newAttachedAssistants);
  }, [attachedAssistants]);

  return (
    <div className="bg-surfacePrimary min-h[514px] rounded-2xl flex flex-col">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl">
        <Image
          fill
          alt={title}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
          src={thumbnail}
        />
      </div>

      <div className="flex flex-col gap-5 mt-[23px] mx-6 flex-1 pb-6">
        <div className="flex items-center justify-between">
          <div className="text-gray-25 text-xl-bold ">{title}</div>

          <button
            aria-label="حذف اسپیکر"
            className="text-error-500 hover:text-error-400 transition-colors cursor-pointer"
            type="button"
            onClick={() => onDelete?.(id)}
          >
            <RedTrash01Icon />
          </button>
        </div>

        <div className="flex flex-col gap-8">
          <WithBorderTabs
            activeTab={activeResponseSpeed}
            activeTabClassName="text-textSecondary bg-surfaceSecondary"
            containerClassName="p-[4px] h-[46px]"
            inactiveTabClassName="text-textSecondary"
            label="سرعت پاسخ گویی"
            tabClassName="h-[36px]"
            tabs={RESPONSE_SPEED_OPTIONS}
            setActiveTab={value => {
              setActiveResponseSpeed(value);
              const speedValue = parseInt(value) as ResponseSpeedType;
              onResponseSpeedChange?.(id, speedValue);
            }}
          />
          <DropdownInput
            multiple
            className="w-full"
            label="دستیاران فعال"
            options={assistantOptions}
            placeholder="دستیار انتخاب کنید"
            type="tags"
            value={selectedAssistants}
            onValueChange={value => {
              const selectedValues = Array.isArray(value)
                ? value
                : [value].filter(Boolean);

              setSelectedAssistants(previousValues => {
                const newlyAdded = selectedValues.filter(
                  val => !previousValues.includes(val),
                );
                const removed = previousValues.filter(
                  val => !selectedValues.includes(val),
                );

                newlyAdded.forEach(assistantValue => {
                  if (typeof assistantValue === 'string') {
                    const assistantId = parseInt(assistantValue);
                    if (!isNaN(assistantId)) {
                      onAttachAssistant?.(id, assistantId);
                    }
                  }
                });

                removed.forEach(assistantValue => {
                  if (typeof assistantValue === 'string') {
                    const assistantId = parseInt(assistantValue);
                    if (!isNaN(assistantId)) {
                      onDetachAssistant?.(id, assistantId);
                    }
                  }
                });

                return selectedValues;
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SmartSpeakerDashboardCard;
