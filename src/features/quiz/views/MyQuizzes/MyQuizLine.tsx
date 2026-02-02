'use client'

import { useCallback } from 'react'
import { useSubmitQuizAttemptMutation } from '@/features/quiz/hooks/query'
import { QuizAttemptWithQuiz } from '@/features/quiz/type'
import Timer from '@/features/quiz/views/components/Timer'
import { Button } from '@/global/components/ui/button'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'

interface MyQuizLineProps {
  quizAttempt: QuizAttemptWithQuiz
  index: number
}

export default function MyQuizLine({ quizAttempt, index }: MyQuizLineProps) {
  const queryClient = useQueryClient()
  const { mutate: submitQuizAttempt, isPending: isSubmitting } = useSubmitQuizAttemptMutation()
  const quiz = quizAttempt.quiz
  const isCompleted = quizAttempt.is_completed

  const endTime =
    !isCompleted && quizAttempt.start_time
      ? dayjs(quizAttempt.start_time).add(quiz.time_limit, 'minutes').toISOString()
      : null
  const remainingTime = endTime ? Math.max(0, dayjs(endTime).diff(dayjs(), 'second')) : 0

  const handleTimeUp = useCallback(() => {
    if (isSubmitting) return
    submitQuizAttempt(quizAttempt.id, {
      onSuccess: () => {
        toast.success('Quiz submitted automatically (time up)')
        queryClient.invalidateQueries({ queryKey: ['all-quiz-attempts'] })
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }, [quizAttempt.id, isSubmitting, submitQuizAttempt])

  const scoreLabel = isCompleted ? `${quizAttempt.score} / ${quizAttempt.max_score}` : '- / -'

  const statusLabel = isCompleted ? 'Completed' : 'In progress'
  const statusClass = isCompleted
    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
    : 'bg-amber-100 text-amber-800 border-amber-200'

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className='group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md'
    >
      <div className='flex min-h-0 flex-row items-stretch gap-0 sm:gap-4'>
        {/* Quiz image */}
        <div className='relative w-28 shrink-0 overflow-hidden rounded-l-xl bg-gray-100 sm:w-36'>
          {quiz.image_url ? (
            <Image
              src={quiz.image_url}
              alt={quiz.title}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              sizes='(max-width: 640px) 112px, 144px'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-gray-400'>
              <svg className='h-10 w-10' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
          )}
        </div>

        {/* Title, score, status */}
        <div className='flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3 sm:gap-2 sm:py-4'>
          <h2 className='line-clamp-2 truncate text-base font-semibold text-gray-900 sm:text-lg'>{quiz.title}</h2>
          <div className='text-sm text-gray-600'>Date: {dayjs(quizAttempt.start_time).format('DD/MM/YYYY HH:mm')}</div>
          <div className='flex flex-wrap items-center gap-3'>
            <span className='w-20 text-sm text-gray-600'>
              Score: <span className='font-medium text-gray-900'>{scoreLabel}</span>
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
              {statusLabel}
            </span>
            {!isCompleted && (
              <Timer timeRemaining={remainingTime} totalTime={quiz.time_limit * 60} onTimeUp={handleTimeUp} />
            )}
          </div>
        </div>

        {/* Actions: timer + continue when incomplete, view result when complete */}
        <div className='flex shrink-0 items-center gap-2 border-l border-gray-100 px-4 py-3 sm:px-5'>
          {isCompleted ? (
            <Button className='w-20 cursor-pointer' variant='outline' size='sm' asChild>
              <Link href={`/quizzes/${quiz.slug}/info`}>Retry</Link>
            </Button>
          ) : (
            <>
              <Button className='w-20 cursor-pointer' size='sm' asChild>
                <Link href={`/quizzes/${quiz.slug}`}>Continue</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.article>
  )
}
