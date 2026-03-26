import {
  type ReactNode,
  useState,
  useContext,
  createContext,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from 'react';

interface State {
  path: string;
  width?: number;
  scrollY?: number;
  subdomain?: string;
}

interface Context {
  browsing: State;
  setBrowsing: Dispatch<SetStateAction<State>>;
}

const Context = createContext<Context | null>(null);

export function BrowsingProvider({ children }: { children: ReactNode }) {
  const [browsing, setBrowsing] = useState<State>({ path: '/' });
  const value: Context = useMemo(() => ({ browsing, setBrowsing }), [browsing]);
  return <Context value={value}>{children}</Context>;
}

export function useBrowsing(): Context {
  const context = useContext(Context);
  if (!context) throw new Error('useBrowsing must be used underneath a BrowingProvider');
  return context;
}
