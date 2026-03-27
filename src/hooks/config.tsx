import { name } from '@root/package.json';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { dottedKeyEntriesToObject, objectToDottedKeyEntries } from '@/lib/utils';
import { configSchema, type Config, defaultConfig, type PartialConfig } from '@/schemas/config';

interface Context {
  config: Config;
  // TODO: maybe just accept a FormData obj and type xInput.name as dotted keyof Config
  updateConfig: (value: PartialConfig) => true | string;
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
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
    localStorage.setItem(`${name}.config`, JSON.stringify(config));
  }, [config]);

  const updateConfig: Context['updateConfig'] = useCallback((value) => {
    const raw = dottedKeyEntriesToObject([
      ...objectToDottedKeyEntries(configRef.current),
      ...objectToDottedKeyEntries(value),
    ]);
    const parsed = configSchema.safeParse(raw);
    if (parsed.error) {
      console.error(objectToDottedKeyEntries(configRef.current), raw, parsed.error.message);
      return parsed.error.message;
    }
    setConfig(parsed.data);
    return true;
  }, []);

  const value: Context = useMemo(() => ({ config, updateConfig }), [config, updateConfig]);

  return <Context value={value}>{children}</Context>;
}

export function useConfig(): Context {
  const context = useContext(Context);
  if (!context) throw new Error('useConfig must be used underneath a ConfigProvider');
  return context;
}
