import { displayName } from '@root/package.json';

import { ConfigModal } from '@/components/config-modal';
import { useNav } from '@/hooks/nav';

export function Nav() {
  const { ref } = useNav();
  return (
    <nav className='grid slide-in-down grid-cols-[auto_1fr_auto] items-center justify-between gap-4 bg-primary p-4 font-semibold text-primary-contrast shadow'>
      <h1>{displayName}</h1>
      <div ref={ref} className='mx-auto' />
      <ConfigModal />
    </nav>
  );
}
