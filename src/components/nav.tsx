import { displayName } from '@root/package.json';
import { Settings } from 'lucide-react';
import type { RefObject } from 'react';

import { Button } from '@/components/button';
import { useNav } from '@/hooks/nav';

export function Nav() {
  const { ref } = useNav();
  return (
    <nav className='flex min-h-18 slide-in-down items-center bg-primary px-4 text-primary-contrast shadow-xl'>
      <div className='mx-auto grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4'>
        <h1 className='font-semibold'>{displayName}</h1>
        <div ref={ref as RefObject<HTMLDivElement | null>} className='mx-auto' />
        <Button variant='ghost' className='text-foreground/66 hover:text-foreground'>
          <Settings />
        </Button>
      </div>
    </nav>
  );
}
