import { createFileRoute } from '@tanstack/react-router';
import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type SubmitEvent } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/button';
import { LabelledControl } from '@/components/labelled-control';
import { NumberInput } from '@/components/number-input';
import { SourceView } from '@/components/source-view';
import { TextInput } from '@/components/text-input';
import { useBrowsing } from '@/hooks/browsing';
import { useNav } from '@/hooks/nav';

export const Route = createFileRoute('/')({ component: App });

// TODO: move breakpoints out to config. will need to dynamically inject a stylesheet with container queryies
function App() {
  const { browsing, setBrowsing } = useBrowsing();
  const { ref: navRef } = useNav();
  const leftRef = useRef<HTMLIFrameElement | null>(null);
  const rightRef = useRef<HTMLIFrameElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const height = data.get('height');
      const subdomain = data.get('subdomain');
      const path = data.get('path');
      setBrowsing((prev) => ({
        ...prev,
        height: parseInt(String(height), 10),
        path: String(path) || '/',
        subdomain: subdomain ? String(subdomain) : null,
      }));
    },
    [setBrowsing]
  );

  useEffect(() => {
    if (!leftRef.current) return;
    const controller = new AbortController();
    leftRef.current.addEventListener(
      'scroll',
      (event) => {
        console.log(event);
      },
      { signal: controller.signal }
    );
    function updateWidth() {
      if (!leftRef.current) return;
      const width = leftRef.current.getBoundingClientRect().width;
      setWidth(Math.round(width));
    }
    const observer = new ResizeObserver(updateWidth);
    observer.observe(leftRef.current);
    controller.signal.addEventListener('abort', () => observer.disconnect());
    updateWidth();
    return () => controller.abort();
  }, [setBrowsing]);

  return (
    <>
      {navRef.current &&
        createPortal(
          <form className='mx-auto flex flex-wrap items-end gap-2' onSubmit={handleSubmit}>
            <LabelledControl label='Subdomain' className='gap-0 text-xs'>
              <TextInput placeholder='Subdomain' defaultValue={browsing.subdomain ?? ''} name='subdomain' />
            </LabelledControl>
            <LabelledControl label='Path' className='gap-0 text-xs'>
              <TextInput placeholder='Path' defaultValue={browsing.path} name='path' />
            </LabelledControl>
            <LabelledControl label='Height Px' className='gap-0 text-xs'>
              <NumberInput
                placeholder='Height Px'
                defaultValue={browsing.height}
                name='height'
                min={1000}
                max={Infinity}
                step={100}
              />
            </LabelledControl>
            <Button variant='muted'>
              <RefreshCw />
            </Button>
            {width && <span className='py-2.5'>{`${width}px`}</span>}
          </form>,
          navRef.current
        )}
      <div className='grid size-full grid-cols-2 justify-center gap-4 @min-[calc(0900px+1rem)]:grid-cols-[repeat(2,450px)] @min-[calc(1300px+1rem)]:grid-cols-[repeat(2,650px)] @min-[calc(1900px+1rem)]:grid-cols-[repeat(2,950px)] @min-[calc(2500px+1rem)]:grid-cols-[repeat(2,1250px)] @min-[calc(3000px+1rem)]:grid-cols-2'>
        <SourceView ref={leftRef} sourceName='left' />
        <SourceView ref={rightRef} sourceName='right' />
      </div>
    </>
  );
}
