import { Settings } from 'lucide-react';
import { useEffect, useMemo, type RefObject } from 'react';

import { Modal, ModalOpenButton } from '@/components/modal';
import { SourceConfigModalContent } from '@/components/source-config-modal';
import { useBrowsing } from '@/hooks/browsing';
import { useConfig } from '@/hooks/config';

export function SourceView({
  sourceName,
  ref,
}: {
  sourceName: 'left' | 'right';
  ref: RefObject<HTMLIFrameElement | null>;
}) {
  const { browsing } = useBrowsing();
  const { config } = useConfig();

  const source = useMemo(() => config.sources[sourceName], [config.sources, sourceName]);

  const href = useMemo(() => {
    const baseUrl = source.baseUrl;
    const url = new URL(browsing.path, baseUrl);
    if (browsing.subdomain) url.hostname = `${browsing.subdomain}.${url.hostname}`;
    return url.href;
  }, [browsing.subdomain, browsing.path, source]);

  useEffect(() => {
    ref.current?.contentWindow?.location.replace(href);
  }, [browsing, href, ref]);

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
        className='w-full'
        height={browsing.height}
        src={href}
        sandbox='allow-same-origin allow-scripts allow-forms'
      />
    </div>
  );
}
