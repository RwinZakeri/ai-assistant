"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  labelClassName?: string;
  onLabelClick?: (e: React.MouseEvent<HTMLLabelElement>) => void;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, labelClassName, id, onLabelClick, ...props }, ref) => {
  const generatedId = React.useId()
  const checkboxId = id || generatedId;

  const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (onLabelClick) {
      onLabelClick(e);
      return;
    }
    if (!props.disabled && props.onCheckedChange) {
      e.preventDefault();
      // Toggle the checked state: if checked is true, set to false, otherwise set to true
      const newChecked = props.checked === true ? false : true;
      props.onCheckedChange(newChecked);
    }
  };

  const checkbox = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={checkboxId}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-sm border border-linePrimary bg-transparent ring-offset-background transition-colors cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary-300 data-[state=checked]:border-none data-[state=checked]:text-white",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current ")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label) {
    return (
      <div className="flex items-center gap-2">
        {checkbox}
        <LabelPrimitive.Root
          htmlFor={checkboxId}
          onClick={handleLabelClick}
          className={cn(
            "text-sm-demibold cursor-pointer select-none",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            props.disabled && "cursor-not-allowed opacity-50",
            labelClassName
          )}
        >
          {label}
        </LabelPrimitive.Root>
      </div>
    );
  }

  return checkbox;
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
