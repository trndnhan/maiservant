// client/src/hooks/useRandomGradient.ts
'use client'
import { useEffect, useState } from 'react'

export const useRandomGradient = () => {
  const [style, setStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    const randomAngle = Math.floor(Math.random() * 360) + 1
    const randomDuration = (Math.random() * 4 + 1).toFixed(2)
    setStyle({
      '--gradient-angle': `${randomAngle}deg`,
      '--gradient-duration': `${randomDuration}s`
    } as React.CSSProperties)
  }, [])

  return style
}
