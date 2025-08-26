'use client'

import { useState, type ReactNode } from 'react'
import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import { loggerLink } from '@trpc/client/links/loggerLink'
import superjson from 'superjson'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppRouter } from '@/app/api/root'

export const trpc = createTRPCReact<AppRouter>()
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function TrpcProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            retry: 2,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  const [client] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' || op.direction === 'down',
        }),
        httpBatchLink({
          url: `${basePath}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
