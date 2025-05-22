// client\src\components\chat\deleteAlertDialog.tsx
import * as React from 'react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import { useRandomEmojis } from '@/hooks/useRandomEmojis'

interface DeleteAlertDialogProps {
  sessionId: string
  onDelete: (sessionId: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteAlertDialog({ sessionId, onDelete, open, onOpenChange }: DeleteAlertDialogProps) {
  const randomEmoji = useRandomEmojis(1)
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <span />
      </AlertDialogTrigger>
      <AlertDialogContent className='font-poppins sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
          {randomEmoji && (
            <AlertDialogDescription className='font-segoe'>
              This action cannot be undone. Are you sure you want to delete this chat session? {randomEmoji}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer shadow-md font-medium transition ease-in-out duration-300 hover:scale-105 text-gray-900'>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(sessionId)}
            className='cursor-pointer shadow-md font-semibold transition ease-in-out duration-300 hover:scale-105 bg-rose-500 hover:bg-rose-700 text-gray-900'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
