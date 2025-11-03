'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Quiz } from '@/global/lib/database/quizzes'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClient } from '@/global/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
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
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const difficultyClass =
    difficultyColors[quiz.difficulty_level as keyof typeof difficultyColors] || difficultyColors[3]
  const difficultyLabel = difficultyLabels[quiz.difficulty_level as keyof typeof difficultyLabels] || 'Medium'

  const handleQuizClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/quizzes/${quiz.slug}`)
  }

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
      className='group'
    >
      <div onClick={handleQuizClick} className='block cursor-pointer'>
        <motion.div
          className='h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl'
          whileHover={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <motion.div className='relative h-32 overflow-hidden' transition={{ duration: 0.3 }}>
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

          {/* Content */}
          <div className='p-6'>
            {/* Title */}
            <motion.h3
              className='group-hover:text-primary mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors duration-200'
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              {quiz.title}
            </motion.h3>

            {/* Description */}
            <p title={quiz.description} className='mb-4 truncate text-sm leading-relaxed text-gray-600'>
              {quiz.description}
            </p>

            {/* Stats */}
            <div className='mb-4 flex items-center justify-between'>
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

            {/* Difficulty Badge */}
            <motion.div
              className='flex items-center justify-between'
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyClass}`}>
                {difficultyLabel}
              </div>

              <motion.div
                className='text-primary flex items-center text-sm font-medium'
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Start Quiz
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
