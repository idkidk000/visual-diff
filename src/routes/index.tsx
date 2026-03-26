import { createFileRoute } from '@tanstack/react-router';
import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, type SubmitEvent } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/button';
import { LiveView } from '@/components/live-view';
import { TextInput } from '@/components/text-input';
import { useBrowsing } from '@/hooks/browsing';
import { useConfig } from '@/hooks/config';
import { useNav } from '@/hooks/nav';

export const Route = createFileRoute('/')({ component: App });

function App() {
  const { browsing, setBrowsing } = useBrowsing();
  const { ref: navRef } = useNav();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { config } = useConfig();

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const subdomain = data.get('subdomain');
      const url = data.get('url');
      setBrowsing((prev) => ({ ...prev, subdomain: subdomain ? String(subdomain) : undefined, path: String(url) }));
    },
    [setBrowsing]
  );

  useEffect(() => {
    if (!iframeRef.current) return;
    const controller = new AbortController();
    iframeRef.current.addEventListener(
      'scroll',
      (event) => {
        console.log(event);
      },
      { signal: controller.signal }
    );
    return () => controller.abort();
  }, []);

  return (
    <>
      {navRef.current &&
        createPortal(
          <form className='col-span-2 flex flex-wrap gap-2' onSubmit={handleSubmit}>
            <TextInput placeholder='Subdomain' defaultValue={browsing.subdomain} name='subdomain' />
            <TextInput placeholder='URL Fragment' defaultValue={browsing.path} name='url' />
            <Button variant='muted'>
              <RefreshCw />
            </Button>
          </form>,
          navRef.current
        )}
      <div className='grid size-full grid-cols-2 gap-4'>
        <LiveView baseUrl={config.sources.left.baseUrl} name={config.sources.left.name} ref={iframeRef} />
        <LiveView baseUrl={config.sources.right.baseUrl} name={config.sources.right.name} />
      </div>
    </>
  );
}
