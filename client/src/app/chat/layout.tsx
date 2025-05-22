// client/src/app/chat/layout.tsx
'use client'
import { AppSidebar } from '@/components/chat/appSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import ChooseModel from '@/components/chat/chooseModel'
import CreateNewChat from '@/components/chat/createNewChat'
import useInactivityLogout from '@/hooks/useInactivityLogout'
import { Toaster } from '@/components/ui/sonner'

export default function ChatPage({ children }: Readonly<{ children: React.ReactNode }>) {
  useInactivityLogout(15 * 60 * 1000)

  return (
    <SidebarProvider>
      <Toaster position='top-right' />
      <AppSidebar />
      <SidebarInset className='px-4 flex flex-col flex-1 min-h-0 relative'>
        <div className='flex flex-col flex-1 min-h-0'>
          <header className='flex h-11 shrink-0 items-center border-b border-gray-200 border-dashed'>
            <div className='flex items-center'>
              <SidebarTrigger className='-ml-1' />
              <CreateNewChat />
              <ChooseModel />
            </div>
          </header>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
