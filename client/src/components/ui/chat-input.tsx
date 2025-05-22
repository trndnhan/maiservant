import * as React from 'react'
import { AutosizeTextarea, AutosizeTextAreaRef } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const ChatInput = React.forwardRef<AutosizeTextAreaRef, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <AutosizeTextarea
      autoComplete='off'
      maxHeight={125}
      ref={ref}
      name='message'
      className={cn(
        'px-4 py-3 bg-grey-50 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-md flex items-center resize-none',
        className
      )}
      {...props}
    />
  )
)
ChatInput.displayName = 'ChatInput'

export { ChatInput }
