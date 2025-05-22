// client/src/components/chat/chooseModel.tsx
'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { modelGroups, Model } from '@/data/modelGroups'
import useModelStore, { ExtendedModel } from '@/stores/modelStore'

export default function ChooseModel() {
  const [open, setOpen] = React.useState(false)
  const { selectedModel, setSelectedModel } = useModelStore()

  return (
    <div className='flex items-center space-x-4 font-poppins tracking-tight'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            className={cn('cursor-pointer h-9 justify-start transition ease-in-out duration-300 hover:scale-105', {
              'text-gray-400': !selectedModel
            })}
          >
            {selectedModel ? selectedModel.label : '+ Choose Model'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0 font-poppins' side='right' align='start'>
          <Command>
            <CommandInput placeholder='Search model...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {modelGroups.map((group, index) => (
                <React.Fragment key={group.family}>
                  {index > 0 && <CommandSeparator />}
                  <CommandGroup>
                    <div className='px-2 py-1.5 text-xs font-medium text-neutral-500'>{group.family}</div>
                    {group.models.map((model: Model) => (
                      <CommandItem
                        key={model.value}
                        value={model.value}
                        onSelect={(value) => {
                          const foundModel = group.models.find((m) => m.value === value)
                          if (foundModel) {
                            const extendedModel: ExtendedModel = {
                              ...foundModel,
                              family: group.family
                            }
                            setSelectedModel(extendedModel)
                          }
                          setOpen(false)
                        }}
                      >
                        {model.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </React.Fragment>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
