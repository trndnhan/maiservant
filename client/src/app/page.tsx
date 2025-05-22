// client\src\app\page.tsx
'use client'
import { Toaster } from '@/components/ui/sonner'
import { AppName } from '@/components/appName'
import { CallToAction } from '@/components/root/callToAction'
import { AuthForm } from '@/components/root/authForm'
import { Background } from '@/components/root/background'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { generateRandomEmojis } from '@/hooks/useRandomEmojis'

export default function RootPage() {
  useEffect(() => {
    const showIdleToast = localStorage.getItem('showIdleToast')
    if (showIdleToast === 'true') {
      toast.error(`Session expired due to inactivity. Please log in again. ${generateRandomEmojis(1)}`)
      localStorage.removeItem('showIdleToast')
    }
  }, [])
  return (
    <Background>
      <div className='absolute z-50 inset-0 max-h-screen max-w-screen overflow-y-auto'>
        <div className='absolute p-11 top-5 left-0 md:top-0 md:left-0 md:absolute md:p-11 w-full flex md:justify-start justify-center'>
          <AppName />
        </div>

        <div className='flex justify-center items-center h-full'>
          <div className='w-full flex flex-col md:flex-row items-center justify-between p-11 gap-5 md:gap-3'>
            <CallToAction />
            <AuthForm />
          </div>
        </div>
        <Toaster position='top-right' />
      </div>
    </Background>
  )
}
