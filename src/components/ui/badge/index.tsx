import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { XCloseIcon } from "@/assets/images/svg/XClose";
import { ArrowLeftIcon } from "@/assets/images/svg/ArrowLeft";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-2xl w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        gray: "bg-surfaceTertiary text-textTertiary",
        primary: "bg-primary-900 text-primary-100",
        sale: "bg-error-500 text-error-100 border border-error-700",
        warning: "bg-warning-900 text-warning-100",
        success: "bg-success-900 text-success-100",
        error: "bg-error-900 text-error-100",
      },
      size: {
        sm: "h-[18px] text-xs-medium",
        md: "h-6 text-sm font-medium",
        lg: "h-7 text-sm font-medium",
      },
      padding: {
        // No icon padding
        "no-icon-sm": "py-0.5 px-2",
        "no-icon-md": "py-0.5 px-2.5",
        "no-icon-lg": "py-1 px-3",
        // Close icon and trailing icon padding (top right bottom left)
        "close-sm": "py-0.5 pr-2 pb-0.5 pl-1.5",
        "close-md": "py-0.5 pr-2.5 pb-0.5 pl-2",
        "close-lg": "py-1 pr-3 pb-1 pl-2.5",
        // Leading icon padding (top right bottom left)
        "leading-sm": "py-0.5 pr-2 pb-0.5 pl-1.5",
        "leading-md": "py-0.5 pr-2.5 pb-0.5 pl-2",
        "leading-lg": "py-1 pr-3 pb-1 pl-2.5",
      },
    },
    defaultVariants: {
      variant: "gray",
      size: "md",
      padding: "no-icon-md",
    },
  }
);

interface BadgeProps
  extends React.ComponentProps<"span">,
    Omit<VariantProps<typeof badgeVariants>, "padding"> {
  asChild?: boolean;
  icon?: "close" | "leading" | "trailing";
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  // Determine padding based on icon type and size
  const getPaddingVariant = () => {
    const currentSize = size || "md";
    if (!icon) {
      return `no-icon-${currentSize}` as const;
    }
    if (icon === "close" || icon === "trailing") {
      return `close-${currentSize}` as const;
    }
    if (icon === "leading") {
      return `leading-${currentSize}` as const;
    }
    return `no-icon-${currentSize}` as const;
  };

  const renderIcon = () => {
    if (icon === "close") {
      return <XCloseIcon className="text-textSecondary" />;
    }
    if (icon === "leading" || icon === "trailing") {
      return <ArrowLeftIcon />;
    }
    return null;
  };

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant, size, padding: getPaddingVariant() }),
        className
      )}
      {...props}
    >
      {icon === "leading" && (
        <span className="flex items-center gap-1">
          {renderIcon()}
          {children}
        </span>
      )}
      {icon === "trailing" && (
        <span className="flex items-center gap-1">
          {children}
          {renderIcon()}
        </span>
      )}
      {icon === "close" && (
        <span className="flex items-center gap-1">
          {children}
          {renderIcon()}
        </span>
      )}
      {!icon && children}
    </Comp>
  );
}

export { Badge, badgeVariants };
