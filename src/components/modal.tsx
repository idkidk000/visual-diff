import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type RefObject,
  type MouseEvent,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useState,
  type SyntheticEvent,
} from 'react';

import { Button } from '@/components/button';
import { cn } from '@/lib/utils';

interface Context {
  ref: RefObject<HTMLDialogElement | null>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Context = createContext<Context | null>(null);

export function Modal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const value: Context = useMemo(
    () => ({
      ref,
      isOpen,
      close() {
        ref.current?.close();
      },
      open() {
        ref.current?.showModal();
        setIsOpen(true);
      },
      toggle() {
        if (ref.current?.open) ref.current.close();
        else {
          ref.current?.showModal();
          setIsOpen(true);
        }
      },
      setIsOpen,
    }),
    [isOpen]
  );

  return <Context value={value}>{children}</Context>;
}

export function useModal(): Context {
  const context = useContext(Context);
  if (!context) throw new Error('useModal must be used underneath a Modal');
  return context;
}

export function ModalContent({
  children,
  className,
  onClose,
  sticky = false,
  ...props
}: Omit<ComponentPropsWithoutRef<'dialog'>, 'closedby'> & { sticky?: boolean }) {
  const { ref, setIsOpen } = useModal();

  const handleClose = useCallback(
    (event: SyntheticEvent<HTMLDialogElement>) => {
      setIsOpen(false);
      onClose?.(event);
    },
    [onClose, setIsOpen]
  );

  return (
    <dialog
      className={cn('m-auto p-4 rounded-sm bg-background text-foreground max-w-dvw max-h-dvh', className)}
      ref={ref}
      closedby={sticky ? 'closerequest' : 'any'}
      onClose={handleClose}
      {...props}
    >
      {children}
    </dialog>
  );
}

function ModalButton({
  children,
  kind,
  onClick,
  ...props
}: ComponentProps<typeof Button> & { kind: 'close' | 'open' | 'toggle' }) {
  const { close, open, toggle } = useModal();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (kind === 'close') close();
      else if (kind === 'open') open();
      else if (kind === 'toggle') toggle();
      onClick?.(event);
    },
    [kind, close, open, toggle, onClick]
  );

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

export function ModalCloseButton(props: Omit<ComponentProps<typeof ModalButton>, 'kind'>) {
  return <ModalButton kind='close' {...props} />;
}

export function ModalOpenButton(props: Omit<ComponentProps<typeof ModalButton>, 'kind'>) {
  return <ModalButton kind='open' {...props} />;
}

export function ModalToggleButton(props: Omit<ComponentProps<typeof ModalButton>, 'kind'>) {
  return <ModalButton kind='toggle' {...props} />;
}
