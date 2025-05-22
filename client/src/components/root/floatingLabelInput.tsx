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

    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type

    const stringValue = value ? value.toString() : ''

    return (
      <div className='relative'>
        <Input
          id={id}
          placeholder=' '
          type={inputType}
          ref={ref}
          value={value}
          {...props}
          className={cn('peer', type === 'password' && 'pr-10', className)}
        />
        <Label
          htmlFor={id}
          className={cn(
            'absolute left-3 z-10 px-1 pointer-events-none transition-all duration-200 bg-violet-50',
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
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute inset-y-0 right-3 flex items-center'
            tabIndex={-1}
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
