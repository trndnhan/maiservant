// client/src/components/chat/chatInputForm.tsx
'use client'
import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChatInput } from '@/components/ui/chat-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FileText, File as FileIcon, Loader } from 'lucide-react'
import Image from 'next/image'
import { UseFormReturn } from 'react-hook-form'
import { useLineCount } from '@/lib/useLineCount'

interface ChatInputFormProps {
  form: UseFormReturn<{ message: string }>
  selectedFiles: File[]
  previewUrls: string[]
  fileInputRef: React.RefObject<HTMLInputElement | null>
  truncateFileName: (name: string, maxLength?: number) => string
  handleFileUploadClick: () => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleRemoveFile: (index: number) => void
  onSubmit: (values: { message: string }) => void
  isSubmitDisabled: boolean
  isSubmitting: boolean
  onLineCountChange?: (lines: number) => void
}

export const ChatInputForm: FC<ChatInputFormProps> = ({
  form,
  selectedFiles,
  previewUrls,
  fileInputRef,
  truncateFileName,
  handleFileUploadClick,
  handleFileChange,
  handleDrop,
  handleDragOver,
  handleRemoveFile,
  onSubmit,
  isSubmitDisabled,
  isSubmitting,
  onLineCountChange = () => {}
}) => {
  const { ref: textareaRef, lines, onChange: updateLines } = useLineCount()

  React.useEffect(() => {
    onLineCountChange(lines)
  }, [lines, onLineCountChange])

  return (
    <div className='relative' onDragOver={handleDragOver} onDrop={handleDrop}>
      {selectedFiles.length > 0 && (
        <motion.div
          className='gap-1 ml-1 w-40'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {selectedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='relative bg-gray-50 rounded-lg shadow-sm p-1 hover:shadow-md transition-shadow duration-200'
            >
              <div className='flex items-center'>
                {file.type.startsWith('image/') ? (
                  <Image
                    src={previewUrls[index]}
                    alt={file.name}
                    width={32}
                    height={32}
                    className='w-8 h-8 object-cover rounded-md mr-1'
                  />
                ) : (
                  <div className='w-8 h-8 flex items-center justify-center bg-gray-50 rounded-md mr-1'>
                    {file.type === 'application/pdf' ? (
                      <FileText size={20} className='text-red-500' />
                    ) : (
                      <FileIcon size={20} className='text-gray-500' />
                    )}
                  </div>
                )}
                <div className='flex-1'>
                  <h4 className='text-[10px] font-semibold text-gray-800 truncate' title={file.name}>
                    {truncateFileName(file.name, 15)}
                  </h4>
                  <p className='text-[10px] text-gray-500 mt-0.5'>{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFile(index)}
                type='button'
                className='absolute top-1 right-1 text-xs text-red-300 hover:text-red-900 transition-colors'
                aria-label={`Remove file ${file.name}`}
              >
                ❌
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ChatInput
                    placeholder='Type your message here or drag files here...'
                    className='font-segoe resize-none rounded-xl border-0 p-2 shadow-none focus-visible:ring-0 leading-7'
                    {...field}
                    ref={textareaRef}
                    onChange={(e) => {
                      form.setValue('message', e.target.value)
                      updateLines()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (isSubmitDisabled) return
                        form.handleSubmit(onSubmit)()
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex items-center'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-9 w-9 shadow-md bg-gray-50 transition ease-in-out duration-300 hover:scale-105'
                    onClick={handleFileUploadClick}
                    aria-label='Attach File'
                  >
                    📎
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom' className='font-poppins'>
                  <p>Attach File</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              type='submit'
              size='sm'
              disabled={isSubmitDisabled}
              className={`h-8 text-xs rounded-full shadow-md ml-auto gap-1 font-semibold transition ease-in-out duration-300 ${
                isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
              } bg-linear-225 from-signinup1 via-signinup2 to-signinup3 text-gray-900`}
              effect='shineHover'
              aria-disabled={isSubmitDisabled}
            >
              {isSubmitting && <Loader className='animate-spin h-4 w-4' />}
              Send <span className='text-sm'>📨</span>
            </Button>
          </div>
        </form>
      </Form>

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
        multiple
        aria-hidden='true'
        tabIndex={-1}
      />
    </div>
  )
}
