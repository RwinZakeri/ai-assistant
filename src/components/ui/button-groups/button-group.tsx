import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot]]:border [&>[data-slot]]:border-gray-800 [&>[data-slot]]:hover:bg-surfaceSecondary [&>[data-slot][data-state=on]]:bg-surfaceSecondary [&>[data-slot][data-state=on]]:text-accent-foreground has-[>[data-slot=button-group]]:gap-2",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

type ButtonGroupProps = React.ComponentProps<"div"> &
  VariantProps<typeof buttonGroupVariants> & {
    value?: React.Key;
    defaultValue?: React.Key;
    onValueChange?: (value: React.Key) => void;
  };

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      orientation,
      children,
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<
      React.Key | undefined
    >(defaultValue);

    const selectedValue = isControlled ? value : internalValue;

    const handleSelection = React.useCallback(
      (nextValue: React.Key) => {
        if (!isControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
      [isControlled, onValueChange]
    );

    type ButtonChildProps = {
      value?: React.Key;
      onClick?: React.MouseEventHandler<Element>;
      ["data-slot"]?: string;
    };

    const items = React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      const element = child as React.ReactElement<ButtonChildProps>;
      const hasSelectableValue =
        element.props.value !== undefined ||
        typeof element.props.onClick === "function";

      if (!hasSelectableValue) {
        return element;
      }

      const buttonValue = element.props.value ?? element.key ?? index;
      const isSelected =
        selectedValue !== undefined ? selectedValue === buttonValue : false;

      const handleClick = (event: React.MouseEvent) => {
        element.props.onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        handleSelection(buttonValue);
      };

      return React.cloneElement(element, {
        "data-state": isSelected ? "on" : "off",
        "aria-pressed": isSelected,
        onClick: handleClick,
      } as Partial<ButtonChildProps> & {
        "data-state"?: "on" | "off";
        "aria-pressed"?: boolean;
      });
    });

    return (
      <div
        ref={ref}
        role="group"
        data-slot="button-group"
        data-orientation={orientation}
        className={cn(
          "flex flex-row-reverse",
          buttonGroupVariants({ orientation }),
          className
        )}
        {...props}
      >
        {items}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
