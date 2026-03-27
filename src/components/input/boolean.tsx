import { useCallback, useEffect, useRef, type ChangeEvent, type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function InputBoolean({
  className,
  onChange,
  onValueChange,
  value,
  defaultValue,
  name,
  ...props
}: Omit<
  ComponentProps<'input'>,
  'type' | 'placeholder' | 'checked' | 'value' | 'defaultValue' | 'checked' | 'defaultChecked'
> & {
  onValueChange?: (value: boolean) => void;
  value?: boolean;
  defaultValue?: boolean;
}) {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (ref.current) ref.current.value = String(event.target.checked);
      onValueChange?.(event.target.checked);
      onChange?.(event);
    },
    [onChange, onValueChange]
  );

  useEffect(() => {
    if (ref.current) ref.current.value = String(value ?? defaultValue ?? false);
  }, [value, defaultValue]);

  return (
    <>
      <input type='hidden' name={name} ref={ref} />
      <input
        type='checkbox'
        defaultChecked={defaultValue}
        checked={value}
        className={cn(
          'rounded-sm border border-border bg-background text-foreground shadow-md text-base text-left  outline-2 outline-transparent focus:outline-accent size-6 mx-auto my-[--spacing(2.1)]',
          className
        )}
        onChange={handleChange}
        {...props}
      />
    </>
  );
}
