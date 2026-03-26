import { useMemo, type RefObject } from 'react';

import { useBrowsing } from '@/hooks/browsing';

// TODO: thinkk i need to proxy `href` so we have the same origin and i can interact with `iframeElem.contentWindow.window`
export function LiveView({
  baseUrl,
  name,
  ref,
}: {
  baseUrl: string;
  name: string;
  ref?: RefObject<HTMLIFrameElement | null>;
}) {
  const { browsing } = useBrowsing();

  const href = useMemo(() => {
    const url = new URL(browsing.path, baseUrl);
    if (browsing.subdomain) url.hostname = `${browsing.subdomain}.${url.hostname}`;
    return url.href;
  }, [browsing.subdomain, browsing.path, baseUrl]);

  return (
    <div className='grid size-full slide-in-up grid-rows-[auto_auto_1fr] text-center'>
      <h2 className='font-semibold'>{name}</h2>
      <h3 className='text-muted'>{href}</h3>
      <iframe title={name} ref={ref} className='h-full w-full border' src={href} sandbox='allow-same-origin' />
    </div>
  );
}
