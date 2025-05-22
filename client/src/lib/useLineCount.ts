// client/src/lib/useLineCount.ts
import { useRef, useState, useCallback, useLayoutEffect, ElementRef } from 'react'
import { ChatInput } from '@/components/ui/chat-input'

export function useLineCount() {
  type TextAreaRef = ElementRef<typeof ChatInput>

  const ref = useRef<TextAreaRef | null>(null)

  const bufferRef = useRef<HTMLTextAreaElement | null>(null)

  const [lines, setLines] = useState(1)

  const update = useCallback(() => {
    const inst = ref.current
    if (!inst) return

    const ta = 'textArea' in inst ? inst.textArea : (inst as unknown as HTMLTextAreaElement)

    if (!bufferRef.current) {
      const buf = document.createElement('textarea')
      Object.assign(buf.style, {
        border: 'none',
        height: '0',
        overflow: 'hidden',
        padding: '0',
        position: 'absolute',
        left: '0',
        top: '0',
        zIndex: '-1'
      })
      document.body.appendChild(buf)
      bufferRef.current = buf
    }

    const buf = bufferRef.current!
    const cs = window.getComputedStyle(ta)
    const pad = parseInt(cs.paddingLeft) + parseInt(cs.paddingRight)
    let lh = parseInt(cs.lineHeight)
    if (isNaN(lh)) lh = parseInt(cs.fontSize)

    buf.style.width = `${ta.clientWidth - pad}px`
    buf.style.font = cs.font
    buf.style.whiteSpace = cs.whiteSpace
    buf.style.wordWrap = cs.wordWrap
    buf.value = ta.value

    const wrapped = Math.max(1, Math.floor(buf.scrollHeight / lh))
    const hard = ta.value.split('\n').length

    setLines(Math.max(wrapped, hard))
  }, [])

  useLayoutEffect(() => {
    update()
  })

  return { ref, lines, onChange: update }
}
