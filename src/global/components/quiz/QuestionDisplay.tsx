'use client'

import { motion } from 'framer-motion'
import SingleChoiceQuestion from './AnswerOptions/SingleChoiceQuestion'
import MultipleChoiceQuestion from './AnswerOptions/MultipleChoiceQuestion'
import SequenceQuestion from './AnswerOptions/SequenceQuestion'
import DragWordQuestion from './AnswerOptions/DragWordQuestion'

interface Question {
  id: string
  question_text: string
  question_type: 'single_choice' | 'multiple_choice' | 'sequence' | 'drag_word'
  question_order: number
  points: number
  explanation: string
  question_data: any
}

interface QuestionDisplayProps {
  question: Question
  answer: any
  onAnswerChange: (answer: any) => void
  isMarkedForReview: boolean
  onMarkForReview: () => void
}

export default function QuestionDisplay({
  question,
  answer,
  onAnswerChange,
  isMarkedForReview,
  onMarkForReview
}: QuestionDisplayProps) {
  const renderAnswerComponent = () => {
    switch (question.question_type) {
      case 'single_choice':
        return (
          <SingleChoiceQuestion questionData={question.question_data} answer={answer} onAnswerChange={onAnswerChange} />
        )
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            questionData={question.question_data}
            answer={answer}
            onAnswerChange={onAnswerChange}
          />
        )
      case 'sequence':
        return (
          <SequenceQuestion questionData={question.question_data} answer={answer} onAnswerChange={onAnswerChange} />
        )
      case 'drag_word':
        return (
          <DragWordQuestion questionData={question.question_data} answer={answer} onAnswerChange={onAnswerChange} />
        )
      default:
        return (
          <div className='rounded-lg bg-red-50 p-4 text-red-500'>
            Unsupported question type: {question.question_type}
          </div>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='mx-auto max-w-4xl'
    >
      {/* Question Header */}
      <div className='mb-8'>
        <h2 className='text-xl leading-relaxed font-semibold text-gray-900'>{question.question_text}</h2>
      </div>

      {/* Answer Component */}
      <div className='mb-8'>{renderAnswerComponent()}</div>
    </motion.div>
  )
}
