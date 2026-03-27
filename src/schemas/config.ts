import { z } from 'zod';

import type { DeepPartial } from '@/lib/utils';

const sourceSchema = z.object({
  baseUrl: z.url(),
  name: z.string(),
});

export const layoutMode = ['row', 'overlay'] as const;

// this needs to parse form data where the values are all potentially strings
export const configSchema = z.object({
  breakpoints: z.object({
    lock: z.union([z.stringbool(), z.boolean()]),
    values: z.union([
      z.string().transform((value) =>
        value
          .split(',')
          .map((token) => parseInt(token, 10))
          .filter((token) => !Number.isNaN(token))
      ),
      z.array(z.int()),
    ]),
  }),
  browsing: z.object({
    path: z.string().transform((value) => {
      if (value.length) return value;
      return '/';
    }),
    subdomain: z
      .string()
      .nullable()
      .transform((value) => {
        if (typeof value === 'string' && value.length) return value;
        return null;
      }),
  }),
  grid: z.object({
    colour: z.string().regex(/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6,6}||[0-9a-fA-F]{8,8})$/),
    pitch: z.coerce.number().min(1).transform(Math.round),
    show: z.union([z.stringbool(), z.boolean()]),
  }),
  layout: z.object({
    height: z.coerce.number().min(100).transform(Math.round),
    mode: z.enum(layoutMode),
  }),
  sources: z.object({
    left: sourceSchema,
    right: sourceSchema,
  }),
});

export type Config = z.infer<typeof configSchema>;

export const defaultConfig: Config = {
  breakpoints: {
    values: [450, 650, 950, 1250],
    lock: true,
  },
  browsing: {
    path: '/',
    subdomain: null,
  },
  grid: {
    colour: '#ff0',
    pitch: 32,
    show: true,
  },
  layout: {
    height: 5000,
    mode: 'row',
  },
  sources: {
    left: {
      baseUrl: 'http://localhost:3000',
      name: 'Active',
    },
    right: {
      baseUrl: 'http://localhost:3001',
      name: 'Main',
    },
  },
};

export type PartialConfig = DeepPartial<Config>;
