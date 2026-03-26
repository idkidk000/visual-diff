import { createContext, useContext, useMemo, useRef, type ReactNode, type RefObject } from 'react';

interface Context {
  ref: RefObject<HTMLDivElement | null>;
}

const Context = createContext<Context | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const ref: Context['ref'] = useRef(null);
  const value: Context = useMemo(() => ({ ref }), []);
  return <Context value={value}>{children}</Context>;
}

export function useNav(): Context {
  const context = useContext(Context);
  if (!context) throw new Error('useNav must be used underneath a NavProvider');
  return context;
}
