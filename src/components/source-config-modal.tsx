import { Check, X } from 'lucide-react';
import { useCallback, useEffect, useEffectEvent, useRef, useState, type SubmitEvent } from 'react';

import { Button } from '@/components/button';
import { InputText } from '@/components/input/text';
import { LabelledControl } from '@/components/labelled-control';
import { ModalContent, ModalState, useModal } from '@/components/modal';
import { useConfig } from '@/hooks/config';
import { objectToDottedKeyEntries } from '@/lib/utils';

export function SourceConfigModalContent({ sourceName }: { sourceName: 'left' | 'right' }) {
  const { config, updateConfig } = useConfig();
  const { close, state } = useModal();
  const [errors, setErrors] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement | null>(null);

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      const result = updateConfig(Object.fromEntries(new FormData(event.target).entries()));
      if (result === true) close();
      else setErrors(result);
    },
    [close, updateConfig]
  );

  const resetForm = useEffectEvent(() => {
    for (const [fieldName, value] of objectToDottedKeyEntries(config)) {
      const field = ref.current?.querySelector<HTMLInputElement>(`[name="${fieldName}"]`);
      if (field) field.value = String(value);
    }
    setErrors(null);
  });

  useEffect(() => {
    if (state !== ModalState.Open) return;
    resetForm();
  }, [state]);

  const isHttps = window.location.protocol === 'https:';

  return (
    <ModalContent sticky className='max-w-md text-left'>
      <form className='grid gap-4' onSubmit={handleSubmit} ref={ref}>
        <h2 className='text-center font-semibold'>{`Configure ${sourceName} source`}</h2>
        <LabelledControl label='Name'>
          <InputText
            placeholder='Name'
            defaultValue={config.sources[sourceName].name}
            name={`sources.${sourceName}.name`}
            required
          />
        </LabelledControl>
        <LabelledControl label='Base URL'>
          <InputText
            placeholder='Base URL'
            type='url'
            defaultValue={config.sources[sourceName].baseUrl}
            name={`sources.${sourceName}.baseUrl`}
            required
          />
        </LabelledControl>
        {errors && <span className='text-danger'>{errors}</span>}
        <span className='text-sm text-muted'>
          Be sure to disable X-Frame-Options header if set. CORS can be left enabled.
        </span>
        {isHttps && (
          <span className='text-sm text-danger'>
            This page was served over HTTPS so you may only view HTTPS content. If you need plain HTTP, run the app
            locally.
          </span>
        )}
        <fieldset className='flex justify-around'>
          <Button className='mx-auto'>
            <Check />
            Submit
          </Button>
          <Button type='button' variant='muted' className='mx-auto' onClick={close}>
            <X />
            Cancel
          </Button>
        </fieldset>
      </form>
    </ModalContent>
  );
}
