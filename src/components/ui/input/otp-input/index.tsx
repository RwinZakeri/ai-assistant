"use client";

import React from "react";

import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "@/lib/utils";
import { persianToEnglish } from "@/utils/persianToEnglish";

function InputOTP({
  className,
  containerClassName,
  onChange,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  // Enforce digits-only and support RTL direction
  // Convert Persian digits to English before filtering
  const handleChange = (value: string) => {
    const convertedValue = persianToEnglish(value);
    const digitsOnly = convertedValue.replace(/\D/g, "");
    onChange?.(digitsOnly);
  };

  // Block non-digit keys on desktop while allowing navigation keys
  // Support both English and Persian digits
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = new Set([
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ]);
    if (allowedKeys.has(e.key)) {
      onKeyDown?.(e);
      return;
    }
    // Check for English digits (0-9) or Persian digits (۰-۹)
    const isEnglishDigit = /^\d$/.test(e.key);
    const isPersianDigit = /^[۰-۹]$/.test(e.key);
    if (!isEnglishDigit && !isPersianDigit) {
      e.preventDefault();
      return;
    }
    // Allow both English and Persian digits - conversion happens in handleChange
    onKeyDown?.(e);
  };

  return (
    <OTPInput
      data-slot="input-otp"
      dir="ltr"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]*"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      containerClassName={cn(
        "flex items-center  has-disabled:*:*:bg-(--color-disabledPrimary) has-disabled:*:*:border-(--color-linePrimary) ",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2 flex-row-reverse", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  const hasValue = char && char.trim() !== "";

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-has-value={hasValue}
      className={cn(
        // Base slot styles
        "relative flex h-14 w-14 sm:w-16 sm:h-16 items-center justify-center rounded-lg border text-sm shadow-xs transition-all outline-none",
        // Base colors
        "border-(--color-gray-400)  text-foreground title-sm-demibold",
        // Focus/active state with ring (only when focused)
        "data-[active=true]:border-(--color-primary-400) data-[active=true]:border-2 data-[active=true]:text-(--color-primary-400) data-[active=true]:ring-(--color-primary-500)/40 data-[active=true]:ring-[3px] data-[active=true]:z-10",
        // Has value state - only border change, no ring (but not when error)
        "data-[has-value=true]:border-(--color-primary-400) data-[has-value=true]:border-2 data-[has-value=true]:text-(--color-primary-400) aria-invalid:data-[has-value=true]:border-(--color-error-500) aria-invalid:data-[has-value=true]:text-(--color-error-400)",
        // Error state (matches input fields) - should override value state
        "aria-invalid:border-(--color-error-500) aria-invalid:border-2 aria-invalid:text-(--color-error-400) data-[active=true]:aria-invalid:border-(--color-error-500) data-[active=true]:aria-invalid:text-(--color-error-400) data-[active=true]:aria-invalid:ring-(--color-error-500)",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot };
