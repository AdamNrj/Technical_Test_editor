import { z } from 'zod'

export const DocumentSchema = z.object({
  id: z.string().min(1),
  store: z.any().nullable(),
  updatedAt: z.number().default(() => Date.now()),
})

export type DocumentData = z.infer<typeof DocumentSchema>
