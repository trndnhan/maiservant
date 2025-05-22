// client\src\components\chat\servantManager.tsx
/**
 * This feature is underdevdelopement, the current code is just for visual purposes
 */
'use client'
import * as React from 'react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

export function ServantManager({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: string
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size='default' className='font-poppins tracking-tight'>
                <a href={item.url}>
                  <span className='text-lg'>{item.icon} </span>
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
