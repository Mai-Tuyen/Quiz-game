'use client'

import { useCallback } from 'react'
import { useGetCurrentQuizAttemptQuery, useSubmitQuizAttemptMutation } from '@/features/quiz/hooks/query'
import Timer from '@/features/quiz/views/components/Timer'
import { Quiz } from '@/global/lib/database/quizzes'
import { storage } from '@/global/lib/storage'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
interface QuizCardProps {
  quiz: Quiz
  index: number
}

const difficultyColors = {
  1: 'bg-green-100 text-green-800 border-green-200',
  2: 'bg-blue-100 text-blue-800 border-blue-200',
  3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  4: 'bg-orange-100 text-orange-800 border-orange-200',
  5: 'bg-red-100 text-red-800 border-red-200'
}

const difficultyLabels = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Medium',
  4: 'Hard',
  5: 'Expert'
}

export default function QuizCard({ quiz, index }: QuizCardProps) {
  const router = useRouter()
  const userId = storage.get('user')?.id
  const { data: currentAttempt, refetch: refetchCurrentAttempt } = useGetCurrentQuizAttemptQuery(quiz.id, !!userId)
  const { mutate: submitQuizAttempt, isPending: isSubmitting } = useSubmitQuizAttemptMutation()
  const endTime = currentAttempt?.start_time
    ? dayjs(currentAttempt.start_time).add(quiz.time_limit, 'minutes').toISOString()
    : null
  const remainingTime = endTime ? dayjs(endTime).diff(dayjs(), 'second') : null
  const difficultyClass =
    difficultyColors[quiz.difficulty_level as keyof typeof difficultyColors] || difficultyColors[3]
  const difficultyLabel = difficultyLabels[quiz.difficulty_level as keyof typeof difficultyLabels] || 'Medium'

  const handleStartQuiz = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/quizzes/${quiz.slug}/info`)
  }

  const handleContinueQuiz = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/quizzes/${quiz.slug}`)
  }

  const handleTimeUp = useCallback(() => {
    const attemptId = currentAttempt?.id
    if (!attemptId || isSubmitting) return
    submitQuizAttempt(attemptId, {
      onSuccess: () => {
        toast.success('Quiz submitted successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }, [currentAttempt?.id, isSubmitting, submitQuizAttempt, refetchCurrentAttempt])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.98 }}
      className='group h-full'
    >
      <div onClick={currentAttempt?.id ? handleContinueQuiz : handleStartQuiz} className='block h-full cursor-pointer'>
        <motion.div
          className='flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl'
          whileHover={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Image: fixed height */}
          <motion.div className='relative h-32 shrink-0 overflow-hidden' transition={{ duration: 0.3 }}>
            <motion.div
              className='absolute inset-0 bg-white/20'
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
            {quiz?.image_url && (
              <Image src={quiz?.image_url as string} alt={quiz.title} className='absolute inset-0 object-cover' fill />
            )}
          </motion.div>

          {/* Content: flex-1 so all cards same total height */}
          <div className='flex min-h-0 flex-1 flex-col p-6'>
            {/* Title: fixed height for 2 lines so 1-line and 2-line titles take same space */}
            <div className='mb-2 min-h-14 shrink-0'>
              <motion.h3
                className='group-hover:text-primary line-clamp-2 text-lg font-semibold text-gray-900 transition-colors duration-200'
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                {quiz.title}
              </motion.h3>
            </div>

            {/* Description */}
            <p title={quiz.description} className='mb-4 shrink-0 truncate text-sm leading-relaxed text-gray-600'>
              {quiz.description}
            </p>
            {/* Spacer: pushes stats + CTA to bottom so all cards align */}
            <div className='min-h-0 flex-1' aria-hidden />

            {/* Question Count and Time Limit */}
            <div className='mb-4 flex shrink-0 items-center justify-between'>
              <motion.div
                className='flex items-center gap-2'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className='rounded-lg bg-gray-100 p-2'>
                  <svg className='h-4 w-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <span className='text-sm font-medium text-gray-600'>{quiz.question_count} Questions</span>
              </motion.div>

              <motion.div
                className='flex items-center gap-2'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className='rounded-lg bg-gray-100 p-2'>
                  <svg className='h-4 w-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <span className='text-sm font-medium text-gray-600'>{quiz.time_limit} min</span>
              </motion.div>
            </div>

            {/* Difficulty Badge + CTA */}
            <motion.div
              className='flex shrink-0 items-center justify-between'
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyClass}`}>
                {difficultyLabel}
              </div>
              <div className='flex items-center gap-2'>
                {currentAttempt?.id ? (
                  <Timer timeRemaining={remainingTime || 0} totalTime={quiz.time_limit * 60} onTimeUp={handleTimeUp} />
                ) : null}
                <motion.div
                  className='text-primary flex items-center text-sm font-medium'
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentAttempt?.id ? 'Continue' : 'Start Quiz'}
                  <motion.svg
                    className='ml-1 h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </motion.svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
