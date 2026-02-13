'use client'

import { Button } from '@/global/components/ui/button'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface ScoreDisplayProps {
  score: number
  maxScore: number
  timeTaken: number // in seconds
  timeLimit: number // in seconds
  performanceMessage: string
  quizSlug: string
}

export default function ScoreDisplay({
  score,
  maxScore,
  timeTaken,
  timeLimit,
  performanceMessage,
  quizSlug
}: ScoreDisplayProps) {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
  const timePercentage = timeLimit > 0 ? (timeTaken / timeLimit) * 100 : 0
  const router = useRouter()
  const t = useTranslations()

  const getScoreColor = () => {
    if (percentage === 100) return 'text-yellow-500' // Gold for perfect
    if (percentage >= 90) return 'text-green-500'
    if (percentage >= 80) return 'text-blue-500'
    if (percentage >= 70) return 'text-purple-500'
    if (percentage >= 60) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreBackground = () => {
    if (percentage === 100) return 'from-yellow-400 to-yellow-600'
    if (percentage >= 90) return 'from-green-400 to-green-600'
    if (percentage >= 80) return 'from-blue-400 to-blue-600'
    if (percentage >= 70) return 'from-purple-400 to-purple-600'
    if (percentage >= 60) return 'from-orange-400 to-orange-600'
    return 'from-red-400 to-red-600'
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
      className='mx-auto mb-12 max-w-4xl'
    >
      {/* Main Score Card */}
      <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl'>
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${getScoreBackground()} p-8 text-center text-white`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className='mb-4'
          >
            {percentage === 100 ? (
              <div className='mb-2 text-8xl'>🏆</div>
            ) : percentage >= 90 ? (
              <div className='mb-2 text-8xl'>🌟</div>
            ) : percentage >= 80 ? (
              <div className='mb-2 text-8xl'>👏</div>
            ) : percentage >= 70 ? (
              <div className='mb-2 text-8xl'>👍</div>
            ) : (
              <div className='mb-2 text-8xl'>💪</div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className='mb-2 text-4xl font-bold'>{performanceMessage}</h2>
            <p className='text-xl opacity-90'>{t('Result.yourResults')}</p>
          </motion.div>
        </div>

        {/* Score Details */}
        <div className='p-8'>
          <div className='flex flex-col items-center justify-center gap-4'>
            {/* Score Circle */}
            <div className='text-center'>
              <div className='relative mx-auto mb-6 h-48 w-48'>
                {/* Background Circle */}
                <svg className='h-48 w-48 -rotate-90 transform' viewBox='0 0 100 100'>
                  <circle cx='50' cy='50' r='40' fill='none' stroke='#f3f4f6' strokeWidth='8' />
                  {/* Progress Circle */}
                  <motion.circle
                    cx='50'
                    cy='50'
                    r='40'
                    fill='none'
                    stroke='url(#gradient)'
                    strokeWidth='8'
                    strokeLinecap='round'
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 40 * (1 - percentage / 100)
                    }}
                    transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                      <stop
                        offset='0%'
                        stopColor={
                          percentage === 100
                            ? '#fbbf24'
                            : percentage >= 90
                              ? '#10b981'
                              : percentage >= 80
                                ? '#3b82f6'
                                : percentage >= 70
                                  ? '#8b5cf6'
                                  : percentage >= 60
                                    ? '#f59e0b'
                                    : '#ef4444'
                        }
                      />
                      <stop
                        offset='100%'
                        stopColor={
                          percentage === 100
                            ? '#f59e0b'
                            : percentage >= 90
                              ? '#059669'
                              : percentage >= 80
                                ? '#2563eb'
                                : percentage >= 70
                                  ? '#7c3aed'
                                  : percentage >= 60
                                    ? '#d97706'
                                    : '#dc2626'
                        }
                      />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Score Text in Center */}
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  {/* <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                    className={`text-4xl font-bold ${getScoreColor()}`}
                  >
                    {score}
                  </motion.div>
                  <div className='text-2xl text-gray-400'>/ {maxScore}</div> */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className={`text-2xl font-bold ${getScoreColor()} mt-2`}
                  >
                    {Math.round(percentage)}%
                  </motion.div>
                </div>
              </div>
            </div>
            {/* Performance Stats */}
            <div className='space-y-6'>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className='grid grid-cols-2 gap-4'
              >
                <div className='w-[100px] rounded-lg bg-green-50 p-4 text-center sm:w-[200px]'>
                  <div className='text-2xl font-bold text-green-600'>{score}</div>
                  <div className='text-sm text-green-700'>{t('Result.correct')}</div>
                </div>
                <div className='w-[100px] rounded-lg bg-red-50 p-4 text-center sm:w-[200px]'>
                  <div className='text-2xl font-bold text-red-600'>{maxScore - score}</div>
                  <div className='text-sm text-red-700'>{t('Result.incorrect')}</div>
                </div>
              </motion.div>
            </div>
            <div className='mt-2 flex gap-4'>
              <Button
                variant='outline'
                className='cursor-pointer transition-all duration-300 hover:scale-105'
                onClick={() => router.push('/')}
              >
                {t('Common.home')}
              </Button>
              <Button
                className='cursor-pointer transition-all duration-300 hover:scale-105'
                onClick={() => router.push(`/quizzes/${quizSlug}/info`)}
              >
                {t('Common.retry')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
