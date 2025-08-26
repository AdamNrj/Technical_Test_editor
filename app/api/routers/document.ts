import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
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
      const doc = await getDocument(id)
      console.log('[document.get]', {
        id,
        hasStore: !!doc.store,
        updatedAt: doc.updatedAt,
      })
      return doc
    }),

  save: publicProcedure.input(DocumentSchema).mutation(async ({ input }) => {
    try {
      const saved = await saveDocument(input)
      console.log('[document.save] out', {
        id: saved.id,
        updatedAt: saved.updatedAt,
      })
      return { ok: true, updatedAt: saved.updatedAt }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[document.save] ERROR', message)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message })
    }
  }),
})
