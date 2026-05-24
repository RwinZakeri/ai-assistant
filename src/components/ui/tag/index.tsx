import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { DashboardTagCloseIcon } from "@/assets/images/svg/DashboardTagClose";

const tagVariants = cva(
  "inline-flex items-center justify-center rounded-md w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden border bg-black text-text-tertiary border-[#555962]",
  {
    variants: {
      size: {
        sm: "text-xs-medium h-6 py-[3px] px-2",
        md: "text-sm-medium h-6 py-[2px] px-[9px]",
        lg: "text-sm-medium h-7 py-1 px-[10px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface TagProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof tagVariants> {
  asChild?: boolean;
  showCloseIcon?: boolean;
  onClose?: () => void;
}

function Tag({
  className,
  size,
  asChild = false,
  showCloseIcon = false,
  onClose,
  children,
  ...props
}: TagProps) {
  const Comp = asChild ? Slot : "span";

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <Comp
      data-slot="tag"
      className={cn(tagVariants({ size }), className)}
      {...props}
    >
      {children}
      {showCloseIcon && (
        <button
          type="button"
          onClick={handleCloseClick}
          className="flex  items-center justify-space-between  transition-opacity"
          aria-label="Close tag"
        >
          <div className=" w-[16px] h-[16px] mr-1.5 -ml-1 hover:bg-surfaceSecondary rounded-[3px]   cursor-pointer flex items-center justify-center">
            <DashboardTagCloseIcon />
          </div>
        </button>
      )}
    </Comp>
  );
}

export { Tag, tagVariants };
