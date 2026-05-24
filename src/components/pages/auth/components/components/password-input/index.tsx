"use client";

import { TickCircleIcon } from "@/assets/images/svg/TickCircle";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { persianToEnglish } from "@/utils/persianToEnglish";

import { EyeIcon } from "@/assets/images/svg/Eye";
import { EyeOffIcon } from "@/assets/images/svg/EyeOff";
import React, { useEffect, useState } from "react";

export interface PasswordRequirement {
  text: string;
  check?: (password: string) => boolean;
}

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
  error?: string;
  showRequirements?: boolean;
  requirements?: PasswordRequirement[];
  onPasswordChange?: (value: string) => void;
  convertPersianToEnglish?: boolean;
  useWebkitTextSecurity?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  requirementsClassName?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      showRequirements = false,
      requirements = [],
      onPasswordChange,
      convertPersianToEnglish: shouldConvert = false,
      useWebkitTextSecurity = false,
      labelClassName,
      inputClassName,
      errorClassName,
      requirementsClassName,
      id,
      className,
      onChange,
      value,
      onKeyDown: originalOnKeyDown,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState(
      typeof value === "string" ? value : ""
    );

    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const hasError = !!error;

    // Sync internal state with controlled value prop
    useEffect(() => {
      if (typeof value === "string") {
        setPasswordValue(value);
      }
    }, [value]);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Check if a character is Persian (letters or digits)
    const isPersianCharacter = (char: string): boolean => {
      // Persian digits: ۰-۹
      // Persian letters: آ-ی (includes all Persian alphabet)
      const persianRegex = /[\u0600-\u06FF]/;
      return persianRegex.test(char);
    };

    // Filter out Persian characters from a string
    const filterPersianCharacters = (str: string): string => {
      return str
        .split("")
        .filter((char) => !isPersianCharacter(char))
        .join("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow navigation and control keys
      const allowedKeys = new Set([
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Tab",
        "Home",
        "End",
        "Enter",
        "Escape",
        "Meta",
        "Control",
        "Alt",
        "Shift",
      ]);

      if (allowedKeys.has(e.key)) {
        return;
      }

      // Block Persian characters
      if (isPersianCharacter(e.key)) {
        e.preventDefault();
        return;
      }

      // Call original onKeyDown if provided
      if (originalOnKeyDown) {
        originalOnKeyDown(e);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // First, filter out any Persian characters
      value = filterPersianCharacters(value);

      // Then convert Persian digits to English if needed (for backward compatibility)
      if (shouldConvert) {
        value = persianToEnglish(value);
      }

      setPasswordValue(value);

      // Create a synthetic event with the filtered value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      // Call the original onChange if provided
      if (onChange) {
        onChange(syntheticEvent);
      }

      // Call the custom onPasswordChange if provided
      if (onPasswordChange) {
        onPasswordChange(value);
      }
    };

    const getPasswordRequirements = () => {
      if (!showRequirements || requirements.length === 0) {
        return null;
      }

      return requirements.map((req, index) => {
        const isMet = req.check ? req.check(passwordValue) : false;

        return (
          <div
            key={index}
            className={cn(
              "text-sm flex items-center gap-2 justify-start transition-colors duration-300 ease-in-out",
              isMet ? "text-primary-300" : "text-textSecondary",
              requirementsClassName
            )}
          >
            <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
              <TickCircleIcon
                className={cn(
                  "w-4 h-4 transition-all duration-100 ease-out",
                  isMet ? "opacity-100 scale-100" : "opacity-0 scale-10"
                )}
                style={{
                  transitionTimingFunction: isMet
                    ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "ease-out",
                }}
              />
            </div>
            <span className="text-xs-regular transition-colors duration-100 ease-in-out">
              {req.text}
            </span>
          </div>
        );
      });
    };

    const inputType = useWebkitTextSecurity
      ? "text"
      : showPassword
      ? "text"
      : "password";

    return (
      <div className={cn("space-y-1.5", className)}>
        {label && (
          <Label
            htmlFor={inputId}
            className={cn("text-sm-medium leading-none", labelClassName)}
          >
            {label}
          </Label>
        )}

        <div className="relative h-10 md:h-11 w-full">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              "h-10 md:h-11 w-full rounded-md border border-linePrimary px-3 py-1 pr-3",
              "text-base md:text-md-regular text-base-white placeholder:text-textSecondary",
              "bg-transparent shadow-xs outline-none",
              "transition-[background-color,color,box-shadow,border] duration-200",
              "focus-visible:border-primary-300 focus-visible:ring-primary-300/20 focus-visible:ring-[3px]",
              hasError && "border-error-500",
              inputClassName
            )}
            style={
              useWebkitTextSecurity
                ? ({
                    WebkitTextSecurity: showPassword ? "none" : "disc",
                  } as React.CSSProperties)
                : undefined
            }
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-base-white transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeIcon className="h-4 w-4" />
            ) : (
              <EyeOffIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {hasError && (
          <div className="h-5 min-h-[1.25rem] overflow-hidden">
            <p
              id={`${inputId}-error`}
              className={cn(
                "text-sm text-error-500 transition-all duration-300 ease-out",
                hasError
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2",
                errorClassName
              )}
              role="alert"
            >
              {error}
            </p>
          </div>
        )}

        {showRequirements && requirements.length > 0 && (
          <div className="space-y-2 mt-3">{getPasswordRequirements()}</div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
