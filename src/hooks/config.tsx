import { name } from '@root/package.json';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

import { configSchema, type Config } from '@/schemas/config';

const defaultConfig: Config = {
  sources: {
    left: {
      baseUrl: 'http://lvh.me:3000',
      name: 'Main',
    },
    right: {
      baseUrl: 'http://lvh.me:3001',
      name: 'Active',
    },
  },
} as const;

interface Context {
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
}

const Context = createContext<Context | null>(null);

function loadConfig(): Config {
  try {
    const value = localStorage.getItem(`${name}.config`);
    if (value) return configSchema.parse(JSON.parse(value));
  } catch {}
  return { ...defaultConfig };
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(loadConfig);

  const value: Context = useMemo(() => ({ config, setConfig }), [config]);

  useEffect(() => {
    if (config) localStorage.setItem(`${name}.config`, JSON.stringify(config));
    else localStorage.removeItem(`${name}.config`);
  }, [config]);

  return <Context value={value}>{children}</Context>;
}

export function useConfig(): Context {
  const context = useContext(Context);
  if (!context) throw new Error('useConfig must be used underneath a ConfigProvider');
  return context;
}
