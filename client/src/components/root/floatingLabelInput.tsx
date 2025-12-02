// client\src\components\root\floatingLabelInput.tsx
'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ id, label, className, type, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type

    const stringValue = value ? value.toString() : ''

    return (
      <div className='relative'>
        <Input
          id={id}
          placeholder=' '
          type={inputType}
          ref={inputRef}
          value={value}
          {...props}
          className={cn('peer text-foreground', type === 'password' && 'pr-10', className)}
        />
        <Label
          htmlFor={id}
          className={cn(
            'absolute left-3 px-1 pointer-events-none transition-all duration-200 bg-violet-50',
            'peer-placeholder-shown:top-[10px] peer-placeholder-shown:-translate-y-0',
            'peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:-translate-y-1/2',
            'peer-focus:text-sm peer-[&:not(:placeholder-shown)]:top-0',
            'peer-[&:not(:placeholder-shown)]:-translate-y-1/2 peer-[&:not(:placeholder-shown)]:text-sm'
          )}
        >
          {label}
        </Label>
        {type === 'password' && stringValue.length > 0 && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              setShowPassword((prev) => !prev)
            }}
            className='absolute top-1/2 -translate-y-1/2 right-3 flex items-center z-10'
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        )}
      </div>
    )
  }
)

FloatingLabelInput.displayName = 'FloatingLabelInput'

export { FloatingLabelInput }
