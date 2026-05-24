import React from 'react';

import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Label } from '../../label';
import { Input } from './components/TextField';

export interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'suffix'
> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      icon,
      className,
      inputClassName,
      labelClassName,
      errorClassName,
      helperTextClassName,
      prefix,
      suffix,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hasError = !!error;

    return (
      // ========== Container Section ==========
      <div className={cn(`space-y-1.5 ${hasError ? 'mb-4' : ''}`, className)}>
        {/* ========== Label Section ========== */}
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              'text-sm-medium',
              'peer-disabled:bg-(--color-surfaceTertiary) peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              labelClassName,
            )}
          >
            {label}
          </Label>
        )}

        {/* === Input Wrapper with Icon/Error Icon === */}
        <div className="relative h-10 md:h-11 w-full">
          <div className="flex items-center h-full w-full relative">
            {prefix && (
              <span className="absolute right-2 z-10 flex items-center h-full">
                {prefix}
              </span>
            )}
            {(icon || hasError) && (
              <div
                className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10',
                  'transition-colors duration-200 ease-in-out',
                  hasError
                    ? 'text-(--color-error-400)'
                    : 'text-(--color-gray-400)',
                )}
              >
                {/* Cross-fade icons for smooth swap */}
                <span
                  aria-hidden={hasError ? 'true' : 'false'}
                  className={cn(
                    'absolute inset-0 flex items-center justify-center',
                    'transition-opacity duration-200 ease-in-out',
                    hasError ? 'opacity-0' : 'opacity-100',
                  )}
                >
                  {icon}
                </span>
                <span
                  aria-hidden={hasError ? 'false' : 'true'}
                  className={cn(
                    'relative flex items-center justify-center',
                    'transition-opacity duration-200 ease-in-out',
                    hasError ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  <AlertCircle className="h-4 w-4" />
                </span>
              </div>
            )}
            <Input
              ref={ref}
              id={inputId}
              type={props.type || 'text'}
              className={cn(
                'h-10 md:h-11 w-full absolute inset-0',
                'transition-[color,border,box-shadow] duration-200 ease-in-out',
                (icon || hasError) && 'pl-10',
                prefix && 'pr-16',
                suffix && 'pl-16',
                hasError &&
                  'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive',
                inputClassName,
              )}
              // Accessibility: mark invalid state for screen readers
              aria-invalid={hasError}
              // Link input to error/helper text for screen readers
              aria-describedby={
                hasError
                  ? `${inputId}-error`
                  : helperText
                    ? `${inputId}-helper`
                    : undefined
              }
              {...props}
            />
            {suffix && (
              <span className="absolute left-2 z-10 flex items-center h-full">
                {suffix}
              </span>
            )}
          </div>
        </div>

        {/* ===== Error Message Section ===== */}
        {error && (
          <p
            className={cn('text-sm text-destructive', errorClassName)}
            id={`${inputId}-error`}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* ===== Helper Text Section (only shown if no error) ===== */}
        {helperText && !error && (
          <p
            className={cn('text-sm text-muted-foreground', helperTextClassName)}
            id={`${inputId}-helper`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export { TextInput };
