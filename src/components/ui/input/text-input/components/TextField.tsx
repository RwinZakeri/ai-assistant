import React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "h-10 md:h-11 w-80 min-w-0 rounded-md border border-linePrimary px-3 py-1",
        "text-base md:text-sm text-base-white placeholder:text-textSecondary text-md-regular",
        "shadow-xs outline-none",
        "transition-[background-color,color,box-shadow,border] duration-200",

        // Focus styles
        "focus-visible:border-(--color-primary-300) focus-visible:ring-(--color-primary-300)/20 focus-visible:ring-[3px]",

        // Error styles
        "aria-invalid:border-(--color-error-400) aria-invalid:ring-(--color-error-400)/15",
        "dark:aria-invalid:ring-(--color-error-400)/25",

        // Disabled styles
        "disabled:text-foreground/80 disabled:placeholder:text-foreground/50",
        "disabled:cursor-not-allowed ",
        "dark:disabled:bg-gray-100/18",

        // Remove number input spinner styles
        type === "number" &&
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",

        className
      )}
      style={
        type === "number"
          ? {
              MozAppearance: "textfield",
            }
          : undefined
      }
      {...props}
    />
  );
}

export { Input };
