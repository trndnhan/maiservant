// client\src\components\chat\newChat.tsx
'use client'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChatInputForm } from '@/components/chat/chatInputForm'
import { useChat } from '@/hooks/chat/useChat'
import { TypeAnimation } from 'react-type-animation'
import { useRandomEmojis } from '@/hooks/useRandomEmojis'
import { RandomGradientText } from '@/components/randomGradientText'
import useModelStore from '@/stores/modelStore'

export default function NewChat() {
  const chatProps = useChat()
  const randomDisclaimerEmojis = useRandomEmojis(1)
  const randomCTAEmojis = useRandomEmojis(3)
  const { setSelectedModel } = useModelStore()

  useEffect(() => {
    setSelectedModel(null)
  }, [setSelectedModel])

  return (
    <>
      <motion.div
        className='flex flex-col flex-grow justify-center items-center relative'
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.h2
          className='scroll-m-20 text-3xl font-medium font-poppins tracking-tight mb-5 text-center z-10'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          How may I serve you today, <RandomGradientText>Master</RandomGradientText>? {randomCTAEmojis}
        </motion.h2>

        <motion.div
          className='w-9/10 md:w-[750px] font-sans shadow-md relative rounded-xl border bg-gray-50 focus-within:ring-1 focus-within:ring-ring p-3 z-10'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ChatInputForm {...chatProps} />
        </motion.div>
      </motion.div>
      {randomDisclaimerEmojis && (
        <TypeAnimation
          sequence={[
            'Use for reference only!',
            500,
            `Use for reference only! Artificial Intelligent is not that intelligent after all... ${randomDisclaimerEmojis}`
          ]}
          speed={60}
          className='font-segoe absolute bottom-4 left-1/2 transform -translate-x-1/2 italic text-xs text-gray-400 text-center'
        />
      )}
    </>
  )
}
