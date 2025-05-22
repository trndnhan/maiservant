// client\src\components\chat\userManager.tsx
'use client'
import { ChevronsUpDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { UserInfo, useUser } from '@/hooks/chat/useUser'

export function UserManager({ user }: { user: UserInfo }) {
  const { isMobile } = useSidebar()
  const { handleLogout } = useUser()
  const initials = user.email.slice(0, 2).toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-300 font-poppins tracking-tight'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarFallback className='rounded-lg'>{initials}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left leading-tight'>
                <span className='truncate font-semibold'>Hi, {user.full_name}!</span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem className='font-poppins transition-all duration-300 tracking-normal'>
                <span className='text-base'>🛠️ </span>Account Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className='font-poppins transition-all duration-300'>
              <span className='text-base'>🚪 </span>
              <span className='font-bold text-rose-500'>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
