import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

const sizes = {
  md: 'p-2',
} as const;

type Size = keyof typeof sizes;

const base = 'flex gap-2 transition-colors duration-150 border' as const;
const main = 'rounded-sm shadow-md' as const;

const variants = {
  primary: [
    base,
    main,
    'bg-primary text-primary-contrast shadow-md hover:bg-primary/67 active:bg-primary/33 border-primary',
  ],
  muted: [base, main, 'bg-muted text-muted-contrast shadow-md hover:bg-muted/67 active:bg-muted/33 border-muted'],
  success: [
    base,
    main,
    'bg-success text-success-contrast shadow-md hover:bg-success/67 active:bg-success/33 border-success',
  ],
  ghost: [base, 'text-foreground/67 hover:text-foreground border-transparent'],
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
