// client/src/components/chat/chatHistory.tsx
import React from 'react'
import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar'
import { useRandomEmojis } from '@/hooks/useRandomEmojis'
import { useRouter, useParams } from 'next/navigation'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { MoreHorizontal, Loader } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { useSessionActionsWithHandlers } from '@/hooks/chat/useSessionActions'
import { Button } from '@/components/ui/button'
import { RenameDialog } from '@/components/chat/renameDialog'
import { DeleteAlertDialog } from '@/components/chat/deleteAlertDialog'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessions } from '@/hooks/chat/useSessions'

interface ChatItem {
  session_id: string
  title: string
}

interface ChatHistoryProps {
  items: ChatItem[]
  loadingSessionId?: string | null
}

export function ChatHistory({ items, loadingSessionId }: ChatHistoryProps) {
  const [openSessionId, setOpenSessionId] = React.useState<string | null>(null)
  const [renameOpenId, setRenameOpenId] = React.useState<string | null>(null)
  const [deleteOpenId, setDeleteOpenId] = React.useState<string | null>(null)
  const randomEmoji = useRandomEmojis(1)
  const router = useRouter()
  const { chatId: currentChatId } = useParams()
  const { handleRenameSave, handleDelete } = useSessionActionsWithHandlers(router)

  const { animatedSessions } = useSessions()

  return (
    <SidebarGroup>
      {randomEmoji && (
        <SidebarGroupLabel className='font-poppins text-sm w-[220px]'>
          Recent Conversation {randomEmoji}
        </SidebarGroupLabel>
      )}

      <TooltipProvider delayDuration={200}>
        {items.length === 0 ? (
          <div className='text-sm text-gray-500 font-poppins px-2 py-4'>You haven&apos;t created any sessions yet.</div>
        ) : (
          items.map((item) => {
            const isActive = item.session_id === currentChatId
            const isHighlighted = isActive || openSessionId === item.session_id
            const isLoadingMessages = item.session_id === loadingSessionId

            return (
              <div
                key={item.session_id}
                className={`group/item flex justify-between items-center font-poppins p-2 text-xs transition ease-in-out duration-300 ${
                  isHighlighted ? 'bg-gray-200 rounded-lg' : 'text-gray-700 rounded-lg hover:bg-gray-200'
                }`}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => router.push(`/chat/${item.session_id}`)}
                      className='w-[180px] truncate cursor-pointer'
                    >
                      <AnimatePresence>
                        {animatedSessions.has(item.session_id) ? (
                          <motion.span
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className='inline-block'
                          >
                            {item.title}
                          </motion.span>
                        ) : (
                          <span>{item.title}</span>
                        )}
                      </AnimatePresence>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='top' className='font-poppins'>
                    {item.title}
                  </TooltipContent>
                </Tooltip>

                {isLoadingMessages ? (
                  <div className='flex items-center justify-center h-5 w-5'>
                    <Loader size={12} className='animate-spin text-gray-500' />
                  </div>
                ) : (
                  <DropdownMenu
                    modal={false}
                    open={openSessionId === item.session_id}
                    onOpenChange={(open) => setOpenSessionId(open ? item.session_id : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        variant={'ghost'}
                        className={`cursor-pointer h-5 w-5 transition ${
                          openSessionId === item.session_id ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'
                        } hover:bg-gray-200`}
                      >
                        <MoreHorizontal size={12} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align='start' className='w-30 rounded-lg'>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          setRenameOpenId(item.session_id)
                        }}
                        className='cursor-pointer font-poppins font-medium'
                      >
                        🖊️ <span className='text-xs'>Rename</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          setDeleteOpenId(item.session_id)
                          setOpenSessionId(null)
                        }}
                        className='cursor-pointer font-poppins'
                      >
                        🗑️ <span className='font-semibold text-rose-500 text-xs'>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <RenameDialog
                  open={renameOpenId === item.session_id}
                  onOpenChange={(open) => !open && setRenameOpenId(null)}
                  sessionId={item.session_id}
                  initialTitle={item.title}
                  onSave={handleRenameSave}
                />

                {deleteOpenId === item.session_id && (
                  <DeleteAlertDialog
                    open={true}
                    onOpenChange={() => setDeleteOpenId(null)}
                    sessionId={item.session_id}
                    onDelete={() => handleDelete(item.session_id, currentChatId as string)}
                  />
                )}
              </div>
            )
          })
        )}
      </TooltipProvider>
    </SidebarGroup>
  )
}
