// client/src/hooks/chat/useSessionActions.ts
import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Session } from './useSessions'
import { toast } from 'sonner'
import { generateRandomEmojis } from '@/hooks/useRandomEmojis'
import { useRouter } from 'next/navigation'

interface RenameSessionResponse {
  success: boolean
  message: string
}

export function renameSessionApi(sessionId: string, newTitle: string) {
  return axios.patch(`/api/chat/agent/sessions/${sessionId}`, {
    new_name: newTitle
  })
}

export function deleteSessionApi(sessionId: string) {
  return axios.delete(`/api/chat/agent/sessions/${sessionId}`)
}

export interface RenameDialogProps {
  sessionId: string
  initialTitle: string
  onSave: (sessionId: string, newTitle: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function useSessionActions() {
  const qc = useQueryClient()

  const renameSession = useMutation<RenameSessionResponse, Error, { sessionId: string; newTitle: string }>({
    mutationFn: ({ sessionId, newTitle }) => renameSessionApi(sessionId, newTitle).then((res) => res.data),
    onSuccess: (_, { sessionId, newTitle }) => {
      qc.setQueryData<Session[]>(['agentSessions'], (old) =>
        old?.map((s) => (s.session_id === sessionId ? { ...s, title: newTitle } : s))
      )
      toast.success(`Session renamed successfully! ${generateRandomEmojis(1)}`)
    }
  })

  const deleteSession = useMutation<void, Error, string>({
    mutationFn: async (sessionId) => {
      await deleteSessionApi(sessionId)
    },
    onSuccess: (_, sessionId) => {
      qc.setQueryData<Session[]>(['agentSessions'], (old) => old?.filter((s) => s.session_id !== sessionId))
      toast.success(`Session deleted successfully! ${generateRandomEmojis(1)}`)
    }
  })

  return {
    renameSession: renameSession.mutate,
    renameSessionStatus: renameSession.status,
    renameSessionReset: renameSession.reset,
    deleteSession: deleteSession.mutate
  }
}

export function useRenameForm({
  sessionId,
  initialTitle,
  onSave,
  open,
  onOpenChange,
  status,
  resetMutation
}: RenameDialogProps & {
  status: 'idle' | 'pending' | 'success' | 'error'
  resetMutation: () => void
}) {
  const form = useForm<{ title: string }>({
    defaultValues: { title: initialTitle },
    mode: 'onChange'
  })

  const { formState, handleSubmit, reset } = form
  const { isValid, errors } = formState

  useEffect(() => {
    if (open) {
      reset({ title: initialTitle })
    }
  }, [open, initialTitle, reset])

  useEffect(() => {
    if (!open && resetMutation) {
      resetMutation()
    }
  }, [open, resetMutation])

  useEffect(() => {
    if (status === 'success' && onOpenChange) {
      onOpenChange(false)
    }
  }, [status, onOpenChange])

  const submitHandler: SubmitHandler<{ title: string }> = (data) => {
    onSave(sessionId, data.title)
  }

  return {
    form,
    errors,
    isButtonDisabled: !isValid,
    submitHandler: handleSubmit(submitHandler),
    onOpenChange
  }
}

export function useSessionActionsWithHandlers(router: ReturnType<typeof useRouter>) {
  const { renameSession, deleteSession } = useSessionActions()

  const handleRenameSave = (sessionId: string, newTitle: string) => {
    renameSession({ sessionId, newTitle })
  }

  const handleDelete = (sessionId: string, currentChatId?: string) => {
    deleteSession(sessionId)
    if (sessionId === currentChatId) {
      router.push('/chat')
    }
  }

  return {
    handleRenameSave,
    handleDelete
  }
}
