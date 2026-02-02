'use client'

import { useGetAllQuizAttemptsQuery } from '@/features/quiz/hooks/query'
import MyQuizLine from '@/features/quiz/views/MyQuizzes/MyQuizLine'
import { motion } from 'framer-motion'

export default function MyQuizzesView() {
  const {
    data: quizAttempts,
    isLoading: isQuizAttemptsLoading,
    error: quizAttemptsError
  } = useGetAllQuizAttemptsQuery()

  if (isQuizAttemptsLoading) {
    return (
      <div className='mx-auto max-w-3xl px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900'>My Quizzes</h1>
          <p className='mt-1 text-gray-600'>Your attempts and progress</p>
        </div>
        <div className='space-y-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-28 animate-pulse rounded-xl border border-gray-200 bg-gray-50 sm:h-32' />
          ))}
        </div>
      </div>
    )
  }

  if (quizAttemptsError) {
    return (
      <div className='mx-auto max-w-3xl px-4 py-8'>
        <div className='rounded-xl border border-red-200 bg-red-50 p-6 text-center'>
          <p className='font-medium text-red-800'>Failed to load your quizzes</p>
          <p className='mt-1 text-sm text-red-600'>{quizAttemptsError.message}</p>
        </div>
      </div>
    )
  }

  if (!quizAttempts?.length) {
    return (
      <div className='mx-auto max-w-3xl px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900'>My Quizzes</h1>
          <p className='mt-1 text-gray-600'>Your attempts and progress</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-16 text-center'
        >
          <div className='mb-4 text-5xl text-gray-400'>📝</div>
          <h2 className='text-lg font-semibold text-gray-700'>No quizzes yet</h2>
          <p className='mt-1 max-w-sm text-sm text-gray-500'>
            Start a quiz from a category to see your attempts and scores here.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-3xl px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>My Quizzes</h1>
        <p className='mt-1 text-gray-600'>Your attempts and progress</p>
      </div>
      <ul className='space-y-3'>
        {quizAttempts.map((quizAttempt, index) => (
          <li key={quizAttempt.id}>
            <MyQuizLine quizAttempt={quizAttempt} index={index} />
          </li>
        ))}
      </ul>
    </div>
  )
}
