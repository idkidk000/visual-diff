import { z } from 'zod';

const sourceSchema = z.object({
  baseUrl: z.url(),
  name: z.string(),
});

export const configSchema = z.object({
  sources: z.object({
    left: sourceSchema,
    right: sourceSchema,
  }),
});

export type Config = z.infer<typeof configSchema>;
