import { useCallback, type ChangeEvent, type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function NumberInput({
  className,
  onChange,
  onValueChange,
  step,
  ...props
}: Omit<ComponentProps<'input'>, 'type' | 'placeholder' | 'min' | 'max' | 'step' | 'value'> & {
  placeholder: string;
  min: number;
  max: number;
  step: number;
  onValueChange?: (value: number) => void;
}) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(step % 0 ? event.target.valueAsNumber : Math.round(event.target.valueAsNumber));
      onChange?.(event);
    },
    [onChange, onValueChange, step]
  );

  return (
    <input
      type='number'
      className={cn(
        'rounded-sm border border-border bg-background p-2 text-foreground shadow-sm text-base text-right',
        className
      )}
      onChange={handleChange}
      step={step}
      {...props}
    />
  );
}
