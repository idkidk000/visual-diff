import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

const sizes = {
  md: 'p-2',
} as const;

type Size = keyof typeof sizes;

const base = 'flex gap-2';
const main = 'rounded-sm shadow-sm';

const variants = {
  primary: [base, main, 'bg-primary text-primary-contrast shadow-sm hover:bg-primary/66 active:bg-primary/33'],
  muted: [base, main, 'bg-muted text-muted-contrast shadow-sm hover:bg-muted/66 active:bg-muted/33'],
  success: [base, main, 'bg-success text-success-contrast shadow-sm hover:bg-success/66 active:bg-success/33'],
  ghost: [base],
} as const;

type Variant = keyof typeof variants;

export function Button({
  children,
  className,
  size = 'md',
  variant = 'primary',
  ...props
}: ComponentProps<'button'> & { size?: Size; variant?: Variant }) {
  return (
    <button className={cn(sizes[size], variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
