import type { DocumentData } from '@/modules/editor/domain/core/entity'

type DB = Record<string, DocumentData>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any
if (!g.__DOC_DB__) g.__DOC_DB__ = {} as DB
const DBMEM: DB = g.__DOC_DB__

export async function getDocument(id: string): Promise<DocumentData> {
  return DBMEM[id] ?? { id, store: null, updatedAt: Date.now() }
}

export async function saveDocument(doc: DocumentData): Promise<DocumentData> {
  const updated = { ...doc, updatedAt: Date.now() }
  DBMEM[doc.id] = updated
  return updated
}
