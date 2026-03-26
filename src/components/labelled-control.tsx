import { type ComponentProps, type ReactElement } from 'react';

import { cn } from '@/lib/utils';

export function LabelledControl({
  children,
  className,
  label,
  position = 'above',
  ...props
}: ComponentProps<'label'> & { label: string; position?: 'above' | 'left'; children: ReactElement }) {
  return (
    <label className={cn('flex gap-2', position === 'above' && 'flex-col', className)} {...props}>
      {label}
      {children}
    </label>
  );
}
