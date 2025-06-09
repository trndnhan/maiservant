// client/src/hooks/chat/useSessions.ts
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import axios from '@/lib/axios'

interface AgentModel {
  id: string
  name: string
  provider: string
}

export interface Session {
  session_id: string
  title: string
  agent_data: {
    model: AgentModel
  }
}

async function fetchSessions(): Promise<Session[]> {
  const res = await axios.get<Session[]>('/api/chat/agent/sessions', {
    withCredentials: true
  })
  return res.data
}

export function useSessions() {
  const query = useQuery<Session[], Error>({
    queryKey: ['agentSessions'],
    queryFn: fetchSessions,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const prevTitlesRef = useRef<Record<string, string>>({})
  const [animatedSessions, setAnimatedSessions] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!query.data) return

    const prev = prevTitlesRef.current
    const newSet = new Set(animatedSessions)

    query.data.forEach((item) => {
      const prevTitle = prev[item.session_id]
      if (prevTitle === 'New Chat' && item.title !== 'New Chat') {
        newSet.add(item.session_id)
      }
      prev[item.session_id] = item.title
    })

    if (newSet.size !== animatedSessions.size) {
      setAnimatedSessions(newSet)
    }

    // Cleanup after 500ms
    newSet.forEach((id) => {
      setTimeout(() => {
        setAnimatedSessions((s) => {
          const copy = new Set(s)
          copy.delete(id)
          return copy
        })
      }, 500)
    })
  }, [query.data, animatedSessions])

  return {
    ...query,
    animatedSessions
  }
}
