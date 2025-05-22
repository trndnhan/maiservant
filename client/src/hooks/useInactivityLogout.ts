// client/src/hooks/useInactivityLogout.ts
'use client'
import { useIdleTimer } from 'react-idle-timer'
import { useRouter } from 'next/navigation'

export default function useInactivityLogout(timeoutMs: number = 15 * 60 * 1000) {
  const router = useRouter()

  const onIdle = () => {
    localStorage.setItem('showIdleToast', 'true')
    router.push('/')
  }

  useIdleTimer({
    timeout: timeoutMs,
    onIdle,
    debounce: 500
  })
}
