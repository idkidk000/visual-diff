import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type SubmitEvent } from 'react';

import { Button } from '@/components/button';
import { InputBoolean } from '@/components/input/boolean';
import { InputColour } from '@/components/input/colour';
import { InputNumber } from '@/components/input/number';
import { InputText } from '@/components/input/text';
import { LabelledControl } from '@/components/labelled-control';
import { SourceView } from '@/components/source-view';
import { useConfig } from '@/hooks/config';
import { dottedKeyEntriesToObject, objectToDottedKeyEntries } from '@/lib/utils';

export function App() {
  const { config, updateConfig } = useConfig();
  const leftRef = useRef<HTMLIFrameElement | null>(null);
  const rightRef = useRef<HTMLIFrameElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      updateConfig(dottedKeyEntriesToObject(new FormData(event.target).entries()));
    },
    [updateConfig]
  );

  useEffect(() => {
    for (const [fieldName, value] of objectToDottedKeyEntries(config)) {
      const field = formRef.current?.querySelector<HTMLInputElement>(`[name="${fieldName}"]`);
      if (field) field.value = value === null ? '' : String(value);
    }
  }, [config]);

  useEffect(() => {
    if (!leftRef.current) return;

    const controller = new AbortController();

    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key.toLocaleLowerCase() === 'k' && event.ctrlKey && !event.altKey && !event.shiftKey) {
          console.debug('ctrl+k');
          event.preventDefault();
          formRef.current?.querySelector('input')?.focus();
        }
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
    updateWidth();

    controller.signal.addEventListener('abort', () => observer.disconnect());

    return () => controller.abort();
  }, []);

  return (
    <div className='grid h-dvh max-h-dvh min-h-dvh grid-rows-[auto_1fr] overflow-hidden wrap-anywhere'>
      <nav className='slide-in-down bg-primary px-4 py-2 text-primary-contrast shadow-xl'>
        <form className='flex flex-wrap items-end justify-center gap-4' onSubmit={handleSubmit} ref={formRef}>
          <LabelledControl label='Subdomain' className='gap-0 text-xs'>
            <InputText
              placeholder='Subdomain'
              defaultValue={config.browsing.subdomain ?? ''}
              name='browsing.subdomain'
              className='w-[20ch]'
            />
          </LabelledControl>
          <LabelledControl label='Path' className='gap-0 text-xs'>
            <InputText
              placeholder='Path'
              defaultValue={config.browsing.path}
              name='browsing.path'
              className='w-[20ch]'
            />
          </LabelledControl>
          <LabelledControl label='Height Px' className='gap-0 text-xs'>
            <InputNumber
              placeholder='Height Px'
              defaultValue={config.layout.height}
              name='layout.height'
              min={1000}
              max={Infinity}
              step={100}
              className='w-[10ch]'
            />
          </LabelledControl>

          <LabelledControl label='Grid Px' className='gap-0 text-xs'>
            <InputNumber
              placeholder='Grid Px'
              defaultValue={config.grid.pitch}
              name='grid.pitch'
              min={1}
              max={Infinity}
              step={1}
              className='w-[10ch]'
            />
          </LabelledControl>
          <LabelledControl label='Colour' className='gap-0 text-xs'>
            <InputColour defaultValue={config.grid.colour} name='grid.colour' />
          </LabelledControl>
          <LabelledControl label='Show' className='gap-0 text-xs'>
            <InputBoolean defaultValue={config.grid.show} name='grid.show' />
          </LabelledControl>
          <LabelledControl label='Breakpoints' className='gap-0 text-xs'>
            <InputText
              placeholder='Breakpoints'
              defaultValue={String(config.breakpoints.values)}
              name='breakpoints.values'
              className='w-[20ch]'
              pattern='^[\d,]+$'
            />
          </LabelledControl>
          <LabelledControl label='Lock' className='gap-0 text-xs'>
            <InputBoolean defaultValue={config.breakpoints.lock} name='breakpoints.lock' />
          </LabelledControl>
          <Button variant='muted'>
            <RefreshCw />
          </Button>
          {width && <span className='py-2.5'>{`${width}px`}</span>}
        </form>
      </nav>
      {config.breakpoints.lock && (
        <style>{`.source-grid { ${config.breakpoints.values.map((breakpoint) => `@media (width >= calc(${breakpoint * 2}px + 1rem)) { grid-template-columns: repeat(2, ${breakpoint}px); }`).join('\n')} }`}</style>
      )}
      <main className='source-grid grid size-full grid-cols-2 justify-center gap-4 overflow-y-auto py-4'>
        <SourceView ref={leftRef} sourceName='left' />
        <SourceView ref={rightRef} sourceName='right' />
      </main>
    </div>
  );
}
