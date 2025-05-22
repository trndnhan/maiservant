// client/src/hooks/useUser.ts
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'

export type UserInfo = {
  id: string
  email: string
  full_name: string
}

async function fetchUser(): Promise<UserInfo> {
  const { data } = await axios.get<UserInfo>('/api/auth/current_user', {
    withCredentials: true
  })
  return data
}

async function logoutRequest(): Promise<void> {
  await axios.post('/api/auth/jwt/logout', {}, { withCredentials: true })
}

export function useUser() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    error
  } = useQuery<UserInfo, Error>({
    queryKey: ['currentUser'],
    queryFn: fetchUser
  })

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      localStorage.removeItem('showIdleToast')
      queryClient.clear()
      router.push('/')
    },
    onError: (err: Error) => {
      console.error('Error during logout:', err)
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return { user, loading: isLoading, error, handleLogout }
}
