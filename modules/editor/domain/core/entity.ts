import { z } from 'zod'

export const DocumentSchema = z.object({
  id: z.string().min(1),
  // Snapshot serializado del store de tldraw
  store: z.any().nullable(),
  updatedAt: z.number().default(() => Date.now()),
})

export type DocumentData = z.infer<typeof DocumentSchema>
