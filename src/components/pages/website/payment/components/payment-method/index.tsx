'use client';

import { formatNumberWithCommas } from '@/components/pages/user-dashboard/delivery/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import React from 'react';
import { PAYMENT_METHODS } from './constants';
import { CardIcon } from '@/assets/images/svg/Card';
import Image from 'next/image';

const PaymentMethod = ({
  wallet,
  onChange,
}: {
  wallet?: number;
  onChange: () => void;
}) => {
  const [selected, setSelected] = React.useState('online');

  const changeHandler = (data: string) => {
    setSelected(data);
    onChange();
  };

  return (
    <RadioGroup
      className="flex flex-col gap-6 items-end w-full"
      value={selected}
      onValueChange={changeHandler}
    >
      {PAYMENT_METHODS.map(method => (
        <label
          key={method.id}
          className={cn('flex gap-3 items-start w-full cursor-pointer')}
        >
          <div className="flex flex-col gap-1 items-end flex-1 min-w-0">
            <span className="text-md-demibold text-gray-25 leading-6">
              {method.label}
            </span>
            {method.id === 'online' ? (
              <span className="text-sm-medium text-textSecondary leading-5">
                {method.description}
              </span>
            ) : (
              <span className="flex gap-1 items-center text-sm-medium text-gray-25 leading-5">
                <span>{method.currency}</span>
                <span>
                  {wallet == 0 ? '0' : formatNumberWithCommas(wallet as number)}
                </span>
                <span className="text-textSecondary">{method.description}</span>
              </span>
            )}
          </div>
          <div
            className="relative shrink-0"
            style={{ width: 24, height: method.id === 'online' ? 24 : 20 }}
          >
            {method.id === 'online' ? (
              <CardIcon />
            ) : (
              <Image
                priority
                alt="لوگو"
                height={34}
                src="/images/logo.svg"
                width={40}
              />
            )}
          </div>
          <RadioGroupItem
            aria-label={method.label}
            id={method.id}
            value={method.id}
          />
        </label>
      ))}
    </RadioGroup>
  );
};

export default PaymentMethod;
