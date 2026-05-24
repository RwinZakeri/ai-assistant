'use client';

import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';

export interface ToggleProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'checked' | 'onCheckedChange'
> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  label?: string;
  labelClassName?: string;
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  ToggleProps
>(
  (
    {
      className,
      pressed = false,
      onPressedChange,
      label,
      labelClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    const handleCheckedChange = (checked: boolean) => {
      onPressedChange?.(checked);
    };

    const toggleSwitch = (
      <CheckboxPrimitive.Root
        ref={ref}
        checked={pressed}
        disabled={disabled}
        className={cn(
          'peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surfacePrimary disabled:cursor-not-allowed disabled:opacity-50',
          pressed ? 'bg-primary-500' : 'bg-gray-700',
          className,
        )}
        onCheckedChange={handleCheckedChange}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-0 top-0 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out pointer-events-none',
            pressed ? 'translate-x-5' : 'translate-x-0',
          )}
        />
        <span className="sr-only h-full ">
          {pressed ? 'Active' : 'Inactive'}
        </span>
      </CheckboxPrimitive.Root>
    );

    if (label) {
      return (
        <div className="flex items-center gap-3">
          {toggleSwitch}
          <label
            htmlFor={props.id}
            className={cn(
              'text-sm-medium text-textSecondary cursor-pointer select-none',
              disabled && 'cursor-not-allowed opacity-50',
              labelClassName,
            )}
            onClick={
              !disabled && onPressedChange
                ? () => onPressedChange(!pressed)
                : undefined
            }
          >
            {label}
          </label>
        </div>
      );
    }

    return toggleSwitch;
  },
);

Toggle.displayName = 'Toggle';

export { Toggle };
