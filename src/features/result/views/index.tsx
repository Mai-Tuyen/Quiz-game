'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScoreDisplay from '@/features/result/views/ScoreDisplay'
import FireworksAnimation from '@/features/result/views/FireworksAnimation'
import { AttemptWithDetails } from '@/features/result/type'
import { useGetAttemptWithResultsQuery } from '@/features/result/hooks/query'

export default function QuizResultPage({ attemptId }: { attemptId: string }) {
  const router = useRouter()
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
    if (maxScore === 0) return 'No questions completed'

    const percentage = (score / maxScore) * 100

    if (percentage === 100) return 'Perfect! Outstanding work! 🎉'
    if (percentage >= 90) return "Excellent! You're doing great! 🌟"
    if (percentage >= 80) return 'Very Good! Well done! 👏'
    if (percentage >= 70) return 'Good job! Keep it up! 👍'
    if (percentage >= 60) return 'Not bad! Room for improvement 📚'
    return "Keep practicing! You'll get better! 💪"
  }

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className='text-center'
        >
          <div className='mb-4 animate-spin text-6xl'>📊</div>
          <h1 className='mb-2 text-2xl font-bold text-gray-900'>Loading Results...</h1>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className='mx-auto max-w-md p-8 text-center'
        >
          <div className='mb-4 text-6xl'>😞</div>
          <h1 className='mb-2 text-2xl font-bold text-gray-900'>Oops!</h1>
          <p className='mb-6 text-gray-600'>{error.message}</p>
          <motion.button
            onClick={() => router.push('/')}
            className='rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
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

      <div className='container mx-auto px-4 py-8'>
        {/* Main Score Display */}
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
