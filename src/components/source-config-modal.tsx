import { Check, X } from 'lucide-react';
import { useCallback, useEffect, useEffectEvent, useRef, useState, type SubmitEvent } from 'react';

import { Button } from '@/components/button';
import { LabelledControl } from '@/components/labelled-control';
import { ModalContent, ModalState, useModal } from '@/components/modal';
import { TextInput } from '@/components/text-input';
import { useConfig } from '@/hooks/config';
import { dottedKeyEntriesToObject, objectToDottedKeyEntries } from '@/lib/utils';
import { configSchema } from '@/schemas/config';

export function SourceConfigModalContent({ sourceName }: { sourceName: 'left' | 'right' }) {
  const { config, setConfig } = useConfig();
  const { close, state } = useModal();
  const [errors, setErrors] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement | null>(null);

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const parsed = configSchema.safeParse(
        dottedKeyEntriesToObject([...objectToDottedKeyEntries(config), ...data.entries()])
      );
      if (!parsed.success) {
        setErrors(parsed.error.message);
        return;
      }
      setConfig(parsed.data);
      close();
    },
    [close, config, setConfig]
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

  return (
    <ModalContent sticky className='max-w-md text-left'>
      <form className='grid gap-4' onSubmit={handleSubmit} ref={ref}>
        <h2 className='text-center font-semibold'>Configure source</h2>
        <LabelledControl label='Name'>
          <TextInput
            placeholder='Name'
            defaultValue={config.sources[sourceName].name}
            name={`sources.${sourceName}.name`}
            required
          />
        </LabelledControl>
        <LabelledControl label='Base URL'>
          <TextInput
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
