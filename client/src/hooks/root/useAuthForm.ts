// client/src/hooks/root/useAuthForm.ts
'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { generateRandomEmojis } from '@/hooks/useRandomEmojis'

const signUpSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().nonempty('Email is required').email('Must be a valid email'),
  password: z.string().nonempty('Password is required').min(8, 'Password must be at least 8 characters long')
})

const signInSchema = z.object({
  email: z.string().nonempty('Email is required').email('Must be a valid email'),
  password: z.string().nonempty('Password is required')
})

export type SignUpFormValues = z.infer<typeof signUpSchema>
export type SignInFormValues = z.infer<typeof signInSchema>

export const useAuthForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSignup, setIsSignup] = useState<boolean>(true)
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const [navigating, setNavigating] = useState<boolean>(false)

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: { full_name: '', email: '', password: '' }
  })

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' }
  })

  const handleTabChange = (newTab: 'signup' | 'signin') => {
    if ((isSignup ? 'signup' : 'signin') !== newTab) {
      if (isSignup) {
        signUpForm.reset()
      } else {
        signInForm.reset()
      }
      setDirection(newTab === 'signup' ? 'right' : 'left')
      setIsSignup(newTab === 'signup')
    }
  }

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpFormValues) => {
      const response = await axios.post('/api/auth/register', data)
      return response
    },
    onSuccess: () => {
      toast.success(`Account registered successfully! ${generateRandomEmojis(1)}`)
      signUpForm.reset()
      setIsSignup(false)
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400 && error.response?.data?.detail === 'REGISTER_USER_ALREADY_EXISTS') {
          toast.error(`A user already exists with this email! ${generateRandomEmojis(1)}`)
        } else {
          const errorMessage = error.response?.data?.detail || 'Something went wrong'
          toast.error(errorMessage)
        }
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  })

  const signInMutation = useMutation({
    mutationFn: async (data: SignInFormValues) => {
      const formData = new FormData()
      formData.append('username', data.email)
      formData.append('password', data.password)
      const response = await axios.post('/api/auth/jwt/login', formData, { withCredentials: true })
      return response.data
    },
    onSuccess: async () => {
      const userResponse = await axios.get<{ id: string; email: string; full_name: string }>('/api/auth/current_user', {
        withCredentials: true
      })
      const user = userResponse.data
      queryClient.setQueryData(['currentUser'], user)
      setNavigating(true)
      router.push('/chat')
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400 && error.response?.data?.detail === 'LOGIN_BAD_CREDENTIALS') {
          toast.error(`Incorrect email or password, please try again! ${generateRandomEmojis(1)}`)
        } else {
          const errorMessage = error.response?.data?.detail || 'Something went wrong'
          toast.error(errorMessage)
        }
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  })

  const onSignUp = async (data: SignUpFormValues) => {
    signUpMutation.mutate(data)
  }

  const onSignIn = async (data: SignInFormValues) => {
    signInMutation.mutate(data)
  }

  return {
    isSignup,
    loading: signUpMutation.status === 'pending' || signInMutation.status === 'pending' || navigating,
    signUpForm,
    signInForm,
    onSignUp,
    onSignIn,
    direction,
    handleTabChange
  }
}
