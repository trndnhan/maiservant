// client\src\components\chat\createNewChat.tsx
'use client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function CreateNewChat() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/chat')
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            variant='ghost'
            size='icon'
            className='cursor-pointer h-9 w-9 transition ease-in-out duration-300 hover:scale-105'
          >
            <p>✍</p>
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom' className='font-poppins'>
          <p>New Chat</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
