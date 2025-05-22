// client/src/app/chat/[chatId]/page.tsx
import { ChatMessages } from '@/components/chat/chatMessages'

export default async function ChatDetailPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params
  return <ChatMessages chatId={chatId} />
}
