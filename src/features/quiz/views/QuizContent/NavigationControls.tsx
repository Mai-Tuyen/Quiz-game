'use client'

import QuestionMatrixMobile from '@/features/quiz/views/components/QuestionMatrixMobile'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { CiGrid41 } from 'react-icons/ci'
import { useTranslations } from 'next-intl'

interface Question {
  id: string
  question_text: string
  question_type: string
  question_order: number
}

interface NavigationControlsProps {
  currentIndex: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
  questions?: Question[]
  answers?: any[]
  onQuestionClick?: (index: number) => void
}

export default function NavigationControls({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  questions = [],
  answers = [],
  onQuestionClick = () => {}
}: NavigationControlsProps) {
  const t = useTranslations()
  const isFirstQuestion = currentIndex === 0
  const isLastQuestion = currentIndex === totalQuestions - 1
  const [isShowSheetQuestionMatrix, setIsShowSheetQuestionMatrix] = useState(false)

  return (
    <>
      <div className='flex items-center justify-between'>
        {/* Previous Button */}
        <motion.button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
            isFirstQuestion
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
          }`}
          whileHover={isFirstQuestion ? undefined : { scale: 1.02 }}
          whileTap={isFirstQuestion ? undefined : { scale: 0.98 }}
        >
          <svg
            className={`h-4 w-4 ${isFirstQuestion ? 'text-gray-400' : 'text-gray-600'}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          {t('QuizContent.previous')}
        </motion.button>

        {/* Center Controls */}
        <div className='flex items-center gap-4'>
          {/* Question Counter */}
          <div className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600'>
            {currentIndex + 1} {t('Common.of')} {totalQuestions}
          </div>
          <div className='md:hidden'>
            <CiGrid41 className='h-6 w-10' onClick={() => setIsShowSheetQuestionMatrix(true)} />
          </div>
        </div>

        {/* Next Button */}
        <motion.button
          onClick={onNext}
          disabled={isLastQuestion}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
            isLastQuestion ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          whileHover={isLastQuestion ? undefined : { scale: 1.02 }}
          whileTap={isLastQuestion ? undefined : { scale: 0.98 }}
        >
          {isLastQuestion ? t('QuizContent.lastQuestion') : t('QuizContent.next')}
          {!isLastQuestion && (
            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          )}
        </motion.button>
      </div>
      <QuestionMatrixMobile
        open={isShowSheetQuestionMatrix}
        onOpenChange={setIsShowSheetQuestionMatrix}
        questions={questions}
        currentQuestionIndex={currentIndex}
        answers={answers}
        onQuestionClick={onQuestionClick}
      />
    </>
  )
}
