import { useCallback, type ChangeEvent, type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function InputNumber({
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
        'rounded-sm border border-border bg-background text-foreground p-2 shadow-md text-base text-right  outline-2 outline-transparent focus:outline-accent',
        className
      )}
      onChange={handleChange}
      step={step}
      {...props}
    />
  );
}
