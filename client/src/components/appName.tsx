// client/src/components/appName.tsx
'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { RandomGradientText } from '@/components/randomGradientText'
import clsx from 'clsx'

export const AppName = () => {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)

    checkIsMobile()

    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return (
    <div
      className={clsx('font-playfair-display font-bold text-gray-900 tracking-tighter', {
        'text-3xl': pathname === '/' && isMobile,
        'text-xl': !(pathname === '/' && isMobile)
      })}
    >
      M<RandomGradientText>AI</RandomGradientText>Servant
    </div>
  )
}
