// client\src\components\providers.tsx
'use client'
import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3500 * 1000
    }
  }
})

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const persister = createSyncStoragePersister({
      storage: window.localStorage
    })

    persistQueryClient({
      queryClient,
      persister
    })
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
