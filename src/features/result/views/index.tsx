'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScoreDisplay from '@/features/result/views/ScoreDisplay'
import FireworksAnimation from '@/features/result/views/FireworksAnimation'
import { AttemptWithDetails } from '@/features/result/type'
import { useGetAttemptWithResultsQuery } from '@/features/result/hooks/query'
import { useTranslations } from 'next-intl'

export default function QuizResultPage({ attemptId }: { attemptId: string }) {
  const router = useRouter()
  const t = useTranslations()
  const [showFireworks, setShowFireworks] = useState(false)
  const { data: attempt, isLoading: isLoading, error: error } = useGetAttemptWithResultsQuery(attemptId)

  useEffect(() => {
    // Check for perfect score and trigger fireworks
    if (attempt?.score === attempt?.max_score && attempt?.max_score && attempt?.max_score > 0) {
      setShowFireworks(true)
      // Trigger confetti animation
      setTimeout(() => {
        triggerFireworks()
      }, 1000)
    }
  }, [attempt])

  const triggerFireworks = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Fire confetti from two points
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Hide fireworks after animation
    setTimeout(() => {
      setShowFireworks(false)
    }, duration + 1000)
  }

  const getPerformanceMessage = (score: number, maxScore: number) => {
    if (maxScore === 0) return t('Result.noQuestionsCompleted')

    const percentage = (score / maxScore) * 100

    if (percentage === 100) return t('Result.perfectScore')
    if (percentage >= 90) return t('Result.excellentScore')
    if (percentage >= 80) return t('Result.veryGoodScore')
    if (percentage >= 70) return t('Result.goodScore')
    if (percentage >= 60) return t('Result.notBadScore')
    return t('Result.keepPracticing')
  }

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className='text-center'
        >
          <div className='mb-4 animate-spin text-4xl sm:text-5xl md:text-6xl'>📊</div>
          <h1 className='mb-2 text-xl font-bold text-gray-900 sm:text-2xl'>{t('Result.loadingResults')}</h1>
          <div className='mx-auto h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent sm:h-8 sm:w-8'></div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className='mx-auto max-w-md p-6 text-center sm:p-8'
        >
          <div className='mb-4 text-4xl sm:text-5xl md:text-6xl'>😞</div>
          <h1 className='mb-2 text-xl font-bold text-gray-900 sm:text-2xl'>{t('Result.oops')}</h1>
          <p className='mb-6 text-sm text-gray-600 sm:text-base'>{error.message}</p>
          <motion.button
            onClick={() => router.push('/')}
            className='rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 sm:px-6 sm:py-3 sm:text-base'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('Common.backToHome')}
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (!attempt) {
    return null
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      {/* Fireworks Animation */}
      {showFireworks && <FireworksAnimation />}

      <div className='container mx-auto px-4 py-6 sm:py-8 md:py-10'>
        {/* Main Score Display - Mobile First Responsive */}
        <ScoreDisplay
          quizSlug={attempt?.quiz?.slug}
          score={attempt.score}
          maxScore={attempt.max_score}
          timeTaken={attempt.time_taken}
          timeLimit={attempt.quiz.time_limit * 60}
          performanceMessage={getPerformanceMessage(attempt.score, attempt.max_score)}
        />
      </div>
    </div>
  )
}
