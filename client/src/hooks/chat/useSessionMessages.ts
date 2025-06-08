// client/src/hooks/chat/useSessionMessages.ts
import { useInfiniteQuery, InfiniteData, useQueryClient } from '@tanstack/react-query'
import axios from '@/lib/axios'
import { useRef, useLayoutEffect, useEffect, useMemo } from 'react'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  streaming: boolean
}

interface MessageParams {
  limit: number
  before?: string
}

export function useSessionMessages(sessionId: string) {
  const queryClient = useQueryClient()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = useRef(0)
  const prevScrollTopRef = useRef(0)
  const initialLoadRef = useRef(true)
  const wasFetchingRef = useRef(false)

  const initialData = queryClient.getQueryData<InfiniteData<Message[], string | undefined>>([
    'agentSessionMessages',
    sessionId
  ])

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    Message[],
    Error,
    InfiniteData<Message[], string | undefined>,
    ['agentSessionMessages', string],
    string | undefined
  >({
    queryKey: ['agentSessionMessages', sessionId],
    queryFn: async ({ pageParam }) => {
      const params: MessageParams = { limit: 4 }
      if (pageParam) params.before = pageParam
      const res = await axios.get<Message[]>(`/api/chat/agent/sessions/${sessionId}/messages`, {
        params,
        withCredentials: true
      })
      return res.data
    },
    getNextPageParam: (lastPage) => (lastPage.length === 4 ? lastPage[0].created_at : undefined),

    initialData: () => initialData,
    initialPageParam: undefined,

    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    enabled: Boolean(sessionId)
  })

  const messages = useMemo(() => {
    const pages = data?.pages ?? []
    return pages.flat().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }, [data])

  useEffect(() => {
    const container = scrollAreaRef.current?.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]')
    if (!container) return
    const onScroll = () => {
      if (container.scrollTop <= 1 && hasNextPage && !isFetchingNextPage) {
        prevScrollHeightRef.current = container.scrollHeight
        prevScrollTopRef.current = container.scrollTop
        fetchNextPage()
      }
    }
    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    if (!wasFetchingRef.current && isFetchingNextPage) {
      const container = scrollAreaRef.current?.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]')
      if (container) {
        prevScrollHeightRef.current = container.scrollHeight
        prevScrollTopRef.current = container.scrollTop
      }
    }
    wasFetchingRef.current = isFetchingNextPage
  }, [isFetchingNextPage])

  useLayoutEffect(() => {
    const container = scrollAreaRef.current?.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]')
    if (!container) return

    if (initialLoadRef.current) {
      container.scrollTop = container.scrollHeight
      initialLoadRef.current = false
      return
    }

    if (!isFetchingNextPage && prevScrollHeightRef.current > 0) {
      const newHeight = container.scrollHeight
      container.scrollTop = newHeight - prevScrollHeightRef.current + prevScrollTopRef.current
    }
  }, [isFetchingNextPage])

  return {
    messages,
    loading: isLoading,
    error,
    scrollAreaRef,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  }
}
