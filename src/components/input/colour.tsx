import { useCallback, type ChangeEvent, type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function InputColour({
  className,
  onChange,
  onValueChange,
  ...props
}: Omit<ComponentProps<'input'>, 'type' | 'placeholder'> & {
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
      type='color'
      className={cn(
        'rounded-sm border border-border bg-background text-foreground p-1 shadow-md text-base text-left  outline-2 outline-transparent focus:outline-accent size-10.5 mx-auto',
        className
      )}
      onChange={handleChange}
      {...props}
    />
  );
}
