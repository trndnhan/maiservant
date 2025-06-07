// client\src\components\root\authForm.tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useAuthForm } from '@/hooks/root/useAuthForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FloatingLabelInput } from '@/components/root/floatingLabelInput'
import { RandomGradientText } from '@/components/randomGradientText'
import { useRandomEmojis } from '@/hooks/useRandomEmojis'

export const AuthForm = () => {
  const { isSignup, loading, signUpForm, signInForm, onSignUp, onSignIn, direction, handleTabChange } = useAuthForm()

  const signUpDescriptionEmoji = useRandomEmojis(1)
  const signInDescriptionEmoji = useRandomEmojis(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex relative items-center justify-center w-full md:w-1/2 font-poppins'
    >
      <Tabs value={isSignup ? 'signup' : 'signin'} onValueChange={(val) => handleTabChange(val as 'signup' | 'signin')}>
        <TabsList className='grid w-full grid-cols-2 bg-violet-50 shadow-2xl rounded-3xl'>
          <TabsTrigger value='signup' className='text-xs md:text-sm'>
            Sign Up
          </TabsTrigger>
          <TabsTrigger value='signin' className='text-xs md:text-sm'>
            Sign In
          </TabsTrigger>
        </TabsList>

        <AnimatePresence initial={false} custom={direction}>
          {isSignup ? (
            <TabsContent value='signup' key='signup'>
              <motion.div
                initial={{ opacity: 0, x: direction === 'right' ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 'right' ? -50 : 50 }}
                transition={{ duration: 0.3 }}
              >
                <Form {...signUpForm}>
                  <form noValidate onSubmit={signUpForm.handleSubmit(onSignUp)} className='space-y-4'>
                    <Card className='bg-violet-50 shadow-2xl rounded-3xl'>
                      <CardHeader>
                        <CardTitle className='text-sm md:text-base'>Sign Up</CardTitle>
                        <CardDescription className='text-xs md:text-sm font-segoe'>
                          Be the <RandomGradientText>&apos;Master&apos;</RandomGradientText> of your first{' '}
                          <RandomGradientText>&apos;Servant&apos;</RandomGradientText> today! {signUpDescriptionEmoji}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-2'>
                        <div className='space-y-1'>
                          <FormField
                            control={signUpForm.control}
                            name='full_name'
                            render={({ field }) => (
                              <FormItem className='mb-4 space-y-1'>
                                <FormControl>
                                  <FloatingLabelInput
                                    id='full_name'
                                    label='👤 Full Name'
                                    type='text'
                                    className='text-sm md:text-base rounded-3xl'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className='text-xs' />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='space-y-1'>
                          <FormField
                            control={signUpForm.control}
                            name='email'
                            render={({ field }) => (
                              <FormItem className='mb-4 space-y-1'>
                                <FormControl>
                                  <FloatingLabelInput
                                    id='email'
                                    label='📧 Email'
                                    type='email'
                                    className='text-sm md:text-base rounded-3xl'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className='text-xs' />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='space-y-1'>
                          <FormField
                            control={signUpForm.control}
                            name='password'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormControl>
                                  <FloatingLabelInput
                                    id='password'
                                    label='🔑 Password'
                                    type='password'
                                    className='text-sm md:text-base rounded-3xl'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className='text-xs' />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type='submit'
                          disabled={loading || !signUpForm.formState.isValid}
                          className='rounded-full bg-linear-45 from-signinup1 via-signinup2 to-signinup3 px-6 py-3 text-xs md:text-sm font-semibold text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_pink] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none'
                          effect='shineHover'
                        >
                          {loading && <Loader2 className='animate-spin h-4 w-4' />}
                          Sign Up
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </motion.div>
            </TabsContent>
          ) : (
            <TabsContent value='signin' key='signin'>
              <motion.div
                initial={{ opacity: 0, x: direction === 'right' ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 'right' ? -50 : 50 }}
                transition={{ duration: 0.3 }}
              >
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSignIn)} className='space-y-4'>
                    <Card className='bg-violet-50 shadow-2xl rounded-3xl'>
                      <CardHeader>
                        <CardTitle className='text-sm md:text-base'>Sign In</CardTitle>
                        <CardDescription className='text-xs md:text-sm font-segoe'>
                          Welcome Back, <RandomGradientText>&apos;Master&apos;</RandomGradientText>! Sign in to
                          continue. {signInDescriptionEmoji}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-2'>
                        <div className='space-y-1'>
                          <FormField
                            control={signInForm.control}
                            name='email'
                            render={({ field }) => (
                              <FormItem className='mb-4 space-y-2'>
                                <FormControl>
                                  <FloatingLabelInput
                                    id='email'
                                    label='📧 Email'
                                    type='email'
                                    className='text-sm md:text-base rounded-3xl'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className='text-xs' />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='space-y-1'>
                          <FormField
                            control={signInForm.control}
                            name='password'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormControl>
                                  <FloatingLabelInput
                                    id='signin-password'
                                    label='🔑 Password'
                                    type='password'
                                    className='text-sm md:text-base rounded-3xl'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className='text-xs' />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type='submit'
                          disabled={loading || !signInForm.formState.isValid}
                          className='rounded-full bg-linear-45 from-signinup1 via-signinup2 to-signinup3 px-6 py-3 text-xs md:text-sm font-semibold text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_pink] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none'
                          effect='shineHover'
                        >
                          {loading && <Loader2 className='animate-spin h-4 w-4' />}
                          Sign In
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </motion.div>
  )
}
