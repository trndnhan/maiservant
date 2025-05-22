import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'

// Use HTMLDivElement and HTMLAttributes since CommandPrimitive renders as a div.
const Command = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive
      ref={ref as any}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50',
        className
      )}
      {...props}
    />
  )
)
Command.displayName = 'Command'

interface CommandDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className='overflow-hidden p-0'>
        <Command className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 dark:[&_[cmdk-group-heading]]:text-neutral-400'>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(({ className, ...props }, ref) => (
  <div className='flex items-center border-b px-3'>
    <p className='mr-2 shrink-0 opacity-50'>🔍</p>
    <CommandPrimitive.Input
      ref={ref as any}
      className={cn(
        'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-400',
        className
      )}
      {...props}
    />
  </div>
))
CommandInput.displayName = 'CommandInput'

const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.List
      ref={ref as any}
      className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
      {...props}
    />
  )
)
CommandList.displayName = 'CommandList'

const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <CommandPrimitive.Empty ref={ref as any} className='py-6 text-center text-sm' {...props} />
))
CommandEmpty.displayName = 'CommandEmpty'

const CommandGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Group
      ref={ref as any}
      className={cn(
        'overflow-hidden p-1 text-neutral-950 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500 dark:text-neutral-50 dark:[&_[cmdk-group-heading]]:text-neutral-400',
        className
      )}
      {...props}
    />
  )
)
CommandGroup.displayName = 'CommandGroup'

const CommandSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
      ref={ref as any}
      className={cn('-mx-1 h-px bg-neutral-200 dark:bg-neutral-800', className)}
      {...props}
    />
  )
)
CommandSeparator.displayName = 'CommandSeparator'

interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  // if you need additional props like onSelect, you can add them here:
  onSelect?: (value: string) => void
  value?: string
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, onSelect, value, children, ...props }, ref) => (
    <CommandPrimitive.Item
      ref={ref as any}
      className={cn(
        'relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-neutral-100 data-[selected=true]:text-neutral-900 data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:data-[selected=true]:bg-neutral-800 dark:data-[selected=true]:text-neutral-50',
        className
      )}
      onSelect={onSelect ? () => onSelect(value || '') : undefined}
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  )
)
CommandItem.displayName = 'CommandItem'

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-neutral-500 dark:text-neutral-400', className)}
      {...props}
    />
  )
}
CommandShortcut.displayName = 'CommandShortcut'

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator
}
