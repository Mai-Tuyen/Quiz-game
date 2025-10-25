'use client'

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { getCategoryBySlug } from '@/lib/database/categories'
import { getQuizzesByCategory, Quiz } from '@/lib/database/quizzes'
import QuizCard from '@/components/QuizCard'
import QuizCardSkeleton from '@/components/QuizCardSkeleton'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon_url: string
  created_at: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
}

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0
  }
}

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1
  }
}

export default function CategoryQuizzesPage() {
  const params = useParams()
  const categorySlug = params.category_slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch category and quizzes in parallel
        const [categoryData, quizzesData] = await Promise.all([
          getCategoryBySlug(categorySlug),
          getQuizzesByCategory(categorySlug)
        ])

        if (!categoryData) {
          setError('Category not found')
          return
        }

        setCategory(categoryData)
        setQuizzes(quizzesData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load category data')
      } finally {
        setLoading(false)
      }
    }

    if (categorySlug) {
      fetchData()
    }
  }, [categorySlug])

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className='text-center'
        >
          <div className='mb-4 text-6xl'>😞</div>
          <h1 className='mb-2 text-2xl font-bold text-gray-900'>Oops!</h1>
          <p className='text-gray-600'>{error}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='container mx-auto px-4 py-8'
      >
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          transition={{
            duration: 0.6,
            ease: 'easeOut'
          }}
          className='mb-12 text-center'
        >
          {loading ? (
            <div className='space-y-4'>
              <div className='mx-auto h-16 w-16 animate-pulse rounded-full bg-gray-200' />
              <div className='mx-auto h-8 w-64 animate-pulse rounded-lg bg-gray-200' />
              <div className='mx-auto h-4 w-96 animate-pulse rounded bg-gray-200' />
            </div>
          ) : category ? (
            <>
              <motion.div
                className='mb-4 text-6xl'
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {category.icon_url}
              </motion.div>
              <motion.h1
                className='mb-4 text-4xl font-bold text-gray-900'
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {category.name} Quizzes
              </motion.h1>
              <motion.p
                className='mx-auto max-w-2xl text-lg text-gray-600'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {category.description}
              </motion.p>
            </>
          ) : null}
        </motion.div>

        {/* Quizzes Grid */}
        <motion.div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' layout>
          {loading
            ? // Loading skeletons
              Array.from({ length: 8 }).map((_, index) => <QuizCardSkeleton key={index} index={index} />)
            : // Actual quiz cards
              quizzes?.map((quiz, index) => <QuizCard key={quiz.id} quiz={quiz} index={index} />)}
        </motion.div>

        {/* Back to Home Button */}
        {!loading && (
          <motion.div
            className='mt-16 text-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.a
              href='/'
              className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50'
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg
                className='h-5 w-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                whileHover={{ x: -2 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </motion.svg>
              Back to Home
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
