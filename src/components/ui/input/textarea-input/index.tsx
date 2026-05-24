import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../../label";
import { Textarea } from "./components/TextareaField";

export interface TextAreaFieldProps extends React.ComponentProps<"textarea"> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  className?: string;
  textareaClassName?: string;
  labelClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      className,
      textareaClassName,
      labelClassName,
      helperTextClassName,
      errorClassName,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId;
    const hasError = !!error;

    return (
      <div className={cn("space-y-1.5 ", className)}>
        {label && (
          <Label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium leading-none",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              hasError && "text-destructive",
              labelClassName
            )}
          >
            {label}
          </Label>
        )}

        <Textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "border-(--color-linePrimary) transition-[background-color,color,box-shadow,border]",
            "focus-visible:border-(--color-primary-300) focus-visible:ring-(--color-primary-300)/20 focus-visible:ring-[3px]",
            hasError &&
              "aria-invalid:border-(--color-error-400) aria-invalid:ring-(--color-error-400)/15 dark:aria-invalid:ring-(--color-error-400)/25",
            "disabled:text-foreground/80 disabled:placeholder:text-foreground/50",
            "disabled:cursor-not-allowed disabled:pointer-events-none",
            "dark:disabled:bg-(--color-disabledPrimary)",
            textareaClassName
          )}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          placeholder={props.placeholder}
          {...props}
        />

        <div className="min-h-[20px] mt-1.5">
          {error && (
            <p
              id={`${textareaId}-error`}
              className={cn("text-sm text-destructive", errorClassName)}
              role="alert"
            >
              {error}
            </p>
          )}

          {helperText && !error && (
            <p
              id={`${textareaId}-helper`}
              className={cn("text-sm text-muted-foreground", helperTextClassName)}
            >
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";

export { TextAreaField };
