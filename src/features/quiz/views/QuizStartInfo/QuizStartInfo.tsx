'use client'
import { useCreateQuizAttemptMutation, useGetQuizStartInfoQuery } from '@/features/quiz/hooks/query'
import { storage } from '@/global/lib/storage'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
type IProps = {
  slug: string
}
export default function QuizStartInfo({ slug }: IProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const createStartedRef = useRef(false)
  const { data: quizStartInfo } = useGetQuizStartInfoQuery(slug)
  const { mutate: createQuizAttempt, isPending: isCreatingAttempt } = useCreateQuizAttemptMutation()
  const userId = storage.get('user')?.id
  const handleStartQuiz = () => {
    if (createStartedRef.current || isCreatingAttempt || !quizStartInfo?.id || !userId) return
    createStartedRef.current = true
    createQuizAttempt(
      { quizId: quizStartInfo.id, userId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['current-quiz-attempt', quizStartInfo.id] })
          router.push(`/quizzes/${slug}`)
        },
        onSettled: () => {
          createStartedRef.current = false
        }
      }
    )
  }
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-xl'
      >
        <motion.div
          className='mb-6 text-6xl'
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {quizStartInfo?.category?.icon_url}
        </motion.div>

        <h1 className='mb-4 text-3xl font-bold text-gray-900'>{quizStartInfo?.title}</h1>
        <p className='mb-8 leading-relaxed text-gray-600'>{quizStartInfo?.description}</p>

        <div className='mb-8 grid grid-cols-3 gap-4'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <div className='text-2xl font-bold text-blue-600'>{quizStartInfo?.question_count ?? 0}</div>
            <div className='text-sm text-gray-600'>Questions</div>
          </div>
          <div className='rounded-lg bg-green-50 p-4'>
            <div className='text-2xl font-bold text-green-600'>{quizStartInfo?.time_limit ?? 0}</div>
            <div className='text-sm text-gray-600'>Minutes</div>
          </div>
          <div className='rounded-lg bg-purple-50 p-4'>
            <div className='text-2xl font-bold text-purple-600'>Level {quizStartInfo?.difficulty_level}</div>
            <div className='text-sm text-gray-600'>Difficulty</div>
          </div>
        </div>

        <motion.button
          onClick={handleStartQuiz}
          disabled={isCreatingAttempt}
          className='bg-primary cursor-pointer rounded-xl px-8 py-3 text-lg font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70'
          whileHover={isCreatingAttempt ? undefined : { scale: 1.05 }}
          whileTap={isCreatingAttempt ? undefined : { scale: 0.95 }}
        >
          {isCreatingAttempt ? (
            <span className='flex items-center justify-center gap-2'>
              <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
              Starting...
            </span>
          ) : (
            'Start Quiz'
          )}
        </motion.button>
      </motion.div>
    </div>
  )
}
