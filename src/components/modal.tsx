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
  useEffect,
} from 'react';

import { Button } from '@/components/button';
import { cn } from '@/lib/utils';

export const enum ModalState {
  Closed,
  Open,
  Closing,
}

interface Context {
  ref: RefObject<HTMLDialogElement | null>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  state: ModalState;
  setState: Dispatch<SetStateAction<ModalState>>;
}

const Context = createContext<Context | null>(null);

const CLOSING_MS = 300;

export function Modal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [state, setState] = useState<ModalState>(ModalState.Closed);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const open = useCallback(() => {
    ref.current?.showModal();
    setState(ModalState.Open);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const close = useCallback(() => {
    setState(ModalState.Closing);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => ref.current?.close(), CLOSING_MS);
  }, []);

  const value: Context = useMemo(
    () => ({
      ref,
      state,
      close,
      open,
      toggle() {
        if (ref.current?.open) close();
        else open();
      },
      setState,
    }),
    [close, open, state]
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
  const { close, ref, setState, state } = useModal();

  const handleClose = useCallback(
    (event: SyntheticEvent<HTMLDialogElement>) => {
      setState(ModalState.Closed);
      onClose?.(event);
    },
    [onClose, setState]
  );

  useEffect(() => {
    if (!ref.current) return;
    const controller = new AbortController();

    function animate() {
      ref.current?.animate([{ scale: '100%' }, { scale: '105%' }, { scale: '100%' }], {
        duration: 150,
        easing: 'ease-in-out',
      });
    }

    ref.current.addEventListener(
      'click',
      (event) => {
        if (event.target !== ref.current) return;
        if (sticky) animate();
        else close();
      },
      { signal: controller.signal }
    );

    if (sticky)
      ref.current.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') animate();
      });

    return () => controller.abort();
  }, [close, ref, sticky]);

  return (
    <dialog
      data-state={state === ModalState.Open ? 'open' : state === ModalState.Closing ? 'closing' : 'closed'}
      className={cn(
        'm-auto p-4 rounded-sm bg-background text-foreground max-w-dvw max-h-dvh shadow-xl',
        'backdrop:transition-colors backdrop:duration-150 backdrop:bg-transparent data-[state=open]:backdrop:bg-black/33',
        'transition-[scale,opacity,translate] duration-150 scale-50 opacity-0 translate-y-1/2 data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=open]:translate-y-0 data-[state=closing]:-translate-y-1/2',
        className
      )}
      ref={ref}
      closedby='none'
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
