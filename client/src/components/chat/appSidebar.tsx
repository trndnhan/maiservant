// client/src/components/chat/appSidebar.tsx
'use client'
import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { AppName } from '@/components/appName'
import { Sidebar, SidebarFooter, SidebarHeader, SidebarContent } from '@/components/ui/sidebar'
import { ServantManager } from '@/components/chat/servantManager'
import { UserManager } from '@/components/chat/userManager'
import { useUser } from '@/hooks/chat/useUser'
import { ChatHistory } from '@/components/chat/chatHistory'
import { useSessions } from '@/hooks/chat/useSessions'
import useModelStore, { ExtendedModel } from '@/stores/modelStore'
import { useParams } from 'next/navigation'
import { modelGroups } from '@/data/modelGroups'
import { useSessionMessages } from '@/hooks/chat/useSessionMessages'

const navSecondary = [
  {
    title: 'Servant manager',
    url: '#',
    icon: '🤵'
  }
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, loading: userLoading, error: userError } = useUser()
  const { data: sessions = [], isLoading: sessLoading, error: sessError } = useSessions()
  const setSelectedModel = useModelStore((state) => state.setSelectedModel)

  const { chatId: currentChatId } = useParams() as { chatId?: string }
  const { loading: isInitialMessagesLoading } = useSessionMessages(currentChatId || '')

  React.useEffect(() => {
    if (!currentChatId || sessions.length === 0) return
    const session = sessions.find((s) => s.session_id === currentChatId)
    const agentModel = session?.agent_data?.model
    if (agentModel) {
      let label = agentModel.id
      let family = agentModel.provider

      for (const group of modelGroups) {
        const found = group.models.find((m) => m.value === agentModel.id)
        if (found) {
          label = found.label
          family = group.family
          break
        }
      }

      const extended: ExtendedModel = {
        value: agentModel.id,
        label,
        provider: agentModel.provider,
        family
      }

      setSelectedModel(extended)
    }
  }, [sessions, currentChatId, setSelectedModel])

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader className='flex items-center justify-center'>
        <AppName />
      </SidebarHeader>

      <SidebarContent>
        {sessLoading ? (
          <div className='flex h-12 items-center space-x-2 text-sm text-gray-500 p-2'>
            <Loader2 className='animate-spin h-4 w-4' />
            <span>Loading chats...</span>
          </div>
        ) : sessError ? (
          <div className='text-sm text-red-500 p-2'>{sessError.message}</div>
        ) : (
          <ChatHistory
            items={sessions.map((s) => ({ session_id: s.session_id, title: s.title }))}
            loadingSessionId={isInitialMessagesLoading ? currentChatId : null}
          />
        )}
      </SidebarContent>

      <SidebarFooter>
        <ServantManager items={navSecondary} />

        {userLoading ? (
          <div className='flex h-12 items-center space-x-2 text-sm text-gray-500 p-2'>
            <Loader2 className='animate-spin h-4 w-4' />
            <span>Loading user...</span>
          </div>
        ) : userError ? (
          <div className='text-sm text-red-500 p-2'>{userError.message}</div>
        ) : (
          user && <UserManager user={user} />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
