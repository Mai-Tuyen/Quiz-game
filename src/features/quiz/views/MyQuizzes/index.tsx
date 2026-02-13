'use client'

import { useGetAllQuizAttemptsQuery } from '@/features/quiz/hooks/query'
import MyQuizLine from '@/features/quiz/views/MyQuizzes/MyQuizLine'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function MyQuizzesView() {
  const t = useTranslations()
  const {
    data: quizAttempts,
    isLoading: isQuizAttemptsLoading,
    error: quizAttemptsError
  } = useGetAllQuizAttemptsQuery()

  if (isQuizAttemptsLoading) {
    return (
      <div className='mx-auto max-w-3xl px-4 py-6 sm:py-8'>
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-xl font-bold text-gray-900 sm:text-2xl'>{t('MyQuizzes.title')}</h1>
        </div>
        <div className='space-y-2.5 sm:space-y-3'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-24 animate-pulse rounded-lg border border-gray-200 bg-gray-50 sm:h-28 sm:rounded-xl md:h-32'
            />
          ))}
        </div>
      </div>
    )
  }

  if (quizAttemptsError) {
    return (
      <div className='mx-auto max-w-3xl px-4 py-6 sm:py-8'>
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-center sm:rounded-xl sm:p-6'>
          <p className='text-sm font-medium text-red-800 sm:text-base'>{t('MyQuizzes.failedToLoad')}</p>
          <p className='mt-1 text-xs text-red-600 sm:text-sm'>{quizAttemptsError.message}</p>
        </div>
      </div>
    )
  }

  if (!quizAttempts?.length) {
    return (
      <div className='mx-auto max-w-3xl px-4 py-6 sm:py-8'>
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-xl font-bold text-gray-900 sm:text-2xl'>{t('MyQuizzes.title')}</h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 py-12 text-center sm:rounded-xl sm:py-16'
        >
          <div className='mb-3 text-4xl text-gray-400 sm:mb-4 sm:text-5xl'>📝</div>
          <h2 className='text-base font-semibold text-gray-700 sm:text-lg'>{t('MyQuizzes.noQuizzes')}</h2>
          <p className='mt-1 max-w-sm px-4 text-xs text-gray-500 sm:text-sm'>{t('MyQuizzes.noQuizzesDescription')}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-3xl px-4 py-6 sm:py-8'>
      <div className='mb-6 sm:mb-8'>
        <h1 className='text-xl font-bold text-gray-900 sm:text-2xl'>{t('MyQuizzes.title')}</h1>
      </div>
      <ul className='space-y-2.5 sm:space-y-3'>
        {quizAttempts.map((quizAttempt, index) => (
          <li key={quizAttempt.id}>
            <MyQuizLine quizAttempt={quizAttempt} index={index} />
          </li>
        ))}
      </ul>
    </div>
  )
}
