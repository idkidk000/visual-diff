import { z } from 'zod';

export const browsingSchema = z.object({
  path: z.string(),
  subdomain: z.string().nullable(),
  height: z.int(),
});

export type Browsing = z.infer<typeof browsingSchema>;
