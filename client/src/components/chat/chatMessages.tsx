// client\src\components\chat\chatMessages.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { ChatInputForm } from '@/components/chat/chatInputForm'
import { useChat } from '@/hooks/chat/useChat'
import { ChatBubble, ChatBubbleAction, ChatBubbleMessage } from '@/components/ui/chat-bubble'
import { ChatMessageList } from '@/components/ui/chat-message-list'
import { CopyIcon, Loader, ArrowDownIcon } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatSkeleton } from '@/components/chat/chatSkeleton'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessionMessages } from '@/hooks/chat/useSessionMessages'
import { useSearchParams } from 'next/navigation'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface ChatMessagesProps {
  chatId: string
}

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
}

function getMarginClass(lines: number) {
  if (lines <= 1) return 'mb-5'
  if (lines === 2) return 'mb-10'
  if (lines === 3) return 'mb-15'
  return 'mb-20'
}

function getScrollButtonBottomClass(lines: number) {
  if (lines <= 1) return 'bottom-40'
  if (lines === 2) return 'bottom-45'
  if (lines === 3) return 'bottom-50'
  return 'bottom-55'
}

export function ChatMessages({ chatId }: ChatMessagesProps) {
  const chatProps = useChat()
  const { messages, loading, error, scrollAreaRef, isFetchingNextPage } = useSessionMessages(chatId)
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [lineCount, setLineCount] = useState(1)
  const prevLastIdRef = React.useRef<string | null>(null)
  const searchParams = useSearchParams()
  const isNewSession = searchParams.get('new') === 'true'
  const socketRef = chatProps.socketRef

  // Stream ready for new session
  useEffect(() => {
    if (isNewSession && socketRef.current) {
      socketRef.current.emit('stream_ready', { session_id: chatId })
    }
  }, [isNewSession, chatId, socketRef])

  // Track scroll position on viewport (only after initial load done)
  useEffect(() => {
    if (isInitialLoad) return
    const vp = scrollAreaRef.current?.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]')
    if (!vp) return
    const onScroll = () => {
      const distanceFromBottom = vp.scrollHeight - (vp.scrollTop + vp.clientHeight)
      setAutoScrollEnabled(distanceFromBottom < 20)
    }
    vp.addEventListener('scroll', onScroll)
    // initialize state
    onScroll()
    return () => vp.removeEventListener('scroll', onScroll)
  }, [scrollAreaRef, isInitialLoad])

  // Scroll to bottom helper
  const scrollToBottom = () => {
    const vp = scrollAreaRef.current?.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]')
    if (!vp) return

    const smoothScroll = () => {
      const maxScrollTop = vp.scrollHeight - vp.clientHeight
      vp.scrollTo({ top: maxScrollTop, behavior: 'smooth' })

      // Wait until scroll is finished
      const checkIfAtBottom = () => {
        const current = vp.scrollTop
        if (Math.abs(current - maxScrollTop) <= 2) {
          setAutoScrollEnabled(true)
          return
        }
        requestAnimationFrame(checkIfAtBottom)
      }

      requestAnimationFrame(checkIfAtBottom)
    }

    smoothScroll()
  }

  // Handle new messages and initial load scroll
  useEffect(() => {
    const last = messages[messages.length - 1]
    const vp = scrollAreaRef.current?.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]')
    if (!vp || !last) return

    const lastId = `${last.created_at}_${last.role}`
    if (prevLastIdRef.current === lastId) return
    prevLastIdRef.current = lastId

    if (isInitialLoad) {
      // jump instantly on first load
      vp.scrollTop = vp.scrollHeight
      setIsInitialLoad(false)
    } else if (autoScrollEnabled) {
      // smooth scroll for incoming messages
      vp.scrollTo({ top: vp.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, autoScrollEnabled, isInitialLoad, scrollAreaRef])

  if (loading && messages.length === 0) {
    return (
      <div className='flex flex-col h-screen'>
        <ScrollArea ref={scrollAreaRef}>
          <ChatSkeleton />
        </ScrollArea>
      </div>
    )
  }

  if (error) return <div>Error: {error.message}</div>

  const marginClass = getMarginClass(lineCount)
  const getVariant = (role: 'user' | 'assistant') => (role === 'assistant' ? 'received' : 'sent')

  return (
    <div className='flex flex-col h-screen'>
      <ScrollArea ref={scrollAreaRef} className='h-3/4 overflow-y-auto' aria-label='Chat messages' tabIndex={0}>
        <div className={`w-full md:w-[850px] mx-auto bg-muted/40 ${marginClass}`}>
          {isFetchingNextPage && (
            <div className='flex items-center justify-center'>
              <Loader className='animate-spin h-4 w-4 text-black-950 pt-1' />
            </div>
          )}
          <ChatMessageList>
            <AnimatePresence>
              {messages.map((message, index) => {
                const variant = getVariant(message.role)
                const layout = message.role === 'assistant' ? 'ai' : 'default'
                const isPlaceholder = message.role === 'assistant' && message.content === ''
                return (
                  <motion.div
                    key={message.created_at + index}
                    variants={messageVariants}
                    initial={isInitialLoad ? 'hidden' : false}
                    animate='visible'
                    exit='exit'
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className='flex flex-col gap-1'
                  >
                    <ChatBubble variant={variant} layout={message.role === 'assistant' ? 'ai' : 'default'}>
                      <div className='flex flex-col text-sm'>
                        <ChatBubbleMessage
                          variant={variant}
                          layout={layout}
                          isLoading={isPlaceholder}
                          isMarkdown={message.role === 'assistant'}
                          streaming={message.streaming}
                        >
                          {message.content}
                        </ChatBubbleMessage>
                        {message.role === 'assistant' && !message.streaming && !isPlaceholder && (
                          <div className='mt-1 self-start'>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <ChatBubbleAction
                                  className='size-6 rounded-md'
                                  icon={<CopyIcon className='size-3' />}
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(message.content)
                                    } catch (err) {
                                      console.error('Copy failed', err)
                                    }
                                  }}
                                />
                              </TooltipTrigger>
                              <TooltipContent className='font-poppins' side='bottom'>
                                Copy
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </ChatBubble>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </ChatMessageList>
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {!autoScrollEnabled && (
          <motion.button
            key='scroll-button'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToBottom}
            className={`absolute left-1/2 transform -translate-x-1/2 bg-white shadow-md p-2 rounded-full z-10 transition ease-in-out duration-300 hover:scale-105 ${getScrollButtonBottomClass(
              lineCount
            )}`}
            aria-label='Scroll to bottom'
          >
            <ArrowDownIcon className='h-5 w-5' />
          </motion.button>
        )}
      </AnimatePresence>

      <div className='absolute bottom-3 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[750px] p-3 bg-gray-100 shadow-md flex-shrink-0 rounded-xl'>
        <ChatInputForm {...chatProps} onLineCountChange={setLineCount} />
      </div>
    </div>
  )
}
