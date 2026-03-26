import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** recursively build an object from entries where the keys are in dot notation */
export function dottedKeyEntriesToObject(
  entries: Iterable<[key: string, value: unknown]>,
  obj: Record<string, unknown> = {}
): Record<string, unknown> {
  for (const [key, value] of entries) {
    if (key.includes('.')) {
      const [parent, ...children] = key.split('.');
      const child = children.join('.');
      if (!(parent in obj && typeof obj[parent] === 'object')) obj[parent] = {};
      dottedKeyEntriesToObject([[child, value]], obj[parent] as Record<string, unknown>);
    } else obj[key] = value;
  }
  return obj;
}

/** recursively build an entries array with keys in dot notation from an object */
export function objectToDottedKeyEntries(
  obj: Record<string, unknown>,
  entries: [key: string, value: unknown][] = [],
  parent?: string
): [key: string, value: unknown][] {
  for (const [key, value] of Object.entries(obj)) {
    const dotted = parent ? `${parent}.${key}` : key;
    if (typeof value === 'object') objectToDottedKeyEntries(value as Record<string, unknown>, entries, dotted);
    else entries.push([dotted, value]);
  }
  return entries;
}
