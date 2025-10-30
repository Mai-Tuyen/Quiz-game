import { Quiz } from '@/global/lib/database/quizzes'
import { createClient } from '@/global/utils/supabase/client'
import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
export default function QuizStart() {
  const { slug } = useParams()
  const supabase = createClient()
  const router = useRouter()
  // check authentication
  const checkAuth = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    if (!session?.user) {
      router.push('/')
    }
  }
  useEffect(() => {
    checkAuth()
  }, [supabase])

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4'>
      {/* <motion.div
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
          {quiz.category.icon_url}
        </motion.div>

        <h1 className='mb-4 text-3xl font-bold text-gray-900'>{quiz.title}</h1>
        <p className='mb-8 leading-relaxed text-gray-600'>{quiz.description}</p>

        <div className='mb-8 grid grid-cols-3 gap-4'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <div className='text-2xl font-bold text-blue-600'>{quiz.question_count}</div>
            <div className='text-sm text-gray-600'>Questions</div>
          </div>
          <div className='rounded-lg bg-green-50 p-4'>
            <div className='text-2xl font-bold text-green-600'>{quiz.time_limit}</div>
            <div className='text-sm text-gray-600'>Minutes</div>
          </div>
          <div className='rounded-lg bg-purple-50 p-4'>
            <div className='text-2xl font-bold text-purple-600'>Level {quiz.difficulty_level}</div>
            <div className='text-sm text-gray-600'>Difficulty</div>
          </div>
        </div>

        <motion.button
          onClick={startQuiz}
          className='bg-primary rounded-xl px-8 py-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-blue-700'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Quiz
        </motion.button>
      </motion.div> */}
    </div>
  )
}
