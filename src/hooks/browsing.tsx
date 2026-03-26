import { name } from '@root/package.json';
import {
  type ReactNode,
  useState,
  useContext,
  createContext,
  useMemo,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from 'react';

import { browsingSchema, type Browsing } from '@/schemas/browsing';

const defaultBrowsing: Browsing = {
  height: 5000,
  path: '/',
  subdomain: null,
} as const;

interface Context {
  browsing: Browsing;
  setBrowsing: Dispatch<SetStateAction<Browsing>>;
}

const Context = createContext<Context | null>(null);

function loadBrowsing(): Browsing {
  try {
    const value = localStorage.getItem(`${name}.browsing`);
    if (value) return browsingSchema.parse(JSON.parse(value));
  } catch {}
  return { ...defaultBrowsing };
}

export function BrowsingProvider({ children }: { children: ReactNode }) {
  const [browsing, setBrowsing] = useState<Browsing>(loadBrowsing());

  const value: Context = useMemo(() => ({ browsing, setBrowsing }), [browsing]);

  useEffect(() => {
    if (browsing) localStorage.setItem(`${name}.browsing`, JSON.stringify(browsing));
    else localStorage.removeItem(`${name}.browsing`);
  }, [browsing]);

  return <Context value={value}>{children}</Context>;
}

export function useBrowsing(): Context {
  const context = useContext(Context);
  if (!context) throw new Error('useBrowsing must be used underneath a BrowingProvider');
  return context;
}
