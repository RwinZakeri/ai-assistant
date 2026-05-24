import { Checkparimary20Icon } from '@/assets/images/svg/Checkparimary20';
import { ChevronDownIcon } from '@/assets/images/svg/ChevronDown';
import { SearchLgIcon } from '@/assets/images/svg/SearchLg';
import { Tag } from '@/components/ui/tag';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

type DropdownType = 'default' | 'search' | 'tags';

export interface DropdownInputProps {
  type?: DropdownType;
  placeholder?: string;
  searchPlaceholder?: string;
  options: Array<{ value: string; label: string }>;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  onInputChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  className?: string;
  label?: string;
  helperText?: string;
  error?: string;
}

interface SelectTriggerProps extends React.ComponentProps<
  typeof SelectPrimitive.Trigger
> {
  variant?: DropdownType;
}

function SelectTrigger({
  className,
  children,
  variant,
  hasError,
  ...props
}: SelectTriggerProps & { hasError?: boolean }) {
  return (
    <SelectPrimitive.Trigger
      aria-invalid={hasError}
      data-slot="select-trigger"
      className={cn(
        "border-linePrimary data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus:outline-none data-[state=open]:border-primary-300 data-[state=open]:ring-4 data-[state=open]:ring-(--color-gray-500)/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex w-fit items-center justify-between gap-2 rounded-md border px-[14px] text-md-regular whitespace-nowrap shadow-xs transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 h-11 cursor-pointer *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4  bg-base-black",
        hasError &&
          'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive',
        className,
      )}
      {...props}
    >
      {variant === 'search' && <SearchLgIcon className="size-4 opacity-50" />}
      {variant !== 'search' && (
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-4 opacity-50 " />
        </SelectPrimitive.Icon>
      )}
      {children}
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  align = 'center',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        avoidCollisions
        align={align}
        collisionPadding={8}
        data-slot="select-content"
        position={position}
        side="bottom"
        sideOffset={4}
        className={cn(
          'bg-base-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative z-50 max-h-[320px] mt-1 overflow-hidden rounded-md border shadow-md',
          position === 'popper' && '',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            'p-1 max-h-[320px] overflow-y-auto',
            position === 'popper' &&
              'w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <div className="h-12 w-full ">
      <SelectPrimitive.Item
        data-slot="select-item"
        className={cn(
          'flex-row-reverse focus:bg-surfaceSecondary data-[state=checked]:bg-surfaceSecondary data-[state=checked]:text-accent-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm h-11 pr-[14px] pl-2 text-md-medium outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ',
          className,
        )}
        {...props}
      >
        <span className=" absolute left-[14px] flex size-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <Checkparimary20Icon className="size-5" />
          </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText className="">
          {children}
        </SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    </div>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      data-slot="select-separator"
      {...props}
    />
  );
}

// Main DropdownInput component ================================================
function DropdownInput({
  type = 'default',
  placeholder = 'انتخاب کنید',
  searchPlaceholder = 'جستجو',
  options = [],
  value,
  onValueChange,
  onInputChange,
  onKeyDown,
  multiple = false,
  className,
  label,
  helperText,
  error,
}: DropdownInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const listboxId = React.useId();
  const dropdownRef = React.useRef<HTMLDivElement | HTMLInputElement | null>(
    null,
  );
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (type === 'search' && value !== undefined) {
      if (typeof value === 'string') {
        const selectedOption = options.find(opt => opt.value === value);
        if (selectedOption) {
          setInputValue(selectedOption.label);
        } else if (value === '') {
          setInputValue('');
        }
      }
    }
  }, [value, options, type]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const currentRef =
        type === 'search'
          ? (dropdownRef.current as HTMLDivElement | null)
          : dropdownRef.current;
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, type]);

  const filteredOptions = React.useMemo(() => {
    if (type === 'search') {
      if (inputValue) {
        return options.filter(option =>
          option.label.toLowerCase().includes(inputValue.toLowerCase()),
        );
      }
      return options;
    }
    return options;
  }, [options, inputValue, type]);

  const handleValueChange = (newValue: string) => {
    if (type === 'tags' || multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const updatedValues = currentValues.includes(newValue)
        ? currentValues.filter(v => v !== newValue)
        : [...currentValues, newValue];
      onValueChange?.(updatedValues);
    } else {
      if (type === 'search') {
        const selectedOption = options.find(opt => opt.value === newValue);
        const selectedLabel = selectedOption?.label || '';
        setInputValue(selectedLabel);
        // Pass the option value (ID) for filtering, not the label
        onValueChange?.(newValue);
        setIsOpen(false);
        setIsFocused(false);
        // Blur the input when an item is selected
        if (inputRef.current) {
          inputRef.current.blur();
        }
      } else {
        onValueChange?.(newValue);
      }
    }
  };

  // const removeTag = (tagValue: string) => {
  //   if (Array.isArray(value)) {
  //     const updatedValues = value.filter((v) => v !== tagValue);
  //     onValueChange?.(updatedValues);
  //   }
  // };

  // const getDisplayValue = () => {
  //   if (type === "tags" || multiple) {
  //     const values = Array.isArray(value) ? value : [];
  //     if (values.length === 0) return placeholder;
  //     return values
  //       .map((val) => options.find((opt) => opt.value === val)?.label)
  //       .join(", ");
  //   }
  //   if (type === "search") {
  //     return inputValue || placeholder;
  //   }
  //   if (typeof value === "string") {
  //     return options.find((opt) => opt.value === value)?.label || placeholder;
  //   }
  //   return placeholder;
  // };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="text-sm-medium text-textSecondary mb-[6px] block">
          {label}
        </label>
      )}

      {type === 'search' ? (
        <div
          ref={dropdownRef as React.RefObject<HTMLDivElement>}
          className="relative"
        >
          <input
            ref={inputRef}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={isOpen}
            aria-invalid={!!error}
            placeholder={searchPlaceholder}
            role="combobox"
            type="text"
            value={inputValue}
            className={cn(
              'text-textTertiary text-md-regular w-full h-11 px-[14px] pr-10 border rounded-md bg-base-black focus:outline-none focus:ring-4 cursor-text disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                : 'border-linePrimary focus:border-primary-300 focus:ring-(--color-gray-500)/30',
            )}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setIsOpen(false), 150);
            }}
            onChange={e => {
              const newValue = e.target.value;
              setInputValue(newValue);
              // Call onInputChange for real-time search
              onInputChange?.(newValue);
              // Clear filter if input is cleared
              if (newValue === '' && value) {
                onValueChange?.('');
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              if (options.length > 0) {
                setIsOpen(true);
              }
            }}
            onKeyDown={e => {
              // Call custom onKeyDown handler if provided
              if (onKeyDown) {
                onKeyDown(e);
                // If event was prevented, don't continue
                if (e.defaultPrevented) {
                  return;
                }
              }
              // Clear filter on Escape key
              if (e.key === 'Escape' && value) {
                setInputValue('');
                onValueChange?.('');
              }
            }}
          />
          <SearchLgIcon className="absolute right-3 top-1/2 transform -translate-y-1/2  opacity-50 pointer-events-none text-textSecondary " />
          {isOpen && isFocused && filteredOptions.length > 0 && (
            <div
              id={listboxId}
              role="listbox"
              className={cn(
                'absolute top-full bg-base-black left-0 right-0 z-50 mt-1 rounded-md border shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 [direction:ltr] [&>*]:[direction:rtl]',
                filteredOptions.length <= 6
                  ? 'h-auto overflow-hidden'
                  : 'max-h-[320px] overflow-y-auto',
              )}
              style={
                filteredOptions.length > 0 && filteredOptions.length <= 6
                  ? {
                      height: `${
                        8 +
                        filteredOptions.length * 44 +
                        (filteredOptions.length - 1) * 4
                      }px`,
                    }
                  : undefined
              }
            >
              <div className="p-1 space-y-1  ">
                {filteredOptions.map(option => {
                  const isSelected = value === option.value;
                  return (
                    <div
                      key={option.value}
                      aria-selected={isSelected}
                      role="option"
                      className={cn(
                        'relative flex w-full text-textTertiary cursor-pointer items-center rounded-sm h-11 pr-[14px] pl-2 text-md-medium outlin  hover:bg-surfaceSecondary',
                        isSelected && 'bg-surfaceSecondary ',
                      )}
                      onMouseDown={e => {
                        e.preventDefault();
                        handleValueChange(option.value);
                      }}
                    >
                      <span className="absolute left-[14px] flex  items-center justify-center">
                        {isSelected && (
                          <Checkparimary20Icon className="size-5" />
                        )}
                      </span>
                      <span className=" text-textTertiary text-md-medium">
                        {option.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : type === 'tags' || multiple ? (
        <div ref={dropdownRef} className="relative">
          <div
            aria-controls={listboxId}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={!!error}
            role="combobox"
            tabIndex={0}
            className={cn(
              "data-[placeholder]:text-textTertiary [&_svg:not([class*='text-'])]:text-muted-foreground focus:outline-none dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-[14px] text-md-medium shadow-xs transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 min-h-11 py-2 cursor-pointer",
              error
                ? 'border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40'
                : 'border-linePrimary',
              isOpen &&
                !error &&
                'border-primary-300 ring-4 ring-(--color-gray-500)/30',
              isOpen && error && 'ring-4 ring-destructive/20',
              className,
            )}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(!isOpen);
              } else if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
          >
            <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
              {Array.isArray(value) && value.length > 0 ? (
                value.map(val => {
                  const option = options.find(opt => opt.value === val);
                  return (
                    <Tag
                      key={val}
                      showCloseIcon
                      size="sm"
                      onClose={() => {
                        const newValues = value.filter(v => v !== val);
                        onValueChange?.(newValues);
                      }}
                    >
                      {option?.label}
                    </Tag>
                  );
                })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDownIcon className="size-4 opacity-50 flex-shrink-0 " />
          </div>

          {/* Custom dropdown content */}
          {isOpen && (
            <div
              aria-multiselectable="true"
              id={listboxId}
              role="listbox"
              className={cn(
                'absolute top-full left-0 right-0 z-50 mt-1 bg-popover text-popover-foreground rounded-md border shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 [direction:ltr] [&>*]:[direction:rtl] overflow-hidden',
                filteredOptions.length === 0
                  ? 'h-12'
                  : filteredOptions.length > 0
                    ? filteredOptions.length <= 6
                      ? 'h-auto overflow-hidden'
                      : 'max-h-[320px] overflow-y-auto'
                    : 'h-12',
              )}
              style={
                filteredOptions.length > 0 && filteredOptions.length <= 6
                  ? {
                      height: `${
                        8 +
                        filteredOptions.length * 44 +
                        (filteredOptions.length - 1) * 4
                      }px`,
                    }
                  : undefined
              }
            >
              <div className="p-1 space-y-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(option => {
                    const isSelected =
                      Array.isArray(value) && value.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        aria-selected={isSelected}
                        role="option"
                        className={cn(
                          'relative flex w-full cursor-pointer items-center gap-2 rounded-sm h-11 pr-[14px] pl-2 text-md-medium outline-hidden select-none hover:bg-surfaceSecondary hover:text-accent-foreground',
                          isSelected && 'bg-surfaceSecondary ',
                        )}
                        onMouseDown={e => {
                          e.preventDefault();
                          const currentValues = Array.isArray(value)
                            ? value
                            : [];
                          if (isSelected) {
                            const newValues = currentValues.filter(
                              v => v !== option.value,
                            );
                            onValueChange?.(newValues);
                          } else {
                            onValueChange?.([...currentValues, option.value]);
                          }
                        }}
                      >
                        <span className="absolute left-[14px] flex items-center justify-center">
                          {isSelected && (
                            <Checkparimary20Icon className="size-5" />
                          )}
                        </span>
                        <span className="flex-1">{option.label}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-md-medium text-muted-foreground">
                    هیچ نتیجه‌ای یافت نشد
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Select
          value={Array.isArray(value) ? value[0] : value}
          onValueChange={handleValueChange}
        >
          <SelectTrigger
            className={className}
            hasError={!!error}
            variant={type}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {filteredOptions
              .filter(option => option.value !== '')
              .map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}

      {error && (
        <p className="text-sm text-destructive mt-2" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm-regular text-textSecondary mt-2">{helperText}</p>
      )}
    </div>
  );
}

export {
  DropdownInput,
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
