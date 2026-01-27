'use client'

import { motion } from 'framer-motion'

interface Option {
  id: string
  text: string
  is_correct?: boolean
}

interface MultipleChoiceQuestionProps {
  questionData: {
    options: Option[]
    min_selections?: number
    max_selections?: number
    partial_credit?: boolean
  }
  answer: string[] | null
  onAnswerChange: (answer: string[]) => void
}

export default function MultipleChoiceQuestion({
  questionData,
  answer = [],
  onAnswerChange
}: MultipleChoiceQuestionProps) {
  const { options, min_selections = 1, max_selections } = questionData
  const selectedAnswers = answer || []

  const handleOptionToggle = (optionId: string) => {
    let newAnswers

    if (selectedAnswers.includes(optionId)) {
      // Remove the option
      newAnswers = selectedAnswers.filter((id) => id !== optionId)
    } else {
      // Add the option (if within max limit)
      if (max_selections && selectedAnswers.length >= max_selections) {
        return // Don't allow more selections
      }
      newAnswers = [...selectedAnswers, optionId]
    }

    onAnswerChange(newAnswers)
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-3'>
        {options.map((option, index) => {
          const isSelected = selectedAnswers.includes(option.id)
          const isDisabled = max_selections && !isSelected && selectedAnswers.length >= max_selections

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`group relative cursor-pointer ${
                isSelected
                  ? 'ring-opacity-50 border-blue-300 bg-blue-50 ring-2 ring-blue-500'
                  : isDisabled
                    ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              } rounded-lg border p-4 transition-all duration-200`}
              onClick={isDisabled ? undefined : () => handleOptionToggle(option.id)}
              whileHover={isDisabled ? undefined : { scale: 1.01 }}
              whileTap={isDisabled ? undefined : { scale: 0.99 }}
            >
              <div className='flex items-center gap-4'>
                {/* Checkbox */}
                <div
                  className={`relative h-5 w-5 rounded border-2 transition-colors duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : isDisabled
                        ? 'border-gray-300 bg-gray-100'
                        : 'border-gray-300 group-hover:border-gray-400'
                  }`}
                >
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20
                      }}
                      className='absolute inset-0.5 h-3 w-3 text-white'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </motion.svg>
                  )}
                </div>

                {/* Option Letter */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : isDisabled
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>

                {/* Option Text */}
                <div
                  className={`flex-1 text-sm font-medium transition-colors duration-200 ${
                    isSelected
                      ? 'text-blue-900'
                      : isDisabled
                        ? 'text-gray-400'
                        : 'text-gray-700 group-hover:text-gray-900'
                  }`}
                >
                  {option.text}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
