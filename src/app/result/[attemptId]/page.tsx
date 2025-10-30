'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { getAttemptWithResults, AttemptWithDetails } from '@/global/lib/database/attempts'
import ScoreDisplay from '@/global/components/results/ScoreDisplay'
import QuestionReviewMatrix from '@/global/components/results/QuestionReviewMatrix'
import FireworksAnimation from '@/global/components/results/FireworksAnimation'

export default function QuizResultPage() {
  const params = useParams()
  const router = useRouter()
  const attemptId = params.attemptId as string

  const [attempt, setAttempt] = useState<AttemptWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true)
        const resultData = await getAttemptWithResults(attemptId)

        if (!resultData) {
          setError('Quiz results not found')
          return
        }

        setAttempt(resultData)

        // Check for perfect score and trigger fireworks
        if (resultData.score === resultData.max_score && resultData.max_score > 0) {
          setShowFireworks(true)
          // Trigger confetti animation
          setTimeout(() => {
            triggerFireworks()
          }, 1000)
        }
      } catch (err) {
        console.error('Error fetching results:', err)
        setError('Failed to load quiz results')
      } finally {
        setLoading(false)
      }
    }

    if (attemptId) {
      fetchResults()
    }
  }, [attemptId])

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  if (loading) {
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
          <p className='mb-6 text-gray-600'>{error}</p>
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

  const percentage = attempt.max_score > 0 ? (attempt.score / attempt.max_score) * 100 : 0

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      {/* Fireworks Animation */}
      {showFireworks && <FireworksAnimation />}

      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-8 text-center'
        >
          <motion.div
            className='mb-4 text-6xl'
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {attempt.quiz.category.icon_url}
          </motion.div>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>Quiz Completed!</h1>
          <p className='text-lg text-gray-600'>{attempt.quiz.title}</p>
        </motion.div>

        {/* Main Score Display */}
        <ScoreDisplay
          score={attempt.score}
          maxScore={attempt.max_score}
          timeTaken={attempt.time_taken}
          timeLimit={attempt.quiz.time_limit * 60}
          performanceMessage={getPerformanceMessage(attempt.score, attempt.max_score)}
        />

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-4'
        >
          <div className='rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm'>
            <div className='text-2xl font-bold text-blue-600'>{Math.round(percentage)}%</div>
            <div className='text-sm text-gray-600'>Score</div>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm'>
            <div className='text-2xl font-bold text-green-600'>
              {attempt.user_answers.filter((ans) => ans.is_correct).length}
            </div>
            <div className='text-sm text-gray-600'>Correct</div>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm'>
            <div className='text-2xl font-bold text-purple-600'>{formatTime(attempt.time_taken)}</div>
            <div className='text-sm text-gray-600'>Time Used</div>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm'>
            <div className='text-2xl font-bold text-orange-600'>Level {attempt.quiz.difficulty_level}</div>
            <div className='text-sm text-gray-600'>Difficulty</div>
          </div>
        </motion.div>

        {/* Question Review Matrix */}
        <QuestionReviewMatrix userAnswers={attempt.user_answers} quiz={attempt.quiz} />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className='mt-12 flex flex-col justify-center gap-4 sm:flex-row'
        >
          <motion.button
            onClick={() => router.push(`/quizzes/${attempt.quiz.slug}`)}
            className='rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retake Quiz
          </motion.button>
          <motion.button
            onClick={() => router.push(`/categories/${attempt.quiz.category.slug}`)}
            className='rounded-xl border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-50'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            More Quizzes
          </motion.button>
          <motion.button
            onClick={() => router.push('/')}
            className='rounded-xl bg-gray-600 px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-gray-700'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Categories
          </motion.button>
        </motion.div>

        {/* Share Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className='mt-8 text-center'
        >
          <p className='mb-4 text-gray-600'>Share your achievement!</p>
          <div className='flex justify-center gap-4'>
            <motion.button
              onClick={() => {
                const text = `I just scored ${attempt.score}/${attempt.max_score} (${Math.round(percentage)}%) on "${
                  attempt.quiz.title
                }" quiz! 🎉`
                navigator.share?.({ title: 'Quiz Results', text }) || navigator.clipboard?.writeText(text)
              }}
              className='rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📱 Share
            </motion.button>
            <motion.button
              onClick={() => {
                const text = `I scored ${attempt.score}/${
                  attempt.max_score
                } (${Math.round(percentage)}%) on "${attempt.quiz.title}"!`
                navigator.clipboard?.writeText(text)
              }}
              className='rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-600'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📋 Copy
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
