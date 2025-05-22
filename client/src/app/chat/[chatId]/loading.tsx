// client/src/app/chat/[chatId]/loading.tsx
import { ChatSkeleton } from '@/components/chat/chatSkeleton'

export default function Loading() {
  return (
    <div className='flex flex-col flex-1 min-h-screen'>
      <ChatSkeleton />
    </div>
  )
}
