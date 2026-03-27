import { useCallback, type ChangeEvent, type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function InputText({
  className,
  onChange,
  onValueChange,
  ...props
}: Omit<ComponentProps<'input'>, 'type' | 'placeholder'> & {
  type?: 'text' | 'url';
  placeholder: string;
  onValueChange?: (value: string) => void;
}) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(event.target.value);
      onChange?.(event);
    },
    [onChange, onValueChange]
  );

  return (
    <input
      className={cn(
        'rounded-sm border border-border bg-background text-foreground p-2 shadow-md text-base text-left  outline-2 outline-transparent focus:outline-accent',
        className
      )}
      onChange={handleChange}
      {...props}
    />
  );
}
