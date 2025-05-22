// client\src\components\randomGradientText.tsx
'use client'
import { useRandomGradient } from '@/hooks/useRandomGradient'
import type { ReactNode } from 'react'

interface RandomGradientTextProps {
  children: ReactNode
  className?: string
}

export const RandomGradientText = ({ children, className }: RandomGradientTextProps) => {
  const randomGradientStyle = useRandomGradient()

  return (
    <span className={`animate-gradient ${className || ''}`} style={randomGradientStyle}>
      {children}
    </span>
  )
}
