import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/app/api/root'

export const runtime = 'nodejs'

const handler = (req: Request) =>
  fetchRequestHandler({
    router: appRouter,
    endpoint: '/api/trpc',
    req,
    createContext: () => ({}),
    onError({ error, path, type }) {
      console.error('[tRPC onError]', {
        type,
        path,
        message: error.message,
        code: error.code,
      })
    },
  })

export { handler as GET, handler as POST }
