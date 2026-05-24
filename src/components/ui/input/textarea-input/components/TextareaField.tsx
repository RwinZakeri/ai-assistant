import React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles
        "h-32 w-80 rounded-md border border-input bg-transparent px-3 py-2",
        "text-base md:text-sm text-foreground placeholder:text-muted-foreground",
        "shadow-(--color-gray-900)/5 outline-none resize-none",
        "flex field-sizing-content",
        "transition-[color,box-shadow] duration-200",
        "dark:bg-transparent",

        // Focus styles
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",

        // Error styles
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "dark:aria-invalid:ring-destructive/40",

        // Disabled styles
        "disabled:cursor-not-allowed",

        className
      )}
      {...props}
    />
  );
}

export { Textarea };
