import { Check, Settings, X } from 'lucide-react';
import { useCallback, useEffect, useEffectEvent, useRef, useState, type SubmitEvent } from 'react';

import { Button } from '@/components/button';
import { Modal, ModalContent, ModalOpenButton, useModal } from '@/components/modal';
import { TextInput } from '@/components/text-input';
import { useConfig } from '@/hooks/config';
import { dottedKeyEntriesToObject, objectToDottedKeyEntries } from '@/lib/utils';
import { configSchema } from '@/schemas/config';

function ConfigModalInner() {
  const { config, setConfig } = useConfig();
  const { close, isOpen } = useModal();
  const [errors, setErrors] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement | null>(null);

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const parsed = configSchema.safeParse(dottedKeyEntriesToObject(data.entries()));
      if (parsed.success) {
        setConfig(parsed.data);
        close();
        return;
      }
      setErrors(parsed.error.message);
    },
    [close, setConfig]
  );

  const resetForm = useEffectEvent(() => {
    for (const [fieldName, value] of objectToDottedKeyEntries(config)) {
      const field = ref.current?.querySelector<HTMLInputElement>(`[name="${fieldName}"]`);
      if (field) field.value = String(value);
    }
  });

  useEffect(() => {
    if (!isOpen) return;
    resetForm();
  }, [isOpen]);

  return (
    <>
      <ModalOpenButton variant='ghost'>
        <Settings />
      </ModalOpenButton>
      <ModalContent sticky>
        <form className='grid grid-cols-2 gap-4' onSubmit={handleSubmit} ref={ref}>
          <fieldset className='col-span-full grid grid-cols-subgrid gap-y-2'>
            <h3 className='col-span-2'>Name</h3>
            <TextInput
              placeholder='Left Name'
              defaultValue={config.sources.left.name}
              name='sources.left.name'
              required
            />
            <TextInput
              placeholder='Right Name'
              defaultValue={config.sources.right.name}
              name='sources.right.name'
              required
            />
          </fieldset>
          <fieldset className='col-span-full grid grid-cols-subgrid gap-y-2'>
            <h3 className='col-span-2'>Base URL</h3>
            <TextInput
              placeholder='Left Base URL'
              type='url'
              defaultValue={config.sources.left.baseUrl}
              name='sources.left.baseUrl'
              required
            />
            <TextInput
              placeholder='Right Base URL'
              type='url'
              defaultValue={config.sources.right.baseUrl}
              name='sources.right.baseUrl'
              required
            />
          </fieldset>
          {errors && <span className='col-span-2 text-danger'>{errors}</span>}
          <Button className='mx-auto'>
            <Check />
            Submit
          </Button>
          <Button type='button' variant='muted' className='mx-auto' onClick={close}>
            <X />
            Cancel
          </Button>
        </form>
      </ModalContent>
    </>
  );
}

export function ConfigModal() {
  return (
    <Modal>
      <ConfigModalInner />
    </Modal>
  );
}
