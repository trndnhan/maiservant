// client/src/components/chat/chatSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

interface SkeletonConfig {
  isLeft: boolean
  width: string
}

interface ChatSkeletonProps {
  skeletonConfigs?: SkeletonConfig[]
}

const defaultSkeletonConfigs: SkeletonConfig[] = [
  { isLeft: true, width: '60%' },
  { isLeft: false, width: '70%' },
  { isLeft: true, width: '65%' },
  { isLeft: false, width: '75%' },
  { isLeft: true, width: '50%' },
  { isLeft: false, width: '80%' },
  { isLeft: true, width: '70%' },
  { isLeft: false, width: '55%' }
]

export const ChatSkeleton: React.FC<ChatSkeletonProps> = ({ skeletonConfigs = defaultSkeletonConfigs }) => {
  return (
    <div className='w-9/10 md:w-[750px] mx-auto my-4 bg-muted/40'>
      <div className='space-y-4 p-4'>
        {skeletonConfigs.map((config, index) => (
          <div key={index} className={`flex ${config.isLeft ? 'justify-start' : 'justify-end'}`}>
            <Skeleton style={{ width: config.width }} className='p-4 h-14 rounded-3xl' />
          </div>
        ))}
      </div>
    </div>
  )
}
