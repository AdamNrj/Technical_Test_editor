import { describe, it, expect } from 'vitest'
import { getDocument, saveDocument } from '../doc-store'

describe('doc-store', () => {
  it('getDocument returns default when not existing', async () => {
    const doc = await getDocument('does-not-exist')
    expect(doc.id).toBe('does-not-exist')
    expect(doc.store).toBeDefined()
    expect(typeof doc.updatedAt).toBe('number')
  })

  it('saveDocument then getDocument returns same id', async () => {
    const now = Date.now()
    const saved = await saveDocument({
      id: 'unit',
      store: { store: {}, schema: {} },
      updatedAt: now,
    })
    expect(saved.id).toBe('unit')
    const got = await getDocument('unit')
    expect(got.updatedAt).toBeGreaterThanOrEqual(now)
  })
})
