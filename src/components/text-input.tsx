import { useCallback, type ChangeEvent, type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function TextInput({
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
        'rounded-sm border border-border bg-background p-2 text-foreground shadow-sm text-base text-left',
        className
      )}
      onChange={handleChange}
      {...props}
    />
  );
}
