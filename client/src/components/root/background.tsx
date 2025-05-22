// client\src\components\root\background.tsx
/**
 * Background Component
 *
 * Renders an animated, colorful, gradient-based background with optional interactive pointer effects.
 *
 */
'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

export const Background = ({
  gradientBackgroundStart = '#fdf2f8',
  gradientBackgroundEnd = '#F2FDF7',
  firstColor = '249, 245, 168',
  secondColor = '249, 168, 212',
  thirdColor = '249, 168, 212',
  fourthColor = '168, 249, 205',
  fifthColor = '168, 172, 249',
  pointerColor = '140, 100, 255',
  size = '100%',
  blendingValue = 'hard-light',
  children,
  className,
  interactive = false,
  containerClassName
}: {
  gradientBackgroundStart?: string
  gradientBackgroundEnd?: string
  firstColor?: string
  secondColor?: string
  thirdColor?: string
  fourthColor?: string
  fifthColor?: string
  pointerColor?: string
  size?: string
  blendingValue?: string
  children?: React.ReactNode
  className?: string
  interactive?: boolean
  containerClassName?: string
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null)

  const [curX, setCurX] = useState(0)
  const [curY, setCurY] = useState(0)
  const [tgX, setTgX] = useState(0)
  const [tgY, setTgY] = useState(0)

  // Set background colors and other properties once
  useEffect(() => {
    document.body.style.setProperty('--gradient-background-start', gradientBackgroundStart)
    document.body.style.setProperty('--gradient-background-end', gradientBackgroundEnd)
    document.body.style.setProperty('--first-color', firstColor)
    document.body.style.setProperty('--second-color', secondColor)
    document.body.style.setProperty('--third-color', thirdColor)
    document.body.style.setProperty('--fourth-color', fourthColor)
    document.body.style.setProperty('--fifth-color', fifthColor)
    document.body.style.setProperty('--pointer-color', pointerColor)
    document.body.style.setProperty('--size', size)
    document.body.style.setProperty('--blending-value', blendingValue)
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue
  ])

  // Compute random movement types and durations for the animations
  useEffect(() => {
    const movementTypes = ['moveVertical', 'moveInCircle', 'moveHorizontal']
    // Ensure each movement appears at least once
    const assigned: string[] = [...movementTypes] // 3 required entries
    // Fill remaining 2 slots randomly ensuring max usage is 3
    while (assigned.length < 5) {
      const candidate = movementTypes[Math.floor(Math.random() * movementTypes.length)]
      if (assigned.filter((x) => x === candidate).length < 3) {
        assigned.push(candidate)
      }
    }
    // Shuffle assigned array so the order is random
    for (let i = assigned.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[assigned[i], assigned[j]] = [assigned[j], assigned[i]]
    }

    // Generate 5 unique random durations between 10 and 20 seconds
    const durations: number[] = []
    while (durations.length < 5) {
      const randomValue = parseFloat((Math.random() * 10 + 10).toFixed(2))
      if (!durations.includes(randomValue)) {
        durations.push(randomValue)
      }
    }
    // Shuffle durations so they are in random order
    for (let i = durations.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[durations[i], durations[j]] = [durations[j], durations[i]]
    }

    // List of CSS custom property names for the animations
    const animationProperties = [
      '--animate-first',
      '--animate-second',
      '--animate-third',
      '--animate-fourth',
      '--animate-fifth'
    ]
    animationProperties.forEach((prop, index) => {
      document.body.style.setProperty(prop, `${assigned[index]} ${durations[index]}s ease infinite`)
    })
  }, [])

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) return
      setCurX(curX + (tgX - curX) / 20)
      setCurY(curY + (tgY - curY) / 20)
      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
    }
    move()
  }, [tgX, tgY, curX, curY])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect()
      setTgX(event.clientX - rect.left)
      setTgY(event.clientY - rect.top)
    }
  }

  const [isSafari, setIsSafari] = useState(false)
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
  }, [])

  return (
    <div
      className={cn(
        'h-screen w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]',
        containerClassName
      )}
    >
      <svg className='hidden'>
        <defs>
          <filter id='blurMe'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='10' result='blur' />
            <feColorMatrix in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8' result='goo' />
            <feBlend in='SourceGraphic' in2='goo' />
          </filter>
        </defs>
      </svg>
      <div className={cn('', className)}>{children}</div>
      <div
        className={cn(
          'gradients-container h-full w-full blur-lg',
          isSafari ? 'blur-2xl' : '[filter:url(#blurMe)_blur(40px)]'
        )}
      >
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:center_center]`,
            `animate-first`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-400px)]`,
            `animate-second`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%+400px)]`,
            `animate-third`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-200px)]`,
            `animate-fourth`,
            `opacity-70`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-800px)_calc(50%+800px)]`,
            `animate-fifth`,
            `opacity-100`
          )}
        ></div>

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
              `opacity-70`
            )}
          ></div>
        )}
      </div>
    </div>
  )
}
