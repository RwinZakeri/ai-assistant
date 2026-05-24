import React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex shadow-[0px_1px_2px_0px_#1018280D] items-center justify-center gap-2 whitespace-nowrap rounded-md cursor-pointer transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-textSecondary [&_svg]:pointer-events-none  shrink-0 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        primary:
          'bg-primary-500 text-white hover:bg-primary-700 focus-visible:bg-primary-500 focus-visible:shadow-[0_0_0_4px_#511BDD66] disabled:bg-primary-900',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        tertiaryColor:
          'text-primary-200 hover:bg-primary-800 hover:text-primary-100 disabled:text-gray-300',
        secondary:
          ' outline outline-linePrimary outline-1 text-base-white hover:bg-gray-700 disabled:bg-gray-700  disabled:outline-gray-200',
        tertiary: 'hover:bg-surfaceSecondary',
        link: 'text-textTertiary hover:text-gray-100 disabled:text-disabledPrimary',
        linkColor:
          '!text-primary-300 hover:text-primary-200 disabled:text-disabledPrimary',
        error:
          'bg-error-600 text-white hover:bg-error-700 disabled:bg-surfaceTertiary disabled:text-linePrimary disabled:outline-linePrimary disabled:outline-1',
      },
      size: {
        md: 'h-10 px-4 py-[10px]  text-sm-demibold has-[>svg]:px-3',
        sm: 'h-9 px-[14px] py-2  has-[>svg]:px-2.5 text-sm-demibold',
        lg: 'h-11 py-[10px] px-[18px] has-[>svg]:px-4 text-md-demibold',
        xl: 'h-12 py-3 px-5 has-[>svg]:px-4 text-md-demibold',
        xxl: 'h-15 py-4 px-7 has-[>svg]:px-4 text-lg-demibold',
        icon: 'size-9',
      },
      loading: {
        true: 'opacity-70 cursor-wait',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      loading: false,
    },
  },
);

function Button({
  className,
  variant,
  size,
  loading = false,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, loading, className }))}
      data-slot="button"
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            fill="currentColor"
          />
        </svg>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
