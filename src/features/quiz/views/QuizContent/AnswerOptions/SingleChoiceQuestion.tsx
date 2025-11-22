'use client'

import { motion } from 'framer-motion'

interface Option {
  id: string
  text: string
  is_correct?: boolean
}

interface SingleChoiceQuestionProps {
  questionData: {
    options: Option[]
  }
  answer: string | null
  onAnswerChange: (answer: string) => void
}

export default function SingleChoiceQuestion({ questionData, answer, onAnswerChange }: SingleChoiceQuestionProps) {
  const { options } = questionData

  return (
    <div className='space-y-3'>
      {options.map((option, index) => (
        <motion.div
          key={option.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.1 }}
          className={`group relative cursor-pointer ${
            answer === option.id
              ? 'ring-opacity-50 border-blue-300 bg-blue-50 ring-2 ring-blue-500'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          } rounded-lg border p-4 transition-all duration-200`}
          onClick={() => onAnswerChange(option.id)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className='flex items-center gap-4'>
            {/* Radio Button */}
            <div
              className={`relative h-5 w-5 rounded-full border-2 transition-colors duration-200 ${
                answer === option.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-gray-400'
              }`}
            >
              {answer === option.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className='absolute inset-1 rounded-full bg-white'
                />
              )}
            </div>

            {/* Option Letter */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${
                answer === option.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              }`}
            >
              {String.fromCharCode(65 + index)}
            </div>

            {/* Option Text */}
            <div
              className={`flex-1 text-sm font-medium transition-colors duration-200 ${
                answer === option.id ? 'text-blue-900' : 'text-gray-700 group-hover:text-gray-900'
              }`}
            >
              {option.text}
            </div>

            {/* Selection Indicator */}
            {answer === option.id && (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className='text-blue-500'
              >
                <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
