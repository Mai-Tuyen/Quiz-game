'use client'

import { motion } from 'framer-motion'

interface Question {
  id: string
  question_text: string
  question_type: string
  question_order: number
}

interface QuestionMatrixProps {
  questions: Question[]
  currentQuestionIndex: number
  answers: Record<string, any>
  markedForReview: Set<string>
  onQuestionClick: (index: number) => void
}

export default function QuestionMatrix({
  questions,
  currentQuestionIndex,
  answers,
  markedForReview,
  onQuestionClick
}: QuestionMatrixProps) {
  const getQuestionStatus = (question: Question, index: number) => {
    const hasAnswer = answers[question.id] !== undefined && answers[question.id] !== null
    const isMarked = markedForReview.has(question.id)
    const isCurrent = index === currentQuestionIndex

    if (isCurrent) {
      return 'current'
    } else if (isMarked) {
      return 'marked'
    } else if (hasAnswer) {
      return 'answered'
    } else {
      return 'unanswered'
    }
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

  return (
    <div className='space-y-6'>
      {/* Question Grid */}
      <div>
        <h3 className='mb-3 font-semibold text-gray-900'>Questions</h3>
        <div className='grid grid-cols-5 gap-2'>
          {questions.map((question, index) => {
            const status = getQuestionStatus(question, index)
            const styles = getStatusStyles(status)
            return (
              <motion.button
                key={question.id}
                onClick={() => onQuestionClick(index)}
                className={`relative size-10 rounded-lg border-2 text-sm font-semibold transition-all duration-200 ${styles}`}
                whileHover={{ scale: status !== 'current' ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02, duration: 0.2 }}
              >
                <div className='flex h-full flex-col items-center justify-center'>
                  <span className='text-xs font-bold'>{index + 1}</span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className='rounded-lg bg-gray-50 p-4'
      >
        <h4 className='mb-3 text-sm font-medium text-gray-900'>Legend</h4>
        <div className='space-y-2 text-xs'>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded border bg-blue-500'></div>
            <span className='text-gray-600'>Current Question</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded border bg-green-500'></div>
            <span className='text-gray-600'>Answered</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded border border-gray-300 bg-white'></div>
            <span className='text-gray-600'>Not Answered</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
