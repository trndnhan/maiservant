// client/src/components/root/CallToAction.tsx
'use client'
import { TypeAnimation } from 'react-type-animation'
import { useRandomEmojis } from '@/hooks/useRandomEmojis'

export const CallToAction = () => {
  const randomTextEmojis = useRandomEmojis(5)

  return (
    <div className='hidden md:block md:w-1/2 justify-start items-start'>
      {randomTextEmojis && (
        <TypeAnimation
          sequence={[
            "They don't allow you to own a slave",
            500,
            "They don't allow you to own a living human to obey all your orders nowadays...",
            750,
            `They don't allow you to own a living human to obey all your orders nowadays... So why not own an Artificial Un-Intelligent one instead?${randomTextEmojis}`
          ]}
          speed={50}
          className='font-jetbrains-mono text-lg md:text-2xl font-extrabold text-gray-900 leading-tight md:text-left text-justify'
        />
      )}
    </div>
  )
}
