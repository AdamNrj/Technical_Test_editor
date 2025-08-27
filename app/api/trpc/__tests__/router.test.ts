import { describe, it, expect } from 'vitest'
import { appRouter } from '../../root'
import superjson from 'superjson'

describe('tRPC router', () => {
  const caller = appRouter.createCaller({})

  it('document.get works', async () => {
    const res = await caller.document.get({ id: 'test' })
    expect(res.id).toBe('test')
  })

  it('document.save works', async () => {
    const res = await caller.document.save({
      id: 'test',
      store: { store: {}, schema: {} },
      updatedAt: Date.now(),
    })
    expect(res.ok).toBe(true)
  })
})
