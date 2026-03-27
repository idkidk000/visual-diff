import { Settings } from 'lucide-react';
import { useEffect, useMemo, type RefObject } from 'react';

import { Modal, ModalOpenButton } from '@/components/modal';
import { SourceConfigModalContent } from '@/components/source-config-modal';
import { useConfig } from '@/hooks/config';

export function SourceView({
  sourceName,
  ref,
}: {
  sourceName: 'left' | 'right';
  ref: RefObject<HTMLIFrameElement | null>;
}) {
  const { config } = useConfig();

  const source = useMemo(() => config.sources[sourceName], [config.sources, sourceName]);

  const href = useMemo(() => {
    const baseUrl = source.baseUrl;
    const url = new URL(config.browsing.path, baseUrl);
    if (config.browsing.subdomain) url.hostname = `${config.browsing.subdomain}.${url.hostname}`;
    return url.href;
  }, [config.browsing.subdomain, config.browsing.path, source]);

  useEffect(() => {
    ref.current?.contentWindow?.location.replace(href);
  }, [config.browsing, href, ref]);

  return (
    <div className='grid text-center'>
      <h2 className='col-start-1 row-start-1 font-semibold'>{source.name}</h2>
      <h3 className='col-start-1 row-start-2 text-muted'>{href}</h3>
      <Modal>
        <ModalOpenButton variant='ghost' className='col-start-1 row-span-2 row-start-1 my-auto ms-auto'>
          <Settings />
        </ModalOpenButton>
        <SourceConfigModalContent sourceName={sourceName} />
      </Modal>
      <iframe
        title={source.name}
        ref={ref}
        className='col-start-1 row-start-3 w-full'
        height={config.layout.height}
        src={href}
        sandbox='allow-same-origin allow-scripts allow-forms'
      />
      {config.grid.show && (
        <span
          className='pointer-events-none col-start-1 row-start-3 size-full'
          style={{
            background: `repeating-linear-gradient(to right, ${config.grid.colour} 0 1px, transparent 1px ${config.grid.pitch - 1}px), repeating-linear-gradient(to bottom, ${config.grid.colour} 0 1px, transparent 1px ${config.grid.pitch - 1}px)`,
          }}
        />
      )}
    </div>
  );
}
