import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/api/root'

const handler = (req: Request) =>
  fetchRequestHandler({
    router: appRouter,
    endpoint: '/api/trpc',
    req,
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }
