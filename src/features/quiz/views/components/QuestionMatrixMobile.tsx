'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/global/components/ui/sheet'
import { motion } from 'framer-motion'

interface Question {
  id: string
  question_text: string
  question_type: string
  question_order: number
}

interface QuestionMatrixMobileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  questions: Question[]
  currentQuestionIndex: number
  answers: any[]
  onQuestionClick: (index: number) => void
}

export default function QuestionMatrixMobile({
  open,
  onOpenChange,
  questions,
  currentQuestionIndex,
  answers,
  onQuestionClick
}: QuestionMatrixMobileProps) {
  const getQuestionStatus = (question: Question, index: number) => {
    const hasAnswer = answers?.some((answer: any) => answer.question_id === question.id)
    const isCurrent = index === currentQuestionIndex
    if (isCurrent) return 'current'
    if (hasAnswer) return 'answered'
    return 'unanswered'
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-blue-500 text-white border-blue-500 ring-2 ring-blue-200'
      case 'answered':
        return 'bg-green-500 text-white border-green-500 hover:bg-green-600'
      case 'marked':
        return 'bg-yellow-400 text-gray-900 border-yellow-400 hover:bg-yellow-500'
      case 'unanswered':
        return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200'
    }
  }

  const handleQuestionClick = (index: number) => {
    onQuestionClick(index)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom' className='h-[60dvh] max-h-[85dvh] rounded-t-2xl border-t px-4 pt-4 pb-8 sm:px-6'>
        <SheetHeader className='sr-only'>
          <SheetTitle>Question navigator</SheetTitle>
        </SheetHeader>
        <div className='flex h-full flex-col overflow-hidden'>
          <h3 className='mb-3 text-sm font-semibold text-gray-900'>Questions</h3>
          <div className='min-h-0 flex-1 overflow-y-auto'>
            <div className='flex flex-wrap gap-4'>
              {questions.map((question, index) => {
                const status = getQuestionStatus(question, index)
                const styles = getStatusStyles(status)
                return (
                  <motion.button
                    key={question.id}
                    onClick={() => handleQuestionClick(index)}
                    className={`relative size-9 rounded-lg border-2 text-xs font-semibold transition-all duration-200 sm:size-10 sm:text-sm ${styles}`}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(index * 0.015, 0.2), duration: 0.2 }}
                  >
                    <span className='font-bold'>{index + 1}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
          {/* Legend - compact for small screens */}
          <div className='mt-4 shrink-0 rounded-lg bg-gray-50 p-3'>
            <div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs'>
              <div className='flex items-center gap-1.5'>
                <div className='h-3 w-3 rounded border bg-blue-500' />
                <span className='text-gray-600'>Current</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='h-3 w-3 rounded border bg-green-500' />
                <span className='text-gray-600'>Answered</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='h-3 w-3 rounded border border-gray-300 bg-white' />
                <span className='text-gray-600'>Not answered</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
