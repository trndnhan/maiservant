// client/src/components/chat/chatHistory.tsx
import React from 'react'
import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar'
import { useRandomEmojis } from '@/hooks/useRandomEmojis'
import { useRouter, useParams } from 'next/navigation'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { MoreHorizontal } from 'lucide-react'
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

interface ChatItem {
  session_id: string
  title: string
}

interface ChatHistoryProps {
  items: ChatItem[]
}

export function ChatHistory({ items }: ChatHistoryProps) {
  const [openSessionId, setOpenSessionId] = React.useState<string | null>(null)
  const [renameOpenId, setRenameOpenId] = React.useState<string | null>(null)
  const [deleteOpenId, setDeleteOpenId] = React.useState<string | null>(null)
  const randomEmoji = useRandomEmojis(1)
  const router = useRouter()
  const { chatId: currentChatId } = useParams()
  const { handleRenameSave, handleDelete } = useSessionActionsWithHandlers(router)

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

            return (
              <div
                key={item.session_id}
                className={`group/item flex justify-between items-center font-poppins p-2 text-xs transition ease-in-out duration-300 ${
                  isHighlighted ? 'bg-neutral-100 rounded-lg' : 'text-gray-700 hover:bg-neutral-100 hover:rounded-lg'
                }`}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => router.push(`/chat/${item.session_id}`)}
                      className='w-[180px] truncate cursor-pointer'
                    >
                      {item.title}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='top' className='font-poppins'>
                    {item.title}
                  </TooltipContent>
                </Tooltip>

                <DropdownMenu
                  modal={false}
                  open={openSessionId === item.session_id}
                  onOpenChange={(open) => setOpenSessionId(open ? item.session_id : null)}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      variant={'ghost'}
                      className={`cursor-pointer h-1 w-1 transition ${
                        openSessionId === item.session_id ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'
                      } hover:bg-gray-200`}
                    >
                      <MoreHorizontal size={5} />
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
