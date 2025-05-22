// client/src/hooks/useChat.ts
'use client'

import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePathname, useRouter } from 'next/navigation'
import { useQueryClient, type InfiniteData } from '@tanstack/react-query'
import useModelStore from '@/stores/modelStore'
import { useUser } from '@/hooks/chat/useUser'
import type { Message } from '@/hooks/chat/useSessionMessages'
import type { Session } from '@/hooks/chat/useSessions'
import io, { Socket } from 'socket.io-client'

export function useChat() {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { selectedModel } = useModelStore()
  const { user } = useUser()

  const isChatRoute = pathname.startsWith('/chat/')
  const currentConversationId = isChatRoute ? pathname.split('/').pop() : null

  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(z.object({ message: z.string() })),
    defaultValues: { message: '' }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:2002', {
        path: '/socket.io',
        transports: ['websocket', 'polling']
      })
    }

    const socket = socketRef.current

    const onStream = (data: { session_id: string; content: string; done?: boolean }) => {
      queryClient.setQueryData<InfiniteData<Message[]> | undefined>(
        ['agentSessionMessages', data.session_id],
        (old) => {
          if (!old || old.pages.length === 0) return old
          const pages = [...old.pages]
          const firstPage = [...pages[0]] // Newest page
          const assistantIdx = firstPage.map((m) => m.role).lastIndexOf('assistant')
          if (assistantIdx < 0) return old
          firstPage[assistantIdx] = {
            ...firstPage[assistantIdx],
            content: data.content,
            streaming: !data.done
          }
          pages[0] = firstPage
          return { ...old, pages }
        }
      )
    }

    const onTitle = (data: { session_id: string; title: string }) => {
      queryClient.setQueryData<Session[] | undefined>(['agentSessions'], (sessions) =>
        sessions?.map((s) => (s.session_id === data.session_id ? { ...s, title: data.title } : s))
      )
    }

    const setupListeners = () => {
      socket.on('assistant_stream', onStream)
      socket.on('session_title', onTitle)
    }

    socket.once('connect', () => {
      console.log('[socket] ready, setting up listeners')
      setupListeners()
    })

    return () => {
      socket.off('assistant_stream', onStream)
      socket.off('session_title', onTitle)
    }
  }, [queryClient])

  const truncateFileName = (name: string, maxLength = 20) =>
    name.length > maxLength ? name.substring(0, maxLength) + '...' : name

  const handleFileUploadClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) {
      setSelectedFiles((prev) => [...prev, ...files])
      setPreviewUrls((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length) {
      setSelectedFiles((prev) => [...prev, ...files])
      setPreviewUrls((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const onSubmit = (values: { message: string }) => {
    if (isSubmitting || !user?.id || !selectedModel) return

    setIsSubmitting(true)

    const newSessionId = currentConversationId ?? crypto.randomUUID()

    if (!currentConversationId) {
      router.push(`/chat/${newSessionId}?new=true`)
      queryClient.setQueryData<Session[] | undefined>(['agentSessions'], (old) => [
        {
          session_id: newSessionId,
          title: '…',
          agent_data: { model: { id: selectedModel.value, name: '', provider: selectedModel.provider } }
        },
        ...(old ?? [])
      ])
    }

    const now = new Date().toISOString()
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: values.message,
      created_at: now,
      streaming: false
    }
    const assistantPlaceholder: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      created_at: now,
      streaming: true
    }

    queryClient.setQueryData<InfiniteData<Message[]> | undefined>(['agentSessionMessages', newSessionId], (oldData) => {
      if (!oldData) return { pages: [[userMsg, assistantPlaceholder]], pageParams: [undefined] }
      const pages = [[userMsg, assistantPlaceholder], ...oldData.pages]
      return { ...oldData, pages }
    })

    form.reset()

    if (socketRef.current?.connected) {
      socketRef.current.emit('init_session', {
        session_id: newSessionId,
        model: selectedModel.value,
        provider: selectedModel.provider,
        prompt: values.message,
        user_id: user.id,
        is_new: !currentConversationId
      })
    } else {
      socketRef.current?.once('connect', () => {
        socketRef.current!.emit('init_session', {
          session_id: newSessionId,
          model: selectedModel.value,
          provider: selectedModel.provider,
          prompt: values.message,
          user_id: user.id,
          is_new: !currentConversationId
        })
      })
    }

    setIsSubmitting(false)
  }

  const messageValue = form.watch('message')
  const isSubmitDisabled = isSubmitting || !messageValue?.trim() || !selectedModel

  return {
    form,
    onSubmit,
    isSubmitDisabled,
    isSubmitting,
    selectedFiles,
    previewUrls,
    fileInputRef,
    socketRef,
    truncateFileName,
    handleFileUploadClick,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleRemoveFile
  }
}
