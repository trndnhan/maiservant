// client/src/components/chat/renameDialog.tsx
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useRandomEmojis } from '@/hooks/useRandomEmojis'
import { useRenameForm, RenameDialogProps } from '@/hooks/chat/useSessionActions'
import { useSessionActions } from '@/hooks/chat/useSessionActions'
import { Loader2 } from 'lucide-react'

export function RenameDialog(props: RenameDialogProps) {
  const { sessionId, initialTitle, open, onOpenChange } = props

  const { renameSession, renameSessionStatus, renameSessionReset } = useSessionActions()

  const {
    form,
    errors,
    isButtonDisabled,
    submitHandler,
    onOpenChange: handleOpenChange
  } = useRenameForm({
    sessionId,
    initialTitle,
    onSave: (id, title) => renameSession({ sessionId: id, newTitle: title }),
    open,
    onOpenChange,
    status: renameSessionStatus,
    resetMutation: renameSessionReset
  })

  const randomEmoji = useRandomEmojis(1)

  const isSubmitting = renameSessionStatus === 'pending'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <span />
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] font-poppins'>
        <DialogHeader>
          <DialogTitle>Rename Session</DialogTitle>
          {randomEmoji && (
            <DialogDescription className='font-segoe'>
              Enter a new name for this session. {randomEmoji}
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={submitHandler} className='space-y-4 py-2'>
            <FormItem className='flex items-center'>
              <FormLabel htmlFor='title' className='pr-4 pl-3 pt-2'>
                New Title
              </FormLabel>
              <FormControl className='flex-1'>
                <div>
                  <Input
                    id='title'
                    {...form.register('title', {
                      required: 'Title cannot be empty',
                      validate: (value) => value.trim() !== '' || 'Title cannot be empty'
                    })}
                  />
                  <FormMessage className='pl-1 pt-1'>{errors.title?.message}</FormMessage>
                </div>
              </FormControl>
            </FormItem>

            <DialogFooter>
              <Button
                type='submit'
                className='cursor-pointer shadow-md font-semibold transition ease-in-out duration-300 hover:scale-105 bg-linear-45 from-signinup1 via-signinup2 to-signinup3 text-gray-900'
                effect='shineHover'
                disabled={isButtonDisabled || isSubmitting}
              >
                {isSubmitting && <Loader2 className='h-4 w-4 animate-spin' />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
