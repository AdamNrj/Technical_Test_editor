import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { DocumentSchema } from '@/modules/editor/domain/core/entity'
import {
  getDocument,
  saveDocument,
} from '@/modules/editor/presentation/store/doc-store'

export const documentRouter = router({
  get: publicProcedure
    .input(z.object({ id: z.string().default('main') }).optional())
    .query(async ({ input }) => {
      const id = input?.id ?? 'main'
      return getDocument(id)
    }),
  save: publicProcedure.input(DocumentSchema).mutation(async ({ input }) => {
    const saved = await saveDocument(input)
    return { ok: true, updatedAt: saved.updatedAt }
  }),
})
