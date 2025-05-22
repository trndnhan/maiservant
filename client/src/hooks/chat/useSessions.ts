// client/src/hooks/chat/useSessions.ts
import { useQuery } from '@tanstack/react-query'
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
  return useQuery<Session[], Error>({
    queryKey: ['agentSessions'],
    queryFn: fetchSessions,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
}
