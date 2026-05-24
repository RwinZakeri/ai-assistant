"use client";

import { cn } from "@/lib/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

interface CustomRadioItemProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  className?: string;
}

export function CustomRadioItem({ className, ...props }: CustomRadioItemProps) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "w-4 h-4 rounded-full border border-linePrimary bg-transparent",
        "data-[state=checked]:bg-primary-300 data-[state=checked]:border-primary-300",
        "disabled:border-linePrimary disabled:bg-transparent",
        "outline-none transition-colors",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center w-full h-full">
        <div className="w-1.5 h-1.5 rounded-full bg-base-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
