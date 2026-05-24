'use client';

import type { DeliveringHourItem } from '@/apis';
import React from 'react';
import DeliveryTimeItem from './DeliveryTimeItem';

const DeliveryTime = ({
  data,
  onClick,
}: {
  data?: DeliveringHourItem[] | null;
  onClick?: (item: DeliveringHourItem) => void;
}) => {
  const [selectedTime, setSelectedTime] = React.useState<number | null>(null);

  return (
    <div className="flex gap-[14px] flex-wrap">
      {data?.map((item, index) => (
        <DeliveryTimeItem
          key={(item.day as string) + index}
          data={item}
          isActive={selectedTime === item.id}
          onClick={() => {
            setSelectedTime(item.id as number);
            onClick?.(item);
          }}
        />
      ))}
    </div>
  );
};

export default DeliveryTime;
